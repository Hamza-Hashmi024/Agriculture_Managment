import { useState  ,  useEffect } from "react";
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
import { ArrowLeft, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { GetAllTaxRules ,  CreateEmployee } from "@/Api/Api";

export function AddEmployer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [taxes ,  setTaxes] = useState<any[]>([]);
  const isEditing = !!id;
  const [formData, setFormData] = useState({
    name: "",
    employeeId: "",
    department: "",
    cnic: "",
    address: "",
    designation: "",
    joiningDate: "",
    tax: "",
    allowance: "",
    contacts: [""],
    salary: "",
    profilePhoto: null as File | null,
    bankAccounts: [{ bankName: "", accountNo: "", iban: "" }],
    wallets: [{ provider: "", number: "" }],
  });


  const showError = (msg: string) => {
  toast({
    title: "Validation Error",
    description: msg,
    variant: "destructive",
  });
};

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // validation
  if (!formData.name.trim()) return showError("Name is required");
  if (formData.contacts.every(c => !c.trim())) return showError("At least one valid contact is required");
  if (!validateCNIC(formData.cnic)) return showError("Invalid CNIC format");
  if (formData.contacts.some(c => !validatePhone(c))) return showError("Invalid phone number format");

  try {
    // 👇 FormData instead of plain object
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("cnic", formData.cnic);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("designation", formData.designation);
    formDataToSend.append("joiningDate", formData.joiningDate);
    formDataToSend.append("tax", formData.tax);
    formDataToSend.append("allowance", formData.allowance);
    formDataToSend.append("salary", formData.salary);

    // ✅ file append
    if (formData.profilePhoto) {
      formDataToSend.append("profilePhoto", formData.profilePhoto);
    }

    // ✅ arrays/objects must be stringified
    formDataToSend.append("contacts", JSON.stringify(formData.contacts.filter(c => c.trim() !== "")));
    formDataToSend.append("bankAccounts", JSON.stringify(formData.bankAccounts));
    formDataToSend.append("wallets", JSON.stringify(formData.wallets));
    for (let pair of formDataToSend.entries()) {
  console.log(pair[0], pair[1]);
}

    await CreateEmployee(formDataToSend);

    toast({
      title: "Employer Added",
      description: `${formData.name} has been added successfully.`,
    });

    navigate("/employees");
  } catch (error: any) {
    toast({
      title: "Error",
      description: error?.response?.data?.error || "Something went wrong while saving employee.",
      variant: "destructive",
    });
  }
};

  // ---------- Contact Handlers ----------
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


const validateCNIC = (cnic: string): boolean => {
  const regex = /^([0-9]{5})-([0-9]{7})-([0-9]{1})$/;
  const match = cnic.match(regex);

  if (!match) return false;

  const firstPart = match[1];
  const middlePart = match[2];
  const lastDigit = parseInt(match[3]);

  if (!/^[0-9]{5}$/.test(firstPart)) return false;
  if (!/^[0-9]{7}$/.test(middlePart)) return false;
  if (isNaN(lastDigit)) return false;

  return true;
};

// Phone Number Validation (Pakistani format)
const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(?:\+92|0)?3[0-9]{2}-?[0-9]{7}$/;
  return phoneRegex.test(phone);
};

  const updateContact = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      contacts: prev.contacts.map((contact, i) =>
        i === index ? value : contact
      ),
    }));
  };

  // ---------- Bank Account Handlers ----------
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
      bankAccounts: prev.bankAccounts.map((acc, i) =>
        i === index ? { ...acc, [field]: value } : acc
      ),
    }));
  };

  // ---------- Wallet Handlers ----------
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
      wallets: prev.wallets.map((w, i) =>
        i === index ? { ...w, [field]: value } : w
      ),
    }));
  };

  useEffect(() => {
    const fetchTaxes = async () =>{
      try {
        const response = await GetAllTaxRules();
        console.log("Fetched tax rules:", response);
         setTaxes(response);
      }catch(error){
        console.error("Failed to fetch tax rules:", error);
      }
    }

    fetchTaxes();
  },[])

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/employees")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Employers
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEditing ? "Edit Employer" : "Add New Employer"}
          </h1>
          <p className="text-muted-foreground">
            {isEditing
              ? "Update employer information"
              : "Register a new employer in the system"}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit}>
          {/* Basic Info */}
           {/* Basic Info */}
         <Card className="mb-6">
  <CardHeader>
    <CardTitle>Basic Information</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    {/* Name */}
    <div>
      <Label htmlFor="name">Full Name *</Label>
      <Input
        id="name"
        value={formData.name}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, name: e.target.value }))
        }
        placeholder="Enter employee full name"
        required
      />
    </div>

    {/* CNIC */}
    <div>
      <Label htmlFor="cnic">CNIC *</Label>
      <Input
        id="cnic"
        value={formData.cnic}
        onChange={(e) => {
          let value = e.target.value.replace(/[^0-9]/g, ""); // सिर्फ digits allow

          // Auto add dashes → XXXXX-XXXXXXX-X
          if (value.length > 5 && value.length <= 12) {
            value = value.slice(0, 5) + "-" + value.slice(5);
          }
          if (value.length > 13) {
            value =
              value.slice(0, 5) +
              "-" +
              value.slice(5, 12) +
              "-" +
              value.slice(12, 13);
          }

          setFormData((prev) => ({ ...prev, cnic: value }));
        }}
        onBlur={(e) => {
          if (!validateCNIC(e.target.value)) {
            toast({
              title: "Invalid CNIC",
              description: "CNIC must follow format 12345-1234567-1 and rules.",
              variant: "destructive",
            });
          }
        }}
        placeholder="35201-1234567-1"
        required
        maxLength={15}
      />
    </div>

    {/* Address */}
    <div>
      <Label htmlFor="address">Address *</Label>
      <Input
        id="address"
        value={formData.address}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, address: e.target.value }))
        }
        placeholder="House #, Street, City"
        required
      />
    </div>

    {/* Designation */}
    <div>
      <Label htmlFor="designation">Designation *</Label>
      <Input
        id="designation"
        value={formData.designation}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            designation: e.target.value,
          }))
        }
        placeholder="e.g. Accountant, Sales Executive, Operations Manager"
        required
      />
    </div>

    {/* Joining Date */}
    <div>
      <Label htmlFor="joiningDate">Joining Date *</Label>
      <Input
        id="joiningDate"
        type="date"
        value={formData.joiningDate}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, joiningDate: e.target.value }))
        }
        required
      />
    </div>

    {/* Salary */}
    <div>
      <Label htmlFor="salary">Salary</Label>
      <Input
        id="salary"
        type="number"
        value={formData.salary}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, salary: e.target.value }))
        }
        placeholder="$4000"
      />
    </div>

    {/* Tax Selection */}
<div>
  <Label htmlFor="tax">Tax Deduction *</Label>
  <Select
    value={formData.tax}
    onValueChange={(value) =>
      setFormData((prev) => ({ ...prev, tax: value }))
    }
  >
    <SelectTrigger className="w-full">
      <SelectValue placeholder="Select Tax" />
    </SelectTrigger>
    <SelectContent>
      {taxes.map((tax) => (
        <SelectItem key={tax.id} value={String(tax.id)}>
          {tax.name} ({tax.type === "percentage" ? `${tax.value}%` : `Rs. ${tax.value}`})
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>


    {/* Allowance */}
    <div>
      <Label htmlFor="allowance">Allowance</Label>
      <Input
        id="allowance"
        type="number"
        value={formData.allowance}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, allowance: e.target.value }))
        }
        placeholder="Enter Allowance (e.g. 5000)"
      />
    </div>

    {/* Contacts */}
    <div>
      <Label>Contacts * (At least one required)</Label>
      <div className="space-y-2">
        {formData.contacts.map((contact, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={contact}
              onChange={(e) => updateContact(index, e.target.value)}
              placeholder="03XX-XXXXXXX"
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

    {/* Profile Photo */}
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
      <Button
  type="button"
  variant="outline"
  size="sm"
  onClick={() => document.getElementById("photo")?.click()}
>
  <Upload className="h-4 w-4 mr-2" />
  Upload
</Button>
      </div>
    </div>
  </CardContent>
</Card>

          {/* Bank Accounts */}
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

          {/* Wallets */}
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

          {/* Actions */}
          <div className="flex gap-4">
            <Button type="submit">
              {isEditing ? "Update Employer" : "Save Employer"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/employees")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
