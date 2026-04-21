import { useEffect, useState } from "react";
import { BarChart3, Download, TrendingUp, Edit } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { getStudents, getAttendanceRecords, getStudentAttendancePercentage } from "../lib/storage";
import { Student, AttendanceRecord } from "../types";
import { EditAttendanceDialog } from "./EditAttendanceDialog";

export function Reports() {
  const [students, setStudents] = useState<Student[]>([]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const loadData = () => {
    setStudents(getStudents());
    setRecords(getAttendanceRecords());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEditClick = (record: AttendanceRecord) => {
    setEditingRecord(record);
    setIsEditDialogOpen(true);
  };

  const handleUpdateComplete = () => {
    loadData();
  };
  
  const filteredStudents = students.filter((s) => {
    const matchesDept = selectedDepartment === "all" || s.department === selectedDepartment;
    const matchesSem = selectedSemester === "all" || s.semester.toString() === selectedSemester;
    return matchesDept && matchesSem;
  });
  
  const departments = Array.from(new Set(students.map((s) => s.department)));
  const semesters = Array.from(new Set(students.map((s) => s.semester))).sort();
  
  // Department-wise attendance data
  const departmentData = departments.map((dept, index) => {
    const deptStudents = students.filter((s) => s.department === dept);
    const deptRecords = records.filter((r) =>
      deptStudents.some((s) => s.id === r.studentId)
    );

    const present = deptRecords.filter((r) => r.status === "present").length;
    const absent = deptRecords.filter((r) => r.status === "absent").length;
    const late = deptRecords.filter((r) => r.status === "late").length;

    return {
      id: `dept-${index}`,
      department: dept || "Unknown",
      Present: present,
      Absent: absent,
      Late: late,
    };
  });
  
  // Overall status distribution
  const statusData = [
    {
      id: "status-present",
      name: "Present",
      value: records.filter((r) => r.status === "present").length,
      color: "#10b981",
    },
    {
      id: "status-absent",
      name: "Absent",
      value: records.filter((r) => r.status === "absent").length,
      color: "#ef4444",
    },
    {
      id: "status-late",
      name: "Late",
      value: records.filter((r) => r.status === "late").length,
      color: "#f59e0b",
    },
  ];
  
  // Daily attendance trend (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split("T")[0];
  });

  const dailyTrendData = last7Days.map((date, index) => {
    const dayRecords = records.filter((r) => r.date === date);
    const present = dayRecords.filter((r) => r.status === "present").length;
    const absent = dayRecords.filter((r) => r.status === "absent").length;

    return {
      id: `day-${index}`,
      date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      Present: present,
      Absent: absent,
    };
  });
  
  // Student performance data
  const studentPerformanceData = filteredStudents
    .map((student) => ({
      name: `${student.firstName} ${student.lastName}`,
      rollNumber: student.rollNumber,
      attendance: getStudentAttendancePercentage(student.id),
    }))
    .sort((a, b) => b.attendance - a.attendance)
    .slice(0, 10);
  
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-500 mt-1">Comprehensive attendance insights</p>
        </div>
        
        <Button className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>
      
      {/* Filters */}
      <Card className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by department" />
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
            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by semester" />
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
      
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Department-wise Attendance */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Department-wise Attendance
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Present" fill="#10b981" key="bar-present" />
              <Bar dataKey="Absent" fill="#ef4444" key="bar-absent" />
              <Bar dataKey="Late" fill="#f59e0b" key="bar-late" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        
        {/* Status Distribution */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Overall Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry) => (
                  <Cell key={entry.id} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
      
      {/* Daily Trend */}
      <Card className="p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Daily Attendance Trend (Last 7 Days)
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailyTrendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Present" stroke="#10b981" strokeWidth={2} key="line-present" />
            <Line type="monotone" dataKey="Absent" stroke="#ef4444" strokeWidth={2} key="line-absent" />
          </LineChart>
        </ResponsiveContainer>
      </Card>
      
      {/* Top Performers */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Student Attendance Performance (Top 10)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Roll Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendance %
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {studentPerformanceData.map((student, index) => (
                <tr key={student.rollNumber} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-gray-900">#{index + 1}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.rollNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        student.attendance >= 75
                          ? "bg-green-100 text-green-700"
                          : student.attendance >= 50
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {student.attendance.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          student.attendance >= 75
                            ? "bg-green-600"
                            : student.attendance >= 50
                            ? "bg-yellow-600"
                            : "bg-red-600"
                        }`}
                        style={{ width: `${student.attendance}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {studentPerformanceData.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No data available</p>
            </div>
          )}
        </div>
      </Card>

      {/* All Attendance Records */}
      <Card className="p-6 mt-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">All Attendance Records</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Student
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Roll Number
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Subject
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {records
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 50)
                .map((record) => {
                  const student = students.find((s) => s.id === record.studentId);
                  return (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {student ? `${student.firstName} ${student.lastName}` : "Unknown"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {student?.rollNumber || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {record.subject || "-"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            record.status === "present"
                              ? "bg-green-100 text-green-700"
                              : record.status === "late"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditClick(record)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>

          {records.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No attendance records yet</p>
            </div>
          )}
        </div>
      </Card>

      <EditAttendanceDialog
        record={editingRecord}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onUpdate={handleUpdateComplete}
      />
    </div>
  );
}
