import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Printer } from "lucide-react";
import { Input } from "@/components/ui/input"; 
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function EmployeeProfile() {
  const mockEmployees = [
    {
      id: "1",
      name: "Ali Khan",
      employeeId: "EMP001",
      department: "IT",
      cnic: "35201-1234567-1",
      address: "House #12, Model Town, Lahore",
      contacts: ["0321-1234567", "042-12345678"],
      salary: "120,000 PKR",
      status: "Active",
      profilePhoto: "https://randomuser.me/api/portraits/men/32.jpg",
      bankAccounts: [
        { bankName: "HBL", accountNo: "1234567890", iban: "PK36HBL0000001234567890" },
      ],
      wallets: [{ provider: "JazzCash", number: "0301-9876543" }],
      advances: [
        { amount: 20000, date: "2025-09-01", status: "Pending" },
        { amount: 10000, date: "2025-08-10", status: "Cleared" },
      ],
      attendance: [
        { date: "2025-09-01", status: "Present" },
        { date: "2025-09-02", status: "Absent" },
        { date: "2025-09-03", status: "Leave" },
      ],
    },
    {
      id: "2",
      name: "Sara Ahmed",
      employeeId: "EMP002",
      department: "Finance",
      cnic: "61101-9876543-2",
      address: "Street 45, F-8 Islamabad",
      contacts: ["0333-4567890"],
      salary: "95,000 PKR",
      status: "Inactive",
      profilePhoto: "https://randomuser.me/api/portraits/women/44.jpg",
      bankAccounts: [],
      wallets: [],
      advances: [],
      attendance: [],
    },
  ];

  const { id } = useParams<{ id: string }>();
  const employee = mockEmployees.find((emp) => emp.id === id);

  const navigate = useNavigate();

  const [advances] = useState(employee?.advances || []);
  const [attendance] = useState(employee?.attendance || []);
    // ✅ Attendance filter states
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // ✅ Filtered Attendance
  const filteredAttendance = attendance.filter((att) => {
    if (!fromDate && !toDate) return true;
    const attDate = new Date(att.date);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    if (from && attDate < from) return false;
    if (to && attDate > to) return false;
    return true;
  });

  if (!employee) {
    return (
      <div className="p-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/employees")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Employees
        </Button>
        <p className="text-red-500 mt-4">Employee not found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center print:hidden">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate("/employees")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{employee.name}</h1>
            <p className="text-muted-foreground">Employee Profile & Management</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/employees/edit/${employee.id}`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      {/* Always Visible Overview Card */}
      <Card className="space-y-6">
        <CardHeader className="flex flex-col md:flex-row gap-6 items-center">
          <img
            src={employee.profilePhoto}
            alt={employee.name}
            className="w-32 h-32 rounded-full border object-cover shadow-md"
          />
          <div>
            <CardTitle className="text-2xl">{employee.name}</CardTitle>
            <p className="text-muted-foreground">ID: {employee.employeeId}</p>
            <p className="mt-2">
              <strong>Status:</strong>{" "}
              <Badge variant={employee.status === "Active" ? "default" : "secondary"}>
                {employee.status}
              </Badge>
            </p>
          </div>
        </CardHeader>

        <CardContent className="grid gap-4 text-sm">

          {/* Employee Basic Info */}
          <div>
            <h3 className="text-base font-semibold mb-2">Employee Information</h3>
            <p><strong>Department:</strong> {employee.department}</p>
            <p><strong>CNIC:</strong> {employee.cnic}</p>
            <p><strong>Address:</strong> {employee.address}</p>
            <p><strong>Contacts:</strong> {employee.contacts.join(", ")}</p>
            <p><strong>Salary:</strong> {employee.salary}</p>
          </div>

          {/* Bank Accounts */}
          <div>
            <h3 className="text-base font-semibold mb-2">Bank Accounts</h3>
            {employee.bankAccounts.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Bank</TableHead>
                    <TableHead>Account No</TableHead>
                    <TableHead>IBAN</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employee.bankAccounts.map((b, idx) => (
                    <TableRow key={idx} className="hover:bg-muted/40 transition-colors">
                      <TableCell>{b.bankName}</TableCell>
                      <TableCell>{b.accountNo}</TableCell>
                      <TableCell>{b.iban}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground">No bank account added.</p>
            )}
          </div>

          {/* Mobile Wallets */}
          <div>
            <h3 className="text-base font-semibold mb-2">Mobile Wallets</h3>
            {employee.wallets.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Provider</TableHead>
                    <TableHead>Wallet Number</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employee.wallets.map((w, idx) => (
                    <TableRow key={idx} className="hover:bg-muted/40 transition-colors">
                      <TableCell>{w.provider}</TableCell>
                      <TableCell>{w.number}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground">No wallet linked.</p>
            )}
          </div>

        </CardContent>
      </Card>

      {/* Tabs below the Overview Card */}
      <Tabs defaultValue="advances" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full md:w-auto">
          <TabsTrigger value="advances">Salary Advances</TabsTrigger>
          <TabsTrigger value="adjustments">Adjustments</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
        </TabsList>

        {/* Salary Advances */}
        <TabsContent value="advances">
          <Card>
            <CardHeader>
              <CardTitle>Salary Advances</CardTitle>
            </CardHeader>
            <CardContent>
              {advances.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {advances.map((a, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{a.date}</TableCell>
                        <TableCell>{a.amount} PKR</TableCell>
                        <TableCell>{a.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">No advances recorded.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Adjustments */}
        <TabsContent value="adjustments">
          <Card>
            <CardHeader>
              <CardTitle>Adjustments / Payroll</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Month</TableHead>
                    <TableHead>Deduction</TableHead>
                    <TableHead>Bonus</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>August 2025</TableCell>
                    <TableCell>5,000 PKR</TableCell>
                    <TableCell>2,000 PKR</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>July 2025</TableCell>
                    <TableCell>0 PKR</TableCell>
                    <TableCell>3,000 PKR</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attendance */}
        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Record</CardTitle>
                {/* ✅ Filter Inputs */}
              <div className="flex gap-4 mb-4">
                <div>
                  <label className="block text-sm mb-1">From</label>
                  <Input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">To</label>
                  <Input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {attendance.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendance.map((att, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{att.date}</TableCell>
                        <TableCell>{att.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">No attendance records found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
