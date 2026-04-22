import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, Mail, Phone, Calendar, GraduationCap, Hash, Edit } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { getStudent, getStudentAttendance, getStudentAttendancePercentage } from "../lib/storage";
import { Student, AttendanceRecord } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { EditAttendanceDialog } from "./EditAttendanceDialog";

export function StudentProfile() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [attendancePercentage, setAttendancePercentage] = useState(0);
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const loadAttendanceData = () => {
    const studentId = user?.role === "student" ? user.studentId : id;

    if (studentId) {
      const studentData = getStudent(studentId);
      setStudent(studentData || null);

      const attendanceData = getStudentAttendance(studentId);
      setAttendance(attendanceData.sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ));

      setAttendancePercentage(getStudentAttendancePercentage(studentId));
    }
  };

  useEffect(() => {
    loadAttendanceData();
  }, [id, user]);

  const handleEditClick = (record: AttendanceRecord) => {
    setEditingRecord(record);
    setIsEditDialogOpen(true);
  };

  const handleUpdateComplete = () => {
    loadAttendanceData();
  };
  
  if (!student) {
    return (
      <div className="p-8">
        <div className="text-center">
          <p className="text-gray-500">Student not found</p>
          {user?.role === "admin" && (
            <Link to="/students">
              <Button className="mt-4">Back to Students</Button>
            </Link>
          )}
        </div>
      </div>
    );
  }

  const presentCount = attendance.filter((r) => r.status === "present").length;
  const absentCount = attendance.filter((r) => r.status === "absent").length;
  const lateCount = attendance.filter((r) => r.status === "late").length;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {user?.role === "admin" && (
        <Link to="/students" className="inline-flex items-center gap-2 text-sm sm:text-base text-gray-600 hover:text-gray-900 mb-4 sm:mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Students
        </Link>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Student Info Card */}
        <Card className="p-4 sm:p-6 lg:col-span-1">
          <div className="text-center">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-bold text-blue-700">
                {student.firstName[0]}{student.lastName[0]}
              </span>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900">
              {student.firstName} {student.lastName}
            </h2>
            <p className="text-gray-500 mt-1">{student.rollNumber}</p>
            
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">{student.email}</span>
              </div>
              
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">{student.phone}</span>
              </div>
              
              <div className="flex items-center gap-3 text-sm">
                <GraduationCap className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">{student.department}</span>
              </div>
              
              <div className="flex items-center gap-3 text-sm">
                <Hash className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">Semester {student.semester}</span>
              </div>
              
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">
                  Enrolled: {new Date(student.enrollmentDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Attendance Overview */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <Card className="p-4 sm:p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Attendance Overview</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{attendance.length}</p>
                <p className="text-sm text-gray-500 mt-1">Total Sessions</p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-700">{presentCount}</p>
                <p className="text-sm text-gray-500 mt-1">Present</p>
              </div>
              
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-2xl font-bold text-red-700">{absentCount}</p>
                <p className="text-sm text-gray-500 mt-1">Absent</p>
              </div>
              
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-700">{lateCount}</p>
                <p className="text-sm text-gray-500 mt-1">Late</p>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Overall Attendance</span>
                <span className={`text-sm font-bold ${
                  attendancePercentage >= 75 ? "text-green-700" :
                  attendancePercentage >= 50 ? "text-yellow-700" : "text-red-700"
                }`}>
                  {attendancePercentage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${
                    attendancePercentage >= 75 ? "bg-green-600" :
                    attendancePercentage >= 50 ? "bg-yellow-600" : "bg-red-600"
                  }`}
                  style={{ width: `${attendancePercentage}%` }}
                />
              </div>
            </div>
          </Card>
          
          {/* Attendance History */}
          <Card className="p-0 sm:p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Attendance History</h3>
            
            {attendance.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px]">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Subject
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Session
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Remarks
                      </th>
                      {(user?.role === "admin" || user?.role === "faculty") && (
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {attendance.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {new Date(record.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {record.subject || "-"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {record.session || "-"}
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
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {record.remarks || "-"}
                        </td>
                        {(user?.role === "admin" || user?.role === "faculty") && (
                          <td className="px-4 py-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditClick(record)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No attendance records yet</p>
            )}
          </Card>
        </div>
      </div>

      <EditAttendanceDialog
        record={editingRecord}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onUpdate={handleUpdateComplete}
      />
    </div>
  );
}
