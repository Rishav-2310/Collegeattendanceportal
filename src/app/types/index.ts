export interface Student {
  id: string;
  rollNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  semester: number;
  dateOfBirth: string;
  enrollmentDate: string;
  photo?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: "present" | "absent" | "late";
  subject?: string;
  session?: string;
  remarks?: string;
}

export interface AttendanceSession {
  id: string;
  date: string;
  subject: string;
  sessionName: string;
  department: string;
  semester: number;
}
