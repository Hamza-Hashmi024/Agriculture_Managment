
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { Download, Printer } from "lucide-react";

interface BuyerLedgerReportProps {
  dateRange: { from: string; to: string };
}

const mockBuyers = [
  { id: "1", name: "Pak Foods Ltd" },
  { id: "2", name: "Noor Traders" },
  { id: "3", name: "Al-Rehman Mills" },
];

const mockTransactions = [
  {
    id: "1",
    date: "2025-07-12",
    type: "Invoice",
    ref: "#INV123",
    debit: 100000,
    credit: 0,
    balance: 100000,
    notes: "Wheat purchase"
  },
  {
    id: "2",
    date: "2025-07-14",
    type: "Payment",
    ref: "#PAY123",
    debit: 0,
    credit: 60000,
    balance: 40000,
    notes: "Bank transfer"
  },
];

export function BuyerLedgerReport({ dateRange }: BuyerLedgerReportProps) {
  const [selectedBuyer, setSelectedBuyer] = useState<string>("");
  const [isGenerated, setIsGenerated] = useState(false);

  const handleGenerate = () => {
    if (selectedBuyer) {
      setIsGenerated(true);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Buyer Ledger Report</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Select Buyer</Label>
            <Select value={selectedBuyer} onValueChange={setSelectedBuyer}>
              <SelectTrigger>
                <SelectValue placeholder="Choose buyer" />
              </SelectTrigger>
              <SelectContent>
                {mockBuyers.map((buyer) => (
                  <SelectItem key={buyer.id} value={buyer.id}>
                    {buyer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Date Range</Label>
            <div className="text-sm text-muted-foreground">
              {new Date(dateRange.from).toLocaleDateString()} - {new Date(dateRange.to).toLocaleDateString()}
            </div>
          </div>
        </div>

        <Button onClick={handleGenerate} disabled={!selectedBuyer}>
          Generate Report
        </Button>

        {isGenerated && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                Ledger for: {mockBuyers.find(b => b.id === selectedBuyer)?.name}
              </h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export XLSX
                </Button>
                <Button variant="outline" size="sm">
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
              </div>
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Ref</TableHead>
                    <TableHead className="text-right">Debit</TableHead>
                    <TableHead className="text-right">Credit</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                      <TableCell>{transaction.type}</TableCell>
                      <TableCell>{transaction.ref}</TableCell>
                      <TableCell className="text-right">
                        {transaction.debit > 0 ? transaction.debit.toLocaleString() : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        {transaction.credit > 0 ? transaction.credit.toLocaleString() : "—"}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {transaction.balance.toLocaleString()}
                      </TableCell>
                      <TableCell>{transaction.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
