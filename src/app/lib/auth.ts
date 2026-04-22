import { User } from "../types";
import { getStudents, getFaculty } from "./storage";

const AUTH_KEY = "alta_auth_user";

// Admin user
const ADMIN_USER = {
  id: "admin1",
  email: "admin@alta.edu",
  password: "admin123",
  name: "Admin User",
  role: "admin" as const,
};

// Default password for all students
const DEFAULT_STUDENT_PASSWORD = "student123";

export const login = (email: string, password: string): User | null => {
  // Check if admin
  if (email === ADMIN_USER.email && password === ADMIN_USER.password) {
    const { password: _, ...userWithoutPassword } = ADMIN_USER;
    localStorage.setItem(AUTH_KEY, JSON.stringify(userWithoutPassword));
    return userWithoutPassword;
  }

  // Check faculty
  const faculty = getFaculty();
  const facultyMember = faculty.find(
    (f) => f.email === email && f.password === password
  );

  if (facultyMember) {
    const user: User = {
      id: facultyMember.id,
      email: facultyMember.email,
      name: `${facultyMember.firstName} ${facultyMember.lastName}`,
      role: "faculty",
      department: facultyMember.department,
      facultyId: facultyMember.id,
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return user;
  }

  // Check students
  const students = getStudents();
  const student = students.find((s) => s.email === email);

  if (student && password === DEFAULT_STUDENT_PASSWORD) {
    const user: User = {
      id: student.id,
      email: student.email,
      name: `${student.firstName} ${student.lastName}`,
      role: "student",
      department: student.department,
      studentId: student.id,
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return user;
  }

  return null;
};

export const logout = (): void => {
  localStorage.removeItem(AUTH_KEY);
};

export const getCurrentUser = (): User | null => {
  const stored = localStorage.getItem(AUTH_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};
