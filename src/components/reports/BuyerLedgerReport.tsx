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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Printer } from "lucide-react";
import { GetBuyersledger, GetAllBuyers } from "@/Api/Api"; // <-- Add GetAllBuyers to fetch buyer list

interface BuyerLedgerReportProps {
  dateRange: { from: string; to: string };
}

export function BuyerLedgerReport({ dateRange }: BuyerLedgerReportProps) {
  const [selectedBuyer, setSelectedBuyer] = useState<string>("");
  const [isGenerated, setIsGenerated] = useState(false);
  const [buyers, setBuyers] = useState<{ id: string; name: string }[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  // Fetch all buyers for dropdown
  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        const res = await GetAllBuyers();
        setBuyers(res); // Ensure API returns [{id, name}, ...]
      } catch (error) {
        console.log("Error fetching buyers:", error);
      }
    };
    fetchBuyers();
  }, []);

  // Fetch ledger when a buyer is selected
  useEffect(() => {
    if (!selectedBuyer) return;
    const fetchBuyersLedger = async () => {
      try {
        const response = await GetBuyersledger(selectedBuyer);
        setTransactions(response); // Ensure API returns transaction array
      } catch (error) {
        console.log("Error fetching ledger:", error);
      }
    };
    fetchBuyersLedger();
  }, [selectedBuyer]);

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
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Select Buyer</Label>
            <Select value={selectedBuyer} onValueChange={setSelectedBuyer}>
              <SelectTrigger>
                <SelectValue placeholder="Choose buyer" />
              </SelectTrigger>
              <SelectContent>
                {buyers.map((buyer) => (
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
              {new Date(dateRange.from).toLocaleDateString()} -{" "}
              {new Date(dateRange.to).toLocaleDateString()}
            </div>
          </div>
        </div>

        <Button onClick={handleGenerate} disabled={!selectedBuyer}>
          Generate Report
        </Button>

        {/* Ledger Table */}
        {isGenerated && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                Ledger for: {buyers.find((b) => b.id === selectedBuyer)?.name}
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
                  {transactions.length > 0 ? (
                    transactions.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell>
                          {new Date(t.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{t.type}</TableCell>
                        <TableCell>{t.ref}</TableCell>
                        <TableCell className="text-right">
                          {t.debit > 0 ? t.debit.toLocaleString() : "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          {t.credit > 0 ? t.credit.toLocaleString() : "—"}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {t.balance.toLocaleString()}
                        </TableCell>
                        <TableCell>{t.notes}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}