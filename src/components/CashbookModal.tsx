
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CashbookModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock cashbook transactions
const mockCashTransactions = [
  {
    id: "1",
    date: "2025-07-01",
    description: "Opening Balance",
    debit: 0,
    credit: 200000,
    balance: 200000
  },
  {
    id: "2",
    date: "2025-07-02",
    description: "Advance to Akbar",
    debit: 20000,
    credit: 0,
    balance: 180000
  },
  {
    id: "3",
    date: "2025-07-04",
    description: "Sale Deposit",
    debit: 0,
    credit: 50000,
    balance: 230000
  },
  {
    id: "4",
    date: "2025-07-05",
    description: "Transfer to Bank",
    debit: 30000,
    credit: 0,
    balance: 200000
  },
  {
    id: "5",
    date: "2025-07-07",
    description: "Office Rent",
    debit: 10000,
    credit: 0,
    balance: 190000
  },
  {
    id: "6",
    date: "2025-07-09",
    description: "Salary Payment",
    debit: 20000,
    credit: 0,
    balance: 170000
  }
];

export function CashbookModal({ open, onOpenChange }: CashbookModalProps) {
  const [dateRange, setDateRange] = useState({
    from: "2025-07-01",
    to: new Date().toISOString().split('T')[0]
  });

  const handleExport = () => {
    console.log("Exporting cashbook data...");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Cashbook - All Cash Transactions</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Date Range Filter */}
          <div className="flex gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="dateFrom">From Date</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateTo">To Date</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
              />
            </div>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Transactions Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Debit</TableHead>
                  <TableHead className="text-right">Credit</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockCashTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell className="text-right">
                      {transaction.debit > 0 ? transaction.debit.toLocaleString() : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      {transaction.credit > 0 ? transaction.credit.toLocaleString() : "—"}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {transaction.balance.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Summary */}
          <div className="bg-muted p-4 rounded-lg">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Debits</p>
                <p className="text-lg font-semibold text-red-600">
                  PKR {mockCashTransactions.reduce((sum, t) => sum + t.debit, 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Credits</p>
                <p className="text-lg font-semibold text-green-600">
                  PKR {mockCashTransactions.reduce((sum, t) => sum + t.credit, 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Closing Balance</p>
                <p className="text-lg font-semibold">
                  PKR {mockCashTransactions[mockCashTransactions.length - 1]?.balance.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
