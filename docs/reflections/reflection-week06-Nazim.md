Week 06 Reflection — Nur Hossain Nazim
Date: Aug 15, 2026

SRS Writing Experience
Kanij fatema bipa

Architecture Decision
We chose a monolithic MVC (Express + Prisma + PostgreSQL) because we're a two-person team on a 10-week timeline, and our data model is deeply relational — bookings reference services, which reference mentors and users — so one database with native ORM joins beats any microservice split. There was brief disagreement over whether the payment/escrow logic should be a separate service from the start; we resolved it by keeping escrow as a clearly-isolated module inside the monolith, with extraction to a microservice documented as our scalability path if the product grows.

API Design Insight
Abir

Question for Faculty
In our escrow model, the mentor is paid only when the student confirms the session happened — but what should happen if a student simply never confirms (not a dispute, just silence)? Should the platform auto-release the payment to the mentor after a defined window (e.g., 72 hours post-session), and does that window differ for a no-show student versus an unresponsive one?