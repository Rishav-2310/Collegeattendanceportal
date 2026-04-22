import { useEffect, useState } from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import { getFaculty, addFaculty, updateFaculty, deleteFaculty } from "../lib/storage";
import { Faculty } from "../types";
import { toast } from "sonner";

export function FacultyManagement() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    loadFaculty();
  }, []);

  const loadFaculty = () => {
    setFaculty(getFaculty());
  };

  const filteredFaculty = faculty.filter((member) => {
    const matchesSearch =
      member.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartment =
      departmentFilter === "all" || member.department === departmentFilter;

    return matchesSearch && matchesDepartment;
  });

  const departments = Array.from(new Set(faculty.map((f) => f.department)));

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      deleteFaculty(id);
      toast.success("Faculty member deleted successfully");
      loadFaculty();
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Faculty Management</h1>
          <p className="text-gray-500 mt-1">Manage faculty members and their information</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Faculty
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Faculty Member</DialogTitle>
              <DialogDescription>
                Fill in the form below to add a new faculty member to the system.
              </DialogDescription>
            </DialogHeader>
            <FacultyForm
              onSuccess={() => {
                setIsAddDialogOpen(false);
                loadFaculty();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
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
      </Card>

      {/* Faculty Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Designation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFaculty.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {member.firstName} {member.lastName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {member.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {member.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {member.designation}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {member.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingFaculty(member);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleDelete(member.id, `${member.firstName} ${member.lastName}`)
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredFaculty.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No faculty members found</p>
            </div>
          )}
        </div>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Faculty Member</DialogTitle>
            <DialogDescription>
              Update the faculty member information below.
            </DialogDescription>
          </DialogHeader>
          <FacultyForm
            faculty={editingFaculty}
            onSuccess={() => {
              setIsEditDialogOpen(false);
              setEditingFaculty(null);
              loadFaculty();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FacultyForm({
  faculty,
  onSuccess,
}: {
  faculty?: Faculty | null;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    firstName: faculty?.firstName || "",
    lastName: faculty?.lastName || "",
    email: faculty?.email || "",
    phone: faculty?.phone || "",
    department: faculty?.department || "",
    designation: faculty?.designation || "",
    dateOfJoining: faculty?.dateOfJoining || new Date().toISOString().split("T")[0],
    password: faculty?.password || "faculty123",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (faculty) {
      updateFaculty(faculty.id, formData);
      toast.success("Faculty member updated successfully");
    } else {
      addFaculty(formData);
      toast.success("Faculty member added successfully");
    }

    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            required
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            required
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          required
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="department">Department</Label>
        <Select
          value={formData.department}
          onValueChange={(value) => setFormData({ ...formData, department: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Computer Science">Computer Science</SelectItem>
            <SelectItem value="Electronics">Electronics</SelectItem>
            <SelectItem value="Mechanical">Mechanical</SelectItem>
            <SelectItem value="Civil">Civil</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="designation">Designation</Label>
        <Select
          value={formData.designation}
          onValueChange={(value) => setFormData({ ...formData, designation: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select designation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Professor">Professor</SelectItem>
            <SelectItem value="Associate Professor">Associate Professor</SelectItem>
            <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
            <SelectItem value="Lecturer">Lecturer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="dateOfJoining">Date of Joining</Label>
        <Input
          id="dateOfJoining"
          type="date"
          required
          value={formData.dateOfJoining}
          onChange={(e) => setFormData({ ...formData, dateOfJoining: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="text"
          required
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <p className="text-xs text-gray-500 mt-1">
          Default password: faculty123 (can be customized)
        </p>
      </div>

      <DialogFooter>
        <Button type="submit">{faculty ? "Update" : "Add"} Faculty Member</Button>
      </DialogFooter>
    </form>
  );
}
