# Architecture Document
**Project:** Campus Guide — One Platform for Campus Life & Career Guidance
**Team:** Team Campus Guide
**Version:** 1.0
**Date:** September 3, 2026
**Course:** UIU Software Engineering Lab | Section D | Lab 422

---

## 1. Architecture Decision

**Selected Pattern:** Monolithic (MVC), deployed as a two-tier system: a Next.js 14 frontend client and a single Node.js/Express REST API monolith serving all business domains.

**Justification:**
Our project has 6 feature areas (auth & roles, information feed, career matching, mentor marketplace, booking & escrow, administration), a small team of 2 core developers (frontend lead + backend lead), and a 10-week timeline. A monolithic architecture is the correct engineering choice for the following specific reasons:

1. **Team coordination:** With 2 developers, a single backend codebase eliminates the coordination overhead of multiple services (service discovery, inter-service networking, separate deployment pipelines). The cost of microservice coordination exceeds its benefit at this team size.

2. **Shared data model:** Our entities share significant data relationships — a *Booking* references a *Service*, which references a *Mentor* and a *User*; a *Payment* references a *Booking*; a *Department* is referenced by users and mentors. These all live in one PostgreSQL database, so the ORM handles joins natively without distributed transactions or cross-service data duplication.

3. **Operational simplicity:** One backend repository deployed as Vercel serverless functions is easier to develop, debug, and redeploy than multiple networked services. Our team does not have the DevOps bandwidth to manage a service mesh, and Vercel's zero-config deployment gives us preview URLs per branch.

4. **Traffic expectation:** Our expected concurrent user count is in the hundreds (a single university's students), which does not require horizontal scaling of individual features. A single well-optimised monolith behind Vercel's edge network handles this load comfortably; serverless functions already scale per-request.

5. **Timeline:** Implementing microservices correctly requires significant upfront architecture work (API gateway, service discovery, distributed tracing). This investment is not justified for a semester timeline.

**When we would reconsider:**
If this product were taken to production with 1,000+ concurrent users and 10+ developers, we would evaluate extracting the **payment/escrow service** (isolation of money logic, independent scaling, compliance boundary) and the **notification service** as independent microservices.

---

## 2. Technology Stack

| Component | Technology | Version | Justification |
|-----------|-----------|---------|---------------|
| Frontend | Next.js 14 (App Router, React 18) | 14.2.x | Server-side rendering & static generation for fast first paint, file-based routing, first-class Vercel deployment, industry standard |
| Styling | Tailwind CSS | 3.4 | Utility-first, rapid iteration, design tokens (UIU orange `#F68B1F`) centralized in config; tiny CSS payload |
| Animation | Framer Motion | 11 | Declarative scroll-reveal/parallax animations matching our IESE-inspired editorial design |
| Icons | lucide-react | 0.4x | Consistent, tree-shakeable SVG icon set |
| Backend | Next.js + Express | 20 / 4.x | Same language across the stack (JS end-to-end), fast REST development, huge ecosystem, team experience |
| Database | PostgreSQL | 16 | ACID compliance, relational integrity for bookings/payments, UUID primary keys via ORM |
| ORM | Prisma | 5.x | Typed schema, migrations, native relation handling (`_count` aggregates already in production responses) |
| Auth | JWT (Bearer tokens) | — | Stateless auth fitting serverless functions; standard pattern |
| Cache | — (platform CDN) | — | Not required at this scale; Vercel edge caching + client-side memoization suffice |
| Hosting / CI | Vercel | — | Zero-config deploys for both tiers, preview deployments per push, HTTPS by default |
| API Documentation | Markdown contract (`BACKEND_API_DOCUMENTATION.md`) | — | Simple, version-controlled, directly usable by the backend developer; a Swagger layer is a future upgrade |

---

## 3. System Architecture Diagram

```
                         ┌───────────────────────────────────────────┐
                         │            User's Machine                   │
                         │   [Browser — desktop / mobile, 360px+]     │
                         │   https://campus-guide-frontend.vercel.app │
                         └───────────────────────┬───────────────────┘
                                                 │ HTTPS (JSON, JWT)
                                                 ▼
                         ┌───────────────────────────────────────────┐
                         │              Vercel Edge                    │
                         │   • CDN / static page delivery (SSG)        │
                         │   • TLS termination                         │
                         └───────────────┬───────────────────────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 ▼                                               ▼
   ┌─────────────────────────────┐              ┌─────────────────────────────┐
   │   Next.js Frontend (SSR)     │              │   Express REST API           │
   │   campus-guide-frontend      │── HTTPS ────▶│   campus-guide-backend       │
   │                              │  /api/*      │   (serverless functions)     │
   │  • App Router pages (13)      │              │                              │
   │  • AuthContext (role state)   │              │  Controllers (views):        │
   │  • api.js client              │              │   /api/auth        (JWT)     │
   │  • fallback: mockDb           │              │   /api/departments            │
   │    (localStorage)             │              │   /api/events                 │
   │                              │              │   /api/services (planned)    │
   │                              │              │   /api/bookings (planned)     │
   │                              │              │   /api/mentors   (planned)    │
   │                              │              │   /api/stories   (planned)    │
   │                              │              │   /api/home-content (planned)│
   │                              │              │   /api/payments  (planned)    │
   └─────────────────────────────┘              └──────────────┬──────────────┘
                                                                │ ORM (Prisma)
                                                                ▼
                                                  ┌─────────────────────────────┐
                                                  │   PostgreSQL 16             │
                                                  │   users · mentors           │
                                                  │   services · bookings       │
                                                  │   events · stories          │
                                                  │   departments · payments    │
                                                  │   home_content (singleton)  │
                                                  └─────────────────────────────┘
                                     (future) ┌────────────────────┐
                                              │  bKash payment rail │
                                              │  escrow: capture /  │
                                              │  release / dispute  │
                                              └────────────────────┘
```

**Key networking rules:**
- Browser speaks HTTPS only, to two Vercel deployments (same-origin policy handled by backend CORS allowlist: frontend production domain + `localhost:3000`)
- All inter-tier communication is JSON over HTTPS; JWT Bearer tokens in the `Authorization` header
- The frontend never talks to PostgreSQL directly — only through the REST API

---

## 4. Component Responsibilities

### 4.1 Backend — Node.js + Express (monolith, MVC)

| Layer | Responsibility |
|-------|----------------|
| Routes (`/api/*`) | Map HTTP verbs + paths to controllers; central CORS + JSON error handler (all errors returned as JSON, never HTML) |
| Controllers | Request handling, auth checks (JWT verify, role guards), object-level ownership checks |
| Services / Business logic | Booking lifecycle state machine (pending → accepted/rejected → completed/cancelled), escrow rules (no double release/charge), rating computation |
| Models (Prisma schema) | Data structure, relations, migrations: User, Mentor, Service, Booking, Event, Story, Department, Payment, HomeContent |
| Validators | Body validation before business logic (email format, fee ≥ 0, required service fields) |

### 4.2 Frontend — Next.js 14 (App Router)

| Layer | Files/Folders | Responsibility |
|-------|--------------|----------------|
| Pages | `src/app/**/page.js` (13 routes) | Route-level screens: public site, auth, three role dashboards |
| Components | `src/components/` | Reusable UI: Navbar (shrink-on-scroll), Footer, Hero, MentorCard, `motion.jsx` animation primitives, `ui.jsx` design system (buttons, modals, toasts, skeletons) |
| API client | `src/lib/api.js` + `src/lib/endpoints.js` | Single place where every backend path lives; handles the response envelope; **graceful fallback** to `src/lib/mockDb.js` (seeded localStorage) when an endpoint is missing or erroring (404/5xx/network) so the product is always demoable |
| State | `src/context/AuthContext.jsx` | Global auth state: token, user, role; session hydration on reload; role-based redirects |
| Utilities | `src/lib/format.js` | Money/date/time/status formatting and status color mapping |

### 4.3 Database — PostgreSQL 16
Primary data store, accessed only via the ORM. UUID primary keys; every table carries `createdAt`/`updatedAt`. Standard operations require no raw SQL. The `HomeContent` singleton (key-value document row) stores admin-editable home page content.

---

## 5. Security Architecture

### 5.1 Authentication
- JWT access tokens issued at login, verified on every protected request (stateless — suits serverless)
- Token persisted client-side; session re-hydrated on reload via `GET /api/auth/me`
- Password hashing with bcrypt (never plain text)

### 5.2 Authorization
- Role-based: **Admin** vs **Mentor** vs **Student** vs **Guest** — dashboard routes and API guards keyed off `user.role`
- Object-level: mentors can only modify their own services and respond to bookings on their own services; students only cancel/confirm their own bookings; users only edit their own profile
- Admin-approval gates: mentor applications and service uploads start as *pending* and are invisible publicly until approved

### 5.3 Data Protection
- Secrets (JWT secret, database URL) in environment variables only — never committed; configured in Vercel project settings
- HTTPS enforced by Vercel on all traffic
- SQL injection: prevented by ORM parameterised queries
- XSS: React escapes output by default; the app renders no raw HTML from user input
- CORS: backend accepts only the frontend origins (production domain + localhost dev)
- Escrow design: funds are captured but held; release requires the student's explicit confirmation, and disputes freeze the payment for admin review

### 5.4 Input Validation
- Server-side validation of every mutating request (registration fields, fee is a non-negative number, booking needs date + time) — the client's validation is UX only and never trusted
- Known issue being fixed: unauthenticated/erroring routes currently return HTML 500 pages instead of JSON errors (flagged in `BACKEND_API_DOCUMENTATION.md`)

---

## 6. Deployment Architecture

### Development (Local)

```bash
# Backend (terminal 1)
cd campus-guide-backend && npm install && npm run dev     # listens on :PORT

# Frontend (terminal 2)
cd campus-guide && npm install
cp .env.local.example .env.local                          # NEXT_PUBLIC_API_BASE_URL=http://localhost:<backend-port>
npm run dev                                                # http://localhost:3000
```
Hot reload on both tiers. No Docker required — Node 20 is the only host dependency.

### Production (Current — Vercel)

```
Frontend:  git push → Vercel auto-build (next build) → static + SSR pages on edge CDN
Backend:   git push → Vercel serverless functions per API route
Env vars:  NEXT_PUBLIC_API_BASE_URL (frontend) · DATABASE_URL, JWT_SECRET (backend)
```

Deployment sequence for the backend team's fixes is a single `git push` — no infrastructure work. Rollback is one click in the Vercel dashboard.

---

## 7. Scalability Path (Future Considerations)

This monolith can scale to approximately 1,000+ concurrent users on the current serverless deployment with:
- Vercel automatic per-function scaling (already per-request)
- Database connection pooling (Prisma Accelerate / PgBouncer)
- Read caching for hot public content (home content, approved services, events)

If the product grows beyond this, we would evaluate:
- Extracting the **payment/escrow service** as an independent microservice (money logic isolation, compliance audit boundary, independent scaling)
- A background job queue for notifications (email/SMS digests of events and booking updates)
- Moving the database to a managed cluster with read replicas (Neon/RDS)
- Containerising both tiers (Docker + Compose locally, Kubernetes only if a multi-service split actually happens)
