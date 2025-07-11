import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Plus, Printer, Download, User } from "lucide-react";

const mockFarmer = {
  id: 1,
  name: "Akbar Ali",
  cnic: "35201-1234567-1",
  village: "Chak 12",
  contacts: ["03001234567", "03451234567"],
  bankDetails: {
    bank: "Meezan Bank",
    account: "0123456789",
    iban: "PK36MEZN0003950101234567"
  },
  wallet: {
    provider: "JazzCash",
    number: "0321-1234567"
  },
  profilePhoto: null
};

const mockAdvances = [
  {
    id: 1,
    date: "2024-07-10",
    type: "Cash",
    amount: 50000,
    balance: 10000,
    source: "Bank",
    vendor: "—",
    reference: "TXN001"
  },
  {
    id: 2,
    date: "2024-06-01",
    type: "In-Kind",
    amount: 35000,
    balance: 5000,
    source: "Credit",
    vendor: "AgriMart",
    reference: "INV002"
  }
];

export function FarmerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("advances");

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/farmers")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Farmer Profile</h1>
            <p className="text-muted-foreground">Complete farmer information and history</p>
          </div>
        </div>
        <Button asChild>
          <Link to={`/farmers/edit/${id}`}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Farmer
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Farmer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <p className="text-lg font-semibold">{mockFarmer.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">CNIC</label>
                <p className="font-mono">{mockFarmer.cnic}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Village</label>
                <p>{mockFarmer.village}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Contacts</label>
                <div className="space-y-1">
                  {mockFarmer.contacts.map((contact, index) => (
                    <p key={index} className="font-mono text-sm">{contact}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Bank Details</label>
                  <p className="text-sm">{mockFarmer.bankDetails.bank}</p>
                  <p className="text-sm font-mono">Acc: {mockFarmer.bankDetails.account}</p>
                  <p className="text-sm font-mono">IBAN: {mockFarmer.bankDetails.iban}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Mobile Wallet</label>
                  <p className="text-sm">{mockFarmer.wallet.provider}</p>
                  <p className="text-sm font-mono">{mockFarmer.wallet.number}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile Photo</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center">
              <User className="h-16 w-16 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="advances">Advances</TabsTrigger>
          <TabsTrigger value="sales">Crop Lots/Sales</TabsTrigger>
          <TabsTrigger value="settlements">Settlements/Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="advances" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Advances History for {mockFarmer.name}</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Printer className="h-4 w-4 mr-2" />
                  Print Ledger
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button asChild>
                  <Link to={`/advances/add/${id}`}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Advance for {mockFarmer.name}
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Reference</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAdvances.map((advance) => (
                    <TableRow key={advance.id}>
                      <TableCell>{advance.date}</TableCell>
                      <TableCell>
                        <Badge variant={advance.type === "Cash" ? "default" : "secondary"}>
                          {advance.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">PKR {advance.amount.toLocaleString()}</TableCell>
                      <TableCell>PKR {advance.balance.toLocaleString()}</TableCell>
                      <TableCell>{advance.source}</TableCell>
                      <TableCell>{advance.vendor}</TableCell>
                      <TableCell className="font-mono text-sm">{advance.reference}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Crop Lots & Sales for {mockFarmer.name}</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Printer className="h-4 w-4 mr-2" />
                  Print Report
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button asChild>
                  <Link to={`/sales/add?farmerId=${id}`}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Sale for {mockFarmer.name}
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No sales records found for this farmer.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settlements" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Settlements & Payments for {mockFarmer.name}</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Printer className="h-4 w-4 mr-2" />
                  Print Report
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button asChild>
                  <Link to={`/settlements/add?farmerId=${id}`}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Payment for {mockFarmer.name}
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No settlement records found for this farmer.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
