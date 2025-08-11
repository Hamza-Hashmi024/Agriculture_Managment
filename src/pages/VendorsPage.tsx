import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Eye, Plus, Download, Search, Filter, Trash2 } from "lucide-react";
import { RegisterVendor, GetVendorList } from "@/Api/Api";

export function VendorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [vendors, setVendors] = useState<any[]>([]);
  const [outstandingOnly, setOutstandingOnly] = useState(false);
  const [addVendorDialog, setAddVendorDialog] = useState(false);
  const [vendorForm, setVendorForm] = useState({
    name: "",
    type: "supplier",
    contacts: [""],
    bankAccounts: [{ bankName: "", accountNo: "", iban: "" }],
    wallets: [{ provider: "", number: "" }],
    notes: "",
  });

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch = vendor.VendorName?.toLowerCase().includes(
      searchTerm.toLowerCase()
    );
    const matchesType =
      typeFilter === "all" ||
      vendor.Type?.toLowerCase() === typeFilter.toLowerCase();
    const matchesOutstanding =
      !outstandingOnly || parseFloat(vendor.NetPayable) > 0;
    return matchesSearch && matchesType && matchesOutstanding;
  });

  const handleAddContact = () => {
    setVendorForm({
      ...vendorForm,
      contacts: [...vendorForm.contacts, ""],
    });
  };

  const handleContactChange = (index: number, value: string) => {
    const newContacts = [...vendorForm.contacts];
    newContacts[index] = value;
    setVendorForm({
      ...vendorForm,
      contacts: newContacts,
    });
  };

  const handleRemoveContact = (index: number) => {
    const newContacts = vendorForm.contacts.filter((_, i) => i !== index);
    setVendorForm({
      ...vendorForm,
      contacts: newContacts.length > 0 ? newContacts : [""],
    });
  };

  const addBankAccount = () => {
    setVendorForm((prev) => ({
      ...prev,
      bankAccounts: [
        ...prev.bankAccounts,
        { bankName: "", accountNo: "", iban: "" },
      ],
    }));
  };

  const removeBankAccount = (index: number) => {
    if (vendorForm.bankAccounts.length > 1) {
      setVendorForm((prev) => ({
        ...prev,
        bankAccounts: prev.bankAccounts.filter((_, i) => i !== index),
      }));
    }
  };

  const updateBankAccount = (index: number, field: string, value: string) => {
    setVendorForm((prev) => ({
      ...prev,
      bankAccounts: prev.bankAccounts.map((account, i) =>
        i === index ? { ...account, [field]: value } : account
      ),
    }));
  };

  const addWallet = () => {
    setVendorForm((prev) => ({
      ...prev,
      wallets: [...prev.wallets, { provider: "", number: "" }],
    }));
  };

  const removeWallet = (index: number) => {
    if (vendorForm.wallets.length > 1) {
      setVendorForm((prev) => ({
        ...prev,
        wallets: prev.wallets.filter((_, i) => i !== index),
      }));
    }
  };

  const updateWallet = (index: number, field: string, value: string) => {
    setVendorForm((prev) => ({
      ...prev,
      wallets: prev.wallets.map((wallet, i) =>
        i === index ? { ...wallet, [field]: value } : wallet
      ),
    }));
  };

  const handleSaveVendor = async () => {
    try {
      console.log("Submitting vendor:", vendorForm);
      await RegisterVendor({
        tenant_id: 1,
        ...vendorForm,
      });

      // Close modal and reset form
      setAddVendorDialog(false);
      setVendorForm({
        name: "",
        type: "supplier",
        contacts: [""],
        bankAccounts: [{ bankName: "", accountNo: "", iban: "" }],
        wallets: [{ provider: "", number: "" }],
        notes: "",
      });
    } catch (error) {
      console.error("Error saving vendor:", error);
    }
  };

  const FetchVendorList = async () => {
    try {
      const data = await GetVendorList();
      setVendors(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    FetchVendorList();
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Vendors</h1>
          <p className="text-muted-foreground">
            Manage suppliers and expense vendors
          </p>
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
              {filteredVendors.map((vendor, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {vendor.VendorName}
                  </TableCell>
                  <TableCell>{vendor.Type}</TableCell>
                  <TableCell>
                    {vendor.NetPayable !== null
                      ? `PKR ${parseFloat(vendor.NetPayable).toLocaleString()}`
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {vendor.LastPurchase
                      ? new Date(vendor.LastPurchase).toLocaleDateString()
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {vendor.LastPayment
                      ? new Date(vendor.LastPayment).toLocaleDateString()
                      : "—"}
                  </TableCell>
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
                        disabled={
                          !vendor.NetPayable ||
                          parseFloat(vendor.NetPayable) <= 0
                        }
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
                onChange={(e) =>
                  setVendorForm({ ...vendorForm, name: e.target.value })
                }
                placeholder="Enter vendor name"
              />
            </div>

            <div>
              <Label>Type</Label>
              <RadioGroup
                value={vendorForm.type}
                onValueChange={(value) =>
                  setVendorForm({ ...vendorForm, type: value })
                }
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

            <div>
              <Label>Bank Accounts</Label>
              {vendorForm.bankAccounts.map((account, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-3 space-y-3 mt-2"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-sm">
                      Bank Account {index + 1}
                    </h4>
                    {vendorForm.bankAccounts.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeBankAccount(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <Select
                    value={account.bankName}
                    onValueChange={(value) =>
                      updateBankAccount(index, "bankName", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select bank" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hbl">HBL</SelectItem>
                      <SelectItem value="ubl">UBL</SelectItem>
                      <SelectItem value="mcb">MCB</SelectItem>
                      <SelectItem value="meezan">Meezan Bank</SelectItem>
                      <SelectItem value="allied">Allied Bank</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    value={account.accountNo}
                    onChange={(e) =>
                      updateBankAccount(index, "accountNo", e.target.value)
                    }
                    placeholder="Account number"
                  />

                  <Input
                    value={account.iban}
                    onChange={(e) =>
                      updateBankAccount(index, "iban", e.target.value)
                    }
                    placeholder="IBAN"
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addBankAccount}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Bank Account
              </Button>
            </div>

            <div>
              <Label>Mobile Wallets</Label>
              {vendorForm.wallets.map((wallet, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-3 space-y-3 mt-2"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-sm">
                      Mobile Wallet {index + 1}
                    </h4>
                    {vendorForm.wallets.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeWallet(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <Select
                    value={wallet.provider}
                    onValueChange={(value) =>
                      updateWallet(index, "provider", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select wallet provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jazzcash">JazzCash</SelectItem>
                      <SelectItem value="easypaisa">Easypaisa</SelectItem>
                      <SelectItem value="sadapay">SadaPay</SelectItem>
                      <SelectItem value="nayapay">NayaPay</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    value={wallet.number}
                    onChange={(e) =>
                      updateWallet(index, "number", e.target.value)
                    }
                    placeholder="Wallet number"
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addWallet}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Mobile Wallet
              </Button>
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea
                value={vendorForm.notes}
                onChange={(e) =>
                  setVendorForm({ ...vendorForm, notes: e.target.value })
                }
                placeholder="Additional notes"
                rows={3}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleSaveVendor} className="flex-1">
                Save Vendor
              </Button>
              <Button
                variant="outline"
                onClick={() => setAddVendorDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
