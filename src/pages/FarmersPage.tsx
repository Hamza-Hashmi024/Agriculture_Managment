
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Download, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const mockFarmers = [
  {
    id: 1,
    name: "Akbar Ali",
    cnic: "35201-1234567-1",
    village: "Chak 12",
    contacts: ["0300-1234567", "0345-1234567"],
    status: "Active",
    totalAdvances: "PKR 150,000"
  },
  {
    id: 2,
    name: "Rafiq Ahmad",
    cnic: "35203-2345678-2",
    village: "Kot Addu",
    contacts: ["0321-2345678"],
    status: "Active",
    totalAdvances: "PKR 85,000"
  },
  {
    id: 3,
    name: "Muhammad Hassan",
    cnic: "35205-3456789-3",
    village: "Chak 15",
    contacts: ["0333-3456789", "0301-3456789"],
    status: "Inactive",
    totalAdvances: "PKR 0"
  }
];

export function FarmersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState("all");

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Farmers</h1>
          <p className="text-muted-foreground">Manage farmer profiles and information</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button asChild>
            <Link to="/farmers/add">
              <Plus className="h-4 w-4 mr-2" />
              Add New Farmer
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
                placeholder="Search by farmer name, CNIC, or village..."
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
                <SelectItem value="all">All Farmers</SelectItem>
                <SelectItem value="village">By Village</SelectItem>
                <SelectItem value="cnic">By CNIC</SelectItem>
                <SelectItem value="bank">By Bank Details</SelectItem>
                <SelectItem value="status">By Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Farmers List ({mockFarmers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Farmer Name</TableHead>
                <TableHead>CNIC</TableHead>
                <TableHead>Village</TableHead>
                <TableHead>Contacts</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Advances</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockFarmers.map((farmer) => (
                <TableRow key={farmer.id}>
                  <TableCell>
                    <Link
                      to={`/farmers/${farmer.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {farmer.name}
                    </Link>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{farmer.cnic}</TableCell>
                  <TableCell>{farmer.village}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {farmer.contacts.map((contact, index) => (
                        <span key={index} className="text-sm">{contact}</span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={farmer.status === "Active" ? "default" : "secondary"}>
                      {farmer.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{farmer.totalAdvances}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/farmers/${farmer.id}`}>
                        <Eye className="h-4 w-4" />
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
