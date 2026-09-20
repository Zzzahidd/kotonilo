import { Context } from 'hono';
import { imagekit } from '../../config/imagekit.js';
import { env } from '../../config/env.js';

export async function getImageKitAuth(c: Context) {
  try {
    const authParams = imagekit.getAuthenticationParameters();
    return c.json({
      success: true,
      data: {
        ...authParams,
        publicKey: env.IMAGEKIT_PUBLIC_KEY,
        urlEndpoint: env.IMAGEKIT_URL_ENDPOINT,
      },
    });
  } catch (error: any) {
    return c.json({ success: false, message: 'ImageKit প্রমাণীকরণ ত্রুটি: ' + error.message }, 500);
  }
}

export async function uploadFile(c: Context) {
  try {
    const body = await c.req.parseBody();
    const file = body['file'] as File | undefined;

    if (!file) {
      return c.json({ success: false, message: 'কোনো ফাইল পাওয়া যায়নি' }, 400);
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName: `kotonilo_${Date.now()}_${file.name.replace(/\s+/g, '_')}`,
      folder: '/kotonilo_reports',
    });

    return c.json({
      success: true,
      message: 'ছবি সফলভাবে আপলোড হয়েছে',
      data: {
        url: uploadResponse.url,
        fileId: uploadResponse.fileId,
        thumbnailUrl: uploadResponse.thumbnailUrl,
      },
    });
  } catch (error: any) {
    console.error('[Upload Error]:', error);
    return c.json({ success: false, message: 'ছবি আপলোড করতে সমস্যা হয়েছে: ' + error.message }, 500);
  }
}
