# Smart Course Registration System

## Project Overview
A university-level course enrollment and timetable assistant that streamlines registration for students, instructors, and administrators. Features include add/drop, waitlists with promotion, seat limits enforcement, clash detection, and an optional timetable optimizer. Target: produce conflict-free timetables, fair seat allocation, and useful registrar analytics.

---

## Key Features / Modules

- Course & Section Management
  - Create/edit course catalog and sections (instructors, capacity, schedules, rooms)
  - Section status (open, closed, cancelled)

- Student Registration
  - Enroll / drop with deadline enforcement
  - Auto-join waitlist when section is full
  - Timetable clash detection (hard and optional soft clashes)
  - Waitlist promotion when seats freed

- Waitlist & Promotion Engine
  - Track position
  - Background job (cron) to promote when seats_taken < capacity
  - Notifications on promotion

- Timetable Optimizer & Suggestion Engine
  - Suggest alternative sections when clashes occur
  - Optional optimizer: build valid schedule respecting preferences (no early classes, avoid long gaps, preferred instructors)

- Deadlines & Permissions
  - Term-level registration/add-drop deadlines enforced by backend

- Faculty Tools
  - View sections, rosters, waitlists
  - Export rosters (CSV/PDF)

- Admin Tools & Reporting
  - Create/manage terms, courses, sections, rooms
  - Reports: seat occupancy, oversubscribed courses, waitlist trends
  - Export reporting

- Notifications & Reminders
  - Email / in-app alerts for promotions, deadline reminders, class reminders

- Audit & Logging
  - Record registration changes, promotions, drops for audit

- APIs & Integration
  - REST API for frontend; extensibility for LMS integration

---

## User Roles
(One role per user — store role_id on users table)

- Student
  - Browse catalog, register/drop (within deadlines)
  - Auto-join waitlists, view timetable, enrollment history, waitlist positions, receive notifications

- Instructor / Faculty
  - View assigned sections, enrolled and waitlisted students
  - Export rosters, optionally approve special seat increases

- Administrator / Registrar
  - Full CRUD on terms, courses, sections, deadlines, rooms
  - Manage users, run reports, configure system settings



---

## Page / Screen List (Frontend)

- Public
  - Landing / Home
  - Public Course Catalog (search + filters)
  - Term Selector / Academic Calendar

- Authentication
  - Login (email + password)
  - Register (student/faculty/admin via invite)
  - Forgot password / Reset

- Student
  - Student Dashboard (term selector)
  - Browse Courses → Course details → Sections list
  - Section Detail (schedule, instructor, capacity)
  - Registration modal (shows conflicts & suggestions)
  - My Registrations (Enrolled & Waitlisted)
  - My Timetable (weekly calendar)
  - Notifications / Activity feed
  - Preferences (avoid times, preferred instructors)

- Faculty
  - Faculty Dashboard (term selector)
  - My Sections (list)
  - Section Roster (enrolled & waitlisted + export)

- Admin / Registrar
  - Admin Dashboard (summaries)
  - Manage Terms, Courses, Sections, Rooms
  - Deadlines management
  - Reports (charts & CSV export)
  - User Management (invite, assign role)
  - System Settings (waitlist rules, buffer times)

- Shared UI Components
  - Header/nav with role selector and term selector
  - Calendar component (weekly)
  - Table, filters, pagination
  - Modals (register / drop / confirm)
  - Notification center

---

## Database Schema 

1. Roles
   - id, name (unique)

2. Users
   - id (UUID), email (unique), full_name, phone, password (hashed), role_id (FK → roles), created_at, is_active

3. Academic Terms
   - id, year, semester, start_date, end_date (unique year+semester)

4. Course Catalog
   - id, code (unique), title, credits, description, department

5. Sections
   - id, term_id, course_id, section_code, instructor_id, capacity, seats_taken, status, notes, created_at (unique term+course+section_code)

6. Rooms
   - id, building, room_number, capacity (unique building+room_number)

7. Section Schedules
   - id, section_id, weekday (enum), start_time, end_time, room_id (check end_time > start_time)

8. Deadlines
   - id, term_id, name, starts_at, ends_at

9. Registrations
   - id, student_id, section_id, term_id, status (enrolled|dropped|withdrawn), enrolled_at, dropped_at, grade (unique student+section)

10. Waitlists
    - id, section_id, student_id, term_id, joined_at, position (unique section+student)

---

## Tech Stack (Tentative)

- Backend: Node.js + Express, Prisma ORM, PostgreSQL
- Auth: JWT (access + refresh), bcrypt
- Email: Nodemailer / SendGrid
- Frontend: React (Vite), React Router, Axios, TailwindCSS, FullCalendar (or custom)
- Dev / Infra: Docker, GitHub Actions, Managed Postgres (Render / Supabase / Heroku)

---

## Auth & Security

- JWT access + refresh tokens
- bcrypt for passwords
- HTTPS, rate limiting, CORS, role-based access control

---

## Workflow 

1. User selects active term.
2. Browse courses → view sections & schedules.
3. Attempt registration:
   - Backend checks registration window, seat availability, clash detection.
   - If available & no clash → insert registration, increment seats_taken.
   - If full → add to waitlist (position = max + 1).
   - If clash → present alternatives / allow override based on rules.
4. Drop course:
   - Drop within deadlines; decrement seats_taken; trigger waitlist promotion job.
5. Promotion:
   - Background job promotes next waitlisted student and sends notification.
6. End of term:
   - Grading & archive.

---

## Expected Deliverables

- Working full-stack application with:
  - Auth & role-based access
  - Course & section management UI
  - Student registration with clash detection and waitlist
  - Background job for waitlist promotions and deadline enforcement
  - Timetable view for students
  - Reporting dashboard (occupancy, waitlist stats)
  - Automated tests for key flows (registration, promotion, clash detection)

---