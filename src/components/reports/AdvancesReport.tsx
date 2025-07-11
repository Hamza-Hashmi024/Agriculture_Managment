
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

interface AdvancesReportProps {
  dateRange: { from: string; to: string };
}

const mockFarmers = [
  { id: "all", name: "All Farmers" },
  { id: "1", name: "Akbar Ali" },
  { id: "2", name: "Rafiq Ahmad" },
  { id: "3", name: "Muhammad Hassan" },
];

const mockAdvances = [
  {
    id: "1",
    farmer: "Akbar Ali",
    date: "2025-07-01",
    type: "Cash",
    amount: 50000,
    balance: 10000,
    source: "Bank",
    status: "Settled"
  },
  {
    id: "2",
    farmer: "Rafiq Ahmad",
    date: "2025-07-03",
    type: "In-kind",
    amount: 35000,
    balance: 5000,
    source: "Credit",
    status: "Outstanding"
  },
  {
    id: "3",
    farmer: "Muhammad Hassan",
    date: "2025-07-05",
    type: "Cash",
    amount: 25000,
    balance: 25000,
    source: "Cash",
    status: "Outstanding"
  },
];

export function AdvancesReport({ dateRange }: AdvancesReportProps) {
  const [selectedFarmer, setSelectedFarmer] = useState<string>("all");
  const [isGenerated, setIsGenerated] = useState(false);

  const handleGenerate = () => {
    setIsGenerated(true);
  };

  const filteredAdvances = selectedFarmer === "all" 
    ? mockAdvances 
    : mockAdvances.filter(advance => 
        advance.farmer === mockFarmers.find(f => f.id === selectedFarmer)?.name
      );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advances Report</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          <div className="flex items-end">
            <Button onClick={handleGenerate}>
              Generate Report
            </Button>
          </div>
        </div>

        {isGenerated && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                Advances Report - {mockFarmers.find(f => f.id === selectedFarmer)?.name}
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
                    <TableHead>Farmer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Advance Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAdvances.map((advance) => (
                    <TableRow key={advance.id}>
                      <TableCell className="font-medium">{advance.farmer}</TableCell>
                      <TableCell>{new Date(advance.date).toLocaleDateString()}</TableCell>
                      <TableCell>{advance.type}</TableCell>
                      <TableCell className="text-right">{advance.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{advance.balance.toLocaleString()}</TableCell>
                      <TableCell>{advance.source}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          advance.status === 'Settled' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {advance.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">Total Advances</p>
                  <p className="text-lg font-semibold">
                    PKR {filteredAdvances.reduce((sum, a) => sum + a.amount, 0).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Outstanding Balance</p>
                  <p className="text-lg font-semibold text-red-600">
                    PKR {filteredAdvances.reduce((sum, a) => sum + a.balance, 0).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Settled Advances</p>
                  <p className="text-lg font-semibold text-green-600">
                    {filteredAdvances.filter(a => a.status === 'Settled').length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Outstanding Count</p>
                  <p className="text-lg font-semibold text-yellow-600">
                    {filteredAdvances.filter(a => a.status === 'Outstanding').length}
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
