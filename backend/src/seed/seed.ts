import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { User } from '../db/User.js';
import { Category } from '../db/Category.js';
import { PriceReport } from '../db/PriceReport.js';
import { Vote } from '../db/Vote.js';
import { hashPassword } from '../utils/auth.js';

const categoriesData = [
  {
    nameBn: 'মোবাইল ফোন',
    nameEn: 'Mobile Phone',
    slug: 'phone',
    icon: 'smartphone',
    descriptionBn: 'নতুন এবং পুরাতন মোবাইল ফোনের দাম',
    order: 1,
    requiredFields: [
      { key: 'model', labelBn: 'মডেল / ব্র্যান্ড', labelEn: 'Model', type: 'text', required: true, placeholderBn: 'যেমন: iPhone 13, Samsung S23' },
      { key: 'storage', labelBn: 'স্টোরেজ', labelEn: 'Storage', type: 'select', required: true, options: ['64GB', '128GB', '256GB', '512GB', '1TB'] },
      { key: 'condition', labelBn: 'অবস্থা', labelEn: 'Condition', type: 'select', required: true, options: ['নতুন', 'ব্যবহৃত (অল্প)', 'ব্যবহৃত (ভালো অবস্থা)', 'ব্যবহৃত (স্ক্র্যাচ আছে)'] },
    ],
    optionalFields: [
      { key: 'batteryHealth', labelBn: 'ব্যাটারি হেলথ (%)', labelEn: 'Battery Health', type: 'text', required: false, placeholderBn: 'যেমন: 87%' },
      { key: 'warranty', labelBn: 'ওয়ারেন্টি আছে?', labelEn: 'Warranty', type: 'select', required: false, options: ['নেই', '১-৩ মাস', '৬ মাস+', 'অফিসিয়াল ১ বছর'] },
      { key: 'box', labelBn: 'অরিজিনাল বক্স আছে', labelEn: 'Original Box', type: 'boolean', required: false },
      { key: 'charger', labelBn: 'অরিজিনাল চার্জার আছে', labelEn: 'Original Charger', type: 'boolean', required: false },
      { key: 'repairHistory', labelBn: 'রিপেয়ার করা হয়েছে?', labelEn: 'Repair History', type: 'text', required: false, placeholderBn: 'যেমন: কোনো রিপেয়ার করা হয়নি' },
    ],
  },
  {
    nameBn: 'ল্যাপটপ',
    nameEn: 'Laptop',
    slug: 'laptop',
    icon: 'laptop',
    descriptionBn: 'ম্যাকবুক, উইন্ডোজ ও গেমিং ল্যাপটপের দাম',
    order: 2,
    requiredFields: [
      { key: 'model', labelBn: 'মডেল / ব্র্যান্ড', labelEn: 'Model', type: 'text', required: true, placeholderBn: 'যেমন: MacBook Air M1, Dell XPS 13' },
      { key: 'ramStorage', labelBn: 'র‌্যাম ও স্টোরেজ', labelEn: 'RAM & SSD', type: 'text', required: true, placeholderBn: 'যেমন: 8GB / 256GB SSD' },
      { key: 'condition', labelBn: 'অবস্থা', labelEn: 'Condition', type: 'select', required: true, options: ['নতুন', 'ব্যবহৃত (ভালো অবস্থা)', 'ব্যবহৃত (সাধারণ)'] },
    ],
    optionalFields: [
      { key: 'batteryCycle', labelBn: 'ব্যাটারি ব্যাকআপ / সাইকেল', labelEn: 'Battery Backup', type: 'text', required: false, placeholderBn: 'যেমন: ৫-৬ ঘণ্টা ব্যাকআপ' },
      { key: 'charger', labelBn: 'অরিজিনাল চার্জার সহ', labelEn: 'Charger Included', type: 'boolean', required: false },
      { key: 'warranty', labelBn: 'ওয়ারেন্টি স্ট্যাটাস', labelEn: 'Warranty Status', type: 'text', required: false },
    ],
  },
  {
    nameBn: 'গ্যাজেট',
    nameEn: 'Gadget',
    slug: 'gadget',
    icon: 'headphones',
    descriptionBn: 'হেডফোন, এয়ারপডস, পাওয়ার ব্যাংক ও অ্যাকসেসরিজ',
    order: 3,
    requiredFields: [
      { key: 'item', labelBn: 'গ্যাজেটের নাম', labelEn: 'Item Name', type: 'text', required: true, placeholderBn: 'যেমন: AirPods Pro 2, Sony WH-1000XM5' },
      { key: 'condition', labelBn: 'অবস্থা', labelEn: 'Condition', type: 'select', required: true, options: ['ইনট্যাক্ট বক্স', 'ব্যবহৃত'] },
    ],
    optionalFields: [
      { key: 'warranty', labelBn: 'ওয়ারেন্টি', labelEn: 'Warranty', type: 'text', required: false },
    ],
  },
  {
    nameBn: 'ঘড়ি',
    nameEn: 'Watch',
    slug: 'watch',
    icon: 'watch',
    descriptionBn: 'স্মার্টওয়াচ এবং এনালগ ঘড়ির দাম',
    order: 4,
    requiredFields: [
      { key: 'brandModel', labelBn: 'ব্র্যান্ড ও মডেল', labelEn: 'Brand & Model', type: 'text', required: true, placeholderBn: 'যেমন: Apple Watch Series 8, Casio Edifice' },
    ],
    optionalFields: [
      { key: 'condition', labelBn: 'অবস্থা', labelEn: 'Condition', type: 'select', required: false, options: ['নতুন', 'ব্যবহৃত'] },
    ],
  },
  {
    nameBn: 'বাইক',
    nameEn: 'Bike',
    slug: 'bike',
    icon: 'bike',
    descriptionBn: 'মোটরসাইকেল ও স্কুটারের কেনাবেচার দাম',
    order: 5,
    requiredFields: [
      { key: 'model', labelBn: 'বাইকের নাম ও সিসি', labelEn: 'Model & CC', type: 'text', required: true, placeholderBn: 'যেমন: Yamaha R15 V3, Suzuki Gixxer' },
      { key: 'year', labelBn: 'কেনার সাল / রেজিস্ট্রেশন', labelEn: 'Registration Year', type: 'text', required: true, placeholderBn: 'যেমন: ২০২১' },
    ],
    optionalFields: [
      { key: 'kmRun', labelBn: 'কত কিলোমিটার চালিত', labelEn: 'KM Driven', type: 'text', required: false, placeholderBn: 'যেমন: ১৫,০০০ কিমি' },
      { key: 'papers', labelBn: 'কাগজপত্রের মেয়াদ', labelEn: 'Papers Status', type: 'text', required: false, placeholderBn: 'যেমন: ১০ বছরের কাগজ ডিজিটাল নাম্বার' },
    ],
  },
  {
    nameBn: 'আসবাব',
    nameEn: 'Furniture',
    slug: 'furniture',
    icon: 'sofa',
    descriptionBn: 'খাট, সোফা, টেবিল, ওয়ারড্রোব ইত্যাদি',
    order: 6,
    requiredFields: [
      { key: 'item', labelBn: 'আসবাবের ধরন', labelEn: 'Furniture Item', type: 'text', required: true, placeholderBn: 'যেমন: সেগুন কাঠের ডাইনিং টেবিল' },
    ],
    optionalFields: [
      { key: 'material', labelBn: 'কাঠ / ম্যাটেরিয়াল', labelEn: 'Material', type: 'text', required: false },
    ],
  },
  {
    nameBn: 'খাবার',
    nameEn: 'Food',
    slug: 'food',
    icon: 'utensils',
    descriptionBn: 'মাছ, মাংস, মিষ্টি, ফলমূল ও রেস্তোরাঁ',
    order: 7,
    requiredFields: [
      { key: 'itemName', labelBn: 'খাবার বা পণ্যের নাম', labelEn: 'Item Name', type: 'text', required: true, placeholderBn: 'যেমন: ইলিশ মাছ, খাসির মাংস' },
      { key: 'quantity', labelBn: 'পরিমাণ ও একক', labelEn: 'Quantity & Unit', type: 'text', required: true, placeholderBn: 'যেমন: ১ কেজি, ১ পিস' },
    ],
    optionalFields: [
      { key: 'market', labelBn: 'বাজার / দোকানের নাম', labelEn: 'Market / Shop', type: 'text', required: false, placeholderBn: 'যেমন: কাওরান বাজার' },
    ],
  },
  {
    nameBn: 'যাতায়াত',
    nameEn: 'Transport',
    slug: 'transport',
    icon: 'car',
    descriptionBn: 'সিএনজি, রিকশা, বাস ও উবারের ভাড়া',
    order: 8,
    requiredFields: [
      { key: 'origin', labelBn: 'কোথা থেকে', labelEn: 'From', type: 'text', required: true, placeholderBn: 'যেমন: মিরপুর ১০' },
      { key: 'destination', labelBn: 'কোথায়', labelEn: 'To', type: 'text', required: true, placeholderBn: 'যেমন: গুলশান ১' },
      { key: 'vehicleType', labelBn: 'যানবাহন', labelEn: 'Vehicle Type', type: 'select', required: true, options: ['সিএনজি (CNG)', 'রিকশা', 'উবার কার', 'উবার বাইক', 'লোকাল বাস'] },
    ],
    optionalFields: [
      { key: 'timeOfDay', labelBn: 'যাত্রার সময়', labelEn: 'Time', type: 'select', required: false, options: ['সকাল', 'দুপুর', 'বিকাল / অফিস ছুটি', 'রাত'] },
      { key: 'passengers', labelBn: 'যাত্রী সংখ্যা', labelEn: 'Passengers', type: 'text', required: false, placeholderBn: 'যেমন: ২ জন' },
    ],
  },
  {
    nameBn: 'সেবা',
    nameEn: 'Services',
    slug: 'services',
    icon: 'wrench',
    descriptionBn: 'এসি সার্ভিসিং, রিপেয়ারিং, দর্জি ও অন্যান্য সেবা',
    order: 9,
    requiredFields: [
      { key: 'serviceType', labelBn: 'সেবার নাম', labelEn: 'Service Name', type: 'text', required: true, placeholderBn: 'যেমন: ১.৫ টন এসি সার্ভিসিং ও গ্যাস' },
    ],
    optionalFields: [
      { key: 'details', labelBn: 'কাজের বিবরণ', labelEn: 'Service Details', type: 'text', required: false },
    ],
  },
  {
    nameBn: 'হোটেল',
    nameEn: 'Hotel',
    slug: 'hotel',
    icon: 'hotel',
    descriptionBn: 'কক্সবাজার, সিলেট, সাজেক ও ঢাকার হোটেল রুমের ভাড়া',
    order: 10,
    requiredFields: [
      { key: 'hotelName', labelBn: 'হোটেলের নাম', labelEn: 'Hotel Name', type: 'text', required: true, placeholderBn: 'যেমন: Hotel Sea Crown' },
      { key: 'roomType', labelBn: 'রুমের ধরন', labelEn: 'Room Type', type: 'text', required: true, placeholderBn: 'যেমন: Deluxe Sea View AC Room' },
      { key: 'nights', labelBn: 'কত রাত', labelEn: 'Nights', type: 'text', required: true, placeholderBn: 'যেমন: ১ রাত' },
    ],
    optionalFields: [
      { key: 'season', labelBn: 'সিজন', labelEn: 'Season', type: 'select', required: false, options: ['অফ-সিজন', 'নরমাল সিজন', 'পিক সিজন / ছুটি'] },
    ],
  },
  {
    nameBn: 'অন্যান্য',
    nameEn: 'Other',
    slug: 'other',
    icon: 'help-circle',
    descriptionBn: 'যেকোনো প্রয়োজনীয় কেনাকাটার দাম',
    order: 11,
    requiredFields: [
      { key: 'title', labelBn: 'পণ্য বা সেবার বিবরণ', labelEn: 'Description', type: 'text', required: true },
    ],
    optionalFields: [],
  },
];

async function seed() {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('[Seed] Connected to MongoDB');

    // Clean up existing records
    await Category.deleteMany({});
    await User.deleteMany({});
    await PriceReport.deleteMany({});
    await Vote.deleteMany({});
    console.log('[Seed] Cleaned old database collections');

    // Insert categories
    const createdCategories = await Category.insertMany(categoriesData);
    const categoryMap = new Map(createdCategories.map((c) => [c.slug, c]));
    console.log(`[Seed] Seeded ${createdCategories.length} categories`);

    // Create dummy users
    const defaultPasswordHash = await hashPassword('password123');
    const dummyUsersData = [
      { username: 'anonymous_569', displayName: 'বেনামি ৫৬৯', isAnonymous: true, role: 'user', passwordHash: defaultPasswordHash },
      { username: 'anonymous_nihad', displayName: 'বেনামি নিহাদ', isAnonymous: true, role: 'user', passwordHash: defaultPasswordHash },
      { username: 'anonymous_882', displayName: 'বেনামি ৮৮২', isAnonymous: true, role: 'user', passwordHash: defaultPasswordHash },
      { username: 'anonymous_969', displayName: 'বেনামি ৯৬৯', isAnonymous: true, role: 'user', passwordHash: defaultPasswordHash },
      { username: 'anonymous_312', displayName: 'বেনামি ৩১২', isAnonymous: true, role: 'user', passwordHash: defaultPasswordHash },
      { username: 'anonymous_841', displayName: 'বেনামি ৮৪১', isAnonymous: true, role: 'user', passwordHash: defaultPasswordHash },
      { username: 'zahid_dev', displayName: 'জাহিদ ইসলাম', email: 'zahid@example.com', isAnonymous: false, role: 'admin', passwordHash: defaultPasswordHash },
      { username: 'nihad_ahmed', displayName: 'নিহাদ আহমেদ', email: 'nihad@example.com', isAnonymous: false, role: 'user', passwordHash: defaultPasswordHash },
      { username: 'tanvir_hasan', displayName: 'তানভীর হাসান', email: 'tanvir@example.com', isAnonymous: false, role: 'user', passwordHash: defaultPasswordHash },
      { username: 'sabbir_khan', displayName: 'সাব্বির খান', email: 'sabbir@example.com', isAnonymous: false, role: 'user', passwordHash: defaultPasswordHash },
    ];

    const createdUsers = await User.insertMany(dummyUsersData);
    console.log(`[Seed] Seeded ${createdUsers.length} users`);

    // Marketplace dummy price reports matching design preview
    const reportsData = [
      {
        userId: createdUsers[0]._id,
        authorName: 'বেনামি ৫৬৯',
        isAnonymous: true,
        categorySlug: 'phone',
        itemTitle: 'Iphone 13 • 128GB',
        price: 35000,
        location: { division: 'ঢাকা', district: 'ঢাকা', area: 'মিরপুর', fullAddress: 'মিরপুর, ঢাকা' },
        condition: 'ব্যবহৃত',
        tags: ['ব্যবহৃত', 'ভালো অবস্থা'],
        attributes: { model: 'iPhone 13', storage: '128GB', color: 'Midnight' },
        extraDetails: { batteryHealth: '৮৭%', warranty: 'নেই', box: true, charger: true, repairHistory: 'কোনো রিপেয়ার নেই' },
        imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80',
        positiveVotesCount: 88,
        negativeVotesCount: 12,
        createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
      },
      {
        userId: createdUsers[1]._id,
        authorName: 'বেনামি নিহাদ',
        isAnonymous: true,
        categorySlug: 'laptop',
        itemTitle: 'Mackbook Air M1 • 256GB',
        price: 65000,
        location: { division: 'ঢাকা', district: 'ঢাকা', area: 'ধানমন্ডি', fullAddress: 'ধানমন্ডি, ঢাকা' },
        condition: 'ব্যবহৃত',
        tags: ['ব্যবহৃত', 'ভালো অবস্থা'],
        attributes: { model: 'MacBook Air M1', ramStorage: '8GB / 256GB SSD', color: 'Space Gray' },
        extraDetails: { batteryCycle: 'ব্যাটারি হেলথ ৯২%', charger: true, box: true },
        imageUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80',
        positiveVotesCount: 76,
        negativeVotesCount: 24,
        createdAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      },
      {
        userId: createdUsers[2]._id,
        authorName: 'বেনামি ৮৮২',
        isAnonymous: true,
        categorySlug: 'transport',
        itemTitle: 'CNG (মিরপুর → গুলশান)',
        price: 220,
        location: { division: 'ঢাকা', district: 'ঢাকা', area: 'মিরপুর', fullAddress: 'মিরপুর, ঢাকা' },
        condition: 'সাধারণ',
        tags: [],
        attributes: { origin: 'মিরপুর ১০', destination: 'গুলশান ১', vehicleType: 'সিএনজি (CNG)', timeOfDay: 'দুপুর', passengers: '২ জন' },
        extraDetails: { notes: 'মিরপুর ১০ থেকে গুলশান গোলচত্বর' },
        imageUrl: '',
        positiveVotesCount: 42,
        negativeVotesCount: 58,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      },
      {
        userId: createdUsers[3]._id,
        authorName: 'বেনামি ৯৬৯',
        isAnonymous: true,
        categorySlug: 'services',
        itemTitle: 'AC Fix',
        price: 2000,
        location: { division: 'ঢাকা', district: 'ঢাকা', area: 'মোহাম্মদপুর', fullAddress: 'মোহাম্মদপুর, ঢাকা' },
        condition: 'সার্ভিস',
        tags: [],
        attributes: { serviceType: '১.৫ টন স্প্লিট এসি মাস্টার ওয়াশ ও গ্যাস রিফিল' },
        extraDetails: { details: 'কম্প্রেসার চেক ও ফুল ইনডোর-আউটডোর ক্লিনিং' },
        imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80',
        positiveVotesCount: 76,
        negativeVotesCount: 24,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        userId: createdUsers[4]._id,
        authorName: 'বেনামি ৩১২',
        isAnonymous: true,
        categorySlug: 'phone',
        itemTitle: 'iPhone 14 Pro • 256GB (Deep Purple)',
        price: 72000,
        location: { division: 'ঢাকা', district: 'ঢাকা', area: 'বনানী', fullAddress: 'বনানী, ঢাকা' },
        condition: 'ব্যবহৃত',
        tags: ['ব্যবহৃত', 'খুব ভালো অবস্থা'],
        attributes: { model: 'iPhone 14 Pro', storage: '256GB', color: 'Deep Purple' },
        extraDetails: { batteryHealth: '৮৯%', box: true, charger: true, warranty: 'নেই' },
        imageUrl: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=800&q=80',
        positiveVotesCount: 88,
        negativeVotesCount: 12,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
      {
        userId: createdUsers[5]._id,
        authorName: 'বেনামি ৮৪১',
        isAnonymous: true,
        categorySlug: 'food',
        itemTitle: 'তাজা পদ্মার ইলিশ মাছ (১.২ কেজি)',
        price: 1650,
        location: { division: 'ঢাকা', district: 'ঢাকা', area: 'কাওরান বাজার', fullAddress: 'কাওরান বাজার, ঢাকা' },
        condition: 'তাজা',
        tags: ['মাছ', 'পদ্মা ইলিশ'],
        attributes: { itemName: 'ইলিশ মাছ', quantity: '১.২ কেজি' },
        extraDetails: { market: 'কাওরান বাজার পাইকারি আড়ত' },
        imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
        positiveVotesCount: 91,
        negativeVotesCount: 9,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      },
      {
        userId: createdUsers[6]._id,
        authorName: 'জাহিদ ইসলাম',
        isAnonymous: false,
        categorySlug: 'hotel',
        itemTitle: 'Hotel Sea Crown • Deluxe Sea View AC Room',
        price: 3200,
        location: { division: 'চট্টগ্রাম', district: 'কক্সবাজার', area: 'কলাতলী', fullAddress: 'কলাতলী, কক্সবাজার' },
        condition: '১ রাত',
        tags: ['হোটেল', 'সি ভিউ'],
        attributes: { hotelName: 'Hotel Sea Crown', roomType: 'Deluxe AC Room', nights: '১ রাত' },
        extraDetails: { season: 'নরমাল সিজন', bookingSource: 'সরাসরি রিসেপশন' },
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
        positiveVotesCount: 84,
        negativeVotesCount: 16,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
      {
        userId: createdUsers[7]._id,
        authorName: 'নিহাদ আহমেদ',
        isAnonymous: false,
        categorySlug: 'bike',
        itemTitle: 'Yamaha R15 V3 (Dark Knight)',
        price: 285000,
        location: { division: 'ঢাকা', district: 'ঢাকা', area: 'উত্তরা', fullAddress: 'উত্তরা, ঢাকা' },
        condition: 'ব্যবহৃত',
        tags: ['বাইক', 'Yamaha'],
        attributes: { model: 'Yamaha R15 V3', year: '২০২২' },
        extraDetails: { kmRun: '১৪,৫০০ কিমি', papers: 'ডিজিটাল নাম্বার প্লেট ২ বছর মেয়াদ' },
        imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&q=80',
        positiveVotesCount: 70,
        negativeVotesCount: 30,
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
      },
      {
        userId: createdUsers[8]._id,
        authorName: 'তানভীর হাসান',
        isAnonymous: false,
        categorySlug: 'gadget',
        itemTitle: 'Sony WH-1000XM5 Wireless Headphones',
        price: 265000 / 10, // 26,500
        location: { division: 'ঢাকা', district: 'ঢাকা', area: 'যমুনা ফিউচার পার্ক', fullAddress: 'যমুনা ফিউচার পার্ক, ঢাকা' },
        condition: 'ইনট্যাক্ট বক্স',
        tags: ['হেডফোন', 'Sony'],
        attributes: { item: 'Sony WH-1000XM5', condition: 'ইনট্যাক্ট বক্স' },
        extraDetails: { warranty: '৬ মাসের অফিসিয়াল রিপ্লেসমেন্ট' },
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
        positiveVotesCount: 94,
        negativeVotesCount: 6,
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      },
      {
        userId: createdUsers[9]._id,
        authorName: 'সাব্বির খান',
        isAnonymous: false,
        categorySlug: 'furniture',
        itemTitle: 'সেগুন কাঠের এক্সক্লুসিভ রিডিং টেবিল ও চেয়ার',
        price: 7500,
        location: { division: 'ঢাকা', district: 'ঢাকা', area: 'বাড্ডা', fullAddress: 'বাড্ডা, ঢাকা' },
        condition: 'ব্যবহৃত',
        tags: ['আসবাব', 'সেগুন কাঠ'],
        attributes: { item: 'স্টাডি টেবিল ও কাঠের চেয়ার' },
        extraDetails: { material: '১০০% চিটাগাং সেগুন কাঠ' },
        imageUrl: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&q=80',
        positiveVotesCount: 78,
        negativeVotesCount: 22,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    ];

    for (const report of reportsData) {
      const cat = categoryMap.get(report.categorySlug);
      if (cat) {
        (report as any).categoryId = cat._id;
      }
    }

    const createdReports = await PriceReport.insertMany(reportsData);
    console.log(`[Seed] Seeded ${createdReports.length} price reports`);

    console.log('[Seed] Database successfully seeded with realistic Marketplace dummy data!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
}

seed();
