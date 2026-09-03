# Software Requirements Specification (SRS)
**Project:** Campus Guide  One Platform for Campus Life & Career Guidance
**Team:** Team Campus Guide
**Version:** 1.0
**Date:** September 3, 2026
**Course:** UIU Software Engineering Lab | Section D | Lab 422

---

## 1. Introduction
Our project is Campus Guide, a single platform designed to make student life easier at UIU. It brings together campus information, career guidance, and peer academic mentoring in one place. Students can get important updates, find suitable career paths, and connect with verified senior mentors for academic help.
### 1.1 Purpose
This document describes the functional and non-functional requirements for **Campus Guide**, a unified web platform for United International University (UIU). It serves as the contract between the development team and the faculty evaluator, and as the basis for all design, implementation, and testing activities.

### 1.2 Project Scope
**In scope:**
- **Authentication & roles**  registration (as Student or Mentor), login, JWT session management, role-based dashboards (Student / Mentor / Admin)
- **Pillar 1  Stay Informed:** news, events, achievements and emergency alerts in one public feed, managed by the admin
- **Pillar 2  Choose a Path:** interest & job-preference input that matches a student to a guided career track
- **Pillar 3  Get Mentored:** a marketplace of verified peer-mentor services with search, category filtering, per-session fees, booking requests, accept/reject workflow, session confirmation, ratings, and escrow-style payment protection (bKash)
- **Administration**  departments, events, stories, mentor & service approvals, user management, and an editable public home page

**Out of scope (explicitly not built this semester):**
- Native mobile applications the product is web-only (responsive down to 360px)
- Live bKash money movement  the escrow flow is implemented end-to-end in the UI and status model, but real payment gateway integration is designed and stubbed, not wired to live funds
- Multi-language support  English only
- Automated email/SMS notifications  in-app states and toasts only

### 1.3 Definitions and Abbreviations
| Term | Definition |
|------|-----------|
| JWT | JSON Web Token  used for authentication |
| API | Application Programming Interface |
| SRS | Software Requirements Specification |
| FR | Functional Requirement |
| NFR | Non-Functional Requirement |
| Escrow | Payment captured from the student but held by the platform until the session is confirmed as delivered |
| Service | A bookable mentor offering (title, description, category, per-session fee, date, time, contact) |
| Booking | A student's request for a mentor's service, with lifecycle pending → accepted/rejected → completed/cancelled |
| Mentor | A verified student who offers paid academic help; requires admin approval |
| bKash | Bangladesh's leading mobile financial service  the intended payment rail for escrow |

### 1.4 Intended Audience
This document is intended for the development team, faculty evaluator, and project stakeholders.

---

## 2. Overall Description

### 2.1 Product Perspective
Campus Guide is a standalone web platform that replaces a scattered, manual status quo: announcements lost across Facebook groups, tutoring arranged over chat with no protection, and career guidance available only through occasional office hours. It unifies official information, career direction, and paid peer mentoring into one campus-verified system with a single login. It does not integrate with UIU's internal systems this semester; it integrates with the bKash payment rail for protected session payments (designed, stubbed for live money).

### 2.2 User Classes
| User Type | Description | Key Permissions |
|-----------|-------------|-----------------|
| Guest | Unauthenticated visitor | Browse home page, mentor marketplace, events, stories, pillars; cannot book, rate, or access any dashboard |
| Student | Authenticated user with role `student` | Book mentor sessions, cancel pending requests, confirm & rate completed sessions, edit own profile |
| Mentor | Authenticated user with role `mentor`, pending admin approval | Upload/edit/delete own services, view & accept/reject booking requests for their services, view earnings |
| Admin | System administrator | Full control: departments, events, stories, mentor & service approvals, user management, home-page content editing |

### 2.3 Operating Environment
- Platform: Web application (browser-based, responsive)
- Supported browsers: Chrome 120+, Firefox 120+, Edge 120+, Safari 17+
- Minimum screen width: 360px (mobile-first)
- Frontend runtime: Next.js 14 (Node.js 20)
- Backend runtime: Node.js 20 (REST API)
- Database: PostgreSQL 16 (relational; UUID primary keys via ORM)
- Deployment: Vercel (frontend + serverless backend functions); local development via `npm run dev`

### 2.4 Constraints
- Must complete within the 10-week semester timeline
- Backend production endpoints (`/api/events`, `/api/auth`) must be stabilized by the backend team; until then the frontend operates on a documented local fallback dataset
- Real money movement must not go live without bKash merchant credentials and university approval
- Team size is small (frontend lead + backend lead), favouring a monolithic architecture

### 2.5 Assumptions
- Users have access to a modern web browser and a stable internet connection
- Users register with genuine UIU identities; email domain checks deter outside signups
- The Admin account is seeded/created manually  there is no admin self-registration
- Mentors set fair per-session fees; disputes are handled by admin review
- Students and mentors are physically on campus for delivered sessions (the platform brokers, does not video-host)

---

## 3. Functional Requirements

> Each requirement follows this format:
> **FR-[N]: [Title]**
> - **Description:** What the system SHALL do
> - **User Story:** As a [role], I want [action], so that [benefit]
> - **Acceptance Criteria:** Given / When / Then
> - **Priority:** High | Medium | Low

---

**FR-01: User Registration (Student / Mentor)**
- **Description:** The system shall allow new users to register as either a **Student** or a **Mentor** using a name, email, password, phone, department, gender, optional profile photo, and (for mentors) a short bio. Mentor registrations SHALL be created with `status: pending` and SHALL require admin approval before their services are publicly bookable.
- **User Story:** As a new visitor, I want to create an account and choose whether I'm joining to find help or to offer it, so that the platform is relevant to me from the first login.
- **Acceptance Criteria:**
  - Given I am on the registration page