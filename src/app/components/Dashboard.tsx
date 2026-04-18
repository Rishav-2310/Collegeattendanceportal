import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { Card } from "./ui/card";
import { getAttendanceStats, getDepartmentStats, getAttendanceRecords, getStudents } from "../lib/storage";
import { AttendanceRecord } from "../types";

export function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalRecords: 0,
    presentCount: 0,
    absentCount: 0,
    lateCount: 0,
    attendanceRate: 0,
    todayPresent: 0,
    todayTotal: 0,
  });
  const [deptStats, setDeptStats] = useState<Array<{ department: string; count: number }>>([]);
  const [recentRecords, setRecentRecords] = useState<AttendanceRecord[]>([]);
  
  useEffect(() => {
    setStats(getAttendanceStats());
    setDeptStats(getDepartmentStats());
    
    // Get recent attendance records
    const records = getAttendanceRecords();
    const recent = records
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
    setRecentRecords(recent);
  }, []);
  
  const statCards = [
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: Users,
      color: "bg-blue-500",
      textColor: "text-blue-700",
      bgColor: "bg-blue-50",
    },
    {
      title: "Present Today",
      value: `${stats.todayPresent}/${stats.todayTotal}`,
      icon: UserCheck,
      color: "bg-green-500",
      textColor: "text-green-700",
      bgColor: "bg-green-50",
    },
    {
      title: "Attendance Rate",
      value: `${stats.attendanceRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: "bg-purple-500",
      textColor: "text-purple-700",
      bgColor: "bg-purple-50",
    },
    {
      title: "Absent Records",
      value: stats.absentCount,
      icon: UserX,
      color: "bg-red-500",
      textColor: "text-red-700",
      bgColor: "bg-red-50",
    },
  ];
  
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome to Alta School of Technology Portal</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Department Distribution
          </h2>
          <div className="space-y-4">
            {deptStats.map((dept) => (
              <div key={dept.department}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{dept.department}</span>
                  <span className="text-sm text-gray-500">{dept.count} students</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${(dept.count / stats.totalStudents) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        {/* Recent Attendance */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Recent Attendance Activity
          </h2>
          <div className="space-y-3">
            {recentRecords.length > 0 ? (
              recentRecords.map((record) => {
                const student = getStudents().find(s => s.id === record.studentId);
                return (
                  <div
                    key={record.id}
                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {student ? `${student.firstName} ${student.lastName}` : 'Unknown Student'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(record.date).toLocaleDateString()} {record.subject && `• ${record.subject}`}
                      </p>
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
                );
              })
            ) : (
              <p className="text-gray-500 text-center py-4">No attendance records yet</p>
            )}
          </div>
        </Card>
      </div>
      
      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/attendance" className="block">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-500">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Mark Attendance</h3>
                <p className="text-sm text-gray-500">Record today's attendance</p>
              </div>
            </div>
          </Card>
        </Link>
        
        <Link to="/students" className="block">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-500">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Manage Students</h3>
                <p className="text-sm text-gray-500">View and edit student records</p>
              </div>
            </div>
          </Card>
        </Link>
        
        <Link to="/reports" className="block">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-500">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">View Reports</h3>
                <p className="text-sm text-gray-500">Analyze attendance data</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
