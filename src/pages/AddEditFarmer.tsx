
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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
    bankName: "",
    accountNo: "",
    iban: "",
    walletProvider: "",
    walletNumber: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.cnic || !formData.village || !formData.contacts[0]) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Here you would typically save to database
    toast({
      title: isEditing ? "Farmer Updated" : "Farmer Added",
      description: `${formData.name} has been ${isEditing ? 'updated' : 'added'} successfully.`,
    });

    navigate("/farmers");
  };

  const addContact = () => {
    setFormData(prev => ({
      ...prev,
      contacts: [...prev.contacts, ""]
    }));
  };

  const removeContact = (index: number) => {
    if (formData.contacts.length > 1) {
      setFormData(prev => ({
        ...prev,
        contacts: prev.contacts.filter((_, i) => i !== index)
      }));
    }
  };

  const updateContact = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      contacts: prev.contacts.map((contact, i) => i === index ? value : contact)
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
            {isEditing ? "Update farmer information" : "Register a new farmer in the system"}
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
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter farmer's full name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="cnic">CNIC *</Label>
                <Input
                  id="cnic"
                  value={formData.cnic}
                  onChange={(e) => setFormData(prev => ({ ...prev, cnic: e.target.value }))}
                  placeholder="35201-1234567-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="village">Village *</Label>
                <Input
                  id="village"
                  value={formData.village}
                  onChange={(e) => setFormData(prev => ({ ...prev, village: e.target.value }))}
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
                    onChange={(e) => setFormData(prev => ({ ...prev, profilePhoto: e.target.files?.[0] || null }))}
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
              <CardTitle>Bank Details (Optional)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="bankName">Bank Name</Label>
                <Select value={formData.bankName} onValueChange={(value) => setFormData(prev => ({ ...prev, bankName: value }))}>
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
                <Label htmlFor="accountNo">Account Number</Label>
                <Input
                  id="accountNo"
                  value={formData.accountNo}
                  onChange={(e) => setFormData(prev => ({ ...prev, accountNo: e.target.value }))}
                  placeholder="Enter account number"
                />
              </div>

              <div>
                <Label htmlFor="iban">IBAN</Label>
                <Input
                  id="iban"
                  value={formData.iban}
                  onChange={(e) => setFormData(prev => ({ ...prev, iban: e.target.value }))}
                  placeholder="PK36SCBL0000001123456702"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Mobile Wallet (Optional)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="walletProvider">Provider</Label>
                <Select value={formData.walletProvider} onValueChange={(value) => setFormData(prev => ({ ...prev, walletProvider: value }))}>
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
                <Label htmlFor="walletNumber">Number</Label>
                <Input
                  id="walletNumber"
                  value={formData.walletNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, walletNumber: e.target.value }))}
                  placeholder="0321-1234567"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="submit">
              {isEditing ? "Update Farmer" : "Save Farmer"}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate("/farmers")}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
