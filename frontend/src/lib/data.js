// ===============================
// 📘 Students Data
// ===============================
export const studentsData = [
  {
    id: 1,
    studentId: "S001",
    name: "John Doe",
    email: "john.doe@example.com",
    photo: "/avatar.png",
    phone: "123-456-7890",
    grade: 10,
    className: "A",
    address: "123 Main St, Anytown, USA",
  },
  {
    id: 2,
    studentId: "S002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    photo: "/avatar.png",
    phone: "098-765-4321",
    grade: 11,
    className: "B",
    address: "456 Oak Ave, Anytown, USA",
  },
  {
    id: 3,
    studentId: "S003",
    name: "David Johnson",
    email: "david.johnson@example.com",
    photo: "/avatar.png",
    phone: "555-222-9999",
    grade: 12,
    className: "C",
    address: "789 Elm St, Anytown, USA",
  },
];

// ===============================
// 👨‍🏫 Teachers Data
// ===============================
export const teachersData = [
  {
    id: 1,
    teacherId: "T001",
    name: "Mr. Smith",
    subjects: ["Math", "Physics"],
    classes: ["10A", "11B"],
    phone: "111-222-3333",
    address: "789 Pine St, Anytown, USA",
  },
  {
    id: 2,
    teacherId: "T002",
    name: "Ms. Jones",
    subjects: ["English", "History"],
    classes: ["9A", "10B"],
    phone: "444-555-6666",
    address: "321 Maple St, Anytown, USA",
  },
  {
    id: 3,
    teacherId: "T003",
    name: "Mr. Brown",
    subjects: ["Chemistry", "Biology"],
    classes: ["11C", "12A"],
    phone: "777-888-9999",
    address: "654 Cedar Ave, Anytown, USA",
  },
];

// ===============================
// 📚 Courses / Subjects Data
// ===============================
export const coursesData = [
  {
    id: 1,
    courseName: "Mathematics",
    courseCode: "MATH101",
    creditHours: 3,
    teachers: ["Alice Phelps", "Russell Davidson"],
  },
  {
    id: 2,
    courseName: "English Literature",
    courseCode: "ENG201",
    creditHours: 4,
    teachers: ["Manuel Becker", "Eddie Chavez"],
  },
  {
    id: 3,
    courseName: "Physics",
    courseCode: "PHY301",
    creditHours: 3,
    teachers: ["Lola Newman", "Darrell Delgado"],
  },
  {
    id: 4,
    courseName: "Chemistry",
    courseCode: "CHEM210",
    creditHours: 3,
    teachers: ["Nathan Kelly", "Benjamin Snyder"],
  },
  {
    id: 5,
    courseName: "Biology",
    courseCode: "BIO110",
    creditHours: 4,
    teachers: ["Alma Benson", "Lina Collier"],
  },
  {
    id: 6,
    courseName: "History",
    courseCode: "HIS205",
    creditHours: 2,
    teachers: ["Hannah Bowman", "Betty Obrien"],
  },
  {
    id: 7,
    courseName: "Geography",
    courseCode: "GEO105",
    creditHours: 2,
    teachers: ["Lora French", "Sue Brady"],
  },
  {
    id: 8,
    courseName: "Art",
    courseCode: "ART120",
    creditHours: 2,
    teachers: ["Harriet Alvarado", "Mayme Keller"],
  },
  {
    id: 9,
    courseName: "Music",
    courseCode: "MUS130",
    creditHours: 2,
    teachers: ["Gertrude Roy", "Rosa Singleton"],
  },
  {
    id: 10,
    courseName: "Literature",
    courseCode: "LIT140",
    creditHours: 3,
    teachers: ["Effie Lynch", "Brett Flowers"],
  },
];

// ===============================
// 🧩 Sections Data
// ===============================
export const sectionsData = [
  { id: 1, sectionName: "1A", capacity: 20, grade: 1, supervisor: "Joseph Padilla" },
  { id: 2, sectionName: "2B", capacity: 22, grade: 2, supervisor: "Blake Joseph" },
  { id: 3, sectionName: "3C", capacity: 20, grade: 3, supervisor: "Tom Bennett" },
  { id: 4, sectionName: "4B", capacity: 18, grade: 4, supervisor: "Aaron Collins" },
  { id: 5, sectionName: "5A", capacity: 16, grade: 5, supervisor: "Iva Frank" },
  { id: 6, sectionName: "5B", capacity: 20, grade: 5, supervisor: "Leila Santos" },
  { id: 7, sectionName: "7A", capacity: 18, grade: 7, supervisor: "Carrie Walton" },
  { id: 8, sectionName: "6B", capacity: 22, grade: 6, supervisor: "Christopher Butler" },
  { id: 9, sectionName: "6C", capacity: 18, grade: 6, supervisor: "Marc Miller" },
  { id: 10, sectionName: "6D", capacity: 20, grade: 6, supervisor: "Ophelia Marsh" },
];

// ===============================
// 📆 Terms Data
// ===============================
export const termsData = [
  {
    id: 1,
    year: 2025,
    semester: "Spring",
    totalCourses: 10,
    totalSections: 25,
  },
  {
    id: 2,
    year: 2025,
    semester: "Fall",
    totalCourses: 8,
    totalSections: 20,
  },
  {
    id: 3,
    year: 2026,
    semester: "Summer",
    totalCourses: 5,
    totalSections: 10,
  },
];

// ===============================
// ⏰ Deadlines Data
// ===============================
export const deadlinesData = [
  {
    id: 1,
    term: "Spring 2025",
    course: "MATH101 - Mathematics",
    registrationOpen: "2025-01-10",
    addDropStart: "2025-01-15",
    addDropEnd: "2025-01-25",
    registrationClose: "2025-02-01",
    waitlistClose: "2025-02-10",
  },
  {
    id: 2,
    term: "Fall 2025",
    course: "ENG201 - English Literature",
    registrationOpen: "2025-07-01",
    addDropStart: "2025-07-05",
    addDropEnd: "2025-07-20",
    registrationClose: "2025-07-30",
    waitlistClose: "2025-08-10",
  },
  {
    id: 3,
    term: "Summer 2026",
    course: "PHY301 - Physics",
    registrationOpen: "2026-03-05",
    addDropStart: "2026-03-10",
    addDropEnd: "2026-03-25",
    registrationClose: "2026-04-01",
    waitlistClose: "2026-04-10",
  },
];

// ===============================
// 🧑‍💻 Role
// ===============================
export const role = "admin";
