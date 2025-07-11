
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Download } from "lucide-react";

const mockAdvances = [
  {
    id: 1,
    farmerName: "Akbar Ali",
    farmerCnic: "35201-1234567-1",
    date: "2024-07-10",
    type: "Cash",
    amount: 50000,
    source: "Bank",
    vendor: "—",
    reference: "TXN001",
    status: "Active"
  },
  {
    id: 2,
    farmerName: "Akbar Ali",
    farmerCnic: "35201-1234567-1",
    date: "2024-06-01",
    type: "In-Kind",
    amount: 35000,
    source: "Credit",
    vendor: "AgriMart",
    reference: "INV002",
    status: "Partial"
  },
  {
    id: 3,
    farmerName: "Rafiq Ahmad",
    farmerCnic: "35203-2345678-2",
    date: "2024-07-04",
    type: "Cash",
    amount: 25000,
    source: "Cash",
    vendor: "—",
    reference: "CSH003",
    status: "Active"
  }
];

export function AdvancesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState("all");

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Advances</h1>
          <p className="text-muted-foreground">Manage farmer advances and payments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button asChild>
            <Link to="/advances/add">
              <Plus className="h-4 w-4 mr-2" />
              Add New Advance
            </Link>
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by farmer name or CNIC..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
              
              <Select>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="inkind">In-Kind</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="bank">Bank</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="credit">Credit</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Vendor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Vendors</SelectItem>
                  <SelectItem value="agrimart">AgriMart</SelectItem>
                  <SelectItem value="kissan">Kissan Agri</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Advances List ({mockAdvances.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Farmer Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAdvances.map((advance) => (
                <TableRow key={advance.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{advance.farmerName}</p>
                      <p className="text-sm text-muted-foreground font-mono">{advance.farmerCnic}</p>
                    </div>
                  </TableCell>
                  <TableCell>{advance.date}</TableCell>
                  <TableCell>
                    <Badge variant={advance.type === "Cash" ? "default" : "secondary"}>
                      {advance.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">PKR {advance.amount.toLocaleString()}</TableCell>
                  <TableCell>{advance.source}</TableCell>
                  <TableCell>{advance.vendor}</TableCell>
                  <TableCell className="font-mono text-sm">{advance.reference}</TableCell>
                  <TableCell>
                    <Badge variant={
                      advance.status === "Active" ? "default" :
                      advance.status === "Partial" ? "secondary" : "outline"
                    }>
                      {advance.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
