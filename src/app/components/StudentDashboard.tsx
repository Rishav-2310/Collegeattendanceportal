import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { UserCheck, UserX, Clock, TrendingUp, Calendar } from "lucide-react";
import { Card } from "./ui/card";
import { getStudent, getStudentAttendance, getStudentAttendancePercentage } from "../lib/storage";
import { AttendanceRecord, Student } from "../types";

export function StudentDashboard() {
  const { user } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [stats, setStats] = useState({
    totalClasses: 0,
    present: 0,
    absent: 0,
    late: 0,
    percentage: 0,
  });

  useEffect(() => {
    if (user?.studentId) {
      const studentData = getStudent(user.studentId);
      const attendanceRecords = getStudentAttendance(user.studentId);
      const percentage = getStudentAttendancePercentage(user.studentId);

      setStudent(studentData || null);
      setAttendance(attendanceRecords);

      const present = attendanceRecords.filter((r) => r.status === "present").length;
      const absent = attendanceRecords.filter((r) => r.status === "absent").length;
      const late = attendanceRecords.filter((r) => r.status === "late").length;

      setStats({
        totalClasses: attendanceRecords.length,
        present,
        absent,
        late,
        percentage,
      });
    }
  }, [user]);

  const statCards = [
    {
      title: "Attendance Rate",
      value: `${stats.percentage.toFixed(1)}%`,
      icon: TrendingUp,
      color: stats.percentage >= 75 ? "bg-green-500" : "bg-red-500",
      textColor: stats.percentage >= 75 ? "text-green-700" : "text-red-700",
      bgColor: stats.percentage >= 75 ? "bg-green-50" : "bg-red-50",
    },
    {
      title: "Total Classes",
      value: stats.totalClasses,
      icon: Calendar,
      color: "bg-blue-500",
      textColor: "text-blue-700",
      bgColor: "bg-blue-50",
    },
    {
      title: "Present",
      value: stats.present,
      icon: UserCheck,
      color: "bg-green-500",
      textColor: "text-green-700",
      bgColor: "bg-green-50",
    },
    {
      title: "Absent",
      value: stats.absent,
      icon: UserX,
      color: "bg-red-500",
      textColor: "text-red-700",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Welcome, {student?.firstName}!
        </h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">
          {student?.department} - Semester {student?.semester}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1 mr-4">
                  <p className="text-xs sm:text-sm text-gray-500 mb-1 truncate">{stat.title}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.textColor}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Attendance Warning */}
      {stats.percentage < 75 && stats.totalClasses > 0 && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <UserX className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">Low Attendance Warning</h3>
              <p className="text-sm text-red-700 mt-1">
                Your attendance is below the required 75%. Please attend classes regularly to meet the minimum requirement.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Attendance */}
      <Card className="p-4 sm:p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Recent Attendance Records
        </h2>
        <div className="space-y-3">
          {attendance.length > 0 ? (
            attendance
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 10)
              .map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {new Date(record.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    {record.subject && (
                      <p className="text-sm text-gray-500">{record.subject}</p>
                    )}
                    {record.remarks && (
                      <p className="text-xs text-gray-400 mt-1">{record.remarks}</p>
                    )}
                  </div>
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
                </div>
              ))
          ) : (
            <p className="text-gray-500 text-center py-8">No attendance records yet</p>
          )}
        </div>
      </Card>
    </div>
  );
}
