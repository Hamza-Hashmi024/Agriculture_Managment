
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Eye, Plus, Download } from "lucide-react";

const mockFarmersPayables = [
  {
    id: 1,
    name: "Akbar Ali",
    netPayable: 261500,
    lastSale: "2024-07-12",
    lastPayment: "2024-07-14"
  },
  {
    id: 2,
    name: "Rafiq Ahmad",
    netPayable: 420000,
    lastSale: "2024-07-13",
    lastPayment: null
  },
  {
    id: 3,
    name: "Muhammad Hassan",
    netPayable: 323000,
    lastSale: "2024-07-18",
    lastPayment: "2024-07-20"
  }
];

const mockVendorsPayables = [
  {
    id: 1,
    name: "AgriMart",
    netPayable: 112000,
    lastPurchase: "2024-07-10",
    lastPayment: "2024-07-11"
  },
  {
    id: 2,
    name: "Kissan Agri",
    netPayable: 47500,
    lastPurchase: "2024-07-09",
    lastPayment: null
  },
  {
    id: 3,
    name: "Expense",
    netPayable: 28000,
    lastPurchase: "2024-07-01",
    lastPayment: null
  }
];

export function PayablesPage() {
  const [activeTab, setActiveTab] = useState("farmers");
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [selectedPayable, setSelectedPayable] = useState<any>(null);
  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    paymentMode: "cash",
    bankAccount: "",
    refNo: "",
    date: new Date().toISOString().split('T')[0],
    uploadProof: "",
    notes: ""
  });

  const handlePaymentSubmit = () => {
    console.log("Payment submitted:", paymentForm);
    setPaymentDialog(false);
    setSelectedPayable(null);
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

  const openPaymentModal = (payable: any, type: string) => {
    setSelectedPayable({ ...payable, type });
    setPaymentForm({
      ...paymentForm,
      amount: payable.netPayable.toString()
    });
    setPaymentDialog(true);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Payables</h1>
          <p className="text-muted-foreground">Manage payments to farmers and vendors</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="farmers">Farmers</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
        </TabsList>

        <TabsContent value="farmers" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Farmer Payables</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Farmer Name</TableHead>
                    <TableHead>Net Payable</TableHead>
                    <TableHead>Last Sale</TableHead>
                    <TableHead>Last Payment</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockFarmersPayables.map((farmer) => (
                    <TableRow key={farmer.id}>
                      <TableCell className="font-medium">{farmer.name}</TableCell>
                      <TableCell>PKR {farmer.netPayable.toLocaleString()}</TableCell>
                      <TableCell>{farmer.lastSale}</TableCell>
                      <TableCell>{farmer.lastPayment || "—"}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button asChild variant="outline" size="sm">
                            <Link to={`/payables/farmer/${farmer.id}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Link>
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={() => openPaymentModal(farmer, 'farmer')}
                            disabled={farmer.netPayable <= 0}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Payment
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendors" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Payables</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor Name</TableHead>
                    <TableHead>Net Payable</TableHead>
                    <TableHead>Last Purchase</TableHead>
                    <TableHead>Last Payment</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockVendorsPayables.map((vendor) => (
                    <TableRow key={vendor.id}>
                      <TableCell className="font-medium">{vendor.name}</TableCell>
                      <TableCell>PKR {vendor.netPayable.toLocaleString()}</TableCell>
                      <TableCell>{vendor.lastPurchase}</TableCell>
                      <TableCell>{vendor.lastPayment || "—"}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button asChild variant="outline" size="sm">
                            <Link to={`/payables/vendor/${vendor.id}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Link>
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={() => openPaymentModal(vendor, 'vendor')}
                            disabled={vendor.netPayable <= 0}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Payment
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Payment Modal */}
      <Dialog open={paymentDialog} onOpenChange={setPaymentDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input 
                value={selectedPayable?.name || ""} 
                disabled 
                className="bg-muted" 
              />
            </div>
            
            <div>
              <Label>Amount to pay (max: {selectedPayable?.netPayable?.toLocaleString() || 0})</Label>
              <Input 
                type="number" 
                max={selectedPayable?.netPayable || 0}
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
    </div>
  );
}
