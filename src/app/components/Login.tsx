import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { GraduationCap, LogIn } from "lucide-react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const success = login(email, password);
    if (success) {
      navigate("/");
    } else {
      setError("Invalid email or password");
    }
  };

  const quickLogin = (role: "admin" | "faculty" | "student") => {
    let email = "";
    let password = "";

    switch (role) {
      case "admin":
        email = "admin@alta.edu";
        password = "admin123";
        break;
      case "faculty":
        email = "faculty@alta.edu";
        password = "faculty123";
        break;
      case "student":
        email = "emily.johnson@alta.edu";
        password = "student123";
        break;
    }

    setEmail(email);
    setPassword(password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Alta School</h1>
          <p className="text-gray-600">of Technology</p>
          <p className="text-sm text-gray-500 mt-2">Attendance Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@alta.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" size="lg">
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center mb-3">Demo Accounts - Quick Login:</p>
          <div className="grid grid-cols-3 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => quickLogin("admin")}
              className="text-xs"
            >
              Admin
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => quickLogin("faculty")}
              className="text-xs"
            >
              Faculty
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => quickLogin("student")}
              className="text-xs"
            >
              Student
            </Button>
          </div>
          <div className="mt-3 space-y-1 text-xs text-gray-500">
            <p>Admin: admin@alta.edu / admin123</p>
            <p>Faculty: faculty@alta.edu / faculty123</p>
            <p>Student: Any student email / student123</p>
            <p className="text-xs text-gray-400 mt-2">
              All students can login using their email with password: student123
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
