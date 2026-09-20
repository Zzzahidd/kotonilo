import { Context } from 'hono';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';
import { User, IUser } from '../../db/User.js';
import { Session } from '../../db/Session.js';
import { OTP } from '../../db/OTP.js';
import { env } from '../../config/env.js';
import {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashToken,
  generateAnonymousCredentials,
  TokenPayload,
} from '../../utils/auth.js';
import { parseDeviceInfo } from '../../utils/device.js';
import { sendOtpEmail } from '../../services/emailService.js';
import {
  registerSchema,
  loginSchema,
  googleAuthSchema,
  sendOtpSchema,
  verifyOtpSchema,
  refreshTokenSchema,
} from './authSchemas.js';

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

async function createSession(userId: any, c: Context, payload: TokenPayload) {
  const deviceInfo = parseDeviceInfo(c);
  const refreshToken = generateRefreshToken(payload);
  const tokenHash = hashToken(refreshToken);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  const session = await Session.create({
    userId,
    tokenHash,
    ipAddress: deviceInfo.ipAddress,
    userAgent: deviceInfo.userAgent,
    deviceType: deviceInfo.deviceType,
    browser: deviceInfo.browser,
    os: deviceInfo.os,
    expiresAt,
    lastActiveAt: new Date(),
  });

  const accessToken = generateAccessToken(payload);

  return {
    accessToken,
    refreshToken,
    sessionId: session._id,
  };
}

export async function register(c: Context) {
  const body = await c.req.json();
  const data = registerSchema.parse(body);

  const existingUsername = await User.findOne({ username: data.username.toLowerCase() });
  if (existingUsername) {
    return c.json({ success: false, message: 'এই ইউজারনেমটি ইতিমধ্যে ব্যবহৃত হয়েছে' }, 400);
  }

  if (data.email) {
    const existingEmail = await User.findOne({ email: data.email.toLowerCase() });
    if (existingEmail) {
      return c.json({ success: false, message: 'এই ইমেইলটি ইতিমধ্যে ব্যবহৃত হয়েছে' }, 400);
    }
  }

  const passwordHash = await hashPassword(data.password);
  const user = await User.create({
    username: data.username.toLowerCase(),
    displayName: data.displayName,
    email: data.email?.toLowerCase(),
    passwordHash,
    isAnonymous: false,
  });

  const payload: TokenPayload = {
    userId: user._id.toString(),
    username: user.username,
    role: user.role,
    isAnonymous: false,
  };

  const { accessToken, refreshToken, sessionId } = await createSession(user._id, c, payload);

  return c.json({
    success: true,
    message: 'অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে',
    data: {
      user: {
        id: user._id,
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        isAnonymous: user.isAnonymous,
        role: user.role,
      },
      accessToken,
      refreshToken,
      sessionId,
    },
  });
}

export async function login(c: Context) {
  const body = await c.req.json();
  const data = loginSchema.parse(body);

  const query = data.usernameOrEmail.toLowerCase();
  const user = await User.findOne({
    $or: [{ username: query }, { email: query }],
  }).select('+passwordHash');

  if (!user || !user.passwordHash) {
    return c.json({ success: false, message: 'ইউজারনেম বা পাসওয়ার্ড সঠিক নয়' }, 401);
  }

  const isMatch = await comparePassword(data.password, user.passwordHash);
  if (!isMatch) {
    return c.json({ success: false, message: 'ইউজারনেম বা পাসওয়ার্ড সঠিক নয়' }, 401);
  }

  const payload: TokenPayload = {
    userId: user._id.toString(),
    username: user.username,
    role: user.role,
    isAnonymous: user.isAnonymous,
  };

  const { accessToken, refreshToken, sessionId } = await createSession(user._id, c, payload);

  return c.json({
    success: true,
    message: 'লগইন সফল হয়েছে',
    data: {
      user: {
        id: user._id,
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        isAnonymous: user.isAnonymous,
        role: user.role,
      },
      accessToken,
      refreshToken,
      sessionId,
    },
  });
}

// Rate limiter map for anonymous account generation (IP -> timestamps[])
const anonymousCreationRateLimit = new Map<string, number[]>();

export async function createAnonymous(c: Context) {
  const deviceInfo = parseDeviceInfo(c);
  const ip = deviceInfo.ipAddress;
  const deviceFingerprint = crypto
    .createHash('sha256')
    .update(`${ip}_${deviceInfo.userAgent}_${deviceInfo.os}`)
    .digest('hex');

  // Anti-Spam Rate Limit: Max 5 creation requests per 15 minutes per IP
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const recentAttempts = (anonymousCreationRateLimit.get(ip) || []).filter(
    (t) => now - t < windowMs
  );
  if (recentAttempts.length >= 5) {
    return c.json(
      {
        success: false,
        message: 'অতিরিক্ত অনুরোধ করা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।',
      },
      429
    );
  }
  recentAttempts.push(now);
  anonymousCreationRateLimit.set(ip, recentAttempts);

  // Check if an anonymous account already exists for this IP or device fingerprint
  const existingAnonUser = await User.findOne({
    isAnonymous: true,
    $or: [
      { createdIp: ip },
      { deviceFingerprint },
    ],
  });

  if (existingAnonUser) {
    // Existing anonymous user found -> reuse and reconnect to their single account
    existingAnonUser.lastIp = ip;
    await existingAnonUser.save();

    const payload: TokenPayload = {
      userId: existingAnonUser._id.toString(),
      username: existingAnonUser.username,
      role: existingAnonUser.role,
      isAnonymous: true,
    };

    const { accessToken, refreshToken, sessionId } = await createSession(
      existingAnonUser._id,
      c,
      payload
    );

    return c.json({
      success: true,
      isExisting: true,
      message: 'আপনার পূর্বের বেনামী অ্যাকাউন্টে যুক্ত করা হয়েছে',
      data: {
        user: {
          id: existingAnonUser._id,
          username: existingAnonUser.username,
          displayName: existingAnonUser.displayName,
          isAnonymous: true,
          role: existingAnonUser.role,
        },
        credentials: null,
        accessToken,
        refreshToken,
        sessionId,
      },
    });
  }

  // Create single new anonymous user tied to this IP & device
  const { username, displayName, rawPassword } = generateAnonymousCredentials();
  const passwordHash = await hashPassword(rawPassword);

  const user = await User.create({
    username,
    displayName,
    passwordHash,
    isAnonymous: true,
    createdIp: ip,
    deviceFingerprint,
    lastIp: ip,
  });

  const payload: TokenPayload = {
    userId: user._id.toString(),
    username: user.username,
    role: user.role,
    isAnonymous: true,
  };

  const { accessToken, refreshToken, sessionId } = await createSession(user._id, c, payload);

  return c.json({
    success: true,
    isExisting: false,
    message: 'বেনামী অ্যাকাউন্ট তৈরি হয়েছে',
    data: {
      user: {
        id: user._id,
        username: user.username,
        displayName: user.displayName,
        isAnonymous: true,
        role: user.role,
      },
      credentials: {
        username: user.username,
        password: rawPassword,
      },
      accessToken,
      refreshToken,
      sessionId,
    },
  });
}

export async function googleLogin(c: Context) {
  const body = await c.req.json();
  const data = googleAuthSchema.parse(body);

  let googlePayload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: data.credential,
      audience: env.GOOGLE_CLIENT_ID,
    });
    googlePayload = ticket.getPayload();
  } catch (error) {
    console.error('[Google OAuth Error]:', error);
    return c.json({ success: false, message: 'গুগল যাচাইকরণ ব্যর্থ হয়েছে' }, 401);
  }

  if (!googlePayload || !googlePayload.email) {
    return c.json({ success: false, message: 'গুগল প্রোফাইল থেকে ইমেইল পাওয়া যায়নি' }, 400);
  }

  const { sub: googleId, email, name, picture } = googlePayload;

  let user = await User.findOne({ $or: [{ googleId }, { email: email.toLowerCase() }] });

  if (!user) {
    const baseUsername = email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '');
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const username = `${baseUsername}_${randomSuffix}`.toLowerCase();

    user = await User.create({
      username,
      displayName: name || 'Google User',
      email: email.toLowerCase(),
      googleId,
      avatar: picture || '',
      isAnonymous: false,
    });
  } else {
    if (!user.googleId) {
      user.googleId = googleId;
    }
    if (picture && !user.avatar) {
      user.avatar = picture;
    }
    await user.save();
  }

  const payload: TokenPayload = {
    userId: user._id.toString(),
    username: user.username,
    role: user.role,
    isAnonymous: user.isAnonymous,
  };

  const { accessToken, refreshToken, sessionId } = await createSession(user._id, c, payload);

  return c.json({
    success: true,
    message: 'গুগল দিয়ে সফলভাবে লগইন হয়েছে',
    data: {
      user: {
        id: user._id,
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        avatar: user.avatar,
        isAnonymous: user.isAnonymous,
        role: user.role,
      },
      accessToken,
      refreshToken,
      sessionId,
    },
  });
}

export async function sendOtp(c: Context) {
  const body = await c.req.json();
  const data = sendOtpSchema.parse(body);

  const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpHash = crypto.createHash('sha256').update(rawOtp).digest('hex');

  // Invalidate older OTPs for this email and purpose
  await OTP.updateMany(
    { email: data.email.toLowerCase(), purpose: data.purpose, isUsed: false },
    { $set: { isUsed: true } }
  );

  const deviceInfo = parseDeviceInfo(c);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await OTP.create({
    email: data.email.toLowerCase(),
    otpHash,
    purpose: data.purpose,
    ipAddress: deviceInfo.ipAddress,
    expiresAt,
  });

  const sent = await sendOtpEmail(data.email, rawOtp, data.purpose === 'login' ? 'লগইন' : 'ইমেইল যাচাইকরণ');
  if (!sent) {
    return c.json({ success: false, message: 'ওটিপি ইমেইল পাঠানো সম্ভব হয়নি' }, 500);
  }

  return c.json({
    success: true,
    message: 'আপনার ইমেইলে ওটিপি কোড পাঠানো হয়েছে',
  });
}

export async function verifyOtp(c: Context) {
  const body = await c.req.json();
  const data = verifyOtpSchema.parse(body);

  const otpDoc = await OTP.findOne({
    email: data.email.toLowerCase(),
    purpose: data.purpose,
    isUsed: false,
    expiresAt: { $gt: new Date() },
  });

  if (!otpDoc) {
    return c.json({ success: false, message: 'ওটিপি কোড মেয়াদোত্তীর্ণ বা পাওয়া যায়নি' }, 400);
  }

  if (otpDoc.attempts >= otpDoc.maxAttempts) {
    otpDoc.isUsed = true;
    await otpDoc.save();
    return c.json({ success: false, message: 'সর্বোচ্চ চেষ্টার সীমা পার হয়েছে। নতুন ওটিপি নিন।' }, 429);
  }

  const inputHash = crypto.createHash('sha256').update(data.otp).digest('hex');
  if (inputHash !== otpDoc.otpHash) {
    otpDoc.attempts += 1;
    await otpDoc.save();
    return c.json({ success: false, message: 'ভুল ওটিপি কোড দেওয়া হয়েছে' }, 400);
  }

  otpDoc.isUsed = true;
  await otpDoc.save();

  // Find or create user
  let user = await User.findOne({ email: data.email.toLowerCase() });
  if (!user) {
    const baseUsername = data.email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '');
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const username = `${baseUsername}_${randomSuffix}`.toLowerCase();

    user = await User.create({
      username,
      displayName: baseUsername,
      email: data.email.toLowerCase(),
      isAnonymous: false,
    });
  }

  const payload: TokenPayload = {
    userId: user._id.toString(),
    username: user.username,
    role: user.role,
    isAnonymous: user.isAnonymous,
  };

  const { accessToken, refreshToken, sessionId } = await createSession(user._id, c, payload);

  return c.json({
    success: true,
    message: 'ওটিপি যাচাইকরণ সফল হয়েছে',
    data: {
      user: {
        id: user._id,
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        isAnonymous: user.isAnonymous,
        role: user.role,
      },
      accessToken,
      refreshToken,
      sessionId,
    },
  });
}

export async function refresh(c: Context) {
  const body = await c.req.json();
  const data = refreshTokenSchema.parse(body);

  const payload = verifyRefreshToken(data.refreshToken);
  if (!payload) {
    return c.json({ success: false, message: 'অবৈধ রিফ্রেশ টোকেন' }, 401);
  }

  const tokenHash = hashToken(data.refreshToken);
  const session = await Session.findOne({
    userId: payload.userId,
    tokenHash,
    isRevoked: false,
    expiresAt: { $gt: new Date() },
  });

  if (!session) {
    return c.json({ success: false, message: 'সেশন পাওয়া যায়নি বা বাতিল করা হয়েছে' }, 401);
  }

  // Token rotation
  const newRefreshToken = generateRefreshToken(payload);
  const newAccessToken = generateAccessToken(payload);
  const newTokenHash = hashToken(newRefreshToken);

  session.tokenHash = newTokenHash;
  session.lastActiveAt = new Date();
  await session.save();

  return c.json({
    success: true,
    data: {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    },
  });
}

export async function logout(c: Context) {
  const body = await c.req.json().catch(() => ({}));
  if (body.refreshToken) {
    const tokenHash = hashToken(body.refreshToken);
    await Session.findOneAndUpdate({ tokenHash }, { isRevoked: true });
  }

  return c.json({
    success: true,
    message: 'সফলভাবে লগআউট হয়েছে',
  });
}

export async function logoutAllDevices(c: Context) {
  const user = c.get('user' as any);
  if (!user || !user.userId) {
    return c.json({ success: false, message: 'অনুমতি নেই' }, 401);
  }

  await Session.updateMany({ userId: user.userId, isRevoked: false }, { isRevoked: true });

  return c.json({
    success: true,
    message: 'সকল ডিভাইস থেকে লগআউট সম্পন্ন হয়েছে',
  });
}

export async function getSessions(c: Context) {
  const user = c.get('user' as any);
  if (!user || !user.userId) {
    return c.json({ success: false, message: 'অনুমতি নেই' }, 401);
  }

  const sessions = await Session.find({
    userId: user.userId,
    isRevoked: false,
    expiresAt: { $gt: new Date() },
  }).sort({ lastActiveAt: -1 });

  return c.json({
    success: true,
    data: sessions.map((s) => ({
      id: s._id,
      deviceType: s.deviceType,
      browser: s.browser,
      os: s.os,
      ipAddress: s.ipAddress,
      lastActiveAt: s.lastActiveAt,
      createdAt: s.createdAt,
    })),
  });
}

export async function revokeSession(c: Context) {
  const user = c.get('user' as any);
  const sessionId = c.req.param('id');

  const session = await Session.findOne({ _id: sessionId, userId: user.userId });
  if (!session) {
    return c.json({ success: false, message: 'সেশন পাওয়া যায়নি' }, 404);
  }

  session.isRevoked = true;
  await session.save();

  return c.json({
    success: true,
    message: 'ডিভাইস সেশন বাতিল করা হয়েছে',
  });
}

export async function getMe(c: Context) {
  const tokenUser = c.get('user' as any);
  if (!tokenUser || !tokenUser.userId) {
    return c.json({ success: false, message: 'অনুমতি নেই' }, 401);
  }

  const user = await User.findById(tokenUser.userId);
  if (!user) {
    return c.json({ success: false, message: 'ব্যবহারকারী পাওয়া যায়নি' }, 404);
  }

  return c.json({
    success: true,
    data: {
      user: {
        id: user._id,
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        avatar: user.avatar,
        isAnonymous: user.isAnonymous,
        role: user.role,
        createdAt: user.createdAt,
      },
    },
  });
}
