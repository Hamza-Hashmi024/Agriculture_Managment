
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

interface AddEditExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense?: any;
}

export function AddEditExpenseModal({ open, onOpenChange, expense }: AddEditExpenseModalProps) {
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

  useEffect(() => {
    if (expense) {
      setFormData({
        category: expense.category || "",
        vendor: expense.vendor || "Expense",
        amount: expense.amount?.toString() || "",
        description: expense.description || "",
        paymentMode: expense.status === "Credit" ? "credit" : "paid-full",
        fundingSource: "",
        bankAccount: "",
        referenceNo: "",
        paidNow: "",
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
  }, [expense, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Expense form submitted:", formData);
    onOpenChange(false);
  };

  const categories = [
    "Rent", "Salary", "Utilities", "Food", "Diesel", "Fertilizer", "Seeds", "Others"
  ];

  const vendors = [
    "Expense", "AgriMart", "Kissan Agri", "Green Valley", "Farm Tech"
  ];

  const fundingSources = [
    "Cash Box", "HBL Account", "Meezan Account", "Allied Bank"
  ];

  const isVendorLinked = formData.vendor !== "Expense";
  const showFundingFields = formData.paymentMode === "paid-full" || formData.paymentMode === "partial";
  const showBankFields = showFundingFields && formData.fundingSource !== "Cash Box";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {expense ? "Edit Expense" : "Add Expense"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
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
                onValueChange={(value) => setFormData(prev => ({ ...prev, vendor: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {vendors.map((vendor) => (
                    <SelectItem key={vendor} value={vendor}>
                      {vendor}
                    </SelectItem>
                  ))}
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
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="Enter amount"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter description"
              />
            </div>
          </div>

          <div>
            <Label>Payment Mode *</Label>
            <RadioGroup
              value={formData.paymentMode}
              onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMode: value }))}
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
                    onValueChange={(value) => setFormData(prev => ({ ...prev, fundingSource: value }))}
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
                    onChange={(e) => setFormData(prev => ({ ...prev, referenceNo: e.target.value }))}
                    placeholder="Enter reference number"
                  />
                </div>
              </div>

              {showBankFields && (
                <div>
                  <Label htmlFor="bankAccount">Bank Account *</Label>
                  <Select
                    value={formData.bankAccount}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, bankAccount: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select bank account" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hbl-main">HBL - Main Account</SelectItem>
                      <SelectItem value="meezan-current">Meezan - Current Account</SelectItem>
                      <SelectItem value="allied-savings">Allied - Savings Account</SelectItem>
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
                  onChange={(e) => setFormData(prev => ({ ...prev, paidNow: e.target.value }))}
                  placeholder="Amount paid now"
                />
              </div>
              <div>
                <Label>Remaining to Pay</Label>
                <Input
                  value={formData.amount && formData.paidNow 
                    ? (parseFloat(formData.amount) - parseFloat(formData.paidNow || "0")).toString()
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
              onChange={(e) => setFormData(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
              accept=".pdf,.jpg,.jpeg,.png"
              className="mt-1"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {expense ? "Update" : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
