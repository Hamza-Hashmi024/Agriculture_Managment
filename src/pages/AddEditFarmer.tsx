import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { RegisterFarmer } from "@/Api/Api";

export function AddEditFarmer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: "",
    cnic: "",
    village: "",
    contacts: [""],
    profilePhoto: null as File | null,
    bankAccounts: [{ bankName: "", accountNo: "", iban: "" }],
    wallets: [{ provider: "", number: "" }],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.cnic ||
      !formData.village ||
      !formData.contacts[0]
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const submissionData = {
      tenant_id: 1, // Replace this with actual tenant_id (e.g., from context or user session)
      name: formData.name,
      cnic: formData.cnic,
      village: formData.village,
      profile_photo_url: "", // You need to handle image upload separately, or remove this if not used
      contacts: formData.contacts.filter(Boolean),
      bankAccounts: formData.bankAccounts.filter(
        (acc) => acc.bankName || acc.accountNo || acc.iban
      ),
      wallets: formData.wallets.filter(
        (wallet) => wallet.provider || wallet.number
      ),
    };

    try {
      await RegisterFarmer(submissionData);

      toast({
        title: isEditing ? "Farmer Updated" : "Farmer Added",
        description: `${formData.name} has been ${
          isEditing ? "updated" : "added"
        } successfully.`,
      });

      navigate("/farmers");
    } catch (err) {
      toast({
        title: "Error",
        description: "Something went wrong while saving the farmer.",
        variant: "destructive",
      });
    }
  };

  const addContact = () => {
    setFormData((prev) => ({
      ...prev,
      contacts: [...prev.contacts, ""],
    }));
  };

  const removeContact = (index: number) => {
    if (formData.contacts.length > 1) {
      setFormData((prev) => ({
        ...prev,
        contacts: prev.contacts.filter((_, i) => i !== index),
      }));
    }
  };

  const updateContact = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      contacts: prev.contacts.map((contact, i) =>
        i === index ? value : contact
      ),
    }));
  };

  const addBankAccount = () => {
    setFormData((prev) => ({
      ...prev,
      bankAccounts: [
        ...prev.bankAccounts,
        { bankName: "", accountNo: "", iban: "" },
      ],
    }));
  };

  const removeBankAccount = (index: number) => {
    if (formData.bankAccounts.length > 1) {
      setFormData((prev) => ({
        ...prev,
        bankAccounts: prev.bankAccounts.filter((_, i) => i !== index),
      }));
    }
  };

  const updateBankAccount = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      bankAccounts: prev.bankAccounts.map((account, i) =>
        i === index ? { ...account, [field]: value } : account
      ),
    }));
  };

  const addWallet = () => {
    setFormData((prev) => ({
      ...prev,
      wallets: [...prev.wallets, { provider: "", number: "" }],
    }));
  };

  const removeWallet = (index: number) => {
    if (formData.wallets.length > 1) {
      setFormData((prev) => ({
        ...prev,
        wallets: prev.wallets.filter((_, i) => i !== index),
      }));
    }
  };

  const updateWallet = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      wallets: prev.wallets.map((wallet, i) =>
        i === index ? { ...wallet, [field]: value } : wallet
      ),
    }));
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/farmers")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Farmers
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEditing ? "Edit Farmer" : "Add New Farmer"}
          </h1>
          <p className="text-muted-foreground">
            {isEditing
              ? "Update farmer information"
              : "Register a new farmer in the system"}
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Enter farmer's full name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="cnic">CNIC *</Label>
                <Input
                  id="cnic"
                  value={formData.cnic}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, cnic: e.target.value }))
                  }
                  placeholder="35201-1234567-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="village">Village *</Label>
                <Input
                  id="village"
                  value={formData.village}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      village: e.target.value,
                    }))
                  }
                  placeholder="Enter village name"
                  required
                />
              </div>

              <div>
                <Label>Contacts * (At least one required)</Label>
                <div className="space-y-2">
                  {formData.contacts.map((contact, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={contact}
                        onChange={(e) => updateContact(index, e.target.value)}
                        placeholder="0300-1234567"
                        required={index === 0}
                      />
                      {formData.contacts.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeContact(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addContact}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Contact
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="photo">Profile Photo</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        profilePhoto: e.target.files?.[0] || null,
                      }))
                    }
                  />
                  <Button type="button" variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Bank Accounts (Optional)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.bankAccounts.map((account, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Bank Account {index + 1}</h4>
                    {formData.bankAccounts.length > 1 && (
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

                  <div>
                    <Label>Bank Name</Label>
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
                  </div>

                  <div>
                    <Label>Account Number</Label>
                    <Input
                      value={account.accountNo}
                      onChange={(e) =>
                        updateBankAccount(index, "accountNo", e.target.value)
                      }
                      placeholder="Enter account number"
                    />
                  </div>

                  <div>
                    <Label>IBAN</Label>
                    <Input
                      value={account.iban}
                      onChange={(e) =>
                        updateBankAccount(index, "iban", e.target.value)
                      }
                      placeholder="PK36SCBL0000001123456702"
                    />
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addBankAccount}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Bank Account
              </Button>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Mobile Wallets (Optional)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.wallets.map((wallet, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Mobile Wallet {index + 1}</h4>
                    {formData.wallets.length > 1 && (
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

                  <div>
                    <Label>Provider</Label>
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
                  </div>

                  <div>
                    <Label>Number</Label>
                    <Input
                      value={wallet.number}
                      onChange={(e) =>
                        updateWallet(index, "number", e.target.value)
                      }
                      placeholder="0321-1234567"
                    />
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addWallet}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Mobile Wallet
              </Button>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="submit">
              {isEditing ? "Update Farmer" : "Save Farmer"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/farmers")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
