import { useState, useEffect } from "react";
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
import { GetALLcashboxTransaction } from "@/Api/Api";

interface CashbookModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CashbookModal({ open, onOpenChange }: CashbookModalProps) {
  const [CashTransactions, setCashTransactions] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState({
    from: "2025-07-01",
    to: new Date().toISOString().split("T")[0],
  });

  const handleExport = () => {
    console.log("Exporting cashbook data...");
  };

  useEffect(() => {
    const FetchTransaction = async () => {
      try {
        const data = await GetALLcashboxTransaction();
        if (data && data.transactions) {
          let runningBalance = parseFloat(data.opening_balance);

          // Add opening balance as first row
          const openingRow = {
            id: 0,
            date: dateRange.from,
            description: "Opening Balance",
            debit: 0,
            credit: runningBalance,
            balance: runningBalance,
          };

          const formattedTransactions = data.transactions.map(
            (t: any, index: number) => {
              const debit = parseFloat(t.debit);
              const credit = parseFloat(t.credit);
              runningBalance = runningBalance + credit - debit;

              return {
                id: index + 1,
                date: t.date,
                description: t.description,
                debit,
                credit,
                balance: runningBalance,
              };
            }
          );

          setCashTransactions([openingRow, ...formattedTransactions]);
        }
      } catch (err) {
        console.log(err);
      }
    };

    FetchTransaction();
  }, [dateRange.from]);

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
          <div className="border rounded-lg max-h-[400px] overflow-y-auto">
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
                {CashTransactions?.length > 0 ? (
                  CashTransactions.map((transaction: any, index: number) => (
                    <TableRow key={transaction.id || index}>
                      <TableCell>
                        {new Date(transaction.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell className="text-right">
                        {transaction.debit > 0
                          ? transaction.debit.toLocaleString()
                          : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        {transaction.credit > 0
                          ? transaction.credit.toLocaleString()
                          : "—"}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {transaction.balance.toLocaleString()}
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
                  {CashTransactions.reduce(
                    (sum, t) => sum + (t.debit || 0),
                    0
                  ).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Credits</p>
                <p className="text-lg font-semibold text-green-600">
                  PKR{" "}
                  {CashTransactions.reduce(
                    (sum, t) => sum + (t.credit || 0),
                    0
                  ).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Closing Balance</p>
                <p className="text-lg font-semibold">
                  PKR{" "}
                  {CashTransactions[CashTransactions.length - 1]?.balance?.toLocaleString() ||
                    "0"}
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
