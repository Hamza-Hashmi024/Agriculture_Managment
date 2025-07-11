
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Eye, Plus, Download, Search, Filter } from "lucide-react";

const mockVendors = [
  {
    id: 1,
    name: "AgriMart",
    type: "Supplier",
    netPayable: 112000,
    lastPurchase: "10-Jul",
    lastPayment: "11-Jul"
  },
  {
    id: 2,
    name: "Kissan Agri",
    type: "Supplier",
    netPayable: 47500,
    lastPurchase: "09-Jul",
    lastPayment: null
  },
  {
    id: 3,
    name: "Expense",
    type: "Expense",
    netPayable: 28000,
    lastPurchase: "01-Jul",
    lastPayment: null
  },
  {
    id: 4,
    name: "Farm Equipment Co",
    type: "Supplier",
    netPayable: 0,
    lastPurchase: "15-Jun",
    lastPayment: "16-Jun"
  }
];

export function VendorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [outstandingOnly, setOutstandingOnly] = useState(false);
  const [addVendorDialog, setAddVendorDialog] = useState(false);
  const [vendorForm, setVendorForm] = useState({
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

  const filteredVendors = mockVendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || vendor.type.toLowerCase() === typeFilter.toLowerCase();
    const matchesOutstanding = !outstandingOnly || vendor.netPayable > 0;
    return matchesSearch && matchesType && matchesOutstanding;
  });

  const handleAddContact = () => {
    setVendorForm({
      ...vendorForm,
      contacts: [...vendorForm.contacts, ""]
    });
  };

  const handleContactChange = (index: number, value: string) => {
    const newContacts = [...vendorForm.contacts];
    newContacts[index] = value;
    setVendorForm({
      ...vendorForm,
      contacts: newContacts
    });
  };

  const handleRemoveContact = (index: number) => {
    const newContacts = vendorForm.contacts.filter((_, i) => i !== index);
    setVendorForm({
      ...vendorForm,
      contacts: newContacts.length > 0 ? newContacts : [""]
    });
  };

  const handleSaveVendor = () => {
    console.log("Saving vendor:", vendorForm);
    setAddVendorDialog(false);
    // Reset form
    setVendorForm({
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
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Vendors</h1>
          <p className="text-muted-foreground">Manage suppliers and expense vendors</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={addVendorDialog} onOpenChange={setAddVendorDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Vendor
              </Button>
            </DialogTrigger>
          </Dialog>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="search">Search Vendor</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by vendor name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label>Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="supplier">Supplier</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="outstanding"
                checked={outstandingOnly}
                onChange={(e) => setOutstandingOnly(e.target.checked)}
                className="h-4 w-4"
              />
              <Label htmlFor="outstanding">Outstanding Only</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vendors Table */}
      <Card>
        <CardHeader>
          <CardTitle>Vendor List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Net Payable</TableHead>
                <TableHead>Last Purchase</TableHead>
                <TableHead>Last Payment</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell className="font-medium">{vendor.name}</TableCell>
                  <TableCell>{vendor.type}</TableCell>
                  <TableCell>PKR {vendor.netPayable.toLocaleString()}</TableCell>
                  <TableCell>{vendor.lastPurchase}</TableCell>
                  <TableCell>{vendor.lastPayment || "—"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/vendors/${vendor.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </Button>
                      <Button 
                        size="sm" 
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

      {/* Add Vendor Modal */}
      <Dialog open={addVendorDialog} onOpenChange={setAddVendorDialog}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Vendor</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={vendorForm.name}
                onChange={(e) => setVendorForm({...vendorForm, name: e.target.value})}
                placeholder="Enter vendor name"
              />
            </div>

            <div>
              <Label>Type</Label>
              <RadioGroup 
                value={vendorForm.type} 
                onValueChange={(value) => setVendorForm({...vendorForm, type: value})}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="supplier" id="supplier" />
                  <Label htmlFor="supplier">Supplier</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="expense" id="expense" />
                  <Label htmlFor="expense">Expense</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Contacts</Label>
              {vendorForm.contacts.map((contact, index) => (
                <div key={index} className="flex gap-2 mt-2">
                  <Input
                    value={contact}
                    onChange={(e) => handleContactChange(index, e.target.value)}
                    placeholder="Enter contact number"
                  />
                  {vendorForm.contacts.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveContact(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddContact}
                className="mt-2"
              >
                Add Contact
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Bank Account</Label>
              <Input
                value={vendorForm.bankName}
                onChange={(e) => setVendorForm({...vendorForm, bankName: e.target.value})}
                placeholder="Bank name"
              />
              <Input
                value={vendorForm.accountNo}
                onChange={(e) => setVendorForm({...vendorForm, accountNo: e.target.value})}
                placeholder="Account number"
              />
              <Input
                value={vendorForm.iban}
                onChange={(e) => setVendorForm({...vendorForm, iban: e.target.value})}
                placeholder="IBAN"
              />
            </div>

            <div className="space-y-2">
              <Label>Wallet</Label>
              <Input
                value={vendorForm.walletNumber}
                onChange={(e) => setVendorForm({...vendorForm, walletNumber: e.target.value})}
                placeholder="Wallet number"
              />
              <Input
                value={vendorForm.walletType}
                onChange={(e) => setVendorForm({...vendorForm, walletType: e.target.value})}
                placeholder="Wallet type (e.g., JazzCash)"
              />
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea
                value={vendorForm.notes}
                onChange={(e) => setVendorForm({...vendorForm, notes: e.target.value})}
                placeholder="Additional notes"
                rows={3}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleSaveVendor} className="flex-1">
                Save Vendor
              </Button>
              <Button variant="outline" onClick={() => setAddVendorDialog(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
