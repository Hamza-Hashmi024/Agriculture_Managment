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
  const [attendanceRecords, setAttendanceRecords] = useState([
    { id: 1, name: "Ali Khan", department: "IT", date: "2025-09-10", status: "Present", checkIn: "09:05 AM", checkOut: "05:15 PM" },
    { id: 2, name: "Sara Ahmed", department: "Finance", date: "2025-09-10", status: "Present", checkIn: "09:20 AM", checkOut: "" },
    { id: 3, name: "Ali Khan", department: "IT", date: "2025-09-09", status: "Absent", checkIn: "", checkOut: "" },
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

  // ✅ Handle Check-In
  const handleCheckIn = (id: number) => {
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setAttendanceRecords((prev) =>
      prev.map((rec) =>
        rec.id === id ? { ...rec, checkIn: now, status: "Present" } : rec
      )
    );
  };

  // ✅ Handle Check-Out
  const handleCheckOut = (id: number) => {
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setAttendanceRecords((prev) =>
      prev.map((rec) =>
        rec.id === id ? { ...rec, checkOut: now } : rec
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
                <TableHead>Check-In</TableHead>
                <TableHead>Check-Out</TableHead>
                <TableHead>Actions</TableHead>
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
                  <TableCell>{rec.checkIn || "-"}</TableCell>
                  <TableCell>{rec.checkOut || "-"}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button size="sm" onClick={() => handleCheckIn(rec.id)} disabled={!!rec.checkIn}>
                      Check-In
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleCheckOut(rec.id)} disabled={!rec.checkIn || !!rec.checkOut}>
                      Check-Out
                    </Button>
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
