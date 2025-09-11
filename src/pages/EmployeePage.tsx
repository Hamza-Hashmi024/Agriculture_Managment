import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search, Download, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// ✅ Mock Employers Data
const mockEmployees = [
  {
    id: 1,
    name: "John Doe",
    employeeId: "EMP-001",
    department: "HR",
    contacts: ["+1 234 567 890"],
    status: "Active",
    salary: "$4000",
  },
  {
    id: 2,
    name: "Jane Smith",
    employeeId: "EMP-002",
    department: "Finance",
    contacts: ["+1 987 654 321"],
    status: "Inactive",
    salary: "$3500",
  },
  {
    id: 3,
    name: "Ali Khan",
    employeeId: "EMP-003",
    department: "IT",
    contacts: ["+92 300 1234567", "+92 333 7654321"],
    status: "Active",
    salary: "$5000",
  },
];

export function EmployeePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [employees, setEmployees] = useState(mockEmployees);

  // ✅ Export to CSV
  const handleExport = () => {
    if (employees.length === 0) {
      alert("No employees available to export.");
      return;
    }

    const headers = ["Employee Name", "Employee ID", "Department", "Contacts", "Status", "Salary"];
    const rows = employees.map((emp) => [
      emp.name,
      emp.employeeId,
      emp.department,
      (emp.contacts || []).join(", "),
      emp.status,
      emp.salary,
    ]);

    const csvContent = [
      headers.join(","), // header row
      ...rows.map((row) => row.map((value) => `"${value}"`).join(",")), // data rows
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "employees.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Employers</h1>
          <p className="text-muted-foreground">
            Manage employer profiles and information
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button asChild>
            <Link to="/employees/add">
              <Plus className="h-4 w-4 mr-2" />
              Add New Employer
            </Link>
          </Button>
               <Button asChild>
            <Link to="/attendance">
              <Plus className="h-4 w-4 mr-2" />
              Mark Attendance
            </Link>
          </Button>
        </div>
      </div>

      {/* Search + Filter */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by employee name, ID, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Employers</SelectItem>
                <SelectItem value="department">By Department</SelectItem>
                <SelectItem value="id">By Employee ID</SelectItem>
                <SelectItem value="status">By Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employees List ({employees.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee Name</TableHead>
                <TableHead>Employee ID</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Contacts</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No employees found.
                  </TableCell>
                </TableRow>
              ) : (
                employees.map((emp) => (
                  <TableRow key={emp.id}>
                    <TableCell>
                      <Link
                        to={`/employees/${emp.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {emp.name}
                      </Link>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {emp.employeeId}
                    </TableCell>
                    <TableCell>{emp.department}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {(emp.contacts || []).map((contact, index) => (
                          <span key={index} className="text-sm">
                            {contact}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={emp.status === "Active" ? "default" : "secondary"}
                      >
                        {emp.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{emp.salary}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/employees/${emp.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
