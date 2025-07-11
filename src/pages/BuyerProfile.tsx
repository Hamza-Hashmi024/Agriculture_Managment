
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CreditCard, Edit, Download, Eye } from "lucide-react";
import { AddPaymentModal } from "@/components/AddPaymentModal";

// Mock data for buyer details
const mockBuyerDetails = {
  "1": {
    id: "1",
    name: "Pak Foods",
    contacts: ["0333-1234567", "0321-7654321"],
    bankName: "Meezan Bank",
    accountNo: "0123456789",
    iban: "PK36MEZN0000000123456789",
    walletNumber: "0315-1234567",
    walletType: "Easypaisa",
    netReceivable: 210000,
    invoices: [
      { id: "1", date: "12-Jul-2025", crop: "Wheat", invoiceNo: "#INV123", amount: 100000 },
      { id: "2", date: "10-Jul-2025", crop: "Rice", invoiceNo: "#INV122", amount: 70000 },
      { id: "3", date: "09-Jul-2025", crop: "Maize", invoiceNo: "#INV120", amount: 70000 }
    ],
    installments: [
      { id: "1", invoiceNo: "#INV123", amount: 40000, dueDate: "14-Jul-2025", status: "Overdue" },
      { id: "2", invoiceNo: "#INV120", amount: 60000, dueDate: "20-Jul-2025", status: "Due Soon" },
      { id: "3", invoiceNo: "#INV124", amount: 70000, dueDate: "25-Jul-2025", status: "Pending" }
    ],
    payments: [
      { id: "1", date: "14-Jul-2025", amount: 60000, mode: "Bank", bank: "HBL", refNo: "12345", notes: "Partial pay" },
      { id: "2", date: "10-Jul-2025", amount: 70000, mode: "Cash", bank: "—", refNo: "", notes: "Full pay" }
    ]
  },
  "2": {
    id: "2",
    name: "Noor Traders",
    contacts: ["0300-9876543"],
    bankName: "UBL",
    accountNo: "9876543210",
    iban: "PK24UBL0000009876543210",
    walletNumber: "0345-9876543",
    walletType: "JazzCash",
    netReceivable: 85000,
    invoices: [
      { id: "1", date: "10-Jul-2025", crop: "Cotton", invoiceNo: "#INV125", amount: 85000 }
    ],
    installments: [
      { id: "1", invoiceNo: "#INV125", amount: 85000, dueDate: "22-Jul-2025", status: "Due Soon" }
    ],
    payments: []
  },
  "3": {
    id: "3",
    name: "Safeer Bros",
    contacts: ["0333-5555555", "0321-4444444"],
    bankName: "ABL",
    accountNo: "5555444433",
    iban: "PK12ABL0000005555444433",
    walletNumber: "0310-5555555",
    walletType: "Easypaisa",
    netReceivable: 120000,
    invoices: [
      { id: "1", date: "09-Jul-2025", crop: "Sugarcane", invoiceNo: "#INV126", amount: 120000 }
    ],
    installments: [
      { id: "1", invoiceNo: "#INV126", amount: 120000, dueDate: "30-Jul-2025", status: "Pending" }
    ],
    payments: []
  }
};

export function BuyerProfile() {
  const { id } = useParams<{ id: string }>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedInstallmentId, setSelectedInstallmentId] = useState<string | null>(null);
  const [editBuyer, setEditBuyer] = useState({
    name: "",
    contacts: "",
    bankName: "",
    accountNo: "",
    iban: "",
    walletNumber: "",
    walletType: "",
    notes: ""
  });

  const buyer = id ? mockBuyerDetails[id as keyof typeof mockBuyerDetails] : null;

  if (!buyer) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold mb-2">Buyer Not Found</h2>
          <p className="text-muted-foreground mb-4">The buyer you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/buyers">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Buyers
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    setEditBuyer({
      name: buyer.name,
      contacts: buyer.contacts.join(", "),
      bankName: buyer.bankName,
      accountNo: buyer.accountNo,
      iban: buyer.iban,
      walletNumber: buyer.walletNumber,
      walletType: buyer.walletType,
      notes: ""
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    console.log("Saving buyer edit:", editBuyer);
    setIsEditModalOpen(false);
  };

  const handleAddPayment = (installmentId?: string) => {
    setSelectedInstallmentId(installmentId || null);
    setIsPaymentModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      "Overdue": "text-red-600 bg-red-50",
      "Due Soon": "text-orange-600 bg-orange-50",
      "Pending": "text-gray-600 bg-gray-50"
    };
    const colorClass = statusColors[status as keyof typeof statusColors] || "text-gray-600 bg-gray-50";
    return `px-2 py-1 rounded-full text-xs font-medium ${colorClass}`;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button asChild variant="outline">
          <Link to="/buyers">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Buyers
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold">{buyer.name}</CardTitle>
              <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                <p><strong>Contacts:</strong> {buyer.contacts.join(", ")}</p>
                <p><strong>Bank A/C:</strong> {buyer.bankName}, {buyer.accountNo}, {buyer.iban}</p>
                <p><strong>Wallet:</strong> {buyer.walletNumber} ({buyer.walletType})</p>
                <p className="text-lg font-semibold text-foreground">
                  <strong>Net Receivable:</strong> PKR {buyer.netReceivable.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            {buyer.netReceivable > 0 && (
              <Button onClick={() => handleAddPayment()}>
                <CreditCard className="h-4 w-4 mr-2" />
                Add Payment
              </Button>
            )}
            
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Buyer
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit Buyer</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-name">Name</Label>
                    <Input
                      id="edit-name"
                      value={editBuyer.name}
                      onChange={(e) => setEditBuyer({...editBuyer, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-contacts">Contacts</Label>
                    <Input
                      id="edit-contacts"
                      value={editBuyer.contacts}
                      onChange={(e) => setEditBuyer({...editBuyer, contacts: e.target.value})}
                      placeholder="0321..., 0345..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="edit-bank-name">Bank Name</Label>
                      <Input
                        id="edit-bank-name"
                        value={editBuyer.bankName}
                        onChange={(e) => setEditBuyer({...editBuyer, bankName: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-account-no">A/C No</Label>
                      <Input
                        id="edit-account-no"
                        value={editBuyer.accountNo}
                        onChange={(e) => setEditBuyer({...editBuyer, accountNo: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="edit-iban">IBAN</Label>
                    <Input
                      id="edit-iban"
                      value={editBuyer.iban}
                      onChange={(e) => setEditBuyer({...editBuyer, iban: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="edit-wallet-number">Wallet Number</Label>
                      <Input
                        id="edit-wallet-number"
                        value={editBuyer.walletNumber}
                        onChange={(e) => setEditBuyer({...editBuyer, walletNumber: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-wallet-type">Wallet Type</Label>
                      <Input
                        id="edit-wallet-type"
                        value={editBuyer.walletType}
                        onChange={(e) => setEditBuyer({...editBuyer, walletType: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="edit-notes">Notes</Label>
                    <Textarea
                      id="edit-notes"
                      value={editBuyer.notes}
                      onChange={(e) => setEditBuyer({...editBuyer, notes: e.target.value})}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveEdit}>
                      Save
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Ledger
            </Button>
          </div>

          <Tabs defaultValue="invoices" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
              <TabsTrigger value="installments">Installments</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
            </TabsList>

            <TabsContent value="invoices">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Crop</TableHead>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Invoice</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {buyer.invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>{invoice.date}</TableCell>
                      <TableCell>{invoice.crop}</TableCell>
                      <TableCell className="font-medium">{invoice.invoiceNo}</TableCell>
                      <TableCell>PKR {invoice.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="installments">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {buyer.installments.map((installment) => (
                    <TableRow key={installment.id}>
                      <TableCell className="font-medium">{installment.invoiceNo}</TableCell>
                      <TableCell>PKR {installment.amount.toLocaleString()}</TableCell>
                      <TableCell>{installment.dueDate}</TableCell>
                      <TableCell>
                        <span className={getStatusBadge(installment.status)}>
                          {installment.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleAddPayment(installment.id)}
                        >
                          <CreditCard className="h-4 w-4 mr-1" />
                          Add Payment
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="payments">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead>Bank</TableHead>
                    <TableHead>Ref No.</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {buyer.payments.length > 0 ? (
                    buyer.payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{payment.date}</TableCell>
                        <TableCell>PKR {payment.amount.toLocaleString()}</TableCell>
                        <TableCell>{payment.mode}</TableCell>
                        <TableCell>{payment.bank}</TableCell>
                        <TableCell>{payment.refNo || "—"}</TableCell>
                        <TableCell>{payment.notes}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No payments recorded yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <AddPaymentModal
        buyerId={buyer.id}
        installmentId={selectedInstallmentId}
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      />
    </div>
  );
}
