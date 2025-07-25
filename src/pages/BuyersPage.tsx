
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Plus, Download, Eye, CreditCard } from "lucide-react";
import { AddPaymentModal } from "@/components/AddPaymentModal";
import { RegisterBuyer } from "@/Api/Api";

// Mock data for buyers
const mockBuyers = [
  {
    id: "1",
    name: "Pak Foods",
    netReceivable: 210000,
    lastSale: "12-Jul-2025",
    lastPayment: "14-Jul-2025"
  },
  {
    id: "2", 
    name: "Noor Traders",
    netReceivable: 85000,
    lastSale: "10-Jul-2025",
    lastPayment: "10-Jul-2025"
  },
  {
    id: "3",
    name: "Safeer Bros",
    netReceivable: 120000,
    lastSale: "09-Jul-2025",
    lastPayment: null
  },
  {
    id: "4",
    name: "Fresh Market",
    netReceivable: 0,
    lastSale: "08-Jul-2025", 
    lastPayment: "08-Jul-2025"
  }
];

export function BuyersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [outstandingOnly, setOutstandingOnly] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedBuyerId, setSelectedBuyerId] = useState<string>("");
  const [newBuyer, setNewBuyer] = useState({
    name: "",
    contacts: "",
    bankName: "",
    accountNo: "",
    iban: "",
    walletNumber: "",
    walletType: "",
    notes: ""
  });

  const filteredBuyers = mockBuyers.filter(buyer => {
    const matchesSearch = buyer.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = outstandingOnly ? buyer.netReceivable > 0 : true;
    return matchesSearch && matchesFilter;
  });

  // const handleAddBuyer = () => {
  //   console.log("Adding buyer:", newBuyer);
  //   setIsAddModalOpen(false);
  //   setNewBuyer({
  //     name: "",
  //     contacts: "",
  //     bankName: "",
  //     accountNo: "",
  //     iban: "",
  //     walletNumber: "",
  //     walletType: "",
  //     notes: ""
  //   });
  // };


  
const handleAddBuyer = async () => {
  const buyerData = {
    tenantId: 1, // or fetch dynamically
    name: newBuyer.name,
    notes: newBuyer.notes,
    contacts: [
      { phoneNumber: newBuyer.contacts }
    ],
    bankAccounts: [
      {
        bankName: newBuyer.bankName,
        accountNumber: newBuyer.accountNo,
        iban: newBuyer.iban
      }
    ],
    wallets: [
      {
        walletNumber: newBuyer.walletNumber,
        provider: newBuyer.walletType
      }
    ]
  };

  try {
    const response = await RegisterBuyer(buyerData);
    console.log("Buyer registered successfully:", response);
    

    setIsAddModalOpen(false);
    setNewBuyer({
      name: "",
      contacts: "",
      bankName: "",
      accountNo: "",
      iban: "",
      walletNumber: "",
      walletType: "",
      notes: ""
    });
  } catch (error) {
    console.error("Error registering buyer:", error);
   
  }
};


  const handleAddPayment = (buyerId: string) => {
    setSelectedBuyerId(buyerId);
    setIsPaymentModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Buyers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search Buyer"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="outstanding-only"
                checked={outstandingOnly}
                onCheckedChange={(checked) => setOutstandingOnly(checked as boolean)}
              />
              <Label htmlFor="outstanding-only">Outstanding Only</Label>
            </div>

            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Buyer
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Buyer</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newBuyer.name}
                      onChange={(e) => setNewBuyer({...newBuyer, name: e.target.value})}
                      placeholder="Buyer name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contacts">Contacts</Label>
                    <Input
                      id="contacts"
                      value={newBuyer.contacts}
                      onChange={(e) => setNewBuyer({...newBuyer, contacts: e.target.value})}
                      placeholder="0321..., 0345..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="bank-name">Bank Name</Label>
                      <Input
                        id="bank-name"
                        value={newBuyer.bankName}
                        onChange={(e) => setNewBuyer({...newBuyer, bankName: e.target.value})}
                        placeholder="Bank name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="account-no">A/C No</Label>
                      <Input
                        id="account-no"
                        value={newBuyer.accountNo}
                        onChange={(e) => setNewBuyer({...newBuyer, accountNo: e.target.value})}
                        placeholder="Account number"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="iban">IBAN</Label>
                    <Input
                      id="iban"
                      value={newBuyer.iban}
                      onChange={(e) => setNewBuyer({...newBuyer, iban: e.target.value})}
                      placeholder="IBAN"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="wallet-number">Wallet Number</Label>
                      <Input
                        id="wallet-number"
                        value={newBuyer.walletNumber}
                        onChange={(e) => setNewBuyer({...newBuyer, walletNumber: e.target.value})}
                        placeholder="0315..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="wallet-type">Wallet Type</Label>
                      <Input
                        id="wallet-type"
                        value={newBuyer.walletType}
                        onChange={(e) => setNewBuyer({...newBuyer, walletType: e.target.value})}
                        placeholder="JazzCash, Easypaisa"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={newBuyer.notes}
                      onChange={(e) => setNewBuyer({...newBuyer, notes: e.target.value})}
                      placeholder="Additional notes"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddBuyer}>
                      Save
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Buyer Name</TableHead>
                <TableHead>Net Receivable</TableHead>
                <TableHead>Last Sale</TableHead>
                <TableHead>Last Payment</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBuyers.map((buyer) => (
                <TableRow key={buyer.id}>
                  <TableCell className="font-medium">{buyer.name}</TableCell>
                  <TableCell>
                    <span className={buyer.netReceivable > 0 ? "text-orange-600 font-medium" : "text-green-600"}>
                      PKR {buyer.netReceivable.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>{buyer.lastSale}</TableCell>
                  <TableCell>{buyer.lastPayment || "—"}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/buyers/${buyer.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </Button>
                      {buyer.netReceivable > 0 && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleAddPayment(buyer.id)}
                        >
                          <CreditCard className="h-4 w-4 mr-1" />
                          Add Payment
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredBuyers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No buyers found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>

      <AddPaymentModal
        buyerId={selectedBuyerId}
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      />
    </div>
  );
}
