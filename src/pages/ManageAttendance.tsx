import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function ManageAttendance() {
  // ✅ Dummy Employee Attendance Data
  const [attendanceRecords, setAttendanceRecords] = useState([
    { id: 1, name: "Ali Khan", department: "IT", date: "2025-09-01", status: "Present" },
    { id: 2, name: "Ali Khan", department: "IT", date: "2025-09-02", status: "Absent" },
    { id: 3, name: "Sara Ahmed", department: "Finance", date: "2025-09-01", status: "Leave" },
    { id: 4, name: "Sara Ahmed", department: "Finance", date: "2025-09-02", status: "Present" },
  ]);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // ✅ Filter by date range
  const filteredRecords = attendanceRecords.filter((rec) => {
    if (!fromDate && !toDate) return true;
    const recDate = new Date(rec.date);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;
    if (from && recDate < from) return false;
    if (to && recDate > to) return false;
    return true;
  });

  // ✅ Handle status update
  const handleStatusChange = (id: number, newStatus: string) => {
    setAttendanceRecords((prev) =>
      prev.map((rec) =>
        rec.id === id ? { ...rec, status: newStatus } : rec
      )
    );
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manage Employee Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-4 mb-4">
            <div>
              <label className="block text-sm mb-1">From</label>
              <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm mb-1">To</label>
              <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
            </div>
            <Button
              variant="outline"
              className="self-end"
              onClick={() => {
                setFromDate("");
                setToDate("");
              }}
            >
              Reset
            </Button>
          </div>

          {/* Attendance Table */}
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((rec) => (
                <TableRow key={rec.id}>
                  <TableCell>{rec.name}</TableCell>
                  <TableCell>{rec.department}</TableCell>
                  <TableCell>{rec.date}</TableCell>
                  <TableCell>
                    <Select
                      value={rec.status}
                      onValueChange={(value) => handleStatusChange(rec.id, value)}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Present">Present</SelectItem>
                        <SelectItem value="Absent">Absent</SelectItem>
                        <SelectItem value="Leave">Leave</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}