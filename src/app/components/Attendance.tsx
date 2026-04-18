import { useEffect, useState } from "react";
import { Calendar, Save, Check, X, Clock } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { getStudents, addBulkAttendance } from "../lib/storage";
import { Student, AttendanceRecord } from "../types";
import { toast } from "sonner";

export function Attendance() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [subject, setSubject] = useState("");
  const [session, setSession] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState<
    Record<string, "present" | "absent" | "late">
  >({});
  
  useEffect(() => {
    const allStudents = getStudents();
    setStudents(allStudents);
    
    // Initialize all as present
    const initialStatus: Record<string, "present" | "absent" | "late"> = {};
    allStudents.forEach((student) => {
      initialStatus[student.id] = "present";
    });
    setAttendanceStatus(initialStatus);
  }, []);
  
  useEffect(() => {
    let filtered = students;
    
    if (selectedDepartment !== "all") {
      filtered = filtered.filter((s) => s.department === selectedDepartment);
    }
    
    if (selectedSemester !== "all") {
      filtered = filtered.filter((s) => s.semester.toString() === selectedSemester);
    }
    
    setFilteredStudents(filtered);
  }, [students, selectedDepartment, selectedSemester]);
  
  const departments = Array.from(new Set(students.map((s) => s.department)));
  const semesters = Array.from(new Set(students.map((s) => s.semester))).sort();
  
  const handleStatusChange = (studentId: string, status: "present" | "absent" | "late") => {
    setAttendanceStatus((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };
  
  const handleMarkAll = (status: "present" | "absent" | "late") => {
    const newStatus: Record<string, "present" | "absent" | "late"> = {};
    filteredStudents.forEach((student) => {
      newStatus[student.id] = status;
    });
    setAttendanceStatus((prev) => ({
      ...prev,
      ...newStatus,
    }));
  };
  
  const handleSave = () => {
    if (!subject.trim() || !session.trim()) {
      toast.error("Please enter subject and session details");
      return;
    }
    
    const records: Omit<AttendanceRecord, "id">[] = filteredStudents.map((student) => ({
      studentId: student.id,
      date,
      status: attendanceStatus[student.id] || "present",
      subject,
      session,
    }));
    
    addBulkAttendance(records);
    toast.success("Attendance saved successfully!");
    
    // Reset form
    setSubject("");
    setSession("");
    setDate(new Date().toISOString().split("T")[0]);
    
    // Reset all to present
    const initialStatus: Record<string, "present" | "absent" | "late"> = {};
    students.forEach((student) => {
      initialStatus[student.id] = "present";
    });
    setAttendanceStatus(initialStatus);
  };
  
  const presentCount = filteredStudents.filter(
    (s) => attendanceStatus[s.id] === "present"
  ).length;
  const absentCount = filteredStudents.filter(
    (s) => attendanceStatus[s.id] === "absent"
  ).length;
  const lateCount = filteredStudents.filter(
    (s) => attendanceStatus[s.id] === "late"
  ).length;
  
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mark Attendance</h1>
        <p className="text-gray-500 mt-1">Record student attendance for the session</p>
      </div>
      
      {/* Session Details */}
      <Card className="p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Session Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="e.g., Data Structures"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="session">Session</Label>
            <Input
              id="session"
              placeholder="e.g., Morning, Afternoon"
              value={session}
              onChange={(e) => setSession(e.target.value)}
            />
          </div>
        </div>
      </Card>
      
      {/* Filters */}
      <Card className="p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Filter Students</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Department</Label>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Semester</Label>
            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Semesters</SelectItem>
                {semesters.map((sem) => (
                  <SelectItem key={sem} value={sem.toString()}>
                    Semester {sem}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>
      
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{filteredStudents.length}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Present</p>
              <p className="text-2xl font-bold text-green-700">{presentCount}</p>
            </div>
            <Check className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Absent</p>
              <p className="text-2xl font-bold text-red-700">{absentCount}</p>
            </div>
            <X className="w-8 h-8 text-red-500" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Late</p>
              <p className="text-2xl font-bold text-yellow-700">{lateCount}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
      </div>
      
      {/* Quick Actions */}
      <div className="flex gap-2 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleMarkAll("present")}
          className="text-green-700 border-green-300 hover:bg-green-50"
        >
          Mark All Present
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleMarkAll("absent")}
          className="text-red-700 border-red-300 hover:bg-red-50"
        >
          Mark All Absent
        </Button>
      </div>
      
      {/* Students List */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Roll Number
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Semester
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {student.rollNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-700 font-medium">
                          {student.firstName[0]}{student.lastName[0]}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {student.firstName} {student.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.semester}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleStatusChange(student.id, "present")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          attendanceStatus[student.id] === "present"
                            ? "bg-green-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-green-50"
                        }`}
                      >
                        Present
                      </button>
                      <button
                        onClick={() => handleStatusChange(student.id, "late")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          attendanceStatus[student.id] === "late"
                            ? "bg-yellow-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-yellow-50"
                        }`}
                      >
                        Late
                      </button>
                      <button
                        onClick={() => handleStatusChange(student.id, "absent")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          attendanceStatus[student.id] === "absent"
                            ? "bg-red-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-red-50"
                        }`}
                      >
                        Absent
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No students found</p>
            </div>
          )}
        </div>
      </Card>
      
      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <Button
          onClick={handleSave}
          className="flex items-center gap-2"
          size="lg"
        >
          <Save className="w-5 h-5" />
          Save Attendance
        </Button>
      </div>
    </div>
  );
}
