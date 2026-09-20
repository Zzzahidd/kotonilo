# Koto Nilo? — Design Specification

## 1. Document Purpose

This document is the complete UI/UX design specification for **Koto Nilo? (কত নিলো?)**, a Bangladesh-focused crowdsourced price-intelligence web platform.

This document is intended to be used as the design source of truth for implementation with Codex or another coding agent.

The product is a **responsive web platform**, not a native mobile application.

The design goal is to create a premium, calm, trustworthy, breathable, information-first experience that helps people answer one simple question:

> **How much should I pay?**

The interface should have a small amount of Bangladeshi personality and humor, but it must remain mature and useful rather than becoming a meme-style product.

---

# 2. Product Definition

## 2.1 One-Sentence Definition

> Koto Nilo? is a crowdsourced Bangladesh database of what people actually paid for products, transport, food, travel, and services, so others can check the going price before they spend money.

## 2.2 Core Product Loop

**Pay → Report → Compare → Learn → Contribute**

The product is a living database.

Its value comes from:

- Real transaction reports
- Searchable historical data
- Location
- Time
- Context
- Normalized prices
- Aggregation
- Comparison
- Freshness
- Honest confidence

The database can be complicated internally.

The user's experience should remain simple.

> **Make the database complicated, not the user's experience.**

---

# 3. Product Positioning

Do not position Koto Nilo? primarily as:

> "A crowdsourced price comparison website."

That description is technically correct but does not communicate the strongest user value.

The product should feel like a **decision tool people check immediately before spending money**.

Primary user question:

> **"Am I paying too much?"**

Primary product promise:

> **"Know the price before you agree to it."**

Alternative personality-driven messaging:

> **"Bhai, koto nilo?"**

or:

> **"See what people actually paid."**

Humor should come from the data and wording, not childish UI decoration.

---

# 4. UX Philosophy

## 4.1 Core Principles

1. **Answer first**
2. **One decision per screen**
3. **Progressive disclosure**
4. **Search before browsing**
5. **Contribution after value**
6. **Evidence without clutter**
7. **Keep price visually dominant**
8. **Use compact report cards**
9. **Do not turn the product into a social network**
10. **Do not overwhelm users with categories**
11. **Use category-specific forms**
12. **Be honest when data is insufficient**
13. **Location and freshness matter**
14. **Whitespace is a feature**
15. **Premium means restraint, not decoration**

## 4.2 Information Hierarchy

Every important screen should generally follow:

> **Primary answer → Supporting context → Small evidence → Optional details**

Do not make the user scan a dashboard to discover the answer.

---

# 5. Target User Mental Model

The user should not think:

> "I want to browse a price database."

They should think:

> "Someone quoted me a price. Is that normal?"

or:

> "I'm about to buy this. What do people usually pay?"

The homepage and search experience must support this mental model.

---

# 6. Homepage

## 6.1 Primary Purpose

The homepage exists primarily to get the user to a useful price answer quickly.

It should not become:

- A news feed
- A community feed
- A category directory
- An analytics dashboard

## 6.2 Header

### Desktop

Left:

- Koto Nilo? logo/wordmark

Center:

- Minimal navigation/search depending on viewport

Right:

- Primary contribution CTA:
  **আপনার দেওয়া দাম জানান**

### Mobile

Prioritize:

- Search
- Add price
- Essential navigation only

Do not fill the mobile header with unnecessary actions.

## 6.3 Hero

Primary headline:

> **How much should I pay?**

Possible Bangla version:

> **কত দেওয়া উচিত?**

Supporting text:

> **Real prices reported by people in Bangladesh.**

Search placeholder:

> **Search a product, service, route, hotel...**

Example searches:

- iPhone 13
- AC servicing
- CNG Mirpur → Farmgate
- Hilsa 1kg

Do not display a huge category directory above the fold.

## 6.4 Supporting Content

A small amount of useful information can appear below the hero:

- Recent useful reports
- Popular searches
- Example searches

Avoid making all of these compete equally:

- Trending
- Latest
- Categories
- Community activity
- Articles
- Charts
- Statistics

The homepage should remain focused.

---

# 7. Search

Search is one of the most important product surfaces.

## 7.1 Search Philosophy

Use **natural search**, not a complicated category tree.

Example:

User searches:

> iPhone 13

The system can identify:

> iPhone 13 128GB

or show relevant variants.

Users should not need to understand the database taxonomy.

## 7.2 Search Examples

Search should support things such as:

- iPhone 13
- Used iPhone 13
- AC servicing
- CNG Mirpur to Farmgate
- Hilsa 1kg
- Tailor shirt
- Laptop repair
- Hotel Cox's Bazar

## 7.3 Search Results

Search results should help the user reach a useful price answer quickly.

Do not force users to browse dozens of raw reports before showing the aggregate answer.

---

# 8. Price Result Page

This is the most important screen in the product.

The user should get the answer immediately.

## 8.1 Primary Structure

Example:

```
৳35,500
Typical price
৳32k–৳39k
126 recent reports
📍 Dhaka
Updated today

See reports
```

The price should be the strongest visual element.

## 8.2 Do Not Over-Metricize

Do not show a wall of:

- Average
- Median
- Mode
- Standard deviation
- Minimum
- Maximum
- Percentile
- Confidence score
- Trend score
- Multiple charts

The user primarily needs:

1. How much?
2. Is that normal?
3. Why should I trust this?

## 8.3 Terminology

Prefer:

> **Typical price**

instead of:

> Average price

"Typical" is easier to understand and better reflects a robust aggregate.

---

# 9. Data Confidence and Freshness

This is a critical product requirement.

A price database becomes misleading if old or sparse data is presented as current fact.

Never display a strong "typical price" when there are only a few reports.

## 9.1 Strong Dataset

Example:

> **Typical · High confidence**

## 9.2 Early Dataset

Example:

> **Early estimate · 7 reports**

## 9.3 Insufficient Dataset

Example:

> **Not enough data yet · only 2 reports**

## 9.4 Freshness

Examples:

> **126 reports · 23 in last 30 days**

or:

> **Updated 2 hours ago**

Freshness and sample size should be visible whenever they materially affect trust.

---

# 10. Check My Price

This is one of the most useful product interactions. The user sees a typical price and asks:

> "What if someone quoted me ৳1,800?"

## 10.1 Input

Prompt:

> **What did they quote you?**

Input:

`৳ ______`

Button:

> **Check**

## 10.2 Possible Results

### Good Deal

> 🟢 **Good deal**
>
> ৳700 is below the typical range.

### Fair

> 🟡 **Fair**
>
> ৳1,800 is within the typical range.

### High

> 🔴 **High**
>
> ৳1,800 is high. Typical: ৳800–৳1,200.

Do not classify a price when there is insufficient comparable data.

The underlying system should use the available distribution rather than arbitrary universal thresholds.

---

# 11. Location

Location matters because prices vary by place.

However, location should not create unnecessary contribution friction.

## 11.1 UX Rule

Use location primarily as:

- Context
- Filter
- Comparison dimension

rather than forcing users to provide an unnecessarily precise address.

Example:

> 📍 Dhaka ▾

Possible options:

- Dhaka
- Chattogram
- Sylhet
- Rajshahi
- Khulna
- Other

Exact address should only be requested when it materially improves the report.

---

# 12. Adding a Price

The contribution flow should be extremely fast.

The user should not have to complete a universal form containing every possible field.

## 12.1 Core Flow

```
Add price
    ↓
What did you pay for?
    ↓
Search/select item or category
    ↓
Category-specific form
    ↓
Submit
```

## 12.2 Category-Specific Templates

### Used iPhone

Required:

- Product
- Storage
- Condition
- Price
- Location

Optional:

- Battery health
- Warranty
- Box
- Charger
- Repair history
- Purchase date

### Fish

Required:

- Fish/item name
- Quantity
- Unit
- Price
- Location
- Quality

Optional:

- Market
- Fresh/frozen
- Size
- Additional details

### CNG

Required:

- Starting location
- Destination
- Price
- Time/date

Optional:

- Negotiated or meter
- Traffic
- Passenger count
- Additional details

### Hotel

Required:

- Hotel
- Location
- Room type
- Nights
- Price
- Date

Optional:

- Guests
- Breakfast
- Booking source
- Room condition
- Additional details

## 12.3 Progressive Disclosure

Do not put every possible field on screen.

Primary form:

> The few things required for a meaningful comparison.

Secondary action:

> **+ Add more details**

This keeps contribution fast while preserving data quality.

---

# 13. Dynamic Forms

The most important UX challenge is that products, transport, food, hotels, and services require radically different information.

Therefore:

> **One giant universal form is prohibited.**

Use:

> **Category → Appropriate template → Relevant details**

The user should never have to figure out what information the system needs.

---

# 14. Account and Anonymous Identity

The product should not require personal information such as email or phone by default.

The account exists mainly so users can:

- Own a report
- Edit a report
- Delete a report
- View submitted reports

## 14.1 Manual Account

Fields:

- Username
- Password

No unnecessary personal information.

## 14.2 Anonymous Account

Button:

> **Create anonymous account**

The system automatically generates credentials.

Example:

```
Username: anonymous369
Password: generated automatically
```

The anonymous identity must be unique enough to manage reports.

## 14.3 Contribution UX

The contribution experience should minimize authentication friction.

If authentication is required before submission, keep the account creation UI extremely short.

The product should not collect personal information merely because it can.

---

# 15. Reports

Reports are evidence, not a social feed.

Use compact cards.

Example:

```
৳34,500
iPhone 13 · 128GB · Used
Mirpur · 2 days ago
```

Optional details can appear below.

Do not create a Facebook-like feed.

Avoid:

- Likes
- Followers
- Comments
- Social profiles
- Reactions
- DMs
- Engagement counters

The community exists to generate useful data.

---

# 16. Report Details

A report detail view should show:

- Price
- Item/service
- Relevant context
- Location
- Date/time
- Optional details
- Contributor identity only when useful
- Edit/delete controls for the owner

Keep the view compact.

---

# 17. My Reports

The user needs a simple management page.

Show:

- Submitted reports
- Price
- Item
- Location
- Date
- Status

Actions:

- Edit
- Delete

Do not turn this into a complex analytics dashboard.

---

# 18. Category Architecture

Categories should primarily exist in the backend/data model.

They should not dominate navigation.

Broad examples:

- Electronics
- Transport
- Food
- Hotels
- Services
- Shopping
- Travel

Users should usually reach categories through:

- Search
- Add price flow

The category system can evolve based on actual user behavior.

---

# 19. Price Normalization

The backend should normalize reports into meaningful units where appropriate.

Examples:

- ৳/kg
- ৳/item
- ৳/night
- ৳/trip
- ৳/hour
- ৳/service

This enables apples-to-apples comparison.

The UI should expose normalized values only when they improve understanding.

Do not expose unnecessary technical calculations.

---

# 20. Deal Classification

The interface may communicate price position using:

- 🟢 Good deal
- 🟡 Fair
- 🔴 High

This is not decoration.

The underlying concept is:

> Price position / deal score

Classification should depend on sufficient comparable data.

If there is not enough data:

> Not enough data to compare.

Never manufacture confidence.

---

# 21. Moderation and Data Quality

Because the product is user-generated, the system needs protection against:

- Spam
- Fake prices
- Jokes
- Duplicate reports
- Offensive content
- Malicious reports
- Suspicious patterns

Possible system-level controls:

- Rate limiting
- Duplicate detection
- Suspicious-price detection
- Community flagging
- Admin review
- Report status

These mechanisms should not clutter the normal user experience.

---

# 22. Visual Design Direction

## 22.1 Overall Aesthetic

The product should feel:

- Premium
- Calm
- Modern
- Trustworthy
- Breathable
- Information-first
- Mature
- Slightly playful

Reference qualities:

- Airbnb-like clarity
- Uber-like utility
- Modern SaaS information hierarchy
- Strong editorial typography

Do not copy another company's UI.

---

# 23. What "Premium" Means

Premium does not mean:

- Black everywhere
- Gold accents
- Huge gradients
- Excessive glassmorphism
- Large shadows
- Excessive animation
- Decorative noise everywhere
- AI-generated visual clutter

Premium means:

- Strong typography
- Generous whitespace
- Restrained color
- Subtle borders
- Calm surfaces
- Confident hierarchy
- High-quality imagery where needed
- Thoughtful interactions
- Consistent responsive behavior

---

# 24. Background and Surfaces

Primary background:

> `#F5F3F5`

Primary dark/CTA:

> `#191923`

The interface should feel slightly warm rather than sterile white.

Use white surfaces to create hierarchy.

Do not use excessive cards.

A section does not need a card simply because it contains information.

---

# 25. Color Variables

Use semantic variables rather than arbitrary one-off colors.

### Background
- Background.default = `#F5F3F5`
- Background.subtle = `#F0EFF0`

### Surface
- Surface.default = `#FFFFFF`
- Surface.subtle = `#FAFAF8`
- Surface.elevated = `#FFFFFF`

### Text
- Text.primary = `#191923`
- Text.secondary = `#55555C`
- Text.muted = `#848389`
- Text.inverse = `#FFFFFF`

### Border
- Border.default = `#E3E2E3`
- Border.subtle = `#EFEDEF`

### Icon
- Icon.primary = `#191923`
- Icon.secondary = `#696A70`

### Brand
- Brand.primary = `#191923`

### Feedback — Positive
- Feedback.positive = `#168A55`
- Feedback.positive.bg = `#EAF7F0`
- Feedback.positive.border = `#CDECDE`

### Feedback — Negative
- Feedback.negative = `#D94A45`
- Feedback.negative.bg = `#FDEEEE`
- Feedback.negative.border = `#F5D2D0`

### Interactive
- Interactive.primary = `#191923`
- Interactive.primary.hover = `#2A2A35`
- Interactive.primary.pressed = `#101017`
- Interactive.focus = `#191923`
- Interactive.disabled = `#B8B7BA`

### Input
- Input.bg = `#FFFFFF`
- Input.border = `#E3E2E3`
- Input.border.focus = `#191923`
- Input.text = `#191923`
- Input.placeholder = `#848389`
- Input.icon = `#696A70`

---

# 26. Typography

## 26.1 Fonts

Primary Bangla font:

> Noto Sans Bengali

Primary Latin/English font:

> Inter

The implementation should load the appropriate weights.

## 26.2 Font Weights

- 400 = Regular
- 500 = Medium
- 600 = SemiBold
- 700 = Bold

Prefer 400, 500, and 600.

Use 700 sparingly.

Hero titles should generally use 600 rather than an excessively heavy weight.

---

# 27. Desktop Type Scale

| Style | Size | Weight | Line-height |
|---|---|---|---|
| Hero H1 | 64px | 600 | ~74px |
| Hero Supporting Text | 24px | 400 | ~36px |
| Section Heading | 28px | 600 | 36px |
| Section Supporting Text | 16px | 400 | 24px |
| Navigation | 16px | 500 | 24px |
| Navbar CTA | 14px | 500 | 20px |
| Card Title | 20px | 500 | 28px |
| Card Price | 28px | 600 | 36px |
| Card Metadata | 13–14px | 400 | 20px |
| Status/Vote Chips | 13px | 500 | Height: 32px |

---

# 28. Mobile Type Scale

| Style | Size | Weight |
|---|---|---|
| Hero H1 | 40px | 600 |
| Hero Supporting Text | 18px | 400 |
| Section Heading | 24px | 600 |
| Card Title | 18px | 500 |
| Card Price | 24px | 600 |
| Body | 15–16px | 400 |
| Navigation/Buttons | 14px | 500 |
| Metadata | 12–13px | 400 |

---

# 29. Spacing System — Mandatory 4px Grid

This is a strict design rule.

All spacing values must use a 4px base grid and should be multiples of 4px.

This applies to:

- Padding
- Margin
- Gap
- Grid spacing
- Section spacing
- Component spacing
- Input spacing
- Card spacing
- Button spacing
- Layout spacing
- Border radius

Preferred values:

> 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 80, 96

Do not introduce arbitrary values such as:

> 3, 5, 7, 10, 13, 15, 17, 18, 22, 26, 30

unless there is a genuine technical exception.

Consistency is more important than mathematical perfection.

---

# 30. Border Radius

Standard radius values must also follow the 4px system.

Recommended:

- Input: 12px
- Button: 8–12px
- Small container: 8px
- Cards: 16px
- Large containers: 16px
- Category cards: 12–16px

Intentional pill exception:

> `9999px`

for chips/status pills when a pill shape is specifically intended.

Avoid random corner radii.

---

# 31. Shadows

Use very little shadow.

The interface should rely primarily on:

- Surface contrast
- Borders
- Whitespace
- Typography

Report cards should generally have:

> No obvious shadow

Elevated elements may use a subtle shadow only when necessary.

Avoid floating-everything UI.

---

# 32. Cards

Cards should be used only when they help separate independent information.

Do not wrap every section in a card.

Report card characteristics:

- White surface
- Subtle border
- 16px radius
- Compact content
- Strong price hierarchy
- Quiet metadata
- Minimal shadow

---

# 33. Buttons

Not every button should look like the primary CTA.

### Primary

Dark: `#191923`

Use for important actions such as:

- Add price
- Check
- Submit

### Secondary

Use subtle border/surface treatment.

### Tertiary

Use text or icon treatment when appropriate.

Avoid turning every action into a large filled button.

---

# 34. Inputs

Inputs should be calm and obvious.

Default:

- Background: `#FFFFFF`
- Border: `#E3E2E3`
- Text: `#191923`
- Placeholder: `#848389`
- Radius: `12px`

Focus:

- Border: `#191923`

Maintain sufficient contrast and visible focus states.

---

# 35. Search Input

Search is a major product interaction.

It should be visually prominent but not visually aggressive.

Use:

- Search icon
- Clear placeholder
- Large enough hit area
- Comfortable horizontal padding
- Clear focus state

Desktop search can be wide.

Mobile search should occupy the available width.

---

# 36. Hero Visual / Texture

A subtle visual atmosphere can be used in the hero.

Possible direction:

- Restrained texture
- ASCII-inspired pattern
- Small typographic marks
- Data-like visual fragments
- Very subtle grid/noise

The visual must:

- Stay secondary to the headline
- Not cover the entire hero
- Not reduce readability
- Not look like generic AI-generated decoration
- Not become a giant illustration

The visual should reinforce the idea of data, prices, and real-world transactions without becoming literal.

---

# 37. Responsive Layout

The platform must be designed mobile-first in interaction while still supporting a strong desktop layout.

### Desktop

Use:

- Wide content container
- Strong central hero
- Large search
- Compact navigation
- Two-column layouts only where useful
- Generous whitespace

### Mobile

Prioritize:

- Search
- Primary answer
- Check price
- Add price
- Relevant evidence

Avoid:

- Dense tables
- Horizontal overflow
- Tiny metadata
- Excessive filters
- Multi-column card grids when they reduce readability

---

# 38. Recommended Core Screens

The MVP should have these core screens.

### 1. Home
Purpose: Start a price search.
Elements: Header, Hero, Search, Example searches, Small evidence section

### 2. Search
Purpose: Find a product/service/route.
Elements: Search input, Search results, Relevant categories/variants only when needed

### 3. Price Result
Purpose: Answer how much the user should expect to pay.
Elements: Typical price, Range, Report count, Location, Freshness, Check My Price, See reports

### 4. Check My Price
Purpose: Compare a quoted price against real reports.
Elements: User price input, Result classification, Explanation, Typical range

### 5. Add Price
Purpose: Contribute a transaction.
Elements: Item/category selection, Dynamic form, Essential fields, Optional details, Submit

### 6. Report Details
Purpose: Show evidence behind the aggregate.
Elements: Price, Context, Location, Time, Optional details

### 7. My Reports
Purpose: Manage reports.
Elements: Report list, Edit, Delete

---

# 39. MVP Scope

The MVP should include:

- Homepage
- Search
- Categories/templates
- Price result pages
- Community reports
- Dynamic forms
- Location
- Timestamp
- Price normalization
- Aggregation
- Anonymous/manual account system
- Report ownership
- Edit/delete
- Basic moderation
- Responsive web experience

---

# 40. Explicitly Avoid in MVP

Do not build:

- Social feed
- Followers
- Messaging
- Nationwide interactive map
- Hundreds of categories
- AI parsing
- Payments
- Complex gamification
- Large analytics dashboard
- Excessive notifications
- Native mobile application
- Community profiles as a major feature

The first product question is:

> Will people report prices, and will other people find those reports useful?

---

# 41. Data Density Strategy

The biggest product risk is not technical complexity.

It is:

> Not having enough useful data.

The product needs enough reports for a meaningful answer.

Therefore the interface must encourage contribution without turning contribution into the primary experience.

Important strategies:

- Make reporting fast.
- Ask only relevant fields.
- Show value before asking for contribution.
- Make the result useful immediately.
- Make report ownership simple.
- Use freshness indicators.
- Do not fake certainty.

---

# 42. Comparison Quality

Apples-to-apples comparison requires context.

### Phone
Potentially relevant: Model, Storage, Condition, Battery health, Warranty, Repair history

### Hotel
Potentially relevant: Hotel, Room type, Nights, Guests, Date, Booking source

### Transport
Potentially relevant: Origin, Destination, Vehicle/service type, Price, Time/date, Negotiated/meter

The UI should request context only when it materially affects comparison.

---

# 43. Interaction Rules

**Loading** — Prefer lightweight skeletons where needed. Do not animate every element.

**Hover** — Use subtle surface/border changes.

**Focus** — Always maintain a clear focus state.

**Pressed** — Use a small visual change rather than dramatic animation.

**Success** — Use concise confirmation. Example: `Price added.`

**Error** — Explain what needs fixing. Avoid generic messages like `Something went wrong.`

---

# 44. Accessibility

The product must maintain strong accessibility fundamentals.

Requirements:

- Sufficient text contrast
- Visible focus states
- Keyboard navigation
- Adequate touch targets
- Semantic HTML
- Form labels
- Error messages associated with inputs
- Do not rely on color alone to communicate Good/Fair/High
- Support Bangla typography correctly

When using green/yellow/red status colors, also provide text labels and/or icons.

---

# 45. Content Tone

Tone should be:

- Clear
- Direct
- Helpful
- Slightly witty
- Bangladeshi
- Never childish

Examples:

- কত নিলো?
- আপনার দেওয়া দাম জানান
- কত দেওয়া উচিত?
- অন্যরা কত দিয়েছে?
- আপনার দামটা কেমন?
- Not enough data yet

The product should sound like a knowledgeable friend, not a corporate bank and not a meme page.

---

# 46. Navigation

Keep navigation minimal.

Potential desktop structure:

```
[Logo]   Home   Search                    [আপনার দেওয়া দাম জানান]
```

or:

```
[Logo]   Home   Categories   Search        [আপনার দেওয়া দাম জানান]
```

Do not add navigation items just because there is space.

Mobile should collapse to the most useful actions.

---

# 47. Empty States

Empty states must be useful.

Example:

> No reliable price yet.
>
> Be the first person to add what you paid.

CTA:

> Add a price

Do not show a fake price.

---

# 48. Low-Data States

If only a few reports exist:

> **Early estimate**
>
> Based on 4 recent reports.

If data is insufficient:

> **Not enough data yet**
>
> We need a few more reports before we can give you a reliable typical price.

This is better than presenting false precision.

---

# 49. Error and Trust Philosophy

Trust is more important than visual polish.

Never:

- Pretend there is enough data
- Hide report age
- Present stale prices as current
- Manufacture averages
- Use fake community activity
- Create fake user counts
- Create fake review counts

If the system does not know, say so.

---

# 50. Product Personality

The name:

> Koto Nilo?

should remain central to the personality.

The product can use occasional Bangla phrasing such as:

> Bhai, koto nilo?

But avoid turning every screen into a joke.

The personality should be:

> Confident + useful + slightly cheeky

not:

> Meme app

---

# 51. Engineering/UI Implementation Guidance

The implementation should preserve the design system through reusable components and semantic tokens.

Recommended component groups:

```
Layout
├── Container
├── Header
├── Navigation
├── Section
└── Stack

Search
├── SearchInput
├── SearchResult
└── SearchSuggestions

Price
├── PriceDisplay
├── PriceRange
├── PriceConfidence
├── PriceStatus
└── PriceComparison

Reports
├── ReportCard
├── ReportList
└── ReportDetails

Forms
├── FormField
├── DynamicForm
├── CategorySelector
├── OptionalDetails
└── SubmitPrice

Feedback
├── EmptyState
├── ErrorState
├── SuccessMessage
└── LoadingState
```

Do not create one-off components for every screen if an existing primitive can be reused.

---

# 52. Design Token Implementation

Semantic color variables should be represented directly in the UI system.

Do not scatter raw hex values throughout components.

Example:

```css
--background-default: #F5F3F5;
--background-subtle: #F0EFF0;

--surface-default: #FFFFFF;
--surface-subtle: #FAFAF8;
--surface-elevated: #FFFFFF;

--text-primary: #191923;
--text-secondary: #55555C;
--text-muted: #848389;
--text-inverse: #FFFFFF;

--border-default: #E3E2E3;
--border-subtle: #EFEDEF;

--brand-primary: #191923;
```

The same semantic structure should be reflected in the component code.

---

# 53. 4px Rule — Implementation Requirement

All component spacing and standard radius values must use the 4px grid.

Examples:

- Button horizontal padding: 16px
- Button vertical padding: 12px
- Card padding: 24px
- Card gap: 16px
- Section gap: 48px
- Grid gap: 24px
- Input padding: 12px / 16px
- Input radius: 12px
- Card radius: 16px

Do not invent arbitrary spacing during implementation.

If a design screenshot suggests a value such as 18px, 22px, or 30px, convert it to the closest appropriate 4px-grid value unless there is a strong reason not to.

---

# 54. Do Not Overdesign

Avoid:

- Giant dashboard sidebars
- Excessive glass cards
- Gradient backgrounds everywhere
- Floating widgets everywhere
- Excessive icons
- Huge decorative illustrations
- Excessive animation
- Dense tables
- Five different CTA styles
- Too many pills
- Unnecessary charts

The product should feel like a high-quality information utility.

---

# 55. Final Design North Star

Every design decision should answer:

> Does this help someone understand how much they should pay, trust the answer, or contribute useful data?

If not, question whether it belongs.

The final experience should feel like:

> A calm, premium, trustworthy price-intelligence tool for Bangladesh.

Not:

- A social network.
- A marketplace.
- A generic SaaS dashboard.
- A giant database UI.

---

# 56. Final Product Loop

```
User has a price question
        ↓
Search
        ↓
See typical price
        ↓
Understand range + freshness + location
        ↓
Optionally check their quoted price
        ↓
Make a decision
        ↓
Later report what they actually paid
        ↓
Database becomes more useful
        ↓
Future users get better answers
```

This loop is the core of Koto Nilo?. Everything else should support it.
