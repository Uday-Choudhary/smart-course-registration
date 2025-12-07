# 🎓 Smart Course Registration System
A modern, full-featured university course registration platform built with the MERN stack (PostgreSQL, Express, React, Node.js) that connects students, faculty, and administrators. Features role-based authentication, course management, waitlist automation, and timetable conflict detection.

![Tech Stack](https://img.shields.io/badge/React-19.1-blue) ![Node.js](https://img.shields.io/badge/Node.js-18+-green) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-blue) ![Prisma](https://img.shields.io/badge/Prisma-5.22-brightgreen)

---

## Features

### Authentication & Authorization
- **User Registration** - Sign up as Student, Faculty, or Admin
- **Secure Login** - JWT-based authentication with bcrypt password hashing
- **Role-Based Access Control** - Different permissions for students, faculty, and administrators
- **Protected Routes** - Secure pages based on authentication status and user role
- **Change Password** - Secure password update functionality

### For Students
- **Browse Courses** - View all available courses with real-time search
- **Course Search & Filter** - Find courses by code, title, or section
- **Course Details** - View comprehensive course descriptions, schedules, and instructor info
- **Enroll in Courses** - One-click enrollment with automatic conflict detection
- **Waitlist Management** - Automatic waitlist join when sections are full
- **My Registrations** - Track all enrolled courses and their status
- **Drop Courses** - Drop courses with automatic waitlist promotion
- **Timetable View** - Visual weekly schedule with color-coded classes
- **Dashboard Analytics** - Overview of credits earned, enrolled courses, and upcoming classes
- **Conflict Detection** - Automatic detection of schedule conflicts

### For Faculty
- **My Dashboard** - Overview of assigned sections and student counts
- **Assigned Courses** - View all sections you're teaching with enrollment stats
- **Student Rosters** - See all students enrolled in your sections
- **Timetable View** - Your teaching schedule at a glance
- **Capacity Monitoring** - Track section enrollment vs capacity with visual indicators
- **Professional UI** - Grid-based course cards with enrollment progress bars

### For Administrators
- **Admin Dashboard** - System-wide overview and analytics
- **Manage Courses** - Create, edit, and delete courses
- **Manage Sections** - Configure sections with schedules, capacity, and instructors
- **Manage Faculty** - Add, update, and assign faculty to courses
- **Manage Students** - Student account management
- **Manage Terms** - Configure academic terms (Fall, Spring, Summer)
- **Manage Deadlines** - Set registration deadlines
- **Manage Rooms** - Configure classrooms and locations
- **Manage Schedules** - Create and assign class schedules
- **Waitlist Overview** - System-wide waitlist monitoring
- **Analytics & Reports** - Enrollment statistics and capacity utilization

---

## Tech Stack

### Frontend
- **React 19.1** - Latest React with modern hooks
- **Vite 7.1** - Lightning-fast build tool
- **React Router DOM 7.9** - Client-side routing
- **Axios 1.13** - HTTP client for API requests
- **Framer Motion 12.23** - Smooth animations
- **React Hot Toast 2.6** - Elegant notifications
- **Lucide React 0.546** - Beautiful icons
- **Tailwind CSS 4.1** - Utility-first CSS framework
- **React Big Calendar 1.19** - Calendar and timetable views
- **React Hook Form 7.67** - Form validation
- **Zod 4.1** - Schema validation

### Backend
- **Node.js 18+** - JavaScript runtime
- **Express.js 5.1** - Web application framework
- **Prisma ORM 5.22** - Type-safe database client
- **PostgreSQL** - Relational database
- **JWT 9.0** - JSON Web Tokens for authentication
- **Bcrypt 3.0** - Password hashing
- **Helmet 8.1** - Security middleware
- **CORS 2.8** - Cross-origin resource sharing
- **Express Validator 7.3** - Request validation
- **Express Rate Limit 8.2** - API rate limiting

---

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 18+ (Node 22 recommended)
- **npm** 10+
- **PostgreSQL** 14+ (or Supabase account)
- **Git** (for cloning the repository)

---

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/dingdong-vamshi/forked-smart-course-registration.git
cd forked-smart-course-registration
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Configure Environment Variables
Create a `.env` file in the `backend` directory:

```env
# Database Configuration (PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/course_registration"

# Server Configuration
PORT=4000
NODE_ENV=development

# JWT Secret (use a strong random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

**Note:** For Supabase PostgreSQL:
- Use the connection pooling URL for `DATABASE_URL`
- Ensure your database is accessible

#### Generate Prisma Client & Run Migrations
```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Seed database with sample data
npm run seed

# (Optional) Open Prisma Studio to view/edit data
npx prisma studio
```

#### Start Backend Server
```bash
npm run dev
```

The backend will start on `http://localhost:4000`

### 3. Frontend Setup

#### Install Dependencies
```bash
cd frontend
npm install
```

#### Configure Environment Variables
Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:4000/api
```

#### Start Frontend Development Server
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

### 4. Run Both Servers Concurrently

From the root directory:
```bash
npm run dev:all
```

This will start both backend and frontend servers simultaneously.

---

## Project Structure

```
forked-smart-course-registration/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   ├── migrations/      # Database migrations
│   │   └── seed.js          # Sample data seeder
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   │   ├── academic/    # Academic-related controllers
│   │   │   ├── auth.controller.js
│   │   │   └── dashboard.controller.js
│   │   ├── middleware/      # Auth & validation middleware
│   │   ├── routes/          # API routes
│   │   │   ├── academic/    # Academic routes
│   │   │   ├── auth.route.js
│   │   │   └── dashboard.route.js
│   │   ├── utils/           # Helper functions
│   │   ├── prisma.js        # Prisma client
│   │   └── server.js        # Entry point
│   └── package.json
│
├── frontend/
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── api/             # API service layer
│   │   ├── components/      # Reusable components
│   │   │   ├── auth/        # Auth components
│   │   │   ├── common/      # Common components
│   │   │   └── dashboard/   # Dashboard components
│   │   ├── context/         # React Context providers
│   │   ├── pages/           # Page components
│   │   │   ├── admin/       # Admin pages
│   │   │   ├── faculty/     # Faculty pages
│   │   │   └── student/     # Student pages
│   │   ├── App.jsx          # Main app component
│   │   └── index.css        # Global styles
│   └── package.json
│
├── package.json             # Root package.json
└── README.md
```

---

## API Endpoints

### Authentication
- `POST /api/login` - Login user
- `POST /api/register` - Register new user
- `POST /api/change-password` - Change user password

### Courses
- `GET /api/course` - Get all courses
- `GET /api/course/:id` - Get course by ID
- `POST /api/course` - Create course (Admin only)
- `PUT /api/course/:id` - Update course (Admin only)
- `DELETE /api/course/:id` - Delete course (Admin only)

### Sections
- `GET /api/section` - Get all sections
- `GET /api/section/:id` - Get section by ID
- `POST /api/section` - Create section (Admin only)
- `PUT /api/section/:id` - Update section (Admin only)
- `DELETE /api/section/:id` - Delete section (Admin only)

### Enrollment
- `POST /api/enroll/register` - Enroll in course (Student only)
- `DELETE /api/enroll/drop/:registrationId` - Drop course (Student only)
- `GET /api/enroll/waitlists` - Get user's waitlists (Student only)

### Students
- `GET /api/students` - Get all students (Admin only)
- `GET /api/students/dashboard-stats` - Get student dashboard stats
- `GET /api/students/registrations` - Get student registrations
- `POST /api/students` - Create student (Admin only)
- `PUT /api/students/:id` - Update student (Admin only)
- `DELETE /api/students/:id` - Delete student (Admin only)

### Faculty
- `GET /api/faculty` - Get all faculty (Admin only)
- `GET /api/faculty/dashboard-stats` - Get faculty dashboard stats
- `POST /api/faculty` - Create faculty (Admin only)
- `PUT /api/faculty/:id` - Update faculty (Admin only)
- `DELETE /api/faculty/:id` - Delete faculty (Admin only)

### Terms
- `GET /api/term` - Get all terms
- `POST /api/term` - Create term (Admin only)
- `PUT /api/term/:id` - Update term (Admin only)
- `DELETE /api/term/:id` - Delete term (Admin only)

### Rooms
- `GET /api/room` - Get all rooms
- `POST /api/room` - Create room (Admin only)
- `PUT /api/room/:id` - Update room (Admin only)
- `DELETE /api/room/:id` - Delete room (Admin only)

### Schedules
- `GET /api/schedule` - Get all schedules
- `POST /api/schedule` - Create schedule (Admin only)
- `PUT /api/schedule/:id` - Update schedule (Admin only)
- `DELETE /api/schedule/:id` - Delete schedule (Admin only)

### Deadlines
- `GET /api/deadline` - Get all deadlines
- `POST /api/deadline` - Create deadline (Admin only)
- `PUT /api/deadline/:id` - Update deadline (Admin only)
- `DELETE /api/deadline/:id` - Delete deadline (Admin only)

### Dashboard
- `GET /api/dashboard/waitlists` - Get all waitlists (Admin only)

---

## Database Schema

### User
- `id` - UUID primary key
- `full_name` - User's full name
- `email` - Unique email address
- `password` - Hashed password
- `phone` - Phone number
- `sex` - Gender
- `roleId` - Foreign key to Role
- `subjects` - JSON array of subjects (Faculty)
- `createdAt` - Timestamp

### Role
- `id` - Auto-increment primary key
- `name` - Role name (Student, Faculty, Admin)

### Course
- `id` - Auto-increment primary key
- `code` - Unique course code (e.g., CS101)
- `title` - Course title
- `description` - Course description
- `creditHours` - Number of credits
- `departmentId` - Foreign key to Department
- `createdAt` - Timestamp

### Section
- `id` - Auto-increment primary key
- `sectionCode` - Section identifier (e.g., A, B)
- `capacity` - Maximum enrollment
- `termId` - Foreign key to Term
- `createdAt` - Timestamp

### SectionCourse
- `id` - Auto-increment primary key
- `sectionId` - Foreign key to Section
- `courseId` - Foreign key to Course
- `facultyId` - Foreign key to User (Faculty)

### Registration
- `id` - Auto-increment primary key
- `studentId` - Foreign key to User (Student)
- `sectionId` - Foreign key to Section
- `createdAt` - Timestamp
- **Unique constraint:** (studentId, sectionId)

### Waitlist
- `id` - Auto-increment primary key
- `studentId` - Foreign key to User (Student)
- `sectionId` - Foreign key to Section
- `createdAt` - Timestamp (determines position)
- **Unique constraint:** (studentId, sectionId)

### Schedule
- `id` - Auto-increment primary key
- `sectionCourseId` - Foreign key to SectionCourse
- `dayOfWeek` - Day (Monday-Sunday)
- `startTime` - Class start time
- `endTime` - Class end time
- `roomId` - Foreign key to Room

### Term
- `id` - Auto-increment primary key
- `year` - Academic year
- `semester` - Semester (Fall, Spring, Summer)

### Room
- `id` - Auto-increment primary key
- `roomCode` - Room identifier
- `building` - Building name
- `capacity` - Room capacity

### Department
- `id` - Auto-increment primary key
- `name` - Department name
- `code` - Department code

### Deadline
- `id` - Auto-increment primary key
- `termId` - Foreign key to Term
- `type` - Deadline type (Registration, Drop/Add)
- `date` - Deadline date

### Notification
- `id` - Auto-increment primary key
- `userId` - Foreign key to User
- `message` - Notification message
- `read` - Boolean read status
- `createdAt` - Timestamp

---

## Usage Guide

### For Students
1. **Register** - Create an account with role "Student"
2. **Login** - Access your student dashboard
3. **Browse Courses** - View available courses and sections
4. **Search** - Use the search bar to find specific courses
5. **Enroll** - Click "Enroll" on desired course sections
6. **View Timetable** - Check your weekly schedule
7. **Track Registrations** - Monitor enrolled courses in "My Registrations"
8. **Drop Courses** - Remove courses you no longer want
9. **Waitlist** - Automatically join waitlist when sections are full

### For Faculty
1. **Register** - Create an account with role "Faculty"
2. **Login** - Access your faculty dashboard
3. **View Dashboard** - See overview of assigned sections
4. **Assigned Courses** - View all your teaching sections
5. **Check Enrollment** - Monitor student enrollment in your sections
6. **View Timetable** - See your teaching schedule

### For Administrators
1. **Register** - Create an account with role "Admin"
2. **Login** - Access admin dashboard
3. **Manage Courses** - Create and configure courses
4. **Manage Sections** - Set up sections with schedules and capacity
5. **Assign Faculty** - Link instructors to sections
6. **Manage Students** - Handle student accounts
7. **Set Terms** - Configure academic terms
8. **Set Deadlines** - Define registration periods
9. **Monitor Waitlists** - View system-wide waitlist status
10. **View Analytics** - Check enrollment statistics

---

## Available Scripts

### Root Directory
```bash
npm run dev:all       # Start both backend and frontend
npm run start:backend # Start backend only
npm run start:frontend # Start frontend only
```

### Backend
```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm run migrate  # Run Prisma migrations
npx prisma studio # Open Prisma Studio
npx prisma generate # Generate Prisma client
```

### Frontend
```bash
npm run dev      # Start Vite development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 4000 (backend)
lsof -i :4000

# Find process using port 5173 (frontend)
lsof -i :5173

# Kill the process
kill -9 <PID>

# Or change PORT in backend/.env
```

### Database Connection Issues
- Verify PostgreSQL is running
- Check `DATABASE_URL` in `.env`
- Ensure database exists: `CREATE DATABASE course_registration;`
- Run migrations: `npx prisma migrate dev`
- Check firewall settings if using remote database

### Prisma Issues
```bash
# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Regenerate Prisma Client
npx prisma generate

# View database in browser
npx prisma studio
```

### CORS Errors
- Verify `FRONTEND_URL` in backend `.env`
- Check `VITE_API_URL` in frontend `.env`
- Ensure both servers are running
- Clear browser cache

### Authentication Errors
- Check JWT_SECRET is set in backend `.env`
- Verify token is being sent in request headers
- Check token expiration settings
- Clear localStorage and login again

### Enrollment Issues
- Verify student is logged in
- Check section capacity
- Ensure no schedule conflicts
- Check registration deadlines

---

## Key Features Explained

### Waitlist Automation
When a section reaches capacity:
1. New enrollment attempts automatically join the waitlist
2. Waitlist position is determined by join time (FIFO)
3. When a student drops, the first person in waitlist is automatically enrolled
4. Notification is sent to promoted student

### Conflict Detection
The system checks for:
- **Time conflicts** - Classes at the same time
- **Back-to-back classes** - Insufficient time between classes
- **Room conflicts** - Same room double-booked

### Search Functionality
- **Student Portal** - Search courses in Browse Courses page
- **Faculty Portal** - Search assigned sections
- Real-time filtering as you type
- Searches across course code, title, and section

### Dashboard Analytics
- **Students** - Credits earned, enrolled courses, upcoming classes
- **Faculty** - Total sections, total students, today's schedule
- **Admin** - System-wide enrollment stats, waitlist overview

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

## Acknowledgments

- Built with modern web technologies
- Inspired by university course registration systems
- Special thanks to all contributors
---

## Links

- [Documentation](https://docs.google.com/document/d/14p7p9ZV3i9mIPea06WJN8XP5e1r97_yrZRzkQVDNIRo/edit?tab=t.0)
- [GitHub Repository](https://github.com/dingdong-vamshi/forked-smart-course-registration)

---

**Made with ❤️ by the Smart Course Registration Team**
=======
A dynamic, university-level course registration platform designed to streamline the enrollment process for students, faculty, and administrators. This system goes beyond basic registration by offering **smart suggestions**, **automatic conflict detection**, **waitlist management**, and **insightful analytics**.

## 🚀 Tech Stack

### Frontend
- **Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) & [Tailwindcss-animate](https://github.com/jamiebuilds/tailwindcss-animate)
- **Routing:** [React Router DOM 7](https://reactrouter.com/)
- **State Management & Data Fetching:** [Axios](https://axios-http.com/)
- **Form Handling:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) (Validation)
- **UI Components & Icons:** [Lucide React](https://lucide.dev/), [Framer Motion](https://www.framer.com/motion/) (Animations)
- **Calendar:** [React Big Calendar](https://github.com/jquense/react-big-calendar)
- **Notifications:** [React Hot Toast](https://react-hot-toast.com/)

### Backend
- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express.js](https://expressjs.com/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Authentication:** [JWT](https://jwt.io/) (JSON Web Tokens) & [Bcryptjs](https://www.npmjs.com/package/bcryptjs)
- **Validation:** [Express Validator](https://express-validator.github.io/)
- **Security:** [Helmet](https://helmetjs.github.io/), [CORS](https://www.npmjs.com/package/cors)
- **Utilities:** [Moment.js](https://momentjs.com/) (Date handling)

---

## ✨ Key Features

### 🔐 Authentication & Roles
- **Secure Login/Register:** JWT-based authentication with encrypted passwords.
- **Role-Based Access Control (RBAC):** Distinct portals for **Students**, **Faculty**, and **Admins**.

### 📚 Course & Section Management
- **Multi-Section Courses:** Support for multiple sections per course with different schedules and instructors.
- **Room Management:** Assign classrooms and manage capacity.
- **Term Management:** Configure academic terms and registration windows.

### 📝 Student Registration
- **Browse Catalog:** Search and filter available courses.
- **Instant Registration:** Real-time enrollment with immediate feedback.
- **Waitlist System:** Automatic waitlist placement when sections are full.
- **Add/Drop:** Flexible course management within defined deadlines.

### 📅 Smart Scheduling
- **Timetable View:** Visual weekly calendar for students to view their schedule.
- **Clash Detection:** Prevents scheduling conflicts (hard clashes) and warns about potential issues.

### 👥 Faculty & Admin Tools
- **Roster Management:** Faculty can view enrolled students.
- **Dashboard:** Admin dashboard for managing users, courses, and system settings.
- **Analytics:** Insights into seat usage and registration trends.

---

## 🛠️ Installation and Setup

Follow these steps to get the project running locally.

### Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL installed and running

### 1. Clone the Repository
```bash
git clone <repository-url>
cd smart-course-registration
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies.
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB_NAME?schema=public"
JWT_SECRET="your_super_secret_key"
PORT=4000
```

Run database migrations:
```bash
npx prisma migrate dev --name init
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies.
```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```

### 4. Run Both Concurrently
You can also run both servers from the root or frontend directory if configured, but running them in separate terminals is recommended for easier debugging.

---

## Project Structure

```
smart-course-registration/
├── backend/                # Node.js + Express API
│   ├── prisma/             # Database schema and migrations
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth and validation middleware
│   │   ├── routes/         # API route definitions
│   │   └── utils/          # Helper functions
│   └── package.json
│
├── frontend/               # React + Vite Application
│   ├── src/
│   │   ├── api/            # API integration
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # Global state (Auth, etc.)
│   │   ├── pages/          # Page components
│   │   └── App.jsx         # Main application entry
│   └── package.json
│
└── README.md               # Project documentation
```

## 🤝 Contributing
Contributions are welcome! Please fork the repository and submit a pull request.
