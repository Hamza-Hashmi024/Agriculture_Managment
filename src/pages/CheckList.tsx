import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

// Cheque type
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
  const [selectedCheque, setSelectedCheque] = useState<Cheque | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // TODO: Replace with real API call
    setCheques([
      { id: 1, cheque_no: "CHQ123", cheque_date: "2025-08-20", bank_name: "HBL", amount: 50000, status: "pending" },
      { id: 2, cheque_no: "CHQ456", cheque_date: "2025-08-15", bank_name: "MCB", amount: 30000, status: "cleared" },
      { id: 3, cheque_no: "CHQ789", cheque_date: "2025-08-10", bank_name: "UBL", amount: 20000, status: "bounced" },
    ]);
  }, []);

  const filteredCheques = filter === "all" ? cheques : cheques.filter(c => c.status === filter);

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
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Cheque Management</h1>

      {/* Filter */}
      <div className="flex gap-4 items-center">
        <Select onValueChange={setFilter} defaultValue="all">
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by status" />
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

      {/* Cheque List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCheques.map((cheque) => (
          <Card key={cheque.id} className="shadow-md cursor-pointer hover:shadow-lg transition"
            onClick={() => { setSelectedCheque(cheque); setOpen(true); }}>
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between items-center">
                <h2 className="font-semibold">{cheque.cheque_no}</h2>
                <Badge className={getStatusColor(cheque.status)}>{cheque.status}</Badge>
              </div>
              <p className="text-sm text-gray-600">Bank: {cheque.bank_name}</p>
              <p className="text-sm">Date: {cheque.cheque_date}</p>
              <p className="font-bold">Amount: Rs. {cheque.amount.toLocaleString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Cheque Detail Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cheque Details</DialogTitle>
          </DialogHeader>
          {selectedCheque && (
            <div className="space-y-2">
              <p><strong>Cheque No:</strong> {selectedCheque.cheque_no}</p>
              <p><strong>Date:</strong> {selectedCheque.cheque_date}</p>
              <p><strong>Bank:</strong> {selectedCheque.bank_name}</p>
              <p><strong>Amount:</strong> Rs. {selectedCheque.amount.toLocaleString()}</p>
              <p><strong>Status:</strong> {selectedCheque.status}</p>

              <div className="flex gap-2 mt-4">
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
