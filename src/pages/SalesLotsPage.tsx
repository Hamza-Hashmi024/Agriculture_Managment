
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Download, Eye, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const mockSalesLots = [
  {
    id: 1,
    date: "12-Jul",
    farmer: "Akbar Ali",
    crop: "Wheat",
    buyer: "Pak Foods",
    weight: 120,
    rate: 4200,
    status: "Open",
    totalAmount: 504000
  },
  {
    id: 2,
    date: "08-Jul",
    farmer: "Rafiq Ahmad",
    crop: "Rice",
    buyer: "Noor Traders",
    weight: 80,
    rate: 4000,
    status: "Settled",
    totalAmount: 320000
  },
  {
    id: 3,
    date: "06-Jul",
    farmer: "Akbar Ali",
    crop: "Cotton",
    buyer: "Safeer Bros.",
    weight: 60,
    rate: 5200,
    status: "Partial",
    totalAmount: 312000
  }
];

export function SalesLotsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Settled": return "default";
      case "Open": return "destructive";
      case "Partial": return "secondary";
      default: return "outline";
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Sales / Lots</h1>
          <p className="text-muted-foreground">Manage crop sales and buyer transactions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button asChild>
            <Link to="/sales/add">
              <Plus className="h-4 w-4 mr-2" />
              New Sale / Crop Lot
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
                placeholder="Search by farmer, buyer, or crop..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sales</SelectItem>
                <SelectItem value="date">By Date</SelectItem>
                <SelectItem value="crop">By Crop</SelectItem>
                <SelectItem value="buyer">By Buyer</SelectItem>
                <SelectItem value="status">By Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sales / Lots List ({mockSalesLots.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Farmer</TableHead>
                <TableHead>Crop</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Weight (manns)</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Invoice</TableHead>
                <TableHead>Statement</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSalesLots.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{sale.date}</TableCell>
                  <TableCell className="font-medium">{sale.farmer}</TableCell>
                  <TableCell>{sale.crop}</TableCell>
                  <TableCell>{sale.buyer}</TableCell>
                  <TableCell>{sale.weight}</TableCell>
                  <TableCell className="font-mono">{sale.rate.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(sale.status)}>
                      {sale.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/sales/invoice/${sale.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/sales/statement/${sale.id}`}>
                        <FileText className="h-4 w-4" />
                      </Link>
                    </Button>
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
