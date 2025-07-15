
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Edit, Plus, Printer, Download, User } from "lucide-react";

const mockFarmers = {
  "1": {
    id: 1,
    name: "Akbar Ali",
    cnic: "35201-1234567-1",
    village: "Chak 12",
    contacts: ["03001234567", "03451234567"],
    bankAccounts: [
      {
        bank: "Meezan Bank",
        account: "0123456789",
        iban: "PK36MEZN0003950101234567"
      },
      {
        bank: "HBL Bank", 
        account: "9876543210",
        iban: "PK24HABB0003950109876543"
      }
    ],
    wallets: [
      {
        provider: "JazzCash",
        number: "0321-1234567"
      },
      {
        provider: "Easypaisa",
        number: "0300-1234567"
      }
    ],
    profilePhoto: null,
    advances: [
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
    ],
    settlements: [
      {
        id: 1,
        date: "2024-07-12",
        description: "Wheat Sale",
        debit: 504000,
        credit: 0,
        balance: 504000
      },
      {
        id: 2,
        date: "2024-07-12",
        description: "Less: Advances",
        debit: 35000,
        credit: 0,
        balance: 469000
      },
      {
        id: 3,
        date: "2024-07-12",
        description: "Less: Expenses",
        debit: 7500,
        credit: 0,
        balance: 461500
      },
      {
        id: 4,
        date: "2024-07-14",
        description: "Payment to Farmer",
        debit: 0,
        credit: 200000,
        balance: 261500
      }
    ]
  },
  "2": {
    id: 2,
    name: "Muhammad Hassan",
    cnic: "35201-9876543-2",
    village: "Chak 45",
    contacts: ["03009876543", "03459876543"],
    bankAccounts: [
      {
        bank: "HBL Bank",
        account: "9876543210",
        iban: "PK24HABB0003950109876543"
      }
    ],
    wallets: [
      {
        provider: "EasyPaisa",
        number: "0300-9876543"
      }
    ],
    profilePhoto: null,
    advances: [
      {
        id: 1,
        date: "2024-07-15",
        type: "Cash",
        amount: 75000,
        balance: 15000,
        source: "Bank",
        vendor: "—",
        reference: "TXN003"
      },
      {
        id: 2,
        date: "2024-06-20",
        type: "In-Kind",
        amount: 45000,
        balance: 8000,
        source: "Credit",
        vendor: "FarmSupply",
        reference: "INV004"
      }
    ],
    settlements: [
      {
        id: 1,
        date: "2024-07-18",
        description: "Rice Sale",
        debit: 680000,
        credit: 0,
        balance: 680000
      },
      {
        id: 2,
        date: "2024-07-18",
        description: "Less: Advances",
        debit: 45000,
        credit: 0,
        balance: 635000
      },
      {
        id: 3,
        date: "2024-07-18",
        description: "Less: Expenses",
        debit: 12000,
        credit: 0,
        balance: 623000
      },
      {
        id: 4,
        date: "2024-07-20",
        description: "Payment to Farmer",
        debit: 0,
        credit: 300000,
        balance: 323000
      }
    ]
  }
};

export function FarmerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("advances");
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    paymentMode: "cash",
    bankAccount: "",
    refNo: "",
    date: new Date().toISOString().split('T')[0],
    uploadProof: "",
    notes: ""
  });

  const farmer = mockFarmers[id as keyof typeof mockFarmers];
  
  if (!farmer) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Farmer Not Found</h1>
          <Button asChild className="mt-4">
            <Link to="/farmers">Back to Farmers</Link>
          </Button>
        </div>
      </div>
    );
  }

  const currentBalance = farmer.settlements[farmer.settlements.length - 1]?.balance || 0;

  const handlePaymentSubmit = () => {
    // Handle payment submission logic here
    console.log("Payment submitted:", paymentForm);
    setPaymentDialog(false);
    // Reset form
    setPaymentForm({
      amount: "",
      paymentMode: "cash",
      bankAccount: "",
      refNo: "",
      date: new Date().toISOString().split('T')[0],
      uploadProof: "",
      notes: ""
    });
  };

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
                <p className="text-lg font-semibold">{farmer.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">CNIC</label>
                <p className="font-mono">{farmer.cnic}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Village</label>
                <p>{farmer.village}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Contacts</label>
                <div className="space-y-1">
                  {farmer.contacts.map((contact, index) => (
                    <p key={index} className="font-mono text-sm">{contact}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Bank Accounts</label>
                  <div className="space-y-3 mt-2">
                    {farmer.bankAccounts.map((account, index) => (
                      <div key={index} className="p-3 border rounded-lg bg-muted/50">
                        <p className="text-sm font-medium">{account.bank}</p>
                        <p className="text-sm font-mono">Acc: {account.account}</p>
                        <p className="text-sm font-mono">IBAN: {account.iban}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Mobile Wallets</label>
                  <div className="space-y-3 mt-2">
                    {farmer.wallets.map((wallet, index) => (
                      <div key={index} className="p-3 border rounded-lg bg-muted/50">
                        <p className="text-sm font-medium">{wallet.provider}</p>
                        <p className="text-sm font-mono">{wallet.number}</p>
                      </div>
                    ))}
                  </div>
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
              <CardTitle>Advances History for {farmer.name}</CardTitle>
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
                    Add Advance for {farmer.name}
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
                  {farmer.advances.map((advance) => (
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
              <CardTitle>Crop Lots & Sales for {farmer.name}</CardTitle>
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
                    New Sale for {farmer.name}
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
              <CardTitle>Settlements & Payments for {farmer.name}</CardTitle>
              <div className="flex gap-2">
                <Dialog open={paymentDialog} onOpenChange={setPaymentDialog}>
                  <DialogTrigger asChild>
                    <Button disabled={currentBalance <= 0}>
                      Pay Farmer
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Pay Farmer</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Farmer</Label>
                        <Input value={farmer.name} disabled className="bg-muted" />
                      </div>
                      
                      <div>
                        <Label>Amount to pay (max: {currentBalance.toLocaleString()})</Label>
                        <Input 
                          type="number" 
                          max={currentBalance}
                          value={paymentForm.amount}
                          onChange={(e) => setPaymentForm({...paymentForm, amount: e.target.value})}
                          placeholder="Enter amount"
                        />
                      </div>

                      <div>
                        <Label>Payment Mode</Label>
                        <RadioGroup 
                          value={paymentForm.paymentMode} 
                          onValueChange={(value) => setPaymentForm({...paymentForm, paymentMode: value})}
                          className="flex gap-4 mt-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="cash" id="cash" />
                            <Label htmlFor="cash">Cash</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="bank" id="bank" />
                            <Label htmlFor="bank">Bank</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {paymentForm.paymentMode === "bank" && (
                        <div>
                          <Label>Select Bank Account</Label>
                          <Select value={paymentForm.bankAccount} onValueChange={(value) => setPaymentForm({...paymentForm, bankAccount: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select bank account" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="account1">Main Business Account - ***4567</SelectItem>
                              <SelectItem value="account2">Secondary Account - ***8901</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <div>
                        <Label>Reference No. (optional)</Label>
                        <Input 
                          value={paymentForm.refNo}
                          onChange={(e) => setPaymentForm({...paymentForm, refNo: e.target.value})}
                          placeholder="Enter reference number"
                        />
                      </div>

                      <div>
                        <Label>Date</Label>
                        <Input 
                          type="date"
                          value={paymentForm.date}
                          onChange={(e) => setPaymentForm({...paymentForm, date: e.target.value})}
                        />
                      </div>

                      <div>
                        <Label>Upload Proof (optional)</Label>
                        <Input 
                          type="file"
                          onChange={(e) => setPaymentForm({...paymentForm, uploadProof: e.target.value})}
                        />
                      </div>

                      <div>
                        <Label>Notes (optional)</Label>
                        <Textarea 
                          value={paymentForm.notes}
                          onChange={(e) => setPaymentForm({...paymentForm, notes: e.target.value})}
                          placeholder="Enter any notes"
                          rows={3}
                        />
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button onClick={handlePaymentSubmit} className="flex-1">
                          Save Payment
                        </Button>
                        <Button variant="outline" onClick={() => setPaymentDialog(false)} className="flex-1">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Button variant="outline" size="sm">
                  <Printer className="h-4 w-4 mr-2" />
                  Print Statement
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Debit (to farmer)</TableHead>
                    <TableHead className="text-right">Credit (paid)</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {farmer.settlements.map((settlement) => (
                    <TableRow key={settlement.id}>
                      <TableCell>{settlement.date}</TableCell>
                      <TableCell>{settlement.description}</TableCell>
                      <TableCell className="text-right">
                        {settlement.debit > 0 ? `PKR ${settlement.debit.toLocaleString()}` : ''}
                      </TableCell>
                      <TableCell className="text-right">
                        {settlement.credit > 0 ? `PKR ${settlement.credit.toLocaleString()}` : ''}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        PKR {settlement.balance.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Net Amount Due:</span>
                  <span>PKR {currentBalance.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
