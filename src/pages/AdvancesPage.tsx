
import { useState , useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Download } from "lucide-react";
import { GetAdvanceList } from "@/Api/Api";



export function AdvancesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [advances, setAdvances] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);

    useEffect(() => {
    const FetchAdvanceList = async () => {
      try {
        const response = await GetAdvanceList();
        setAdvances(response);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); 
      }
    };
    FetchAdvanceList();
  }, []);

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
          <CardTitle>
            Advances List {loading ? "" : `(${advances.length})`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading advances...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Received By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {advances.map((advance) => (
                  <TableRow key={advance.id}>
                    <TableCell>{advance.id}</TableCell>
                    <TableCell>{new Date(advance.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={advance.type === "cash" ? "default" : "secondary"}>
                        {advance.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      PKR {parseFloat(advance.amount).toLocaleString()}
                    </TableCell>
                    <TableCell>{advance.source_type ?? "—"}</TableCell>
                    <TableCell className="font-mono text-sm">{advance.reference_no ?? "—"}</TableCell>
                    <TableCell>{advance.received_by ?? "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
