# AGENTS.md

## Project: Koto Nilo — কত নিলো?

This document is the primary engineering instruction for Codex and all coding agents working on this repository.

Codex MUST read and follow this document before making changes.

The goal is to build Koto Nilo as a production-quality, fast, secure, maintainable web product—not as a demo, prototype, or unnecessarily complex enterprise system.

---

# 1. Product Context

## Product

**Koto Nilo? — কত নিলো?**

Koto Nilo is a Bangladesh-focused price-sharing and price-discovery web platform.

The core idea:

> Before deciding how much you should pay, see what other people actually paid.

Users can search and browse real-world purchase information shared by other people, including things such as:

- What they bought
- How much they paid
- Where they bought it
- When they bought it
- Relevant details about the purchase
- Optional photos/evidence where appropriate

The platform should help users make better everyday purchasing decisions by exposing real-world prices from other people.

The product is NOT:

- A social-media clone
- A discussion forum
- A messaging platform
- A generic e-commerce marketplace
- A price-comparison engine that depends on retailer APIs
- An AI-first product
- A complex community platform

The primary product loop is:

```text
Discover
→ Search / Browse
→ Compare real-world prices
→ Understand context
→ Decide what to pay
→ Optionally contribute your own price
```

The experience should feel trustworthy, lightweight, fast, and useful.

---

# 2. Core Engineering Philosophy

Code like a senior product engineer.

Prioritize:

1. Correctness
2. Security
3. User experience
4. Performance
5. Maintainability
6. Accessibility
7. Simplicity

Do NOT optimize for:

- Maximum number of libraries
- Maximum abstraction
- Maximum number of files
- Premature microservices
- Enterprise architecture for a small product
- Clever code
- Over-engineering

A simpler architecture that is fast, secure, and maintainable is preferred over a complicated architecture that theoretically scales further.

---

# 3. Technology Stack

## Frontend

Use:

- TanStack Start
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Radix primitives through shadcn where appropriate
- Motion
- TanStack Query
- Zustand
- React Hook Form
- Zod
- Axios

## Backend

Use:

- Hono.js
- TypeScript
- MongoDB
- Mongoose
- Zod
- Nodemailer
- JWT
- bcrypt or an appropriately maintained password-hashing library
- ImageKit integration

## Package Manager

Use **pnpm exclusively**.

Never use:

```bash
npm
yarn
bun
```

for project dependency management.

Use:

```bash
pnpm install
pnpm add
pnpm remove
pnpm dev
pnpm build
pnpm test
```

and the appropriate pnpm equivalents.

Commit the `pnpm-lock.yaml`.

Never manually edit the lockfile.

---

# 4. Version Policy

Use the latest stable versions of dependencies that are compatible with the project.

However:

**Latest does NOT automatically mean best.**

If the latest version introduces:

- instability
- known compatibility problems
- breaking behavior
- poor TanStack Start compatibility
- React incompatibility
- ecosystem instability
- performance regressions

then use the most appropriate stable version instead.

The priority is:

```text
Stable + compatible + performant
>
Newest version
```

After choosing versions, lock them through `pnpm-lock.yaml`.

Do not randomly upgrade dependencies during unrelated tasks.

Before introducing a new dependency, verify that:

1. It is actively maintained.
2. It solves a real problem.
3. It does not duplicate an existing dependency.
4. It is compatible with the current stack.
5. Its bundle/runtime cost is justified.

---

# 5. Repository Architecture

Prefer a monorepo-style structure separating frontend and backend concerns.

Recommended structure:

```text
/
├── apps/
│   ├── web/
│   │   ├── src/
│   │   ├── public/
│   │   ├── package.json
│   │   └── ...
│   │
│   └── api/
│       ├── src/
│       ├── package.json
│       └── ...
│
├── packages/
│   ├── shared/
│   └── config/
│
├── AGENTS.md
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
└── ...
```

Do not create packages merely because monorepos are fashionable.

If shared packages are not actually necessary, keep the architecture simple.

Shared code should contain only genuinely reusable concerns such as:

- shared Zod schemas
- shared TypeScript types
- shared constants

Do not share server-only code with the browser.

---

# 6. TypeScript

Use TypeScript throughout the application.

Avoid:

```ts
any;
```

unless there is a genuinely unavoidable reason.

Prefer:

- explicit types
- inferred types where safe
- discriminated unions
- Zod-inferred types
- reusable domain types

Do not duplicate types manually when they can safely be derived from Zod schemas.

Example:

```ts
const userSchema = z.object({
  username: z.string(),
});

type User = z.infer<typeof userSchema>;
```

Keep type definitions close to their domain unless they are genuinely shared.

---

# 7. Frontend Architecture

TanStack Start is the frontend framework.

Use its routing, server capabilities, and rendering architecture appropriately.

Do not recreate framework functionality manually.

Prefer:

- route-level organization
- feature/domain-based components
- reusable UI primitives
- server rendering where beneficial
- client-side interaction only where required

Avoid making the entire application client-rendered unnecessarily.

---

# 8. Rendering Strategy

Use the appropriate rendering strategy for each page.

Prefer server-rendered/static content when:

- the content does not require client-side interaction
- SEO matters
- the page can be generated efficiently

Use client-side behavior when:

- interaction requires browser state
- animations require client execution
- forms require interactive state
- filtering/searching requires immediate client interaction

Do not use client-side JavaScript for things that can be rendered on the server.

---

# 9. State Management

## Server State

Use **TanStack Query** for server state.

Examples:

- price submissions
- search results
- categories
- user profile
- notifications
- pagination
- cached API responses

Do not duplicate server state in Zustand.

## Client State

Use **Zustand** only when genuinely useful.

Good examples:

- temporary UI preferences
- modal state
- multi-step form state where appropriate
- local filters that need to persist across components
- small client-only application state

Do NOT use Zustand as a replacement for TanStack Query.

## Redux

Do not add Redux unless the application develops a concrete requirement that Zustand cannot reasonably handle.

The default is Zustand.

---

# 10. API Communication

Use **Axios** for frontend-to-backend API communication.

Create a centralized Axios client.

Do not scatter repeated Axios configuration throughout components.

The API client should centralize:

- base URL
- credentials configuration
- timeout
- request handling
- response handling
- authentication behavior
- refresh-token handling where appropriate
- error normalization

Never expose secrets through frontend environment variables.

Only public environment variables may be exposed to the browser.

---

# 11. Data Validation

Use **Zod** for validation.

Validate data at trust boundaries.

This includes:

- request bodies
- query parameters
- route parameters
- authentication input
- OTP input
- user registration
- login
- price submissions
- image metadata
- API responses where appropriate

Never trust client-side validation alone.

Frontend validation improves UX.

Backend validation provides security.

Both are required.

---

# 12. Forms

Use **React Hook Form** for non-trivial forms.

Use Zod as the validation schema.

Prefer:

```text
React Hook Form
+
Zod
```

rather than manually managing large numbers of form states.

Forms should:

- show validation errors clearly
- avoid unnecessary re-renders
- preserve useful input when possible
- prevent duplicate submissions
- provide loading states
- handle server errors
- be keyboard accessible

---

# 13. UI Components

Use **shadcn/ui** as the initial component foundation.

Do not blindly use every shadcn component.

Only install components that are actually needed.

Components should be:

- accessible
- composable
- reusable
- lightweight
- consistent with the product design system

Prefer extending existing components over creating duplicate versions.

Do not introduce another component library unless there is a strong technical reason.

---

# 14. Design Tokens and Tailwind CSS

The existing Koto Nilo design system is the source of truth.

Do NOT invent arbitrary colors throughout the application.

Use the project's existing token names.

Examples of semantic token concepts include:

```text
background.default
background.subtle

surface.default
surface.subtle
surface.elevated

text.primary
text.secondary
text.muted
text.inverse

border.default
border.subtle

icon.primary
icon.secondary

brand.primary

feedback.positive
feedback.negative

interactive.primary
interactive.hover
interactive.pressed
interactive.focus
interactive.disabled

input.background
input.border
```

The exact token names already defined in the design system MUST be preserved.

## Tailwind Usage

Use Tailwind CSS to consume the design tokens.

Do not hardcode raw color values repeatedly in components.

Bad:

```tsx
className = "bg-[#191923] text-[#ffffff]";
```

when a semantic token exists.

Prefer the project's token-based Tailwind utilities.

The implementation should allow the design system to change centrally without requiring hundreds of component edits.

---

# 15. Spacing, Gap, Padding, and Radius

Follow the project's established design-system rules.

All intentional:

- padding
- margin where applicable
- gap
- border radius

values should follow the defined 4px-based system.

Do not randomly introduce values such as:

```text
13px
17px
19px
23px
27px
```

unless there is a documented reason.

Prefer values aligned to the design system.

Do not create arbitrary spacing values merely because they visually look close.

---

# 16. Typography

Use the project's defined typography tokens.

The product supports Bengali content.

Use the project's chosen Bengali-compatible typography system and ensure Bengali text renders correctly across:

- headings
- body text
- buttons
- forms
- navigation
- price values
- error messages

Do not replace the established typography system with arbitrary fonts.

---

# 17. Responsive Design

Koto Nilo is a responsive web application.

Support:

- mobile
- tablet
- desktop
- large desktop screens

Do not design desktop first and simply shrink everything for mobile.

Important flows must be intentionally designed for mobile.

Especially:

- searching
- viewing price records
- submitting a price
- authentication
- OTP verification
- image upload
- filters

Avoid horizontal overflow.

Test realistic narrow viewport sizes.

---

# 18. Motion and Micro-Interactions

Use **Motion** as the application's animation library.

Do NOT add GSAP unless a future feature genuinely requires complex timeline-based animation that Motion cannot reasonably provide.

Motion should be used for purposeful micro-interactions throughout the application.

Examples:

- button feedback
- hover states
- focus transitions
- cards entering the viewport
- search interactions
- filter transitions
- modal/dialog transitions
- dropdown transitions
- toast notifications
- skeleton/content transitions
- page/route transitions where appropriate
- expanding/collapsing sections
- image appearance
- submission confirmation
- subtle empty-state motion

Animation must improve:

- feedback
- hierarchy
- perceived responsiveness
- continuity
- delight

Do NOT animate everything simply because animation is available.

Avoid:

- excessive bouncing
- long transitions
- distracting loops
- animation that blocks interaction
- animation that makes the product feel slow

Prefer short, subtle, purposeful animations.

Respect:

```css
prefers-reduced-motion
```

Users who request reduced motion should receive an appropriately reduced experience.

---

# 19. Performance Principles

Performance is a product requirement.

Optimize for:

- fast initial load
- fast interaction
- low JavaScript execution
- minimal network requests
- efficient rendering
- efficient database queries
- optimized images
- good caching
- good Core Web Vitals

Do not perform premature optimization.

Measure before adding complexity where possible.

---

# 20. Frontend Performance

Use appropriate techniques including:

- code splitting
- route-level splitting
- lazy loading
- dynamic imports where beneficial
- image optimization
- responsive images
- avoiding unnecessary client components
- avoiding unnecessary re-renders
- memoization only when it provides measurable or meaningful benefit
- stable component boundaries
- virtualization for genuinely large lists
- pagination/infinite loading for large datasets
- debounced search where appropriate
- request cancellation where useful
- TanStack Query caching
- prefetching where useful
- avoiding duplicate API requests

Do not blindly wrap everything in:

```ts
memo();
useMemo();
useCallback();
```

Memoization has a cost.

Use it when it solves an actual rendering problem.

---

# 21. Images

User-uploaded images are stored using **ImageKit**.

Do not store uploaded image binaries directly in MongoDB.

The database should store the necessary ImageKit information, such as:

- image URL
- file ID where needed
- relevant metadata where needed

The frontend displays the ImageKit URL.

Optimize images before delivery where possible.

Use:

- responsive dimensions
- appropriate transformations
- modern image formats where supported
- lazy loading for below-the-fold images
- eager loading only for important above-the-fold images

Never allow uncontrolled original-resolution images to destroy page performance.

---

# 22. Image Upload Security

Do not trust:

- filename
- MIME type supplied by the browser
- file extension
- file size supplied by the client

Validate uploads on the server and/or through ImageKit's supported upload/security mechanisms.

Define sensible file-size and format limits.

Do not allow arbitrary executable files.

Do not expose ImageKit private credentials to the browser.

If direct browser upload is used, generate secure server-side upload authentication/signatures as appropriate.

---

# 23. Backend Architecture

Use **Hono.js** for the API.

Keep backend responsibilities separated.

A reasonable structure:

```text
apps/api/src/
├── app.ts
├── server.ts
├── config/
├── db/
├── middleware/
├── modules/
│   ├── auth/
│   ├── users/
│   ├── prices/
│   ├── categories/
│   ├── uploads/
│   └── ...
├── schemas/
├── services/
├── utils/
└── types/
```

Use domain/module organization rather than one enormous controller file.

---

# 24. Hono API Principles

API routes should be:

- predictable
- RESTful where appropriate
- versionable
- validated
- authenticated where required
- authorized
- consistently error-handled

Use appropriate HTTP methods.

Examples:

```text
GET
POST
PATCH
DELETE
```

Do not use POST for everything.

Keep API responses consistent.

---

# 25. API Response Format

Use a predictable response structure.

Success responses should be easy for the frontend to consume.

Errors should contain safe, useful information such as:

```text
success
message
data
error/code where appropriate
```

Do not leak:

- stack traces
- database errors
- internal file paths
- environment variables
- JWT secrets
- SMTP credentials
- ImageKit credentials
- MongoDB connection strings
- internal implementation details

Production API errors must be safe for public exposure.

---

# 26. Authentication Architecture

Use:

```text
Short-lived Access Token
+
Long-lived Refresh Token
```

The access token must have a short expiration time.

The refresh token must have a substantially longer expiration time.

Do not use long-lived access tokens.

The refresh-token flow must provide an API endpoint for obtaining a new access token.

Example conceptual flow:

```text
Login
→ Access Token
→ Refresh Token

Access Token expires
→ Refresh API
→ New Access Token

Refresh Token expires/revoked
→ User must authenticate again
```

---

# 27. Refresh Token Security

Never store raw refresh tokens in the database if avoidable.

Store a cryptographic hash of the refresh token.

When a refresh request arrives:

1. Validate the token.
2. Identify the associated session/user.
3. Hash/verify against the stored value.
4. Validate expiration/revocation.
5. Issue a new short-lived access token.
6. Apply refresh-token rotation where appropriate.
7. Invalidate the previous refresh token when rotation is used.

Design authentication so compromised refresh tokens can be revoked.

Support multiple sessions/devices if the product requires it.

---

# 28. Password Security

Never store plaintext passwords.

Use a strong password hashing algorithm such as bcrypt with an appropriate cost factor, or another actively maintained password hashing solution if the project adopts one.

Never log passwords.

Never return passwords in API responses.

Never include password hashes in public user objects.

---

# 29. OTP Authentication

Use **Nodemailer** to send OTPs.

OTP requirements:

- OTP must expire quickly.
- OTP must be hashed before database storage.
- Raw OTP must never be stored permanently.
- Raw OTP must never be logged.
- OTP must have a maximum verification attempt count.
- OTP must be invalidated after successful verification.
- Old OTPs should be invalidated when a new OTP is generated.
- Rate-limit OTP requests.
- Prevent OTP abuse and repeated email sending.
- Do not expose whether sensitive account information exists when doing so would enable account enumeration.

Conceptual flow:

```text
Request OTP
→ Generate OTP
→ Hash OTP
→ Store hash + expiry + attempt information
→ Send raw OTP through Nodemailer
→ User submits OTP
→ Hash/verify submitted OTP
→ Check expiry
→ Check attempts
→ Verify
→ Invalidate OTP
```

Never print the OTP to the console in production.

---

# 30. Environment Variables

All secrets and environment-specific values must be stored in environment variables.

Examples:

```text
DATABASE_URL
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
ACCESS_TOKEN_EXPIRY
REFRESH_TOKEN_EXPIRY
SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASSWORD
IMAGEKIT_PUBLIC_KEY
IMAGEKIT_PRIVATE_KEY
IMAGEKIT_URL_ENDPOINT
API_URL
WEB_URL
```

Use appropriate names for the actual implementation.

Never commit:

```text
.env
.env.local
.env.production
```

or other secret files.

Commit only safe environment examples such as:

```text
.env.example
```

with placeholder values.

Never expose private secrets through browser-accessible environment variables.

---

# 31. Database

Use **MongoDB with Mongoose**.

Create only the models actually required by the product.

Likely domains include:

- User
- Price/Submission
- Category
- OTP
- RefreshToken/Session

Additional models should only be introduced when the product requires them.

Do not create unnecessary models because they "might be useful later."

---

# 32. Mongoose Principles

Use:

- schema validation
- appropriate indexes
- timestamps
- lean queries where appropriate
- projections/selects to avoid unnecessary fields
- pagination
- efficient population only when necessary

Do not use `.populate()` indiscriminately.

Prefer denormalization where it provides a meaningful performance or query advantage and remains maintainable.

---

# 33. Database Indexing

Index fields based on actual query patterns.

Likely candidates may include:

- category
- item/search fields
- location
- createdAt
- user/creator ID
- relevant combinations used by filters

Do not create indexes blindly.

Every index has:

- storage cost
- write cost
- maintenance cost

Indexes should support real queries.

Review indexes as query patterns evolve.

---

# 34. Pagination

Never return an unlimited number of database records.

Large lists must use pagination.

For high-volume datasets, prefer cursor-based pagination where appropriate.

Avoid unnecessarily large payloads.

The API should return only the data needed by the current screen.

---

# 35. Search

Search should be designed around actual Koto Nilo use cases.

Do not implement an unnecessarily complicated search infrastructure initially.

Start with MongoDB's capabilities where sufficient.

If search volume or requirements later justify a dedicated search engine, evaluate it based on actual evidence.

Do not add Elasticsearch/OpenSearch/etc. prematurely.

---

# 36. Caching

Use caching where it provides measurable value.

Potential cache candidates:

- popular categories
- frequently requested search results
- expensive aggregation queries
- relatively static metadata

Use appropriate cache invalidation.

Do not cache everything.

Incorrect caching is worse than no caching.

TanStack Query should handle appropriate client-side server-state caching.

Backend/server-side caching should be introduced where expensive queries justify it.

---

# 37. API Payload Optimization

API responses should contain only necessary fields.

Avoid returning:

```text
password
passwordHash
OTP data
refresh token hashes
internal database metadata
private ImageKit credentials
unnecessary large objects
```

Use projection/selects.

Paginate large responses.

Compress HTTP responses where supported by the deployment environment.

Do not send the same data repeatedly when caching can safely avoid it.

---

# 38. Rate Limiting and Abuse Prevention

Public endpoints must be protected against abuse.

Especially:

- login
- registration
- OTP requests
- OTP verification
- password operations
- refresh token endpoint
- image uploads
- price submission
- search endpoints where abuse could become expensive

Use rate limiting appropriate to the deployment architecture.

Do not make rate limits so aggressive that normal users cannot use the product.

---

# 39. Security Headers

Use appropriate security headers for the deployed application.

Consider:

- Content Security Policy where practical
- X-Content-Type-Options
- Referrer-Policy
- frame protections
- secure cookie settings where cookies are used
- appropriate CORS configuration

Do not blindly copy a security-header configuration without understanding its effect.

---

# 40. CORS

CORS must allow only known frontend origins in production.

Do not use:

```text
*
```

for credentialed authentication requests.

Development origins can be configured separately.

Never expose the backend unnecessarily.

---

# 41. Cookies / Token Storage

Choose the safest practical token transport.

For browser authentication, prefer secure HTTP-only cookies for refresh credentials where the architecture permits.

Never store sensitive long-lived authentication credentials in insecure browser storage merely because it is convenient.

Use:

- Secure cookies in production
- HttpOnly where appropriate
- SameSite configuration appropriate to the deployment
- HTTPS in production

Access-token handling should minimize exposure.

---

# 42. Authorization

Authentication answers:

> Who are you?

Authorization answers:

> What are you allowed to do?

Every protected mutation must enforce authorization server-side.

For example, if users can edit/delete their own submissions:

```text
User A
→ Can edit User A's submission

User B
→ Cannot edit User A's submission
```

Never trust a user ID supplied by the frontend.

Verify ownership on the backend.

---

# 43. Creator-Only Editing

If the product allows users to edit or delete their own price submissions:

- verify authenticated user
- verify resource ownership
- perform mutation only after authorization
- return safe errors
- do not rely on hiding UI buttons as security

The frontend may hide unauthorized controls for UX.

The backend must enforce authorization regardless.

---

# 44. Logging

Logs are useful for debugging but can become a security vulnerability.

Never log:

- passwords
- OTPs
- access tokens
- refresh tokens
- token hashes
- SMTP credentials
- ImageKit private keys
- database credentials
- cookies
- sensitive personal information

Production logs should contain enough information to diagnose failures without exposing secrets.

Use structured logging where appropriate.

Avoid noisy `console.log()` statements throughout the codebase.

Remove debugging logs before production.

---

# 45. Error Handling

Never expose raw internal exceptions to users.

Bad:

```text
MongoServerError: E11000 duplicate key error collection...
```

Instead return a safe application-level message.

Internally, log enough information to diagnose the real issue.

Use centralized error handling rather than repeating error formatting everywhere.

---

# 46. API Reliability

Every important API must be tested against the actual frontend.

Do not assume that because an endpoint exists, it works.

Verify:

- request format
- response format
- authentication
- authorization
- validation
- database operation
- error handling
- frontend integration

Especially verify:

```text
Registration
Login
OTP sending
OTP verification
Access token generation
Refresh token rotation
Logout
Price creation
Price retrieval
Search
Filtering
Pagination
Price editing
Price deletion
Image upload
Image URL retrieval
User profile
```

Only implement endpoints that the product actually needs.

---

# 47. Frontend/Backend Integration Testing

When implementing a feature that crosses frontend and backend boundaries, test the complete flow.

Example:

```text
Frontend form
→ Axios request
→ Hono route
→ Zod validation
→ Authentication
→ Mongoose
→ MongoDB
→ API response
→ TanStack Query
→ UI update
```

Do not stop after confirming that the backend route compiles.

---

# 48. Loading States

Every asynchronous interaction should have a meaningful loading state where appropriate.

Use:

- skeletons
- disabled states
- loading indicators
- optimistic updates where safe

Do not make the user stare at a frozen interface.

Skeletons should resemble the final content structure.

Do not create giant animated skeletons that consume excessive resources.

---

# 49. Error States

Every important data-fetching UI should have:

- loading state
- success state
- empty state
- error state

Do not assume data will always exist.

Example:

```text
Loading
→ Results

Loading
→ Empty results

Loading
→ Error
```

All three should be intentionally handled.

---

# 50. Empty States

Empty states should explain:

- what happened
- why the user sees nothing
- what they can do next

Avoid generic:

> No data.

Prefer useful product-specific guidance.

---

# 51. Optimistic Updates

Use optimistic updates only when:

- the action is reversible
- failure can be handled safely
- the expected result is predictable

Examples:

- simple UI preferences

Do not use optimistic updates for sensitive operations where incorrect UI state could mislead users.

---

# 52. Debouncing and Request Management

Search inputs should not trigger unnecessary requests on every keystroke.

Use appropriate debouncing.

Cancel obsolete requests where useful.

Avoid race conditions where an older search response overwrites a newer search result.

---

# 53. Accessibility

Accessibility is required.

Use:

- semantic HTML
- keyboard navigation
- visible focus states
- proper labels
- accessible dialogs
- accessible buttons
- appropriate ARIA only when necessary
- sufficient color contrast
- reduced-motion support

Do not use a `<div>` as a button when a `<button>` is appropriate.

Do not remove focus outlines without replacing them with an accessible focus treatment.

---

# 54. SEO

Koto Nilo contains public price information that can benefit from search-engine discovery.

Public pages should have appropriate:

- title
- description
- canonical URL where needed
- structured metadata where useful
- semantic content
- crawlable URLs

Do not expose private user information through SEO metadata.

Authentication and private pages should not be treated as public content.

---

# 55. URL Design

URLs should be:

- readable
- stable
- predictable
- meaningful

Avoid exposing unnecessary internal IDs when a safe slug or public identifier is more appropriate.

Do not expose sensitive database identifiers unnecessarily.

---

# 56. Data Privacy

Collect only information that the product actually needs.

Do not introduce unnecessary:

- phone collection
- email collection
- tracking
- personal data
- device fingerprinting

The product's account system should remain lightweight.

Never store sensitive data simply because the database can store it.

---

# 57. Product Moderation and Abuse

User-generated price information can be manipulated.

The architecture should leave room for:

- reporting
- moderation
- spam prevention
- abuse detection
- submission review if needed

But do not build a huge moderation platform before the product needs it.

Build the minimum safe foundation.

---

# 58. Data Integrity

Price submissions should preserve important context such as:

- item
- price
- category
- location
- date/time where relevant
- creator
- optional supporting information

Do not silently alter user-submitted values.

If normalization is required, preserve the original meaning.

---

# 59. Currency

Koto Nilo primarily operates in Bangladesh.

Use BDT/Taka appropriately.

Do not store monetary values as floating-point numbers when precision matters.

Prefer integer minor units or a carefully defined monetary representation.

If storing BDT without fractional precision, use an integer representation.

Never perform financial calculations using unsafe floating-point assumptions.

---

# 60. Dates and Time

Store timestamps consistently.

Prefer UTC for persisted timestamps where appropriate.

Convert to Bangladesh/local display time at the presentation layer when needed.

Do not rely on the server's local timezone.

---

# 61. Component Architecture

Prefer components that represent real product concepts.

Good:

```text
PriceCard
PriceForm
SearchBar
CategoryFilter
LocationFilter
PriceSummary
OtpForm
UserMenu
```

Avoid:

```text
UniversalBox
SuperContainer
MegaWrapper
GenericThing
```

Do not create abstractions before the pattern is understood.

---

# 62. Component Reuse

Reuse components when they have:

- the same responsibility
- the same interaction model
- meaningful shared behavior

Do not force unrelated components into a generic abstraction just to reduce line count.

Duplication is sometimes cheaper than a bad abstraction.

---

# 63. File and Naming Conventions

Use consistent naming.

Prefer:

```text
PascalCase.tsx
camelCase.ts
kebab-case routes where appropriate
```

Keep names descriptive.

Avoid:

```text
temp.ts
test2.ts
newComponent.tsx
finalComponent.tsx
thing.ts
```

---

# 64. Code Quality

Write code that another senior engineer can understand quickly.

Prefer:

- small focused functions
- explicit responsibilities
- predictable data flow
- meaningful names
- low coupling
- clear boundaries

Avoid:

- giant functions
- deeply nested conditionals
- duplicated business logic
- hidden side effects
- magic constants
- unnecessary abstractions
- premature design patterns

---

# 65. Business Logic

Business logic belongs in appropriate domain/service layers.

Do not put important business rules inside:

- random React components
- route handlers
- database schemas alone

Keep business rules testable and reusable.

---

# 66. Database Queries

Avoid fetching unnecessary documents.

Prefer:

```text
projection
pagination
lean()
indexes
aggregation where appropriate
```

Use aggregation pipelines when they genuinely improve the required query.

Do not create massive aggregation pipelines when a simple query is sufficient.

---

# 67. N+1 Query Prevention

Watch for N+1 database access patterns.

Bad:

```text
Fetch 50 prices
→ Query user for every price
```

Prefer:

- appropriate population when justified
- batching
- denormalization
- aggregation
- separate optimized queries

Measure before choosing the solution.

---

# 68. API Caching

Cache only data that can safely be cached.

When data changes, define how cached data becomes stale.

Do not introduce caching without an invalidation strategy.

A cache without an invalidation strategy is a future bug.

---

# 69. Network Optimization

Reduce:

- request count
- payload size
- duplicate requests
- unnecessary polling

Prefer:

- batching where appropriate
- caching
- pagination
- compressed responses
- selective fields
- prefetching only where beneficial

Do not prefetch large amounts of data users may never use.

---

# 70. Bundle Optimization

Keep the JavaScript bundle small.

Avoid importing entire libraries when a smaller import is available.

Review dependencies that significantly increase bundle size.

Do not install libraries for tiny utilities that can be implemented safely with a few lines of native code.

Use code splitting and lazy loading where beneficial.

---

# 71. Server Performance

The backend should be stateless where practical so it can later scale horizontally.

Do not introduce a load balancer into local development or the initial architecture just because horizontal scaling is mentioned.

When production traffic actually requires horizontal scaling:

```text
Load Balancer
→ Multiple API instances
→ Shared MongoDB
→ Shared cache/session infrastructure where needed
```

The application should not depend on local process memory for critical persistent state.

---

# 72. Deployment Philosophy

The application should be deployable independently:

```text
Web
API
Database
Image storage
Email
```

Do not tightly couple development infrastructure to production infrastructure.

Environment-specific configuration must remain in environment variables.

---

# 73. Git

Initialize Git locally when starting the project.

Use meaningful commits.

Commit after each meaningful completed change.

Examples:

```text
chore: initialize monorepo
feat: add authentication API
feat: add OTP verification
feat: add price submission flow
feat: add ImageKit uploads
fix: handle expired access tokens
perf: optimize price queries
refactor: simplify auth service
```

Do not make giant commits containing unrelated work.

Do not commit:

- secrets
- `.env`
- build output
- node_modules
- temporary files
- debugging artifacts

---

# 74. Git Before and After Changes

Before making substantial changes:

1. Inspect the existing repository.
2. Understand the current architecture.
3. Check existing conventions.
4. Read relevant documentation/skills.
5. Avoid rewriting working code unnecessarily.

After completing a meaningful task:

1. Run relevant checks.
2. Fix errors.
3. Review changed files.
4. Remove debugging code.
5. Commit the completed change.

Never commit broken code knowingly unless the task specifically requires committing an intermediate state.

---

# 75. Skills

**Codex MUST read the relevant available skills before performing a task.**

At the beginning of every task:

1. Identify relevant skills.
2. Read their instructions.
3. Follow them.
4. Then inspect the repository.
5. Then implement.

Do not assume that previous knowledge of a skill is sufficient.

If a task involves:

- frontend
- TanStack
- React
- Figma
- database
- deployment
- security
- testing
- Git
- image handling

check whether a relevant skill exists before implementation.

Skills are part of the project's development workflow.

---

# 76. Existing Code First

Before creating new code:

1. Search the repository.
2. Look for an existing implementation.
3. Reuse existing utilities/components/services when appropriate.
4. Extend existing architecture rather than duplicating it.

Do not create a second:

```text
apiClient
authService
validation helper
Button
Modal
Toast
database connection
```

if one already exists.

---

# 77. Do Not Rewrite Unnecessarily

If existing code works, do not rewrite it simply because you personally prefer another style.

Change existing code when:

- it is incorrect
- insecure
- unnecessarily slow
- difficult to maintain
- inconsistent with the architecture
- required by the new feature

Keep unrelated changes out of the task.

---

# 78. Testing

Important business logic and security-sensitive flows should be tested.

Prioritize tests for:

- authentication
- authorization
- OTP expiration
- OTP verification
- password hashing
- refresh token behavior
- token expiration
- ownership checks
- price creation
- price editing/deletion
- validation
- pagination
- search/filter behavior

Do not chase arbitrary test coverage percentages.

Test behavior that could break the product.

---

# 79. API Verification

When adding an API, verify that it actually works.

At minimum verify:

```text
Request
→ Validation
→ Authentication
→ Authorization
→ Database
→ Response
```

For OTP:

```text
Request OTP
→ Email sent
→ OTP stored as hash
→ OTP expires correctly
→ Verification succeeds with correct OTP
→ Verification fails with incorrect OTP
→ OTP cannot be reused
```

For authentication:

```text
Login
→ Access token works
→ Access token expires
→ Refresh token generates a new access token
→ Invalid refresh token fails
→ Logout invalidates session/token as designed
```

---

# 80. Error Testing

Do not test only successful requests.

Test:

- invalid input
- missing fields
- invalid IDs
- expired tokens
- revoked tokens
- unauthorized access
- duplicate data
- nonexistent resources
- expired OTP
- wrong OTP
- too many OTP attempts
- rate-limit conditions
- upload failures
- database failures

---

# 81. Performance Verification

When optimizing, verify that the optimization actually helps.

Useful areas to inspect:

- bundle size
- page load
- network requests
- database query performance
- API latency
- rendering behavior
- image payload size
- cache hit behavior

Do not claim an optimization exists if it has not actually been implemented.

Do not add comments such as:

```text
// optimized
```

without meaningful optimization.

---

# 82. Security Is Not a Feature Toggle

Security must exist throughout the application.

For every new feature ask:

```text
Who can access this?
What input can they control?
What data can they access?
Can they abuse this endpoint?
Can they bypass the UI?
Could this leak information?
Could this create excessive database/network cost?
```

Always enforce security server-side.

---

# 83. No Secrets in Client Code

Never place:

```text
JWT secrets
MongoDB credentials
SMTP passwords
ImageKit private key
API private keys
refresh-token secrets
```

in client-side code.

Anything shipped to the browser must be considered public.

---

# 84. No Sensitive Console Output

Development debugging may temporarily log safe information.

Before completing a task, remove sensitive or unnecessary logs.

Never log:

```text
password
OTP
JWT
refresh token
cookie
authorization header
private key
database URL
SMTP password
```

---

# 85. Dependency Hygiene

Periodically inspect dependencies.

Remove packages that are no longer used.

Do not install two libraries for the same problem.

Preferred principle:

```text
Native platform
>
Existing project dependency
>
Small focused dependency
>
Large dependency
```

Choose the smallest reasonable solution.

---

# 86. Avoid Overengineering

Do NOT introduce the following unless actual requirements justify them:

- microservices
- Kubernetes
- Redis everywhere
- Kafka
- Elasticsearch
- GraphQL
- event sourcing
- CQRS
- complex message queues
- load balancers for local development
- multiple databases
- elaborate caching layers
- excessive design patterns

Koto Nilo should initially be a well-structured modular application.

Scale complexity when actual product requirements demand it.

---

# 87. Feature Development Process

For every feature:

## Step 1 — Understand

Read:

- AGENTS.md
- relevant skills
- existing implementation
- related components
- related API
- related database models

## Step 2 — Plan

Identify:

- frontend changes
- backend changes
- database changes
- validation
- authentication/authorization
- loading/error states
- performance implications
- testing requirements

## Step 3 — Implement

Build the smallest complete implementation.

## Step 4 — Integrate

Connect:

```text
UI
→ API
→ Validation
→ Business logic
→ Database
```

## Step 5 — Verify

Test both success and failure states.

## Step 6 — Optimize

Remove unnecessary work.

## Step 7 — Review

Check:

- security
- accessibility
- responsive behavior
- performance
- errors
- unused code
- unused dependencies

## Step 8 — Commit

Create a meaningful Git commit.

---

# 88. Definition of Done

A task is not complete merely because the code compiles.

A feature is considered complete when:

- implementation works
- frontend and backend are connected
- validation works
- authentication/authorization works where required
- loading state exists
- error state exists
- empty state exists where applicable
- responsive behavior works
- accessibility is reasonable
- no secrets are exposed
- no unnecessary console logs remain
- no obvious performance problems exist
- relevant tests/checks pass
- unused code/dependencies are removed
- Git commit is created

---

# 89. Final Rule

When deciding between two technically valid implementations, prefer the implementation that is:

```text
Simpler
+
Safer
+
Faster
+
More maintainable
+
Easier to understand
```

Do not optimize for architectural impressiveness.

Build Koto Nilo as a real product.

Every technical decision should ultimately serve:

```text
Fast experience
+
Trustworthy data
+
Simple interaction
+
Secure users
+
Maintainable code
```

If a piece of technology does not materially improve one of those things, question whether it belongs in the project.
