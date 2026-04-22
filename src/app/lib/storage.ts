import { Student, AttendanceRecord, AttendanceSession, Faculty } from "../types";

const STORAGE_KEYS = {
  STUDENTS: "alta_students",
  ATTENDANCE: "alta_attendance",
  SESSIONS: "alta_sessions",
  FACULTY: "alta_faculty",
};

// Initial mock data
const initialStudents: Student[] = [
  {
    id: "1",
    rollNumber: "AST2024001",
    firstName: "Emily",
    lastName: "Johnson",
    email: "emily.johnson@alta.edu",
    phone: "+1-555-0101",
    department: "Computer Science",
    semester: 6,
    dateOfBirth: "2003-05-15",
    enrollmentDate: "2022-08-15",
  },
  {
    id: "2",
    rollNumber: "AST2024002",
    firstName: "Michael",
    lastName: "Chen",
    email: "michael.chen@alta.edu",
    phone: "+1-555-0102",
    department: "Computer Science",
    semester: 6,
    dateOfBirth: "2003-03-22",
    enrollmentDate: "2022-08-15",
  },
  {
    id: "3",
    rollNumber: "AST2024003",
    firstName: "Sarah",
    lastName: "Williams",
    email: "sarah.williams@alta.edu",
    phone: "+1-555-0103",
    department: "Electronics",
    semester: 4,
    dateOfBirth: "2004-07-08",
    enrollmentDate: "2023-08-15",
  },
  {
    id: "4",
    rollNumber: "AST2024004",
    firstName: "James",
    lastName: "Anderson",
    email: "james.anderson@alta.edu",
    phone: "+1-555-0104",
    department: "Mechanical",
    semester: 4,
    dateOfBirth: "2004-01-30",
    enrollmentDate: "2023-08-15",
  },
  {
    id: "5",
    rollNumber: "AST2024005",
    firstName: "Priya",
    lastName: "Patel",
    email: "priya.patel@alta.edu",
    phone: "+1-555-0105",
    department: "Computer Science",
    semester: 2,
    dateOfBirth: "2005-09-12",
    enrollmentDate: "2024-08-15",
  },
  {
    id: "6",
    rollNumber: "AST2024006",
    firstName: "David",
    lastName: "Martinez",
    email: "david.martinez@alta.edu",
    phone: "+1-555-0106",
    department: "Electronics",
    semester: 6,
    dateOfBirth: "2003-11-25",
    enrollmentDate: "2022-08-15",
  },
  {
    id: "7",
    rollNumber: "AST2024007",
    firstName: "Lisa",
    lastName: "Thompson",
    email: "lisa.thompson@alta.edu",
    phone: "+1-555-0107",
    department: "Mechanical",
    semester: 2,
    dateOfBirth: "2005-04-18",
    enrollmentDate: "2024-08-15",
  },
  {
    id: "8",
    rollNumber: "AST2024008",
    firstName: "Ryan",
    lastName: "Lee",
    email: "ryan.lee@alta.edu",
    phone: "+1-555-0108",
    department: "Computer Science",
    semester: 4,
    dateOfBirth: "2004-06-03",
    enrollmentDate: "2023-08-15",
  },
];

// Students
export const getStudents = (): Student[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.STUDENTS);
  if (stored) {
    return JSON.parse(stored);
  }
  // Initialize with mock data
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(initialStudents));
  return initialStudents;
};

export const getStudent = (id: string): Student | undefined => {
  const students = getStudents();
  return students.find((s) => s.id === id);
};

export const addStudent = (student: Omit<Student, "id">): Student => {
  const students = getStudents();
  const newStudent = {
    ...student,
    id: Date.now().toString(),
  };
  students.push(newStudent);
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  return newStudent;
};

export const updateStudent = (id: string, updates: Partial<Student>): void => {
  const students = getStudents();
  const index = students.findIndex((s) => s.id === id);
  if (index !== -1) {
    students[index] = { ...students[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }
};

export const deleteStudent = (id: string): void => {
  const students = getStudents();
  const filtered = students.filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(filtered));
};

// Attendance
export const getAttendanceRecords = (): AttendanceRecord[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
  return stored ? JSON.parse(stored) : [];
};

export const getStudentAttendance = (studentId: string): AttendanceRecord[] => {
  const records = getAttendanceRecords();
  return records.filter((r) => r.studentId === studentId);
};

export const addAttendanceRecord = (
  record: Omit<AttendanceRecord, "id">
): AttendanceRecord => {
  const records = getAttendanceRecords();
  const newRecord = {
    ...record,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
  };
  records.push(newRecord);
  localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(records));
  return newRecord;
};

export const addBulkAttendance = (
  records: Omit<AttendanceRecord, "id">[]
): void => {
  const existingRecords = getAttendanceRecords();
  const newRecords = records.map((record) => ({
    ...record,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
  }));
  const allRecords = [...existingRecords, ...newRecords];
  localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(allRecords));
};

export const updateAttendanceRecord = (
  id: string,
  updates: Partial<AttendanceRecord>
): void => {
  const records = getAttendanceRecords();
  const index = records.findIndex((r) => r.id === id);
  if (index !== -1) {
    records[index] = { ...records[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(records));
  }
};

export const deleteAttendanceRecord = (id: string): void => {
  const records = getAttendanceRecords();
  const filtered = records.filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(filtered));
};

// Sessions
export const getSessions = (): AttendanceSession[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.SESSIONS);
  return stored ? JSON.parse(stored) : [];
};

export const addSession = (
  session: Omit<AttendanceSession, "id">
): AttendanceSession => {
  const sessions = getSessions();
  const newSession = {
    ...session,
    id: Date.now().toString(),
  };
  sessions.push(newSession);
  localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  return newSession;
};

// Analytics
export const getAttendanceStats = () => {
  const students = getStudents();
  const records = getAttendanceRecords();
  
  const totalStudents = students.length;
  const totalRecords = records.length;
  
  const presentCount = records.filter((r) => r.status === "present").length;
  const absentCount = records.filter((r) => r.status === "absent").length;
  const lateCount = records.filter((r) => r.status === "late").length;
  
  const attendanceRate =
    totalRecords > 0 ? (presentCount / totalRecords) * 100 : 0;
  
  // Get today's attendance
  const today = new Date().toISOString().split("T")[0];
  const todayRecords = records.filter((r) => r.date === today);
  const todayPresent = todayRecords.filter((r) => r.status === "present").length;
  
  return {
    totalStudents,
    totalRecords,
    presentCount,
    absentCount,
    lateCount,
    attendanceRate,
    todayPresent,
    todayTotal: todayRecords.length,
  };
};

export const getDepartmentStats = () => {
  const students = getStudents();
  const departments = Array.from(new Set(students.map((s) => s.department)));
  
  return departments.map((dept) => ({
    department: dept,
    count: students.filter((s) => s.department === dept).length,
  }));
};

export const getStudentAttendancePercentage = (studentId: string): number => {
  const records = getStudentAttendance(studentId);
  if (records.length === 0) return 0;

  const presentCount = records.filter((r) => r.status === "present").length;
  return (presentCount / records.length) * 100;
};

// Initial faculty data
const initialFaculty: Faculty[] = [
  {
    id: "faculty1",
    email: "faculty@alta.edu",
    firstName: "John",
    lastName: "Smith",
    phone: "+1-555-0201",
    department: "Computer Science",
    designation: "Professor",
    dateOfJoining: "2015-08-15",
    password: "faculty123",
  },
  {
    id: "faculty2",
    email: "faculty2@alta.edu",
    firstName: "Sarah",
    lastName: "Johnson",
    phone: "+1-555-0202",
    department: "Electronics",
    designation: "Associate Professor",
    dateOfJoining: "2018-01-10",
    password: "faculty123",
  },
];

// Faculty CRUD operations
export const getFaculty = (): Faculty[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.FACULTY);
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem(STORAGE_KEYS.FACULTY, JSON.stringify(initialFaculty));
  return initialFaculty;
};

export const getFacultyMember = (id: string): Faculty | undefined => {
  const faculty = getFaculty();
  return faculty.find((f) => f.id === id);
};

export const addFaculty = (facultyMember: Omit<Faculty, "id">): Faculty => {
  const faculty = getFaculty();
  const newFaculty = {
    ...facultyMember,
    id: "faculty" + Date.now().toString(),
  };
  faculty.push(newFaculty);
  localStorage.setItem(STORAGE_KEYS.FACULTY, JSON.stringify(faculty));
  return newFaculty;
};

export const updateFaculty = (id: string, updates: Partial<Faculty>): void => {
  const faculty = getFaculty();
  const index = faculty.findIndex((f) => f.id === id);
  if (index !== -1) {
    faculty[index] = { ...faculty[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.FACULTY, JSON.stringify(faculty));
  }
};

export const deleteFaculty = (id: string): void => {
  const faculty = getFaculty();
  const filtered = faculty.filter((f) => f.id !== id);
  localStorage.setItem(STORAGE_KEYS.FACULTY, JSON.stringify(filtered));
};
