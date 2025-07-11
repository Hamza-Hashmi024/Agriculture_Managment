
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

interface FarmerLedgerReportProps {
  dateRange: { from: string; to: string };
}

const mockFarmers = [
  { id: "1", name: "Akbar Ali" },
  { id: "2", name: "Rafiq Ahmad" },
  { id: "3", name: "Muhammad Hassan" },
];

const mockTransactions = [
  {
    id: "1",
    date: "2025-07-01",
    type: "Advance",
    ref: "#A123",
    debit: 50000,
    credit: 0,
    balance: -50000,
    notes: "Cash advance"
  },
  {
    id: "2",
    date: "2025-07-12",
    type: "Sale/Lot",
    ref: "#23",
    debit: 0,
    credit: 461500,
    balance: 411500,
    notes: "Wheat crop sale"
  },
  {
    id: "3",
    date: "2025-07-14",
    type: "Payment",
    ref: "#P14",
    debit: 200000,
    credit: 0,
    balance: 211500,
    notes: "Cheque payment"
  },
];

export function FarmerLedgerReport({ dateRange }: FarmerLedgerReportProps) {
  const [selectedFarmer, setSelectedFarmer] = useState<string>("");
  const [isGenerated, setIsGenerated] = useState(false);

  const handleGenerate = () => {
    if (selectedFarmer) {
      setIsGenerated(true);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Farmer Ledger Report</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Select Farmer</Label>
            <Select value={selectedFarmer} onValueChange={setSelectedFarmer}>
              <SelectTrigger>
                <SelectValue placeholder="Choose farmer" />
              </SelectTrigger>
              <SelectContent>
                {mockFarmers.map((farmer) => (
                  <SelectItem key={farmer.id} value={farmer.id}>
                    {farmer.name}
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

        <Button onClick={handleGenerate} disabled={!selectedFarmer}>
          Generate Report
        </Button>

        {isGenerated && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                Ledger for: {mockFarmers.find(f => f.id === selectedFarmer)?.name}
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
                      <TableCell className={`text-right font-medium ${transaction.balance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {transaction.balance.toLocaleString()}
                      </TableCell>
                      <TableCell>{transaction.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">Total Debits</p>
                  <p className="text-lg font-semibold text-red-600">
                    PKR {mockTransactions.reduce((sum, t) => sum + t.debit, 0).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Credits</p>
                  <p className="text-lg font-semibold text-green-600">
                    PKR {mockTransactions.reduce((sum, t) => sum + t.credit, 0).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Final Balance</p>
                  <p className={`text-lg font-semibold ${mockTransactions[mockTransactions.length - 1]?.balance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    PKR {mockTransactions[mockTransactions.length - 1]?.balance.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
