import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Plus, Search, Download, Eye, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GetSalesList } from "@/Api/Api";

export function SalesLotsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const data = await GetSalesList();
        setSalesData(data.data);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchSalesData();
  }, []);

  const filteredSales = salesData.filter((sale) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      sale.farmer_name?.toLowerCase().includes(query) ||
      sale.buyer_name?.toLowerCase().includes(query) ||
      sale.crop?.toLowerCase().includes(query);

    let matchesFilter = true;
    if (filterBy === "buyer") matchesFilter = !!sale.buyer_name;
    if (filterBy === "crop") matchesFilter = !!sale.crop;
    if (filterBy === "status") matchesFilter = !!sale.status;
    if (filterBy === "date") matchesFilter = !!sale.arrival_date;

    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Settled":
        return "default";
      case "Open":
        return "destructive";
      case "Partial":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Sales / Lots</h1>
          <p className="text-muted-foreground">
            Manage crop sales and buyer transactions
          </p>
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
          <CardTitle>Sales / Lots List ({salesData.length})</CardTitle>
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
              {filteredSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>
                    {new Date(sale.arrival_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-medium">
                    {sale.farmer_name}
                  </TableCell>
                  <TableCell>{sale.crop}</TableCell>
                  <TableCell>{sale.buyer_name ?? sale.buyer_id}</TableCell>
                  <TableCell>{sale.weight}</TableCell>
                  <TableCell className="font-mono">
                    {Number(sale.rate).toLocaleString()}
                  </TableCell>
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
