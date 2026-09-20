import { z } from 'zod';

export const createPriceReportSchema = z.object({
  itemTitle: z.string().min(2, 'পণ্যের নাম লিখুন').max(150),
  categorySlug: z.string().min(1, 'ক্যাটাগরি নির্বাচন করুন'),
  price: z.number().int().positive('সঠিক দাম লিখুন'),
  currency: z.string().default('BDT'),
  location: z.object({
    division: z.string().default('ঢাকা'),
    district: z.string().default('ঢাকা'),
    area: z.string().default('মিরপুর'),
    fullAddress: z.string().min(2, 'জায়গার নাম লিখুন'),
  }),
  condition: z.string().default('ব্যবহৃত'),
  tags: z.array(z.string()).default([]),
  attributes: z.record(z.any()).default({}),
  extraDetails: z
    .object({
      batteryHealth: z.string().optional(),
      warranty: z.string().optional(),
      box: z.boolean().optional(),
      charger: z.boolean().optional(),
      repairHistory: z.string().optional(),
      notes: z.string().optional(),
      market: z.string().optional(),
      freshness: z.string().optional(),
      bookingSource: z.string().optional(),
      vehicleType: z.string().optional(),
      serviceType: z.string().optional(),
    })
    .default({}),
  imageUrl: z.string().optional(),
  imageFileId: z.string().optional(),
  isAnonymous: z.boolean().default(true),
});

export const updatePriceReportSchema = createPriceReportSchema.partial();

export const voteSchema = z.object({
  voteType: z.enum(['positive', 'negative']),
});

export const reportProblemSchema = z.object({
  reason: z.enum(['ভুল দাম', 'ভুল তথ্য', 'ডুপ্লিকেট রিপোর্ট', 'অপ্রাসঙ্গিক', 'অন্য কিছু']),
  details: z.string().max(500).optional(),
});

export const checkPriceSchema = z.object({
  itemTitle: z.string().optional(),
  categorySlug: z.string().optional(),
  quotedPrice: z.number().int().positive('যাচাই করার জন্য দাম লিখুন'),
});
