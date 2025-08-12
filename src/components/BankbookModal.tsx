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

interface BankbookModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accounts: any[];
}

// Mock bank transactions
const mockBankTransactions = [
  {
    id: "1",
    date: "2025-07-01",
    description: "Opening Balance",
    debit: 0,
    credit: 300000,
    balance: 300000,
    accountId: "all"
  },
  {
    id: "2",
    date: "2025-07-03",
    description: "Transfer from Cash",
    debit: 0,
    credit: 30000,
    balance: 330000,
    accountId: "1"
  },
  {
    id: "3",
    date: "2025-07-04",
    description: "Advance Payment",
    debit: 10000,
    credit: 0,
    balance: 320000,
    accountId: "1"
  },
  {
    id: "4",
    date: "2025-07-05",
    description: "Buyer Payment",
    debit: 0,
    credit: 80000,
    balance: 400000,
    accountId: "2"
  },
  {
    id: "5",
    date: "2025-07-08",
    description: "Vendor Payment",
    debit: 25000,
    credit: 0,
    balance: 375000,
    accountId: "1"
  }
];

export function BankbookModal({ open, onOpenChange, accounts }: BankbookModalProps) {
  const [selectedAccount, setSelectedAccount] = useState("all");
  const [dateRange, setDateRange] = useState({
    from: "2025-07-01",
    to: new Date().toISOString().split('T')[0]
  });

  const filteredTransactions = selectedAccount === "all" 
    ? mockBankTransactions 
    : mockBankTransactions.filter(t => t.accountId === selectedAccount || t.accountId === "all");

  const handleExport = () => {
    console.log("Exporting bankbook data for account:", selectedAccount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Bankbook - Bank Transactions</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="accountSelect">Select Account</Label>
              <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Bank Accounts</SelectItem>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
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
                {filteredTransactions.map((transaction) => (
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
                  PKR {filteredTransactions.reduce((sum, t) => sum + t.debit, 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Credits</p>
                <p className="text-lg font-semibold text-green-600">
                  PKR {filteredTransactions.reduce((sum, t) => sum + t.credit, 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Balance</p>
                <p className="text-lg font-semibold">
                  PKR {filteredTransactions[filteredTransactions.length - 1]?.balance.toLocaleString()}
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
