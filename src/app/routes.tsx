import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./components/Layout";
import { FacultyLayout } from "./components/FacultyLayout";
import { StudentLayout } from "./components/StudentLayout";
import { Login } from "./components/Login";
import { Dashboard } from "./components/Dashboard";
import { StudentDashboard } from "./components/StudentDashboard";
import { Students } from "./components/Students";
import { FacultyManagement } from "./components/FacultyManagement";
import { StudentProfile } from "./components/StudentProfile";
import { Attendance } from "./components/Attendance";
import { Reports } from "./components/Reports";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { getCurrentUser } from "./lib/auth";

function RoleBasedRedirect() {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to="/" replace />;
}

function RoleBasedLayout() {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case "admin":
      return <Layout />;
    case "faculty":
      return <FacultyLayout />;
    case "student":
      return <StudentLayout />;
    default:
      return <Navigate to="/login" replace />;
  }
}

function RoleBasedDashboard() {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "student") {
    return <StudentDashboard />;
  }

  return <Dashboard />;
}

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    Component: RoleBasedLayout,
    children: [
      {
        index: true,
        Component: RoleBasedDashboard
      },
      {
        path: "students",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <Students />
          </ProtectedRoute>
        ),
      },
      {
        path: "students/:id",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <StudentProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "faculty",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <FacultyManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "attendance",
        element: (
          <ProtectedRoute allowedRoles={["admin", "faculty"]}>
            <Attendance />
          </ProtectedRoute>
        ),
      },
      {
        path: "reports",
        element: (
          <ProtectedRoute allowedRoles={["admin", "faculty"]}>
            <Reports />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentProfile />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "*",
    Component: RoleBasedRedirect,
  },
]);
