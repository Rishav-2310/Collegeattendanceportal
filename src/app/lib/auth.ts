import { User } from "../types";

const AUTH_KEY = "alta_auth_user";

// Mock users for demo
const MOCK_USERS = [
  {
    id: "admin1",
    email: "admin@alta.edu",
    password: "admin123",
    name: "Admin User",
    role: "admin" as const,
  },
  {
    id: "faculty1",
    email: "faculty@alta.edu",
    password: "faculty123",
    name: "Dr. John Smith",
    role: "faculty" as const,
    department: "Computer Science",
  },
  {
    id: "faculty2",
    email: "faculty2@alta.edu",
    password: "faculty123",
    name: "Dr. Sarah Johnson",
    role: "faculty" as const,
    department: "Electronics",
  },
  {
    id: "1",
    email: "emily.johnson@alta.edu",
    password: "student123",
    name: "Emily Johnson",
    role: "student" as const,
    studentId: "1",
    department: "Computer Science",
  },
  {
    id: "2",
    email: "michael.chen@alta.edu",
    password: "student123",
    name: "Michael Chen",
    role: "student" as const,
    studentId: "2",
    department: "Computer Science",
  },
];

export const login = (email: string, password: string): User | null => {
  const user = MOCK_USERS.find(
    (u) => u.email === email && u.password === password
  );

  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem(AUTH_KEY, JSON.stringify(userWithoutPassword));
    return userWithoutPassword;
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
