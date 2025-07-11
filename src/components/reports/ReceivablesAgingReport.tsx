
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Printer, Eye } from "lucide-react";

interface ReceivablesAgingReportProps {
  dateRange: { from: string; to: string };
}

const mockReceivables = [
  {
    id: "1",
    buyer: "Pak Foods Ltd",
    current: 0,
    due1to7: 70000,
    due8to30: 60000,
    due30plus: 80000,
    total: 210000
  },
  {
    id: "2",
    buyer: "Noor Traders",
    current: 15000,
    due1to7: 20000,
    due8to30: 50000,
    due30plus: 0,
    total: 85000
  },
  {
    id: "3",
    buyer: "Al-Rehman Mills",
    current: 25000,
    due1to7: 0,
    due8to30: 35000,
    due30plus: 40000,
    total: 100000
  },
];

export function ReceivablesAgingReport({ dateRange }: ReceivablesAgingReportProps) {
  const [isGenerated, setIsGenerated] = useState(false);

  const handleGenerate = () => {
    setIsGenerated(true);
  };

  const totals = mockReceivables.reduce((acc, item) => ({
    current: acc.current + item.current,
    due1to7: acc.due1to7 + item.due1to7,
    due8to30: acc.due8to30 + item.due8to30,
    due30plus: acc.due30plus + item.due30plus,
    total: acc.total + item.total
  }), { current: 0, due1to7: 0, due8to30: 0, due30plus: 0, total: 0 });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Receivables Aging Report</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Date Range: {new Date(dateRange.from).toLocaleDateString()} - {new Date(dateRange.to).toLocaleDateString()}
          </div>
          <Button onClick={handleGenerate}>
            Generate Report
          </Button>
        </div>

        {isGenerated && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Receivables Aging Analysis</h3>
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
                    <TableHead>Buyer</TableHead>
                    <TableHead className="text-right">Current</TableHead>
                    <TableHead className="text-right">1-7 Days Due</TableHead>
                    <TableHead className="text-right">8-30 Days</TableHead>
                    <TableHead className="text-right">30+ Days</TableHead>
                    <TableHead className="text-right">Total Outstanding</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockReceivables.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.buyer}</TableCell>
                      <TableCell className="text-right">{item.current.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-yellow-600">{item.due1to7.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-orange-600">{item.due8to30.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-red-600">{item.due30plus.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-medium">{item.total.toLocaleString()}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50 font-medium">
                    <TableCell>Total</TableCell>
                    <TableCell className="text-right">{totals.current.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-yellow-600">{totals.due1to7.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-orange-600">{totals.due8to30.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-red-600">{totals.due30plus.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-bold">{totals.total.toLocaleString()}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
