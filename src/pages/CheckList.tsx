import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Cheque {
  id: number;
  cheque_no: string;
  cheque_date: string;
  bank_name: string;
  amount: number;
  status: "pending" | "cleared" | "bounced" | "outstanding";
}

const ChequePage: React.FC = () => {
  const [cheques, setCheques] = useState<Cheque[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>(""); 
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [selectedCheque, setSelectedCheque] = useState<Cheque | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setCheques([
      { id: 1, cheque_no: "CHQ123", cheque_date: "2025-08-20", bank_name: "HBL", amount: 50000, status: "pending" },
      { id: 2, cheque_no: "CHQ456", cheque_date: "2025-08-15", bank_name: "MCB", amount: 30000, status: "cleared" },
      { id: 3, cheque_no: "CHQ789", cheque_date: "2025-08-10", bank_name: "UBL", amount: 20000, status: "bounced" },
      { id: 4, cheque_no: "CHQ999", cheque_date: "2025-08-22", bank_name: "HBL", amount: 70000, status: "outstanding" },
    ]);
  }, []);

  // ✅ Filtering logic
  const filteredCheques = cheques.filter((c) => {
    const matchesStatus = filter === "all" || c.status === filter;
    const matchesSearch =
      c.bank_name.toLowerCase().includes(search.toLowerCase()) ||
      c.cheque_no.toLowerCase().includes(search.toLowerCase()) ||
      c.status.toLowerCase().includes(search.toLowerCase());

    const matchesDate =
      (!dateFrom || new Date(c.cheque_date) >= new Date(dateFrom)) &&
      (!dateTo || new Date(c.cheque_date) <= new Date(dateTo));

    return matchesStatus && matchesSearch && matchesDate;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-200 text-yellow-800";
      case "cleared": return "bg-green-200 text-green-800";
      case "bounced": return "bg-red-200 text-red-800";
      case "outstanding": return "bg-blue-200 text-blue-800";
      default: return "";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Cheque Management</CardTitle>
        <p className="text-muted-foreground">Manage, track and update all your cheques in one place.</p>
      </CardHeader>

     {/* Filter & Search */}
<Card className="shadow-sm border rounded-xl">
  <CardHeader>
    <CardTitle className="text-xl font-semibold">Filters</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      
      {/* Status Filter */}
      <div className="space-y-2">
        <Label>Status</Label>
        <Select onValueChange={setFilter} defaultValue="all">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="cleared">Cleared</SelectItem>
            <SelectItem value="bounced">Bounced</SelectItem>
            <SelectItem value="outstanding">Outstanding</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Search by Bank, Cheque No, Status */}
      <div className="space-y-2">
        <Label>Search</Label>
        <Input
          type="text"
          placeholder="Bank, Cheque No, or Status"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Date From */}
      <div className="space-y-2">
        <Label>Date From</Label>
        <Input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Date To */}
      <div className="space-y-2">
        <Label>Date To</Label>
        <Input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="w-full"
        />
      </div>
    </div>
  </CardContent>
</Card>

      {/* Table */}
      <Card className="shadow-sm border rounded-xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Cheque List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Cheque No</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Bank</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCheques.map((cheque) => (
                  <TableRow key={cheque.id} className="hover:bg-gray-50">
                    <TableCell>{cheque.id}</TableCell>
                    <TableCell>{cheque.cheque_no}</TableCell>
                    <TableCell>{cheque.cheque_date}</TableCell>
                    <TableCell>{cheque.bank_name}</TableCell>
                    <TableCell>Rs. {cheque.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(cheque.status)}>
                        {cheque.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        onClick={() => { setSelectedCheque(cheque); setOpen(true); }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredCheques.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-500">
                      No cheques found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Cheque Detail Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Cheque Details</DialogTitle>
          </DialogHeader>
          {selectedCheque && (
            <div className="space-y-3">
              <p><strong>Cheque No:</strong> {selectedCheque.cheque_no}</p>
              <p><strong>Date:</strong> {selectedCheque.cheque_date}</p>
              <p><strong>Bank:</strong> {selectedCheque.bank_name}</p>
              <p><strong>Amount:</strong> Rs. {selectedCheque.amount.toLocaleString()}</p>
              <p><strong>Status:</strong> {selectedCheque.status}</p>

              <div className="flex gap-3 mt-4">
                <Button variant="outline">Mark as Cleared</Button>
                <Button variant="destructive">Mark as Bounced</Button>
                <Button>Mark as Outstanding</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChequePage;

