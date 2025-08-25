import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  AddExpense,
  GetBankAccountsWithBalance,
  GetAllVendor,
  EditExpense,
} from "@/Api/Api";

type BankAccount = {
  id: string;
  title: string;
  type: string;
  balance: number;
};
interface AddEditExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense?: any;
}

export function AddEditExpenseModal({
  open,
  onOpenChange,
  expense,
}: AddEditExpenseModalProps) {
  const [formData, setFormData] = useState({
    category: "",
    vendor: "Expense",
    amount: "",
    description: "",
    paymentMode: "paid-full",
    fundingSource: "",
    bankAccount: "",
    referenceNo: "",
    paidNow: "",
    file: null as File | null,
  });

  const [bankAccounts, setBankAccounts] = useState<
    { id: string; name: string; balance: number }[]
  >([]);
  const [vendors, setVendors] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    if (!open) return;

    // Fetch banks and vendors
    const fetchData = async () => {
      try {
        const [banksData, vendorsData] = await Promise.all([
          GetBankAccountsWithBalance(),
          GetAllVendor(),
        ]);

        if (Array.isArray(banksData)) setBankAccounts(banksData);
        if (Array.isArray(vendorsData)) setVendors(vendorsData);
      } catch (err) {
        console.error("Error fetching banks/vendors:", err);
      }
    };

    fetchData();

    // Pre-fill form if editing
    if (expense) {
      setFormData({
        category: expense.category || "",
        vendor: expense.vendor || "Expense",
        amount: expense.amount?.toString() || "",
        description: expense.description || "",
        paymentMode:
          expense.status?.toLowerCase() === "credit"
            ? "credit"
            : expense.status?.toLowerCase() === "partial"
            ? "partial"
            : "paid-full",
        fundingSource:
          expense.paymentMode === "cashbox"
            ? "Cash Box"
            : expense.paymentMode === "bank"
            ? banksData?.find((b) => b.id === expense.bank_account_id)?.title ||
              ""
            : "",
        bankAccount: expense.bank_account_id || "",
        referenceNo: expense.reference_no || "",
        paidNow:
          expense.status?.toLowerCase() === "partial"
            ? expense.paid_now?.toString() || ""
            : "",
        file: null,
      });
    } else {
      setFormData({
        category: "",
        vendor: "Expense",
        amount: "",
        description: "",
        paymentMode: "paid-full",
        fundingSource: "",
        bankAccount: "",
        referenceNo: "",
        paidNow: "",
        file: null,
      });
    }
  }, [open, expense]);

  // Fetch bank accounts once when modal opens
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const data = await GetBankAccountsWithBalance();
        if (Array.isArray(data)) {
          setBankAccounts(data);
        }
      } catch (err) {
        console.error("Error fetching bank accounts:", err);
      }
    };

    const fetchVendors = async () => {
      try {
        const data = await GetAllVendor();
        if (Array.isArray(data)) {
          setVendors(data);
        }
      } catch (err) {
        console.error("Error fetching vendors:", err);
      }
    };
    if (open) {
      fetchBanks();
      fetchVendors();
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Find vendor ID
      const vendorId =
        formData.vendor !== "Expense"
          ? vendors.find((v) => v.name === formData.vendor)?.id || null
          : null;

      // Map payment_mode
      let payment_mode: string | null = null;
      if (formData.paymentMode !== "credit") {
        payment_mode =
          formData.fundingSource === "Cash Box" ? "cashbox" : "bank";
      }

      // Map paid_status + paid_now
      let paid_status = "credit";
      let paid_now = 0;
      if (formData.paymentMode === "paid-full") {
        paid_status = "paid";
        paid_now = parseFloat(formData.amount || "0");
      } else if (formData.paymentMode === "partial") {
        paid_status = "partial";
        paid_now = parseFloat(formData.paidNow || "0");
      }

      const payload = {
        category: formData.category,
        vendor_id: vendorId,
        description: formData.description,
        amount: parseFloat(formData.amount || "0"),
        paid_status,
        payment_mode,
        paid_now,
        bank_account_id:
          payment_mode === "bank" ? formData.bankAccount || null : null,
        reference_no: formData.referenceNo || null,
        invoice_file_url: null, // handle file upload separately
      };

      console.log("Submitting expense payload:", payload);

      let res;
      if (expense) {
        res = await EditExpense(expense.id, payload);
      } else {
        res = await AddExpense(payload);
      }

      if (res.status === 200) {
        console.log("Expense saved successfully:", res.data);
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error saving expense:", error);
    }
  };
  const categories = [
   "Rent",
  "Salary",
  "Utilities",
  "Food",
  "Diesel",
  "Fertilizer",
  "Seeds",
  "Electricity",
  "Water",
  "Gas",
  "Internet",
  "Transport",
  "Maintenance",
  "Office Supplies",
  "Healthcare",
  "Entertainment",
  "Travel",
  "Insurance",
  "Others",
  ];

  const fundingSources = [
    "Cash Box",
    "HBL Account",
    "Meezan Account",
    "Allied Bank",
  ];

  const isVendorLinked = formData.vendor !== "Expense";
  const showFundingFields =
    formData.paymentMode === "paid-full" || formData.paymentMode === "partial";
  const showBankFields =
    showFundingFields && formData.fundingSource !== "Cash Box";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{expense ? "Edit Expense" : "Add Expense"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="vendor">Vendor</Label>
              <Select
                value={formData.vendor}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, vendor: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectContent>
                    {vendors.map((vendor) => (
                      <SelectItem key={vendor.id} value={vendor.name}>
                        {vendor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Total Amount *</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, amount: e.target.value }))
                }
                placeholder="Enter amount"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Enter description"
              />
            </div>
          </div>

          <div>
            <Label>Payment Mode *</Label>
            <RadioGroup
              value={formData.paymentMode}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, paymentMode: value }))
              }
              className="flex gap-6 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="paid-full" id="paid-full" />
                <Label htmlFor="paid-full">Paid Full</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="credit" id="credit" />
                <Label htmlFor="credit">Credit</Label>
              </div>
              {isVendorLinked && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="partial" id="partial" />
                  <Label htmlFor="partial">Partial</Label>
                </div>
              )}
            </RadioGroup>
          </div>

          {showFundingFields && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fundingSource">Funding Source *</Label>
                  <Select
                    value={formData.fundingSource}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, fundingSource: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select funding source" />
                    </SelectTrigger>
                    <SelectContent>
                      {fundingSources.map((source) => (
                        <SelectItem key={source} value={source}>
                          {source}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="referenceNo">Reference No.</Label>
                  <Input
                    id="referenceNo"
                    value={formData.referenceNo}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        referenceNo: e.target.value,
                      }))
                    }
                    placeholder="Enter reference number"
                  />
                </div>
              </div>

              {showBankFields && (
                <div>
                  <Label htmlFor="bankAccount">Bank Account *</Label>
                  <Select
                    value={formData.bankAccount}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, bankAccount: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select bank account" />
                    </SelectTrigger>
                    <SelectContent>
                      {bankAccounts
                        .filter((acc) => acc.type === "bank")
                        .map((bank) => (
                          <SelectItem key={bank.id} value={String(bank.id)}>
                            {bank.title} — Balance:{" "}
                            {parseFloat(bank.balance).toLocaleString()}
                          </SelectItem>
                        ))}
                      {bankAccounts.filter((acc) => acc.type === "bank")
                        .length === 0 && (
                        <SelectItem value="no-banks" disabled>
                          No bank accounts found
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </>
          )}

          {formData.paymentMode === "partial" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="paidNow">Paid Now *</Label>
                <Input
                  id="paidNow"
                  type="number"
                  value={formData.paidNow}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      paidNow: e.target.value,
                    }))
                  }
                  placeholder="Amount paid now"
                />
              </div>
              <div>
                <Label>Remaining to Pay</Label>
                <Input
                  value={
                    formData.amount && formData.paidNow
                      ? (
                          parseFloat(formData.amount) -
                          parseFloat(formData.paidNow || "0")
                        ).toString()
                      : "0"
                  }
                  disabled
                  className="bg-gray-50"
                />
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="file">Upload Invoice/Receipt *</Label>
            <Input
              id="file"
              type="file"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  file: e.target.files?.[0] || null,
                }))
              }
              accept=".pdf,.jpg,.jpeg,.png"
              className="mt-1"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">{expense ? "Update" : "Save"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
