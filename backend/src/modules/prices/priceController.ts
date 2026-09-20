import { Context } from 'hono';
import mongoose from 'mongoose';
import { PriceReport, IPriceReport } from '../../db/PriceReport.js';
import { Category } from '../../db/Category.js';
import { Vote } from '../../db/Vote.js';
import { ModerationReport } from '../../db/ModerationReport.js';
import { User } from '../../db/User.js';
import {
  createPriceReportSchema,
  updatePriceReportSchema,
  voteSchema,
  reportProblemSchema,
  checkPriceSchema,
} from './priceSchemas.js';
import { toBanglaNumber, formatBanglaPrice, getRelativeTimeBn } from '../../utils/bangla.js';

export async function createPriceReport(c: Context) {
  const tokenUser = c.get('user' as any);
  if (!tokenUser || !tokenUser.userId) {
    return c.json({ success: false, message: 'রিপোর্ট করতে লগইন বা বেনামী অ্যাকাউন্ট প্রয়োজন' }, 401);
  }

  const body = await c.req.json();
  const data = createPriceReportSchema.parse(body);

  const category = await Category.findOne({ slug: data.categorySlug });
  if (!category) {
    return c.json({ success: false, message: 'নির্বাচিত ক্যাটাগরি পাওয়া যায়নি' }, 400);
  }

  const user = await User.findById(tokenUser.userId);
  if (!user) {
    return c.json({ success: false, message: 'ব্যবহারকারী অ্যাকাউন্ট পাওয়া যায়নি' }, 404);
  }

  let authorName = user.displayName;
  if (data.isAnonymous || user.isAnonymous) {
    if (user.isAnonymous) {
      authorName = user.displayName;
    } else {
      const randomSuffix = Math.floor(100 + Math.random() * 900);
      authorName = `বেনামি ${toBanglaNumber(randomSuffix)}`;
    }
  }

  const report = await PriceReport.create({
    userId: user._id,
    authorName,
    isAnonymous: data.isAnonymous ?? user.isAnonymous,
    categoryId: category._id,
    categorySlug: category.slug,
    itemTitle: data.itemTitle,
    price: data.price,
    currency: data.currency || 'BDT',
    location: data.location,
    condition: data.condition || 'ব্যবহৃত',
    tags: data.tags || [],
    attributes: data.attributes || {},
    extraDetails: data.extraDetails || {},
    imageUrl: data.imageUrl || '',
    imageFileId: data.imageFileId || '',
    status: 'published',
  });

  return c.json({
    success: true,
    message: 'দাম সফলভাবে যুক্ত হয়েছে!',
    data: {
      report,
    },
  });
}

export async function getPrices(c: Context) {
  const query = c.req.query();
  const page = Math.max(1, parseInt(query.page || '1', 10));
  const limit = Math.min(50, Math.max(1, parseInt(query.limit || '12', 10)));
  const skip = (page - 1) * limit;

  const filter: Record<string, any> = { status: 'published' };

  if (query.category && query.category !== 'all') {
    filter.categorySlug = query.category;
  }

  if (query.location && query.location !== 'all' && query.location !== 'সারা বাংলাদেশ') {
    filter['location.fullAddress'] = { $regex: query.location, $options: 'i' };
  }

  if (query.search && query.search.trim() !== '') {
    const searchRegex = new RegExp(query.search.trim(), 'i');
    filter.$or = [
      { itemTitle: { $regex: searchRegex } },
      { 'location.fullAddress': { $regex: searchRegex } },
      { condition: { $regex: searchRegex } },
      { tags: { $in: [searchRegex] } },
    ];
  }

  if (query.timeframe) {
    const now = new Date();
    if (query.timeframe === 'today') {
      const todayStart = new Date(now.setHours(0, 0, 0, 0));
      filter.createdAt = { $gte: todayStart };
    } else if (query.timeframe === 'week') {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      filter.createdAt = { $gte: weekAgo };
    } else if (query.timeframe === 'month') {
      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      filter.createdAt = { $gte: monthAgo };
    }
  }

  let sortOptions: Record<string, any> = { createdAt: -1 };
  if (query.sort === 'lowest') {
    sortOptions = { price: 1 };
  } else if (query.sort === 'highest') {
    sortOptions = { price: -1 };
  } else if (query.sort === 'votes') {
    sortOptions = { positiveVotesCount: -1, createdAt: -1 };
  }

  const [reports, total] = await Promise.all([
    PriceReport.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean(),
    PriceReport.countDocuments(filter),
  ]);

  // Check user votes if logged in
  const tokenUser = c.get('user' as any);
  let userVotesMap = new Map<string, string>();

  if (tokenUser && tokenUser.userId) {
    const reportIds = reports.map((r) => r._id);
    const votes = await Vote.find({
      reportId: { $in: reportIds },
      userId: tokenUser.userId,
    }).lean();

    votes.forEach((v) => {
      userVotesMap.set(v.reportId.toString(), v.voteType);
    });
  }

  const formattedReports = reports.map((report) => {
    const totalVotes = (report.positiveVotesCount || 0) + (report.negativeVotesCount || 0);
    const positivePercentage = totalVotes > 0 ? Math.round((report.positiveVotesCount / totalVotes) * 100) : 75;
    const negativePercentage = 100 - positivePercentage;

    return {
      id: report._id,
      itemTitle: report.itemTitle,
      price: report.price,
      formattedPrice: formatBanglaPrice(report.price),
      authorName: report.authorName,
      isAnonymous: report.isAnonymous,
      categorySlug: report.categorySlug,
      location: report.location,
      condition: report.condition,
      tags: report.tags || [],
      attributes: report.attributes || {},
      extraDetails: report.extraDetails || {},
      imageUrl: report.imageUrl || '',
      positiveVotesCount: report.positiveVotesCount || 0,
      negativeVotesCount: report.negativeVotesCount || 0,
      positivePercentage,
      negativePercentage,
      userVote: userVotesMap.get(report._id.toString()) || null,
      relativeTimeBn: getRelativeTimeBn(report.createdAt),
      createdAt: report.createdAt,
    };
  });

  return c.json({
    success: true,
    data: {
      reports: formattedReports,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
}

export async function getPriceReportById(c: Context) {
  const id = c.req.param('id');
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return c.json({ success: false, message: 'অবৈধ রিপোর্ট আইডি' }, 400);
  }

  const report = await PriceReport.findById(id).lean();
  if (!report) {
    return c.json({ success: false, message: 'রিপোর্ট পাওয়া যায়নি' }, 404);
  }

  const tokenUser = c.get('user' as any);
  let userVote: string | null = null;

  if (tokenUser && tokenUser.userId) {
    const vote = await Vote.findOne({ reportId: report._id, userId: tokenUser.userId }).lean();
    if (vote) {
      userVote = vote.voteType;
    }
  }

  const totalVotes = (report.positiveVotesCount || 0) + (report.negativeVotesCount || 0);
  const positivePercentage = totalVotes > 0 ? Math.round((report.positiveVotesCount / totalVotes) * 100) : 75;
  const negativePercentage = 100 - positivePercentage;

  return c.json({
    success: true,
    data: {
      report: {
        id: report._id,
        userId: report.userId,
        itemTitle: report.itemTitle,
        price: report.price,
        formattedPrice: formatBanglaPrice(report.price),
        authorName: report.authorName,
        isAnonymous: report.isAnonymous,
        categorySlug: report.categorySlug,
        location: report.location,
        condition: report.condition,
        tags: report.tags || [],
        attributes: report.attributes || {},
        extraDetails: report.extraDetails || {},
        imageUrl: report.imageUrl || '',
        positiveVotesCount: report.positiveVotesCount || 0,
        negativeVotesCount: report.negativeVotesCount || 0,
        positivePercentage,
        negativePercentage,
        userVote,
        relativeTimeBn: getRelativeTimeBn(report.createdAt),
        createdAt: report.createdAt,
      },
    },
  });
}

export async function getPriceSummary(c: Context) {
  const query = c.req.query();
  const search = query.q || query.search || '';
  const category = query.category || '';
  const location = query.location || '';

  const filter: Record<string, any> = { status: 'published' };

  if (category && category !== 'all') {
    filter.categorySlug = category;
  }

  if (location && location !== 'all' && location !== 'সারা বাংলাদেশ') {
    filter['location.fullAddress'] = { $regex: location, $options: 'i' };
  }

  if (search && search.trim() !== '') {
    const searchRegex = new RegExp(search.trim(), 'i');
    filter.$or = [
      { itemTitle: { $regex: searchRegex } },
      { 'location.fullAddress': { $regex: searchRegex } },
      { condition: { $regex: searchRegex } },
    ];
  }

  const reports = await PriceReport.find(filter).select('price createdAt').sort({ createdAt: -1 }).lean();

  const count = reports.length;
  if (count === 0) {
    return c.json({
      success: true,
      data: {
        hasData: false,
        count: 0,
        message: 'এখনও যথেষ্ট তথ্য নেই। আপনি প্রথম দামটি জানাতে পারেন।',
      },
    });
  }

  const prices = reports.map((r) => r.price).sort((a, b) => a - b);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const recent30DaysCount = reports.filter((r) => new Date(r.createdAt) >= thirtyDaysAgo).length;

  // Trimmed median/mean
  const medianPrice = prices[Math.floor(prices.length / 2)];
  const minRange = prices[Math.floor(prices.length * 0.15)] || prices[0];
  const maxRange = prices[Math.floor(prices.length * 0.85)] || prices[prices.length - 1];

  let confidenceLevel: 'high' | 'medium' | 'low' = 'low';
  let confidenceText = `মাত্র ${toBanglaNumber(count)}টি রিপোর্টের ভিত্তিতে`;

  if (count >= 15) {
    confidenceLevel = 'high';
    confidenceText = `উচ্চ নির্ভরযোগ্যতা · ${toBanglaNumber(count)}টি রিপোর্টের ভিত্তিতে`;
  } else if (count >= 5) {
    confidenceLevel = 'medium';
    confidenceText = `প্রাথমিক ধারণা · ${toBanglaNumber(count)}টি রিপোর্টের ভিত্তিতে`;
  } else {
    confidenceLevel = 'low';
    confidenceText = `এখনও যথেষ্ট তথ্য নেই · ${toBanglaNumber(count)}টি রিপোর্টের ভিত্তিতে`;
  }

  const latestTime = reports[0]?.createdAt;

  return c.json({
    success: true,
    data: {
      hasData: true,
      count,
      countBn: toBanglaNumber(count),
      recent30DaysCount,
      recent30DaysCountBn: toBanglaNumber(recent30DaysCount),
      typicalPrice: medianPrice,
      typicalPriceFormatted: formatBanglaPrice(medianPrice),
      minRange,
      minRangeFormatted: formatBanglaPrice(minRange),
      maxRange,
      maxRangeFormatted: formatBanglaPrice(maxRange),
      confidenceLevel,
      confidenceText,
      lastUpdatedBn: latestTime ? getRelativeTimeBn(latestTime) : 'আজ',
    },
  });
}

export async function checkMyPrice(c: Context) {
  const body = await c.req.json();
  const data = checkPriceSchema.parse(body);

  const filter: Record<string, any> = { status: 'published' };

  if (data.categorySlug) {
    filter.categorySlug = data.categorySlug;
  }

  if (data.itemTitle && data.itemTitle.trim() !== '') {
    const searchRegex = new RegExp(data.itemTitle.trim(), 'i');
    filter.$or = [{ itemTitle: { $regex: searchRegex } }];
  }

  const reports = await PriceReport.find(filter).select('price').lean();
  const count = reports.length;

  if (count < 2) {
    return c.json({
      success: true,
      data: {
        status: 'unknown',
        headlineBn: 'পর্যাপ্ত তথ্য নেই',
        descriptionBn: 'তুলনা করার জন্য এই মুহূর্তে সিস্টেমে যথেষ্ট দাম রিপোর্ট নেই।',
        quotedPrice: data.quotedPrice,
        quotedPriceFormatted: formatBanglaPrice(data.quotedPrice),
      },
    });
  }

  const prices = reports.map((r) => r.price).sort((a, b) => a - b);
  const minTypical = prices[Math.floor(prices.length * 0.2)] || prices[0];
  const maxTypical = prices[Math.floor(prices.length * 0.8)] || prices[prices.length - 1];
  const typicalMedian = prices[Math.floor(prices.length / 2)];

  let dealStatus: 'good' | 'fair' | 'high' = 'fair';
  let headlineBn = 'দামটা মোটামুটি।';
  let descriptionBn = `আপনাকে ${formatBanglaPrice(data.quotedPrice)} বলেছে। এটা সাধারণ দামের (${formatBanglaPrice(minTypical)} – ${formatBanglaPrice(maxTypical)}) মধ্যেই আছে।`;

  if (data.quotedPrice < minTypical) {
    dealStatus = 'good';
    headlineBn = 'ভালোই দাম!';
    descriptionBn = `আপনাকে ${formatBanglaPrice(data.quotedPrice)} বলেছে। সাধারণ দাম ${formatBanglaPrice(minTypical)} – ${formatBanglaPrice(maxTypical)} এর নিচে!`;
  } else if (data.quotedPrice > maxTypical) {
    dealStatus = 'high';
    headlineBn = 'একটু বেশি চাইছে।';
    descriptionBn = `আপনাকে ${formatBanglaPrice(data.quotedPrice)} বলেছে। সাধারণত এটি ${formatBanglaPrice(minTypical)} – ${formatBanglaPrice(maxTypical)} এর মধ্যে কেনা যায়।`;
  }

  return c.json({
    success: true,
    data: {
      status: dealStatus,
      headlineBn,
      descriptionBn,
      quotedPrice: data.quotedPrice,
      quotedPriceFormatted: formatBanglaPrice(data.quotedPrice),
      typicalPrice: typicalMedian,
      typicalPriceFormatted: formatBanglaPrice(typicalMedian),
      minTypicalFormatted: formatBanglaPrice(minTypical),
      maxTypicalFormatted: formatBanglaPrice(maxTypical),
      sampleCountBn: toBanglaNumber(count),
    },
  });
}

export async function votePriceReport(c: Context) {
  const tokenUser = c.get('user' as any);
  if (!tokenUser || !tokenUser.userId) {
    return c.json({ success: false, message: 'ভোট দিতে লগইন করুন' }, 401);
  }

  const reportId = c.req.param('id');
  if (!reportId || !mongoose.Types.ObjectId.isValid(reportId)) {
    return c.json({ success: false, message: 'অবৈধ রিপোর্ট আইডি' }, 400);
  }

  const body = await c.req.json();
  const data = voteSchema.parse(body);

  const report = await PriceReport.findById(reportId);
  if (!report) {
    return c.json({ success: false, message: 'রিপোর্ট পাওয়া যায়নি' }, 404);
  }

  const existingVote = await Vote.findOne({ reportId: report._id, userId: tokenUser.userId });

  if (existingVote) {
    if (existingVote.voteType === data.voteType) {
      // Toggle off / remove vote
      await Vote.deleteOne({ _id: existingVote._id });
      if (data.voteType === 'positive') {
        report.positiveVotesCount = Math.max(0, report.positiveVotesCount - 1);
      } else {
        report.negativeVotesCount = Math.max(0, report.negativeVotesCount - 1);
      }
    } else {
      // Switch vote
      if (data.voteType === 'positive') {
        report.positiveVotesCount += 1;
        report.negativeVotesCount = Math.max(0, report.negativeVotesCount - 1);
      } else {
        report.negativeVotesCount += 1;
        report.positiveVotesCount = Math.max(0, report.positiveVotesCount - 1);
      }
      existingVote.voteType = data.voteType;
      await existingVote.save();
    }
  } else {
    // New vote
    await Vote.create({
      reportId: report._id,
      userId: tokenUser.userId,
      voteType: data.voteType,
    });
    if (data.voteType === 'positive') {
      report.positiveVotesCount += 1;
    } else {
      report.negativeVotesCount += 1;
    }
  }

  await report.save();

  const totalVotes = report.positiveVotesCount + report.negativeVotesCount;
  const positivePercentage = totalVotes > 0 ? Math.round((report.positiveVotesCount / totalVotes) * 100) : 75;
  const negativePercentage = 100 - positivePercentage;

  const currentVoteDoc = await Vote.findOne({ reportId: report._id, userId: tokenUser.userId });

  return c.json({
    success: true,
    message: 'ভোট সফলভাবে সম্পন্ন হয়েছে',
    data: {
      positiveVotesCount: report.positiveVotesCount,
      negativeVotesCount: report.negativeVotesCount,
      positivePercentage,
      negativePercentage,
      userVote: currentVoteDoc ? currentVoteDoc.voteType : null,
    },
  });
}

export async function reportProblem(c: Context) {
  const tokenUser = c.get('user' as any);
  if (!tokenUser || !tokenUser.userId) {
    return c.json({ success: false, message: 'রিপোর্ট করতে লগইন প্রয়োজন' }, 401);
  }

  const reportId = c.req.param('id');
  if (!reportId || !mongoose.Types.ObjectId.isValid(reportId)) {
    return c.json({ success: false, message: 'অবৈধ রিপোর্ট আইডি' }, 400);
  }

  const body = await c.req.json();
  const data = reportProblemSchema.parse(body);

  await ModerationReport.create({
    reportId,
    userId: tokenUser.userId,
    reason: data.reason,
    details: data.details || '',
  });

  return c.json({
    success: true,
    message: 'আপনার অভিযোগ গ্রহণ করা হয়েছে। ধন্যবাদ।',
  });
}

export async function getMyReports(c: Context) {
  const tokenUser = c.get('user' as any);
  if (!tokenUser || !tokenUser.userId) {
    return c.json({ success: false, message: 'অনুমতি নেই' }, 401);
  }

  const reports = await PriceReport.find({ userId: tokenUser.userId }).sort({ createdAt: -1 }).lean();

  const formattedReports = reports.map((r) => ({
    id: r._id,
    itemTitle: r.itemTitle,
    price: r.price,
    formattedPrice: formatBanglaPrice(r.price),
    categorySlug: r.categorySlug,
    location: r.location,
    condition: r.condition,
    tags: r.tags || [],
    attributes: r.attributes || {},
    extraDetails: r.extraDetails || {},
    imageUrl: r.imageUrl || '',
    positiveVotesCount: r.positiveVotesCount || 0,
    negativeVotesCount: r.negativeVotesCount || 0,
    status: r.status,
    relativeTimeBn: getRelativeTimeBn(r.createdAt),
    createdAt: r.createdAt,
  }));

  return c.json({
    success: true,
    data: {
      reports: formattedReports,
    },
  });
}

export async function updatePriceReport(c: Context) {
  const tokenUser = c.get('user' as any);
  const id = c.req.param('id');

  if (!tokenUser || !tokenUser.userId) {
    return c.json({ success: false, message: 'অনুমতি নেই' }, 401);
  }

  const report = await PriceReport.findById(id);
  if (!report) {
    return c.json({ success: false, message: 'রিপোর্ট পাওয়া যায়নি' }, 404);
  }

  if (report.userId.toString() !== tokenUser.userId && tokenUser.role !== 'admin') {
    return c.json({ success: false, message: 'আপনি এই রিপোর্টটি পরিবর্তনের অধিকারী নন' }, 403);
  }

  const body = await c.req.json();
  const data = updatePriceReportSchema.parse(body);

  if (data.itemTitle) report.itemTitle = data.itemTitle;
  if (data.price) report.price = data.price;
  if (data.location) report.location = data.location as any;
  if (data.condition) report.condition = data.condition;
  if (data.tags) report.tags = data.tags;
  if (data.attributes) report.attributes = { ...report.attributes, ...data.attributes };
  if (data.extraDetails) report.extraDetails = { ...report.extraDetails, ...data.extraDetails };
  if (data.imageUrl !== undefined) report.imageUrl = data.imageUrl;

  await report.save();

  return c.json({
    success: true,
    message: 'রিপোর্ট সফলভাবে আপডেট করা হয়েছে',
    data: { report },
  });
}

export async function deletePriceReport(c: Context) {
  const tokenUser = c.get('user' as any);
  const id = c.req.param('id');

  if (!tokenUser || !tokenUser.userId) {
    return c.json({ success: false, message: 'অনুমতি নেই' }, 401);
  }

  const report = await PriceReport.findById(id);
  if (!report) {
    return c.json({ success: false, message: 'রিপোর্ট পাওয়া যায়নি' }, 404);
  }

  if (report.userId.toString() !== tokenUser.userId && tokenUser.role !== 'admin') {
    return c.json({ success: false, message: 'আপনি এই রিপোর্টটি মুছে ফেলার অধিকারী নন' }, 403);
  }

  await PriceReport.deleteOne({ _id: report._id });
  await Vote.deleteMany({ reportId: report._id });

  return c.json({
    success: true,
    message: 'রিপোর্ট মুছে ফেলা হয়েছে',
  });
}
