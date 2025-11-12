# 🎓 Smart Course Registration System

A dynamic, university-level course registration platform for students, faculty, and admins to manage courses efficiently and stress-free. Go beyond basic enrollment with **smart suggestions**, **automatic conflict detection**, and **insightful analytics**.

[Know more](https://docs.google.com/document/d/14p7p9ZV3i9mIPea06WJN8XP5e1r97_yrZRzkQVDNIRo/edit?tab=t.0)

## Local Setup (after forking)

1. Clone your fork
   - git clone https://github.com/<your-username>/smart-course-registration.git
   - cd smart-course-registration
2. Backend setup
   - cd backend
   - Create a .env file with at least:
     - DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB
     - JWT_SECRET=change-me
     - PORT=4000
   - npm install
   - npx prisma migrate dev
   - npx prisma generate
3. Frontend setup
   - cd ../frontend
   - npm install
4. Run the apps (in two terminals)
   - Backend: cd backend && npm run dev (or npm start)
   - Frontend: cd frontend && npm run dev (or npm start)
   - ```npm run dev:all`` to run both frontend and backend at a time .

---

## Key Features

### Multi-Section Courses  
Register for different sections (e.g., `CS101-A`, `CS101-B`), each with its **own schedule, instructor, and classroom**.

### Seat Limits & Waitlists  
- Each section has a defined seat cap  
- When full, students are **auto-added to the waitlist**  
- Background automation promotes waitlisted students when seats free up

### Timetable Clash Detection  
Avoid accidental overlaps with:
- Hard clash detection (same time conflicts)  
- Soft clash handling (back-to-back or buffer issues)

### Smart Suggestions  
If a class clashes, the system:
- Suggests alternate sections  
- Or builds an optimized schedule based on preferences  
  _(e.g., no early mornings, minimal gaps)_

### Add/Drop Functionality  
Add or drop courses within deadlines — updates reflect instantly across:
- Seats  
- Waitlists  
- Timetables

### Notifications  
Instant alerts for:
- Waitlist movement  
- Deadline reminders  
- Registration updates

### Analytics & Reports  
Insights for admins and faculty on:
- Seat usage  
- Waitlist trends  
- Registration stats  
Exportable reports included ✅

---

## User Roles & Capabilities

| Feature / Action       | Student | Faculty | Admin |
|------------------------|:-----------:|:------------:|:--------:|
| Register / Drop        | Yes        | No           | No       |
| Auto Waitlist Join     | Yes        | No           | No       |
| Timetable View         | Yes        | No           | No       |
| Notifications          | Yes        | No           | No       |
| Manage Rosters         | No         | Yes          | No       |
| Export Lists           | No         | Yes          | Yes      |
| Approve Seat Increases | No         | Yes          | No       |
| Create Course Catalog  | No         | No           | Yes      |
| Assign Instructors     | No         | No           | Yes      |
| Set Deadlines          | No         | No           | Yes      |
| View Analytics         | No         | No           | Yes      |

---

## Core Workflow

### 1. Login  
Choose your role at login:
- Student  
- Faculty  
- Admin  

---

### Student Flow
- Select academic term (e.g., **Fall 2025**)  
- Browse or search the course catalog  
- Register instantly or auto-join waitlist  
- View your **color-coded weekly timetable**  
- Get alerts and reminders in real-time  

---

### Faculty Flow
- View assigned teaching sections  
- Manage student rosters  
- Export lists for grading or attendance  
- Approve seat increases (if applicable)

---

### Admin Flow
- Create and configure courses and sections  
- Assign instructors and classroom locations  
- Set academic deadlines  
- Monitor analytics, trends, and export reports
