---
name: sms-code-writer
description: "Write code for School Management System (SMS) following MERN architecture, naming conventions, patterns, and RBAC rules. Use when: writing models, controllers, services, routes, React components, Redux slices, custom hooks, middleware, jobs, or utilities for SMS modules (students, teachers, attendance, exams, grades, fees, etc.). Triggers on: 'write the code for', 'implement', 'build', 'fill in', 'complete this file', 'code the', 'create the logic for' + any SMS domain."
argument-hint: "What SMS code do you need to write? (e.g., 'StudentList component', 'fee calculation service')"
user-invocable: true
---

# SMS Code Writer Skill

## Project Overview

**School Management System (SMS)** is a full-stack MERN application with 4 packages:
- **backend/**: Node.js + Express.js + MongoDB (models, controllers, services, routes, middleware, jobs)
- **frontend/**: React 18 + Redux Toolkit + RTK Query (components, pages, hooks, slices, API integration)
- **mobile/**: React Native (screens, components, hooks, store)
- **shared/**: Shared types, constants, validations across all packages

**Tech Stack:**
- Backend: Express.js, Mongoose, Joi, Socket.IO, Bull + Redis, Winston
- Frontend: React 18, Redux Toolkit, RTK Query, React Hook Form, Tailwind CSS, TanStack Table
- Auth: JWT (access + refresh tokens), TOTP MFA, Role-Based Access Control (RBAC)
- Multi-tenancy: Every query scoped by `schoolId`

## When to Use This Skill

This skill applies **automatically** when you:
1. Write ANY backend file: model, controller, service, route, middleware, validation, utility, job, socket handler
2. Write ANY frontend file: component, page, hook, Redux slice, RTK Query endpoint, utility
3. Respond to phrases like: "write the code for", "implement", "build", "fill in", "complete this file", "code the", "create the logic for"
4. Reference SMS domains: students, teachers, attendance, exams, grades, fees, library, transport, hostel, HR, payroll, admission, communication, discipline, reports, system settings

**Do NOT use this skill for:**
- General coding questions unrelated to SMS
- Debugging existing code (use a Codebase Error Expert for that)
- Architecture/design decisions at the system level

## Quick Decision Tree

```
Are you writing SMS code?
├─ YES: Continue below
└─ NO: Use default agent

Backend file?
├─ Model → See [Backend Patterns](./references/backend-patterns.md#models)
├─ Controller → See [Backend Patterns](./references/backend-patterns.md#controllers)
├─ Service → See [Backend Patterns](./references/backend-patterns.md#services)
├─ Route → See [Backend Patterns](./references/backend-patterns.md#routes)
├─ Middleware → See [Backend Patterns](./references/backend-patterns.md#middleware)
├─ Validation → See [Backend Patterns](./references/backend-patterns.md#validations)
├─ Job/Socket/Utility → See [Backend Patterns](./references/backend-patterns.md)
└─ Unsure → Check [Module Reference](./references/module-reference.md) to find the right file

Frontend file?
├─ Component → See [Frontend Patterns](./references/frontend-patterns.md#components)
├─ Hook → See [Frontend Patterns](./references/frontend-patterns.md#custom-hooks)
├─ Redux Slice → See [Frontend Patterns](./references/frontend-patterns.md#redux-slices)
├─ RTK Query API → See [Frontend Patterns](./references/frontend-patterns.md#rtk-query)
├─ Page → See [Frontend Patterns](./references/frontend-patterns.md#pages)
└─ Utility → See [Frontend Patterns](./references/frontend-patterns.md#utilities)

Multi-file request?
└─ Follow [Architecture Walkthrough](./references/architecture.md) for end-to-end flows
```

## Step-by-Step Procedure

### Before Writing ANY Code:

1. **Confirm the module** — Is this for students, fees, attendance, etc.? See [Module Reference](./references/module-reference.md) to find which models, controllers, routes apply.

2. **Check naming conventions** — See [Naming Conventions](./references/naming-conventions.md). Example:
   - Model: `Student.model.js` (PascalCase)
   - Controller: `student.controller.js` (camelCase)
   - Service: `fee.service.js` (camelCase)
   - Component: `StudentList.jsx` (PascalCase)
   - Hook: `useStudents.js` (camelCase, starts with `use`)

3. **Scope by schoolId** — ALL database queries MUST filter by `schoolId: req.user.schoolId`. See [Database Rules](./references/database-rules.md).

4. **Enforce RBAC** — Every backend route must declare allowed roles. Every frontend component must check `usePermission()`. See [RBAC & Security](./references/rbac-security.md).

### When Writing Code:

5. **Backend: Follow the pattern** — Model → Controller → Service → Route → Validation. See [Backend Patterns](./references/backend-patterns.md).

6. **Frontend: Fetch with RTK Query** — Never use `useEffect` + axios in presentational components. Always use RTK Query hooks in parent/page level. See [Frontend Patterns](./references/frontend-patterns.md).

7. **Use response helpers** — Backend: Always use `responseHelper.success()`, `responseHelper.error()`, never `res.json()` directly. See [Backend Patterns](./references/backend-patterns.md#response-helpers).

8. **Add proper error handling** — Backend: Throw `AppError` and let global middleware handle it. Frontend: Use RTK Query error state and `toast.error()`. See [Error Handling](./references/error-handling.md).

9. **Index & paginate** — Backend: Add MongoDB indexes for all filter fields. Paginate list endpoints. Use `.lean()` on read queries. See [Database Rules](./references/database-rules.md).

### After Writing:

10. **Validate response shape** — Responses must match `{ success: true/false, message, data, pagination? }`.

11. **Check folder structure** — File is in the right location. Components have their own folder with barrel export `index.js`.

12. **Verify imports** — Use standard imports listed in [Quick Reference](./references/quick-reference.md).

## Key Rules (Never Break These)

| Rule | Why | Reference |
|------|-----|-----------|
| All queries scoped by `schoolId` | Multi-tenancy — data must never leak between schools | [Database Rules](./references/database-rules.md) |
| Routes declare roles — Components use `usePermission()` | Enforce access control | [RBAC & Security](./references/rbac-security.md) |
| Joi validation → `validate()` middleware → controller | Validate early, fail fast | [Backend Patterns](./references/backend-patterns.md#validations) |
| Services contain business logic, not controllers | Reuse logic across routes | [Backend Patterns](./references/backend-patterns.md#services) |
| RTK Query in pages/parent components only | Prevents duplicate fetches, data races | [Frontend Patterns](./references/frontend-patterns.md#components) |
| Never use hardcoded values | Read from env via `process.env.*` | [Database Rules](./references/database-rules.md#environment) |
| Use response helper for all responses | Consistent API shape | [Backend Patterns](./references/backend-patterns.md#response-helpers) |
| Throw `AppError`, never `res.status().json()` | Global error middleware catches it | [Error Handling](./references/error-handling.md) |
| Index every filter/sort field | Performance at scale | [Database Rules](./references/database-rules.md#indexes) |
| Components < 150 lines, split if longer | Readability, reusability, testability | [Frontend Patterns](./references/frontend-patterns.md) |

## Example Prompts to Try This Skill

- "Write the Student model with status enum, indexes, and virtuals"
- "Implement the fee calculation service"
- "Create the StudentList component with filters and pagination"
- "Build the attendance route with RBAC"
- "Code the useAttendance custom hook"
- "Write the grade.controller.js for CRUD + publish grades"
- "Create a StudentForm with React Hook Form and validation"

## Reference Files

| File | Contains |
|------|----------|
| [backend-patterns.md](./references/backend-patterns.md) | Model, controller, service, route, validation, middleware patterns + examples |
| [frontend-patterns.md](./references/frontend-patterns.md) | Component, hook, RTK Query, Redux slice, page patterns + examples |
| [naming-conventions.md](./references/naming-conventions.md) | File naming rules for every file type |
| [database-rules.md](./references/database-rules.md) | Multi-tenancy, ObjectId refs, status enums, indexes, pagination |
| [rbac-security.md](./references/rbac-security.md) | 11 user roles, route authorization, frontend permission checks |
| [module-reference.md](./references/module-reference.md) | 16 SMS modules — what each controller/service/model handles |
| [error-handling.md](./references/error-handling.md) | AppError, global middleware, RTK error handling, logging |
| [quick-reference.md](./references/quick-reference.md) | Common imports, env vars, API patterns |
| [architecture.md](./references/architecture.md) | End-to-end flows: student CRUD, fee payment, attendance marking, grade publishing |

---

**Last Updated:** May 2026  
**Stack:** MERN (MongoDB, Express, React, Node.js) + Redux Toolkit + Socket.IO  
**Author:** School Management System Team
