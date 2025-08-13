import { useState, useEffect, useMemo } from "react";
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
import { GetAllBankAccountsTransaction } from "@/Api/Api";

interface BankbookModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accounts: any[];
}

export function BankbookModal({
  open,
  onOpenChange,
  accounts,
}: BankbookModalProps) {
  const [selectedAccount, setSelectedAccount] = useState("all");
  const [bankTransactions, setBankTransactions] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState({
    from: "2025-07-01",
    to: new Date().toISOString().split("T")[0],
  });

  // Fetch transactions from API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await GetAllBankAccountsTransaction();
        setBankTransactions(response || []);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    fetchTransactions();
  }, []);

  // Filtered transactions by account and date
  const filteredTransactions = useMemo(() => {
    return bankTransactions.filter((t) => {
      const matchAccount =
        selectedAccount === "all" || t.accountId === selectedAccount;
      const date = new Date(t.date);
      const fromDate = new Date(dateRange.from);
      const toDate = new Date(dateRange.to);
      return matchAccount && date >= fromDate && date <= toDate;
    });
  }, [bankTransactions, selectedAccount, dateRange]);

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
              <Select
                value={selectedAccount}
                onValueChange={setSelectedAccount}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select Account" />
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
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, from: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateTo">To Date</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateRange.to}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, to: e.target.value }))
                }
              />
            </div>

            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Transactions Table */}
          <div className="border rounded-lg max-h-[400px] overflow-auto">
  <Table>
    <TableHeader className="sticky top-0 bg-white z-10">
      <TableRow>
        <TableHead>Date</TableHead>
        <TableHead>Description</TableHead>
        <TableHead className="text-right">Debit</TableHead>
        <TableHead className="text-right">Credit</TableHead>
        <TableHead className="text-right">Balance</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {filteredTransactions.length > 0 ? (
        filteredTransactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell>
              {new Date(transaction.date).toLocaleDateString()}
            </TableCell>
            <TableCell>{transaction.description}</TableCell>
            <TableCell className="text-right">
              {parseFloat(transaction.debit) > 0
                ? parseFloat(transaction.debit).toLocaleString()
                : "—"}
            </TableCell>
            <TableCell className="text-right">
              {parseFloat(transaction.credit) > 0
                ? parseFloat(transaction.credit).toLocaleString()
                : "—"}
            </TableCell>
            <TableCell className="text-right font-medium">
              {transaction.balance
                ? parseFloat(transaction.balance).toLocaleString()
                : "—"}
            </TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell
            colSpan={5}
            className="text-center text-muted-foreground"
          >
            No transactions found
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
</div>

          {/* Summary */}
          <div className="bg-muted p-4 rounded-lg">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Debits</p>
                <p className="text-lg font-semibold text-red-600">
                  PKR{" "}
                  {filteredTransactions
                    .reduce((sum, t) => sum + parseFloat(t.debit || 0), 0)
                    .toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Credits</p>
                <p className="text-lg font-semibold text-green-600">
                  PKR{" "}
                  {filteredTransactions
                    .reduce((sum, t) => sum + parseFloat(t.credit || 0), 0)
                    .toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Balance</p>
                <p className="text-lg font-semibold">
                  PKR{" "}
                  {filteredTransactions.length > 0 &&
                  filteredTransactions[filteredTransactions.length - 1].balance
                    ? parseFloat(
                        filteredTransactions[filteredTransactions.length - 1]
                          .balance
                      ).toLocaleString()
                    : "—"}
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
