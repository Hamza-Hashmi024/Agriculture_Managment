import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RecordAccount } from "@/Api/Api";

interface AddBankAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account?: any;
  onClose: () => void;
}

const banks = [
  "Meezan Bank", "HBL (Habib Bank Limited)", "UBL (United Bank Limited)",
  "MCB (Muslim Commercial Bank)", "NBP (National Bank of Pakistan)", "Allied Bank",
  "Bank Alfalah", "Standard Chartered", "Faysal Bank", "JS Bank", "Askari Bank",
  "Bank Al Habib", "Soneri Bank", "Summit Bank", "Silk Bank"
];

export function AddBankAccountModal({ open, onOpenChange, account, onClose }: AddBankAccountModalProps) {
  const [formData, setFormData] = useState({
    type: "bank",
    bank: "",
    title: "",
    accountNo: "",
    branch: "",
    iban: "",
    openingBalance: "",
    openingDate: new Date().toISOString().split('T')[0],
    notes: ""
  });

  useEffect(() => {
    if (account) {
      setFormData({
        type: account.type || "bank",
        bank: account.bank || "",
        title: account.title || "",
        accountNo: account.account_number || "",
        branch: account.branch || "",
        iban: account.iban || "",
        openingBalance: account.opening_balance?.toString() || "",
        openingDate: account.opening_date || new Date().toISOString().split('T')[0],
        notes: account.notes || ""
      });
    } else {
      resetForm();
    }
  }, [account, open]);

  const resetForm = () => {
    setFormData({
      type: "bank",
      bank: "",
      title: "",
      accountNo: "",
      branch: "",
      iban: "",
      openingBalance: "",
      openingDate: new Date().toISOString().split('T')[0],
      notes: ""
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        type: formData.type,
        title: formData.title,
        account_number: formData.accountNo,
        branch: formData.branch,
        iban: formData.iban,
        opening_balance: formData.openingBalance,
        opening_date: formData.openingDate,
        notes: formData.notes,
        bank: formData.type === "bank" ? formData.bank : null
      };

      const result = await RecordAccount(payload);

      if (result?.accountId) {
        console.log("Account created:", result);
        handleClose();
      } else {
        console.error("Failed to add account.");
      }
    } catch (error) {
      console.error("Error while submitting:", error);
    }
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {account ? "Edit Account" : "Add Account"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Selection */}
          <div className="space-y-2">
            <Label>Type *</Label>
            <Select
              value={formData.type}
              onValueChange={(value: "bank" | "cashbox") => {
                setFormData(prev => ({ ...prev, type: value }));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Account Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank">Bank</SelectItem>
                <SelectItem value="cashbox">Cashbox</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bank Dropdown - only for bank type */}
          {formData.type === "bank" && (
            <div className="space-y-2">
              <Label htmlFor="bank">Bank *</Label>
              <Select
                value={formData.bank}
                onValueChange={(value) => setFormData(prev => ({ ...prev, bank: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Bank" />
                </SelectTrigger>
                <SelectContent>
                  {banks.map((bank) => (
                    <SelectItem key={bank} value={bank}>
                      {bank}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Common Fields */}
          <div className="space-y-2">
            <Label htmlFor="title">Account Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountNo">Account No *</Label>
            <Input
              id="accountNo"
              value={formData.accountNo}
              onChange={(e) => setFormData(prev => ({ ...prev, accountNo: e.target.value }))}
              required
            />
          </div>

          {formData.type === "bank" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="branch">Branch</Label>
                <Input
                  id="branch"
                  value={formData.branch}
                  onChange={(e) => setFormData(prev => ({ ...prev, branch: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="iban">IBAN</Label>
                <Input
                  id="iban"
                  value={formData.iban}
                  onChange={(e) => setFormData(prev => ({ ...prev, iban: e.target.value }))}
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="openingBalance">Opening Balance *</Label>
            <Input
              id="openingBalance"
              type="number"
              value={formData.openingBalance}
              onChange={(e) => setFormData(prev => ({ ...prev, openingBalance: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="openingDate">Opening Date *</Label>
            <Input
              id="openingDate"
              type="date"
              value={formData.openingDate}
              onChange={(e) => setFormData(prev => ({ ...prev, openingDate: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              placeholder="Any additional notes"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
