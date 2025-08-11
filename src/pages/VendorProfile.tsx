import { useState , useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Edit, Download, FileText, Building2, Phone, CreditCard, Wallet } from "lucide-react";
import { GetVendorProfile} from "@/Api/Api"



export function VendorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("purchases");
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [vendor, setVendor] = useState(null); 
  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    paymentMode: "cash",
    bankAccount: "",
    refNo: "",
    date: new Date().toISOString().split('T')[0],
    uploadProof: "",
    notes: ""
  });
  const [editForm, setEditForm] = useState({
    name: "",
    type: "supplier",
    contacts: [""],
    bankName: "",
    accountNo: "",
    iban: "",
    walletNumber: "",
    walletType: "",
    notes: ""
  });

useEffect(() => {
  const FetchVendor = async () => {
    try {
      const response = await GetVendorProfile(id)
      setVendor(response)
    } catch (error) {
      console.log(error);
    }
  }
  if (id) {  
    FetchVendor();
  }
}, [id])




  
  if (!vendor) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Vendor Not Found</h1>
          <Button asChild className="mt-4">
            <button onClick={() => navigate("/vendors")}>Back to Vendors</button>
          </Button>
        </div>
      </div>
    );
  }

  const handlePaymentSubmit = () => {
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

  const openPaymentModal = () => {
    setPaymentForm({
      ...paymentForm,
      amount: vendor.netPayable.toString()
    });
    setPaymentDialog(true);
  };

  const openEditModal = () => {
    setEditForm({
      name: vendor.name,
      type: vendor.type.toLowerCase(),
      contacts: vendor.contacts,
      bankName: vendor.bankAccounts[0]?.bank || "",
      accountNo: vendor.bankAccounts[0]?.account || "",
      iban: vendor.bankAccounts[0]?.iban || "",
      walletNumber: vendor.wallets[0]?.number || "",
      walletType: vendor.wallets[0]?.provider || "",
      notes: ""
    });
    setEditDialog(true);
  };

  const handleEditSubmit = () => {
    console.log("Edit submitted:", editForm);
    setEditDialog(false);
  };

 

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/vendors")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Vendors
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Vendor Profile</h1>
          <p className="text-muted-foreground">{vendor.name}</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Vendor Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Vendor Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground">Name & Type</h4>
                <p className="text-base font-medium">{vendor.name}</p>
                <p className="text-sm text-muted-foreground">{vendor.type}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  Contacts
                </h4>
                {vendor.contacts.map((contact, index) => (
                  <p key={index} className="text-base">{contact}</p>
                ))}
              </div>
              
              <div className="lg:col-span-2">
                <h4 className="font-semibold text-sm text-muted-foreground flex items-center gap-1 mb-3">
                  <CreditCard className="h-3 w-3" />
                  Bank Accounts
                </h4>
                <div className="space-y-3">
                  {vendor.bankAccounts.map((account, index) => (
                    <div key={index} className="p-3 border rounded-lg bg-muted/50">
                      <p className="text-sm font-medium">{account.bank}</p>
                      <p className="text-sm text-muted-foreground">Acc: {account.account}</p>
                      <p className="text-sm text-muted-foreground">IBAN: {account.iban}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground flex items-center gap-1 mb-3">
                  <Wallet className="h-3 w-3" />
                  Mobile Wallets
                </h4>
                <div className="space-y-3">
                  {vendor.wallets.map((wallet, index) => (
                    <div key={index} className="p-3 border rounded-lg bg-muted/50">
                      <p className="text-sm font-medium">{wallet.provider}</p>
                      <p className="text-sm text-muted-foreground">{wallet.number}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground">Net Payable</h4>
                <p className="text-lg font-semibold text-red-600">PKR {vendor.netPayable.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <Button onClick={openPaymentModal} disabled={vendor.netPayable <= 0}>
                <Plus className="h-4 w-4 mr-2" />
                Add Payment
              </Button>
              <Button variant="outline" onClick={openEditModal}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Vendor
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Ledger
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Purchases and Payments Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="purchases">Purchases</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="purchases" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Purchase History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Paid</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Invoice</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vendor.purchases.map((purchase) => (
                      <TableRow key={purchase.id}>
                        <TableCell>{purchase.date}</TableCell>
                        <TableCell>{purchase.description}</TableCell>
                        <TableCell>PKR {purchase.amount.toLocaleString()}</TableCell>
                        <TableCell>PKR {purchase.paid.toLocaleString()}</TableCell>
                        <TableCell>PKR {purchase.balance.toLocaleString()}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Mode</TableHead>
                      <TableHead>Bank</TableHead>
                      <TableHead>Ref</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vendor.payments.length > 0 ? (
                      vendor.payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>{payment.date}</TableCell>
                          <TableCell>PKR {payment.amount.toLocaleString()}</TableCell>
                          <TableCell>{payment.mode}</TableCell>
                          <TableCell>{payment.bank}</TableCell>
                          <TableCell>{payment.ref}</TableCell>
                          <TableCell>{payment.notes}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                          No payments found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Payment Modal */}
      <Dialog open={paymentDialog} onOpenChange={setPaymentDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Vendor</Label>
              <Input value={vendor.name} disabled className="bg-muted" />
            </div>
            
            <div>
              <Label>Amount to pay (max: {vendor.netPayable.toLocaleString()})</Label>
              <Input 
                type="number" 
                max={vendor.netPayable}
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

      {/* Edit Vendor Modal */}
      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Vendor</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                placeholder="Enter vendor name"
              />
            </div>

            <div>
              <Label>Type</Label>
              <RadioGroup 
                value={editForm.type} 
                onValueChange={(value) => setEditForm({...editForm, type: value})}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="supplier" id="edit-supplier" />
                  <Label htmlFor="edit-supplier">Supplier</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="expense" id="edit-expense" />
                  <Label htmlFor="edit-expense">Expense</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Contacts</Label>
              {editForm.contacts.map((contact, index) => (
                <div key={index} className="flex gap-2 mt-2">
                  <Input
                    value={contact}
                    onChange={(e) => {
                      const newContacts = [...editForm.contacts];
                      newContacts[index] = e.target.value;
                      setEditForm({...editForm, contacts: newContacts});
                    }}
                    placeholder="Enter contact number"
                  />
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label>Bank Account</Label>
              <Input
                value={editForm.bankName}
                onChange={(e) => setEditForm({...editForm, bankName: e.target.value})}
                placeholder="Bank name"
              />
              <Input
                value={editForm.accountNo}
                onChange={(e) => setEditForm({...editForm, accountNo: e.target.value})}
                placeholder="Account number"
              />
              <Input
                value={editForm.iban}
                onChange={(e) => setEditForm({...editForm, iban: e.target.value})}
                placeholder="IBAN"
              />
            </div>

            <div className="space-y-2">
              <Label>Wallet</Label>
              <Input
                value={editForm.walletNumber}
                onChange={(e) => setEditForm({...editForm, walletNumber: e.target.value})}
                placeholder="Wallet number"
              />
              <Input
                value={editForm.walletType}
                onChange={(e) => setEditForm({...editForm, walletType: e.target.value})}
                placeholder="Wallet type (e.g., JazzCash)"
              />
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea
                value={editForm.notes}
                onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                placeholder="Additional notes"
                rows={3}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleEditSubmit} className="flex-1">
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setEditDialog(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
