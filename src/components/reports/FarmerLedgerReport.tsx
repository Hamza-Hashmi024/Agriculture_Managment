import { useState, useEffect } from "react";
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
import { exportData } from "@/Globle/exportUtils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Printer } from "lucide-react";
import { GetAllFarmer, GetFarmerLedgerReport } from "@/Api/Api";

interface FarmerLedgerReportProps {
  dateRange?: { from: string; to: string };
}

export function FarmerLedgerReport({ dateRange }: FarmerLedgerReportProps) {
  const [selectedFarmer, setSelectedFarmer] = useState<string>("");
  const [farmers, setFarmers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isGenerated, setIsGenerated] = useState(false);
  const [selectedFrom, setSelectedFrom] = useState(dateRange?.from || "");
  const [selectedTo, setSelectedTo] = useState(dateRange?.to || "");

  // Fetch all farmers
  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const response = await GetAllFarmer();
        setFarmers(response);
      } catch (error) {
        console.error("Error fetching farmers:", error);
      }
    };
    fetchFarmers();
  }, []);

  // Generate report
  const handleGenerate = async () => {
    if (!selectedFarmer || !selectedFrom || !selectedTo) return;

    try {
      const data = await GetFarmerLedgerReport(selectedFarmer, selectedFrom, selectedTo);
      setTransactions(data);
      setIsGenerated(true);
    } catch (error) {
      console.error("Error fetching farmer ledger:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Farmer Ledger Report</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Select Farmer</Label>
            <Select value={selectedFarmer} onValueChange={setSelectedFarmer}>
              <SelectTrigger>
                <SelectValue placeholder="Choose farmer" />
              </SelectTrigger>
              <SelectContent>
                {farmers.map((farmer) => (
                  <SelectItem key={farmer.id} value={farmer.id}>
                    {farmer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>From</Label>
            <input
              type="date"
              value={selectedFrom}
              onChange={(e) => setSelectedFrom(e.target.value)}
              className="border rounded px-2 py-1 w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>To</Label>
            <input
              type="date"
              value={selectedTo}
              onChange={(e) => setSelectedTo(e.target.value)}
              className="border rounded px-2 py-1 w-full"
            />
          </div>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={!selectedFarmer || !selectedFrom || !selectedTo}
        >
          Generate Report
        </Button>

        {/* Ledger Table */}
        {isGenerated && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                Ledger for: {farmers.find((f) => f.id === selectedFarmer)?.name}
              </h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    exportData({
                      fileType: "pdf",
                      fileName: `FarmerLedger_${selectedFarmer}.pdf`,
                      headers: ["Date", "Type", "Ref", "Debit", "Credit", "Balance", "Notes"],
                      rows: transactions.map((t) => [
                        new Date(t.date).toLocaleDateString(),
                        t.type,
                        t.ref,
                        t.debit || 0,
                        t.credit || 0,
                        t.balance || 0,
                        t.notes || "",
                      ]),
                    })
                  }
                >
                  <Download className="h-4 w-4 mr-2" /> Export PDF
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    exportData({
                      fileType: "csv",
                      fileName: `FarmerLedger_${selectedFarmer}.csv`,
                      headers: ["Date", "Type", "Ref", "Debit", "Credit", "Balance", "Notes"],
                      rows: transactions.map((t) => [
                        new Date(t.date).toLocaleDateString(),
                        t.type,
                        t.ref,
                        t.debit || 0,
                        t.credit || 0,
                        t.balance || 0,
                        t.notes || "",
                      ]),
                    })
                  }
                >
                  <Download className="h-4 w-4 mr-2" /> Export XLSX
                </Button>

                <Button variant="outline" size="sm" onClick={() => window.print()}>
                  <Printer className="h-4 w-4 mr-2" /> Print
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
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.ref}>
                      <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                      <TableCell>{transaction.type}</TableCell>
                      <TableCell>{transaction.ref}</TableCell>
                      <TableCell className="text-right">
                        {transaction.debit?.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }) || "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        {transaction.credit?.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }) || "—"}
                      </TableCell>
                      <TableCell
                        className={`text-right font-medium ${
                          transaction.balance < 0 ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {transaction.balance?.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }) || 0}
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
