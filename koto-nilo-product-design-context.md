# Koto Nilo — Complete Product & Design Context

> This document is the single source of truth for understanding the Koto Nilo product before designing, implementing, or modifying the application.
>
> Read the entire document before making implementation decisions.
>
> The product is a **responsive web platform**. It is not a native mobile app. The same web application must work properly on desktop browsers and mobile browsers.

---

# 1. Product Overview

## Product name

**কত নিলো?**

English/transliterated internal name:

**Koto Nilo**

The visible product UI should primarily use **Bangla**.

---

# 2. One-Sentence Product Definition

**কত নিলো? is a crowdsourced Bangladesh price-information platform where people share what they actually paid for products, services, food, transportation, hotels, and other everyday transactions so other people can quickly understand what a reasonable price looks like before spending money.**

The core idea is:

> **See what other people actually paid before you decide what you should pay.**

The product is not primarily a social network.

It is not primarily an ecommerce marketplace.

It is not primarily a price-comparison shopping engine.

It is a **decision-support utility powered by community-submitted real-world price reports.**

---

# 3. The Real Problem

In Bangladesh, people frequently don't know what a product or service should cost.

This is especially true for:

- Used phones
- Used laptops
- CNG fares
- Rickshaw fares
- Local transportation
- AC servicing
- Laptop/mobile repair
- Tailoring
- Photography
- Local services
- Hotels
- Restaurants
- Fish
- Other negotiated or locally variable purchases

People currently solve this problem through:

- Asking friends
- Asking family
- Facebook groups
- Messenger
- Searching Facebook
- Google searches
- Asking someone who recently bought the same thing
- Bargaining blindly
- Guessing

The information exists, but it is fragmented and unstructured.

The problem is not simply:

> "Where can I find a price?"

The deeper problem is:

> **"What price should I expect in my situation?"**

The product should make that decision faster.

---

# 4. Core Product Loop

The core loop is:

**Pay → Report → Compare → Learn → Contribute**

Example:

1. Someone buys an iPhone 13 used for ৳35,000.
2. They submit the price.
3. Another person searches for iPhone 13.
4. They see what other people paid.
5. They understand the normal range.
6. They can judge whether a seller's quoted price is reasonable.
7. Eventually they contribute their own transaction.

The community creates the database.

The database creates the product's usefulness.

---

# 5. Primary User Goal

The primary user is NOT visiting the website because they want to browse a social feed.

They are usually trying to answer a practical question:

> **"How much should I pay?"**

or:

> **"Is this price too high?"**

The product should therefore optimize for:

- Fast information retrieval
- Low cognitive load
- Easy comparison
- Trust
- Useful context
- Minimal unnecessary information
- Quick decision-making

---

# 6. Product Philosophy

## Core principle

> **Make the database complicated, not the user's experience.**

The backend can contain:

- Categories
- Templates
- Normalization
- Location
- Timestamp
- Aggregation
- Historical data
- Reports
- Votes
- Moderation
- Confidence
- Duplicate detection

But the user should experience something simple:

> **What did you pay for? → A few relevant questions → Done.**

---

# 7. UX Principles

Every design and implementation decision should follow these principles.

## 7.1 Answer first

When a user searches something, show the useful answer before showing complicated data.

Bad:

- Large chart
- Many statistics
- Multiple filters
- Lots of metadata
- Then the price

Good:

**৳35,000**

Typical price

**৳32,000–৳39,000**

Then supporting information.

---

## 7.2 One decision at a time

Do not put the entire posting form on one screen.

Use a step-by-step flow.

For example:

1. Choose category
2. Choose/enter item
3. Enter required information
4. Optional extra information
5. Review
6. Submit

---

## 7.3 Progressive disclosure

Only show information when it becomes useful.

A phone report might initially need:

- Model
- Storage
- Condition
- Price
- Location

Optional details:

- Battery health
- Warranty
- Box
- Charger
- Repair history

Do not display every possible field immediately.

---

## 7.4 Evidence without clutter

Users should be able to trust the information without being overwhelmed.

Show:

- Price
- Relevant context
- Location
- Time
- Community judgment

Hide deeper information inside the report details.

---

## 7.5 Contribution after value

The product should provide value before aggressively asking users to contribute.

However, in the current MVP posting flow, clicking **"আপনার দেওয়া দাম জানান"** opens the account/login flow because reports need ownership.

Do not add unnecessary personal-information requirements.

---

# 8. Target Personality

The product should feel:

- Modern
- Premium
- Trustworthy
- Calm
- Human
- Slightly humorous
- Bangladeshi
- Useful
- Confident

It should NOT feel:

- Childish
- Meme-heavy
- Cheap
- Government-portal-like
- Generic SaaS
- Overly corporate
- AI-generated
- Social-media-heavy
- Dashboard-heavy

Humor should primarily come from the copy and data context, not from excessive colors, emojis, decorations, or gimmicks.

---

# 9. Responsive Strategy

This is a **responsive web application**.

There is no separate native mobile app in the MVP.

The website should support:

- Desktop browsers
- Laptop browsers
- Tablet browsers
- Mobile browsers

Desktop and mobile should use the same product architecture but adapt layout appropriately.

---

# 10. Main Information Architecture

The MVP should contain approximately these primary experiences:

```text
1. Home
2. Search / Results
3. Price Result / Item Details
4. Add Price / Post Flow
5. Login / Account
6. Anonymous Account Creation
7. Report Details
8. My Reports
9. Edit Report
10. Moderation / Report Problem interaction
```

Some of these are **pages/routes**, while some are **multi-step flows or modal states**.

Do not create unnecessary separate pages just because a step exists.

---

# 11. Page / Screen Structure

## PAGE 1 — Home

Purpose:

The home page should immediately communicate:

> What is this website?

and:

> What can I do here?

Primary actions:

1. Search for a product/service/transaction
2. Browse categories
3. Add your own price report

### Navbar

Left:

**কত নিলো?**

Center:

Search input on desktop.

Recommended desktop navbar search:

```text
Width: 320px
Height: 44px
```

Search placeholder:

**পণ্য, সেবা বা জায়গা খুঁজুন**

Right:

**আপনার দেওয়া দাম জানান**

The CTA is the primary contribution action.

Do not overload the navbar with many links.

Possible supporting navigation:

- দাম খুঁজুন
- কীভাবে কাজ করে

But navigation must remain minimal.

---

# 16. Home Hero

The hero must NOT look like a generic SaaS hero.

It should feel:

- Premium
- Editorial
- Atmospheric
- Trustworthy
- Modern
- Bangladeshi

The user specifically wants visual texture/patterns rather than a boring plain white hero.

Possible visual direction:

- Subtle Bangladesh/Dhaka imagery
- Editorial photography
- Grain
- Structured texture
- Subtle data/report cards
- Controlled ASCII/data texture if appropriate
- Layered visual composition

Do not fill the entire hero with decorative UI.

The decoration should support the message.

### Hero headline

Primary direction:

**ভাই, কত নিলো?**

Supporting message:

**কিছু কেনার আগে দেখে নিন, অন্যরা কত দামে কিনেছে।**

Alternative:

**আপনি কত দেবেন, সেটা বলার আগে জেনে নিন অন্যরা কত দিয়েছে।**

Primary action:

**দাম জানতে শুরু করুন**

The hero should communicate the product's value in seconds.

---

# 17. Home Search

The search experience is one of the most important elements.

Search should be natural.

The user should be able to type:

```text
iPhone 13
CNG Mirpur to Farmgate
AC servicing
ইলিশ মাছ
ল্যাপটপ
```

Do not force the user to navigate a complicated category hierarchy before searching.

Categories are primarily an underlying structure that helps the system understand the report.

---

# 18. Home Categories

The initial category set should be small.

Suggested categories:

- মোবাইল ফোন
- ল্যাপটপ
- ইলেকট্রনিক্স
- গ্যাজেট
- ঘড়ি
- বাইক
- ঘর ও আসবাব
- খাবার
- যাতায়াত
- সেবা
- হোটেল
- অন্যান্য

Do not launch with hundreds of categories.

The category system should evolve based on actual user behavior.

---

# 19. Home Recent Reports

The homepage can show recent community reports.

Section title:

**সাম্প্রতিক দাম রিপোর্ট**

The feed should be mixed across categories.

Example:

```text
iPhone 13
৳35,000
মিরপুর, ঢাকা · ২ দিন আগে

MacBook Air M1
৳65,000
ধানমন্ডি, ঢাকা · ৩ দিন আগে

CNG
মিরপুর → ফার্মগেট
৳280
মিরপুর, ঢাকা · ৫ ঘণ্টা আগে

হোটেল
৳1,800
মোহাম্মদপুর, ঢাকা · ১ দিন আগে
```

The user can browse without selecting a category.

Once the user searches or filters, the feed becomes specific.

---

# 20. Price Report Card

The card is intentionally minimal.

This is extremely important.

A card is NOT:

- A dashboard
- A mini analytics report
- A social-media post
- A product listing page

It represents:

> **One real-world price report.**

The card should answer four questions:

1. What?
2. How much?
3. What context?
4. What does the community think?

### Card structure

```text
[Optional Image]

আইফোন ১৩ · ১২৮ জিবি

৳৩৫,০০০

ব্যবহৃত · ভালো অবস্থা

📍 মিরপুর, ঢাকা · ২ দিন আগে

👍 ভালো দাম ৮২%     👎 বেশি দাম ১৮%
```

---

# 21. Card Information Rules

DO show:

- Item name
- Price
- Only necessary context
- Location
- Time
- Community judgment

DO NOT show on the primary card:

- Username
- Battery health
- Warranty
- Box
- Charger
- Repair history
- Long descriptions
- Report IDs
- Large statistics
- Average price
- Typical range
- Confidence score
- Charts
- Too many badges
- Excessive metadata

Those belong in the detail experience.

---

# 22. Username on Cards

Do not show:

**By Muksidur Rahman**

The platform is not a social network.

Anonymous identity exists primarily for ownership and management of reports.

The user's identity should not become the main content of the card.

The report should feel like:

> **A useful price record**

rather than:

> **Someone's social post**

---

# 23. Image-less Cards

Images are optional.

The system must work when a report has no photo.

For example:

```text
┌──────────────────────────────────────┐
│                                      │
│  সিএনজি                              │
│  মিরপুর → ফার্মগেট                  │
│                                      │
│  ৳২৮০                               │
│                                      │
│  সাধারণ · মিরপুর, ঢাকা · ৫ ঘণ্টা আগে │
│                                      │
│  👍 ঠিকঠাক ৬৮%   👎 বেশি নিয়েছে ৩২% │
│                                      │
└──────────────────────────────────────┘
```

Do not reserve a giant empty image box if there is no image.

---

# 24. Community Voting

The community can judge whether a reported price seems reasonable.

Primary choices:

**👍 ভালো দাম**

**👎 বেশি দাম**

For transportation where appropriate:

**👍 ঠিকঠাক**

**👎 বেশি নিয়েছে**

The vote should communicate:

> "What do people think about this price?"

It is not the same as the transaction itself.

The report says:

> Someone paid ৳35,000.

The community vote says:

> Other people think that price is good/bad.

Keep these concepts visually distinguishable.

---

# 25. Price Result Page

When someone searches a product/service, the result page should answer:

> How much does this normally cost?

Example:

```text
আইফোন ১৩ · ১২৮ জিবি

সাধারণত কত পড়ছে

৳৩২,০০০ – ৳৩৯,০০০

সাধারণ দাম
৳৩৫,০০০

৪৭টি রিপোর্ট
গত ৩০ দিনে ১৮টি

📍 ঢাকা
সর্বশেষ আপডেট: ২ ঘণ্টা আগে
```

Do not overload the result page.

The most important information is:

1. Typical price
2. Range
3. Number/freshness of reports
4. Location
5. Time

---

# 26. Data Confidence

Do not present a strong price estimate when there is not enough data.

Examples:

### Very little data

**এখনও যথেষ্ট তথ্য নেই**

মাত্র ৩টি রিপোর্টের ভিত্তিতে।

### Early estimate

**প্রাথমিক ধারণা**

১০টি রিপোর্টের ভিত্তিতে।

### Enough data

**সাধারণত এই দামের মধ্যে**

৳৩২,০০০ – ৳৩৯,০০০

৪৭টি রিপোর্টের ভিত্তিতে।

Freshness matters.

Example:

**গত ৩০ দিনে ১৮টি রিপোর্ট**

or:

**সর্বশেষ আপডেট: ২ ঘণ্টা আগে**

---

# 27. "My Price" / Price Checking Interaction

A key product interaction is allowing a user to test a quoted price.

Example:

**আপনাকে কত বলেছে?**

Input:

**৳ কত?**

CTA:

**দাম যাচাই করুন**

Result:

### Good

**ভালোই দাম! 👍**

আপনাকে ৳৩৪,০০০ বলেছে।

সাধারণ দাম:

৳৩২,০০০ – ৳৩৯,০০০

### Normal

**দামটা মোটামুটি।**

আপনাকে ৳৩৭,০০০ বলেছে।

এটা সাধারণ দামের মধ্যেই আছে।

### High

**একটু বেশি চাইছে। 👀**

আপনাকে ৳৪২,০০০ বলেছে।

সাধারণ দাম:

৳৩২,০০০ – ৳৩৯,০০০

Do not treat these labels as absolute truth.

They are based on available community data.

---

# 28. Report Detail Page

Clicking a card should reveal deeper information.

Example:

```text
আইফোন ১৩ · ১২৮ জিবি

৳৩৫,০০০

ব্যবহৃত · ভালো অবস্থা

মিরপুর, ঢাকা
২ দিন আগে
```

Then:

### অতিরিক্ত তথ্য

- ব্যাটারি: ৮৭%
- ওয়ারেন্টি: নেই
- বক্স: আছে
- চার্জার: আছে
- রিপেয়ার করা হয়েছে: না

Then:

### এই দামটা কেমন?

👍 ভালো দাম ৮২%

👎 বেশি দাম ১৮%

The detail page is where additional information belongs.

---

# 29. Add Price / Post Flow

Clicking:

**আপনার দেওয়া দাম জানান**

starts the contribution flow.

The contribution process must be step-by-step.

Do not display every possible field on one screen.

---

# 30. Step 1 — Account / Login

The user needs an account so that they can manage their reports.

The account does NOT need unnecessary personal information.

There are two primary options.

## Option A — Existing account

Username:

**আপনার ইউজারনেম**

Password:

**আপনার পাসওয়ার্ড**

CTA:

**লগইন করুন**

---

## Option B — Anonymous account

CTA:

**বেনামে পোস্ট করুন**

This creates an anonymous account.

No phone number is required.

No email is required.

The system automatically generates:

### Username

Example:

**Anonymous 369**

or a Bangla-friendly unique anonymous identifier.

### Password

The system generates a unique password.

The user is shown the credentials.

Example:

```text
আপনার বেনামী অ্যাকাউন্ট তৈরি হয়েছে

ইউজারনেম
Anonymous 369

পাসওয়ার্ড
••••••••

এই তথ্যগুলো সংরক্ষণ করে রাখুন।
পরে আপনার রিপোর্ট পরিবর্তন বা মুছে ফেলতে এগুলো প্রয়োজন হতে পারে।
```

CTA:

**চালিয়ে যান**

---

# 31. Important Account Principle

The account system exists for:

- Ownership
- Editing reports
- Deleting reports
- Managing submitted information

It is NOT intended to create a social identity.

Avoid:

- Followers
- Following
- Profiles
- DMs
- Social feeds
- Likes on users
- Public reputation scores

---

# 32. Step 2 — Category Selection

After authentication/account creation:

Headline:

**আপনি কিসের জন্য টাকা দিয়েছেন?**

Search:

**ক্যাটাগরি খুঁজুন...**

Categories should initially remain limited.

Example:

- মোবাইল ফোন
- ল্যাপটপ
- ইলেকট্রনিক্স
- খাবার
- যাতায়াত
- সেবা
- হোটেল
- অন্যান্য

---

# 33. Step 3 — Category-specific Form

This is one of the most important product features.

There is NOT one universal form.

The fields change according to category.

---

# 34. Example — Used Phone

```text
আপনি কী কিনেছেন?

পণ্য
আইফোন ১৩

স্টোরেজ
১২৮ জিবি

অবস্থা
ব্যবহৃত

দাম
৳ কত দিয়েছেন?

লোকেশন
কোথা থেকে কিনেছেন?
```

Then:

**পরের ধাপ**

---

# 35. Example — CNG

```text
যাত্রাটা সম্পর্কে বলুন

কোথা থেকে
মিরপুর

কোথায়
ফার্মগেট

সময়
দিন / রাত

যাত্রী
২ জন

দাম
৳ কত দিয়েছেন?
```

Then:

**পরের ধাপ**

---

# 36. Example — Fish

```text
মাছটা সম্পর্কে বলুন

মাছের ধরন
ইলিশ

পরিমাণ
১

একক
কেজি

দাম
৳ কত দিয়েছেন?

লোকেশন
কোথা থেকে কিনেছেন?

মান
ভালো / মোটামুটি / সাধারণ
```

---

# 37. Example — AC Servicing

```text
সার্ভিসটা সম্পর্কে একটু বলুন

সেবার ধরন
এসি সার্ভিসিং

এসি
১.৫ টন

ধরন
স্প্লিট

দাম
৳ কত দিয়েছেন?

লোকেশন
কোথায় সার্ভিস নিয়েছেন?
```

---

# 38. Optional Details

After the essential fields:

Headline:

**আরও কিছু জানাতে চান?**

Supporting text:

**এই তথ্যগুলো ঐচ্ছিক। আপনার রিপোর্টকে আরও কাজে লাগাতে চাইলে যোগ করতে পারেন।**

CTA:

**+ আরও তথ্য যোগ করুন**

Examples depend on category.

For phones:

- Battery
- Warranty
- Box
- Charger
- Repair history

For hotels:

- Room type
- Guests
- Nights
- Date
- Breakfast

For services:

- Service type
- Duration
- Parts used
- Brand/model

Do not show irrelevant fields.

---

# 39. Review Before Submission

Before submitting, provide a simple review screen.

Example:

```text
আপনার রিপোর্ট

আইফোন ১৩ · ১২৮ জিবি

৳৩৫,০০০

ব্যবহৃত · ভালো অবস্থা

মিরপুর, ঢাকা
```

Actions:

**তথ্য পরিবর্তন করুন**

**দাম জমা দিন**

---

# 40. Successful Submission

After submission:

Headline:

**দামটা জানিয়ে দিলেন! 🎉**

Description:

**আপনার দেওয়া তথ্য এখন অন্যদের সিদ্ধান্ত নিতে সাহায্য করবে।**

Actions:

**রিপোর্ট দেখুন**

**আরেকটি দাম যোগ করুন**

---

# 41. My Reports

The account area should primarily provide:

**আমার রিপোর্ট**

Purpose:

- View own reports
- Edit reports
- Delete reports

Example:

```text
আমার রিপোর্ট

আইফোন ১৩
৳৩৫,০০০
মিরপুর · ২ দিন আগে

[রিপোর্ট দেখুন]
[সম্পাদনা করুন]
[মুছে ফেলুন]
```

No social profile dashboard.

---

# 42. Edit Report

Users can edit their own reports.

They cannot edit other people's reports.

The same category-specific structure should be reused.

---

# 43. Delete Report

Confirmation:

**রিপোর্টটি মুছে ফেলবেন?**

**মুছে ফেললে এই রিপোর্টটি আর অন্যরা দেখতে পারবে না।**

Actions:

**বাতিল করুন**

**মুছে ফেলুন**

---

# 44. Report Problem / Moderation

Each report can have a small option:

**এই রিপোর্টে সমস্যা আছে?**

Possible reasons:

- ভুল দাম
- ভুল তথ্য
- ডুপ্লিকেট রিপোর্ট
- অপ্রাসঙ্গিক
- অন্য কিছু

CTA:

**রিপোর্ট করুন**

The platform needs moderation because crowdsourced data can contain:

- Spam
- Fake prices
- Jokes
- Duplicates
- Offensive information
- Malicious reports

---

# 45. Search UX

Search should be one of the primary product interactions.

Natural queries should be supported.

Examples:

```text
iPhone 13
iPhone 13 128GB
CNG Mirpur Farmgate
AC servicing
ইলিশ মাছ
ল্যাপটপ
```

The system should identify the relevant category/template behind the search.

Do not force the user to understand the internal category structure.

---

# 46. Filters

Filters should remain limited.

Possible filters:

### Category

সব ক্যাটাগরি

### Location

সব জায়গা

### Time

- সবসময়
- আজ
- গত ৭ দিন
- গত ৩০ দিন

Category-specific filters can appear only when relevant.

Do not show every filter globally.

---

# 47. Location

Location matters because the same thing can have different prices in different places.

However, location should not create unnecessary friction.

Use city/area-level information where possible.

Example:

**📍 মিরপুর, ঢাকা**

or:

**📍 ঢাকা**

Exact addresses are generally unnecessary for the primary experience.

---

# 48. Time

Price information becomes less useful as it becomes old.

Every report should have a timestamp.

Examples:

- ২ ঘণ্টা আগে
- ১ দিন আগে
- ২ দিন আগে
- ১ সপ্তাহ আগে

Aggregated results should also communicate freshness.

---

# 49. Price Normalization

Where useful, normalize price into meaningful units.

Examples:

```text
৳/কেজি
৳/রাত
৳/ট্রিপ
৳/আইটেম
```

This makes different reports comparable.

However, do not expose technical normalization complexity to the user unless useful.

---

# 50. Category System

The database is dynamic.

Initial categories should be small.

Potential categories:

```text
মোবাইল ফোন
ল্যাপটপ
ইলেকট্রনিক্স
গ্যাজেট
বাইক
ঘর ও আসবাব
খাবার
মাছ
যাতায়াত
সেবা
হোটেল
অন্যান্য
```

Categories and templates can expand based on actual user behavior.

---

# 51. "Other" Category

Users must be able to submit something that doesn't fit an existing category.

Use:

**অন্যান্য**

Then collect a small amount of generic information.

The system should learn from repeated "Other" submissions and potentially create new templates/categories later.

---

# 52. What the Product Is NOT

Do not turn Koto Nilo into:

## A social network

No:

- Followers
- Following
- DMs
- User feeds
- Public profiles
- Social reputation systems

## An ecommerce marketplace

No:

- Product checkout
- Seller marketplace
- Cart
- Payment
- Product ordering

## A giant analytics dashboard

No:

- Huge charts everywhere
- Complex dashboards
- Excessive metrics
- Data-science-looking homepage

## A generic AI product

AI is not the core MVP.

Natural-language parsing can be a future enhancement.

---

# 53. AI — Future, Not MVP

Future AI could allow users to type something like:

> "ভাই মিরপুর থেকে ফার্মগেট সিএনজি করে ৩০০ টাকা নিল"

and extract:

```text
Category: CNG
From: Mirpur
To: Farmgate
Price: ৳300
```

But the system must let the user review and correct extracted information.

This is NOT required for the first MVP.

---

# 54. MVP Scope

The MVP should focus on proving two things:

### Question 1

Will people submit real price reports?

### Question 2

Will other people find those reports useful when making decisions?

MVP includes:

- Homepage
- Search
- Category selection
- Category-specific forms
- Price reports
- Report detail
- Location
- Timestamp
- Price normalization where relevant
- Community voting
- Anonymous accounts
- Login
- Edit own reports
- Delete own reports
- Basic moderation/reporting
- Aggregated price information
- Responsive desktop/mobile web UI

---

# 55. Explicitly Avoid in MVP

Do NOT build:

- Native mobile app
- Complex social profiles
- Followers
- Messaging
- Nationwide interactive maps
- Hundreds of categories
- AI parsing
- Payments
- Marketplace functionality
- Complex recommendation engine
- Gamification
- Leaderboards
- User reputation scores
- Excessive notifications
- Complicated admin analytics
- Overly sophisticated charts

Unless specifically requested later.

---

# 56. Recommended Route Structure

A reasonable web architecture can use routes similar to:

```text
/
                Home

/search
                Search results

/search/[query]
                Specific search/result page

/report/[id]
                Individual price report

/add
                Start adding a price

/add/category
                Category selection

/add/[category]
                Category-specific form

/add/[category]/details
                Optional details

/add/review
                Review before submission

/login
                Login

/account/create
                Normal account creation

/account/anonymous
                Anonymous account creation

/my-reports
                User's reports

/my-reports/[id]/edit
                Edit report
```

Some of these can be implemented as client-side steps instead of separate browser routes if that produces a better UX.

Do not create unnecessary routes simply for the sake of having more pages.

---

# 57. Recommended MVP Page Count

Think in terms of **primary experiences**, not number of URLs.

Approximately:

### 7 core user experiences

1. **Home**
2. **Search / Results**
3. **Report Details**
4. **Add Price**
5. **Login / Anonymous Account**
6. **My Reports**
7. **Edit / Delete Report**

The Add Price experience itself contains multiple steps.

This keeps the product small while still demonstrating significant UX/product complexity.

---

# 58. Homepage Content Hierarchy

The homepage should follow:

```text
NAVBAR
↓
HERO
↓
SEARCH
↓
CATEGORIES
↓
RECENT PRICE REPORTS
↓
SMALL TRUST / VALUE SECTION
↓
FOOTER
```

Do not add dozens of sections.

---

# 59. Homepage Card Hierarchy

Each report card:

```text
Optional image

Item name
↓
Price
↓
Relevant context
↓
Location + time
↓
Community vote
```

That's it.

The user should understand the card in approximately one glance.

---

# 60. Premium UI Rules

The website should feel premium through:

- Typography
- Spacing
- Alignment
- Whitespace
- Restrained colors
- Consistent radius
- Strong visual hierarchy
- High-quality photography
- Subtle texture
- Controlled motion
- Good micro-interactions

NOT through:

- Gradients everywhere
- Glassmorphism everywhere
- Excessive shadows
- Neon colors
- Excessive rounded cards
- Huge icons
- Floating random elements
- Excessive animations
- AI-generated decorative clutter

---

# 61. Hero Visual Rules

The hero is allowed to be more expressive than the rest of the site.

It can use:

- Dhaka photography
- Subtle grain
- Data-inspired texture
- Editorial composition
- Floating price cards
- ASCII/data patterns

But visual decoration should occupy a controlled area.

Do not make the entire page visually noisy.

The user's eye should still immediately land on:

**ভাই, কত নিলো?**

and the search/action.

---

# 62. Card Visual Rules

Cards should be:

- White or near-white
- Thin border
- Very subtle elevation if needed
- Moderate radius
- Spacious
- Clean
- Compact

Avoid:

- Thick borders
- Huge shadows
- Excessive badges
- Multiple colored sections
- Dashboard-style grids inside cards

---

# 63. Mobile Card Rules

On mobile:

- Use a single-column feed.
- Reduce unnecessary metadata.
- Keep price highly visible.
- Keep vote controls easy to tap.
- Do not shrink desktop cards until they become unreadable.
- Recompose the card for mobile instead of simply scaling it down.

The mobile browser experience must still feel intentional.

---

# 64. Navbar Responsive Behavior

Desktop:

```text
Logo        Search              CTA
```

Example:

```text
কত নিলো?    [ পণ্য, সেবা বা জায়গা খুঁজুন ]    [আপনার দেওয়া দাম জানান]
```

Mobile:

```text
Logo                         Add
```

The search should move into the page content rather than being forced into a cramped mobile navbar.

---

# 65. Search Input Sizes

Navbar desktop:

```text
320px × 44px
```

Mobile/full content search:

```text
100% width
48px height
```

Recommended internal padding:

```text
Horizontal: 16px
Vertical: centered
```

Icon:

```text
18px
```

---

# 66. CTA

Primary CTA:

**আপনার দেওয়া দাম জানান**

Background:

```text
#191923
```

Text:

```text
#FFFFFF
```

Recommended height:

```text
44px
```

Do not make every button look like a primary CTA.

The hierarchy should be obvious.

---

# 67. Copywriting Tone

The Bangla should sound natural to Bangladesh users.

Prefer:

**ভাই, কত নিলো?**

over:

**মূল্যের তথ্য যাচাই করুন**

Prefer:

**অন্যরা কত দিয়েছে?**

over:

**কমিউনিটি মূল্য বিশ্লেষণ**

Prefer:

**দাম যাচাই করুন**

over:

**মূল্য তুলনা সম্পাদন করুন**

Avoid unnecessarily formal Bangla.

The product should feel human.

---

# 68. Important Bangla UI Copy

## Navbar

**কত নিলো?**

**আপনার দেওয়া দাম জানান**

---

## Hero

**ভাই, কত নিলো?**

**কিছু কেনার আগে দেখে নিন, অন্যরা কত দামে কিনেছে।**

---

## Search

**পণ্য, সেবা বা জায়গা খুঁজুন**

---

## Categories

**জনপ্রিয় ক্যাটাগরি**

---

## Recent

**সাম্প্রতিক দাম রিপোর্ট**

---

## Add Price

**আপনার দেওয়া দাম জানান**

---

## Category Selection

**আপনি কিসের জন্য টাকা দিয়েছেন?**

---

## Optional Details

**আরও কিছু জানাতে চান?**

---

## Voting

**এই দামটা কেমন?**

---

## Price Checking

**আপনাকে কত বলেছে?**

**দাম যাচাই করুন**

---

## Login

**আবার স্বাগতম**

---

## Anonymous

**বেনামে পোস্ট করুন**

---

## Success

**দামটা জানিয়ে দিলেন! 🎉**

---

# 69. Data Model Concept

The backend should conceptually separate:

## User

```text
id
username
passwordHash
isAnonymous
createdAt
```

## Category

```text
id
name
slug
template
```

## Report

```text
id
userId
categoryId
item/type
price
currency
location
createdAt
updatedAt
attributes
extraDetails
image
```

## Vote

```text
id
reportId
userId
vote
createdAt
```

Where:

```text
vote = positive | negative
```

## Moderation Report

```text
id
reportId
userId
reason
createdAt
status
```

The exact implementation/data schema can evolve, but the conceptual separation should remain.

---

# 70. Category Template Concept

Each category should define what information it needs.

Example:

```text
Category: Phone

Required:
- model
- storage
- condition
- price
- location

Optional:
- battery
- warranty
- box
- charger
- repair history
```

Another:

```text
Category: CNG

Required:
- origin
- destination
- price
- time

Optional:
- passengers
- negotiation
- traffic/context
```

The frontend should render fields according to the selected category/template.

Do not hard-code one universal form.

---

# 71. Data Quality

Data quality is one of the largest risks.

Potential problems:

- Fake reports
- Spam
- Duplicate reports
- Joke submissions
- Incorrect categories
- Unrealistic prices
- Old prices
- Malicious submissions

MVP should have basic safeguards:

- Rate limiting
- Duplicate detection
- Suspicious price detection
- User report/flagging
- Admin review capability

---

# 72. Important Product Risk

The biggest product risk is NOT technical complexity.

It is:

> **Data density.**

If a user searches:

> "iPhone 13 used in Mirpur"

and finds only one random report from six months ago, the product isn't useful.

The product becomes valuable when there are enough recent reports to create meaningful comparison.

Therefore, the design should communicate uncertainty instead of pretending the database knows everything.

---

# 73. Historical Value

Over time, the database can become more valuable through:

- Historical prices
- Location differences
- Time differences
- Category trends
- Typical ranges
- Normalized prices
- Community judgments

But these are future product layers.

The MVP should not expose all of this at once.

---

# 74. Competitive Positioning

The competitive alternative is not only another website.

The actual competition includes:

- Facebook groups
- Messenger
- Google Search
- Friends
- Family
- Asking shop owners
- Asking people who recently purchased something

Existing price-information platforms also exist.

Therefore, the product's differentiation must be:

> **Structured, searchable, comparable real-world transaction data.**

Not simply:

> "People can post prices."

---

# 75. UX Differentiation

The product should win through:

```text
Search
↓
Relevant reports
↓
Simple price understanding
↓
Quick judgment
↓
Optional deeper evidence
```

not:

```text
Homepage
↓
Browse categories
↓
Open profile
↓
Read post
↓
Read comments
↓
Ask question
```

Again, this is an information utility, not a social network.

---

# 76. What Codex Should Prioritize

When implementing the product, prioritize in this order:

### 1. UX correctness

The flow must make sense before visual polish.

### 2. Information hierarchy

The important information must be immediately visible.

### 3. Responsive behavior

Desktop and mobile browser layouts must both be intentionally designed.

### 4. Component consistency

Use reusable components.

### 5. Design tokens

Use the Figma variables for:

- Colors
- Typography
- Spacing where available
- Radius where available

### 6. Visual polish

Only after the structure and UX are correct.

---

# 77. What Codex Should NOT Do

Do not:

- Invent additional features
- Add unnecessary pages
- Add social functionality
- Add random dashboard sections
- Add excessive animations
- Add AI functionality without instruction
- Add a mobile app
- Create generic SaaS UI
- Overpopulate cards
- Use English UI text when Bangla copy exists
- Replace the existing visual direction with a generic design system
- Make every component heavily rounded
- Make every action a dark CTA
- Turn the homepage into a dashboard

---

# 78. Definition of a Good Koto Nilo Experience

A new user should be able to:

1. Land on the homepage.
2. Understand what the website does almost immediately.
3. Search for something naturally.
4. See what other people paid.
5. Understand whether the price seems reasonable.
6. See enough context to judge the comparison.
7. Decide what price to negotiate/pay.
8. Optionally contribute their own report.
9. Submit that report without unnecessary personal information.
10. Later edit/delete their own report.

If the interface makes these actions harder, simplify it.

---

# 79. Final Product Mental Model

The user should think:

> **"আমি কিছু কিনতে যাচ্ছি। আগে দেখি অন্যরা কত দিয়েছে।"**

Then:

> **"ওকে, সাধারণত এই রেঞ্জে পড়ছে।"**

Then:

> **"আমাকে ৪২ হাজার বলছে? একটু বেশি মনে হচ্ছে।"**

Then:

> **"আমি ৩৮ হাজার অফার দেব।"**

That is the product.

The goal is not to make users spend more time on the website.

The goal is to help them make a better decision **faster**.

---

# 80. Final Design Principle

The entire product can be summarized as:

> **Less information. More useful information.**

And:

> **Make the database complicated, not the user's experience.**

The interface should feel premium because it is **clear, restrained, intentional, and trustworthy**, not because it contains more visual elements.

---

# 81. Current Design Direction Summary

```text
Product
└── Responsive web platform

Primary purpose
└── Help people understand real-world prices before spending

Primary user action
└── Search

Primary contributor action
└── আপনার দেওয়া দাম জানান

Core data
└── What + Price + Context + Location + Time

Community layer
└── Good price / Too expensive voting

Account
└── Username/password OR anonymous generated account

Posting
└── Category → Dynamic fields → Optional details → Review → Submit

Cards
└── Minimal transaction records

Homepage
└── Premium hero → Search → Categories → Recent reports

Visual style
└── Premium + modern + calm + Bangladeshi

Color
└── #F5F3F5 + #191923 + restrained semantic colors

Typography
└── Noto Sans Bengali

UX
└── Fast decisions + low cognitive load + progressive disclosure

MVP
└── Small, focused, useful

Avoid
└── Social network + marketplace + dashboard complexity + AI bloat
```

---

# 82. Instruction to Codex

Before writing implementation code:

1. Read this entire context.
2. Understand the product goal.
3. Preserve the information hierarchy.
4. Do not add features that aren't specified.
5. Use reusable components.
6. Use the existing Figma design/tokens where available.
7. Keep Bangla as the primary UI language.
8. Make desktop and mobile browser layouts intentional.
9. Prioritize UX over decorative UI.
10. When uncertain, choose the simpler interaction that reduces cognitive load.
11. Do not turn a simple price report into a dashboard.
12. Do not turn the product into a social network.
13. Do not turn the product into an ecommerce marketplace.
14. Do not invent data or pretend there is enough community data when there isn't.
15. Keep the product's core question in mind:

> **"আমি কত দেব?"**
