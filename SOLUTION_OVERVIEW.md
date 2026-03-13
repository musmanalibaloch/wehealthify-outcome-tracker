# WeHealthify Patient Outcome Tracker – Solution Overview

**Audience:** Use this document to explain the solution to stakeholders (product, leadership) and to **technical** reviewers (engineers, architects). The first sections are in plain language; the last section gives technical anchors for deeper discussion.

---

## What This Product Does (plain language)

WeHealthify is a **patient outcome tracker** delivered as **Software-as-a-Service (SaaS)**:

- **Many clinics** use the **same** application (e.g. physical therapy or wellness centers).
- Each clinic **records outcomes** for their patients: who the patient is, pain score (1–10), mobility score (1–10), and when it was recorded.
- Staff **log in** with their clinic account. They see only their clinic’s data and can add new outcomes.

So: **one product, one place to run it**, but each clinic gets a **private, secure view** of the system.

---

## Why a Multi-Tenant SaaS Approach?

In **multi-tenant SaaS**, many customers (here, clinics) share the same application and infrastructure, but **their data is strictly separated**. We chose this because:

1. **One product, many customers** – We build and run a single application. New clinics can start using it without installing separate software or servers.
2. **Lower cost and simpler operations** – Updates, security, and backups are done once and apply to all clinics.
3. **Trust and compliance** – Clinics need to know their patient data is private. The design ensures Clinic A can **never** see or access Clinic B’s data; that separation is built into the system.
4. **Scalability** – As more clinics join, the same architecture supports them without managing a separate system per clinic.

**SaaS flavor in one line:** Single application, multiple tenants, strict data isolation.

---

## Key Decisions (explain to anyone)

### 1. One application, separate data per clinic (multi-tenancy)

**Decision:** All clinics use the same app and the same database. Every piece of data is tagged with **which clinic it belongs to**. When someone logs in, the system only shows or saves data for that clinic.

**Why:** Standard way to run SaaS: one codebase, one deployment, many customers. Keeps development and operations manageable while giving each clinic a private experience.

**For the business:** New clinics can be onboarded without custom builds or new servers. The product feels “theirs” because they only see their own outcomes.

---

### 2. Strict data isolation – “your clinic, your data only”

**Decision:** The system never shows or mixes data between clinics. Every list and every new record is automatically tied to the logged-in user’s clinic. Users cannot request another clinic’s data or “switch” to another clinic’s view.

**Why:** Privacy and compliance require that one tenant cannot access another’s data. Isolation is enforced in the application logic and how data is stored and queried, not only by policy.

**For clinics:** Staff can trust that only their clinic’s outcomes are visible and that other clinics cannot see their patient information.

---

### 3. Login required to use the system

**Decision:** Users must sign in with a username and password (tied to their clinic) before they can see or add outcomes.

**Why:** We need to know **who** is using the app so we can enforce “this user belongs to this clinic, so show only this clinic’s data.” Without login, we could not safely separate tenants.

**For clinics:** Only authorized users with accounts for that clinic can access the outcome tracker. Access is controlled and auditable.

---

### 4. Simple outcome form: patient, pain, mobility, date

**Decision:** Each outcome has: a patient identifier (e.g. name or ID), a pain score (1–10), a mobility score (1–10), and the date it was recorded. The clinic is set automatically from the logged-in user.

**Why:** Keeps the MVP focused and usable. These fields are enough to demonstrate multi-tenant behavior and to be useful for tracking. More fields can be added later without changing the multi-tenant design.

**For clinics:** Staff get a quick way to record and review key metrics. The product stays simple while the architecture supports many clinics.

---

### 5. Validation in both the UI and the server

**Decision:** The app checks that required fields are filled and that scores are in range (1–10) in the browser **and** again on the server before saving.

**Why:** Checks in the browser give immediate feedback. Checks on the server ensure that even if someone bypasses the UI or uses the API directly, invalid data is rejected. In SaaS, the server is the authority; the UI is a convenience.

**For clinics:** Fewer errors and clear messages when something is wrong. Data quality is better because invalid entries are blocked in both places.

---

### 6. Seed data: two sample clinics with users and outcomes

**Decision:** The system includes two demo clinics, a few users per clinic, and sample outcomes. This data is recreated when the backend starts (or when the seed script is run), so demos and tests always start from a known state.

**Why:** Required for the assessment and useful for demos. Makes it easy for evaluators or new developers to try the product and see tenant isolation (e.g. log in as Clinic A, then as Clinic B, and see different lists).

**For the business:** Demos and onboarding are repeatable and consistent.

---

## How This Fits a SaaS Model

| SaaS idea | How this solution reflects it |
|-----------|--------------------------------|
| **Single product, many customers** | One codebase and one deployment serve all clinics. |
| **Tenant isolation** | Each clinic’s data is tagged and filtered so only that clinic’s users can see or create it. |
| **Centralized updates** | A change to the app is deployed once and all clinics get it. |
| **Scalable onboarding** | New clinics get accounts and data space within the same application. |
| **Security and trust** | Login, validation, and data isolation are designed so that “your clinic, your data only” is enforced by the system. |

---

## Summary for Stakeholders

- **What it is:** A patient outcome tracker used by multiple clinics through one SaaS application.
- **How it’s built:** Multi-tenant: one app, one database, with every record tied to a clinic. Users log in; the system only shows and allows changes to their clinic’s data.
- **Why it matters:** Clinics get a private, secure experience without separate software. The business gets a single product that can scale to many clinics with clear data separation.

---

## For Technical Readers (explain to engineers)

When discussing with technical audiences, you can anchor on these points:

- **Architecture:** Row-level tenancy. Tenant key is `clinicId` on `User` and `Outcome`. Same MongoDB database; isolation by always filtering (and setting on create) using the authenticated user’s `clinicId` from the JWT.
- **Enforcement:** Login returns a JWT with `userId`. Protected routes resolve the user and use `req.user.clinicId`. GET outcomes: `Outcome.find({ clinicId: req.user.clinicId })`. POST outcomes: `clinicId` set from `req.user.clinicId` only; client cannot override.
- **Stack:** Backend: Node.js, Express, MongoDB (Mongoose), JWT, express-validator. Frontend: React (Vite), React Router, context for auth. Seed runs on backend start; seed data in `backend/src/db/seedData.js`.
- **Docs:** Full setup and API summary in [README.md](README.md). This document (SOLUTION_OVERVIEW.md) is for product/decision context and for explaining to both technical and non-technical audiences.
