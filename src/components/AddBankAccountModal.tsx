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
  "Meezan Bank",
  "HBL (Habib Bank Limited)",
  "UBL (United Bank Limited)",
  "MCB (Muslim Commercial Bank)",
  "NBP (National Bank of Pakistan)",
  "Allied Bank",
  "Bank Alfalah",
  "Standard Chartered",
  "Faysal Bank",
  "JS Bank",
  "Askari Bank",
  "Bank Al Habib",
  "Soneri Bank",
  "Summit Bank",
  "Silk Bank"
];

export function AddBankAccountModal({ open, onOpenChange, account, onClose }: AddBankAccountModalProps) {
  const [formData, setFormData] = useState({
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
        bank: account.bank || "",
        title: account.title || "",
        accountNo: account.number || "",
        branch: account.branch || "",
        iban: account.iban || "",
        openingBalance: account.openingBalance?.toString() || "",
        openingDate: account.openingDate || new Date().toISOString().split('T')[0],
        notes: account.notes || ""
      });
    } else {
      setFormData({
        bank: "",
        title: "",
        accountNo: "",
        branch: "",
        iban: "",
        openingBalance: "",
        openingDate: new Date().toISOString().split('T')[0],
        notes: ""
      });
    }
  }, [account, open]);

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   console.log("Bank account data:", formData);
  //   handleClose();
  // };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const payload = {
      bank: formData.bank,
      title: formData.title,
      accountNo: formData.accountNo,
      branch: formData.branch,
      iban: formData.iban,
      openingBalance: formData.openingBalance,
      openingDate: formData.openingDate,
      notes: formData.notes,
    };

    const result = await RecordAccount(payload);

    if (result?.accountId) {
      console.log("Bank account created:", result);
      handleClose();
    } else {
      console.error("Failed to add bank account.");
    }
  } catch (error) {
    console.error("Error while submitting bank account:", error);
  }
};
  

  const handleClose = () => {
    onClose();
    setFormData({
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {account ? "Edit Bank Account" : "Add Bank Account"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="space-y-2">
            <Label htmlFor="title">Account Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Current Account"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountNo">Account No *</Label>
            <Input
              id="accountNo"
              value={formData.accountNo}
              onChange={(e) => setFormData(prev => ({ ...prev, accountNo: e.target.value }))}
              placeholder="0123-4567"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="branch">Branch</Label>
            <Input
              id="branch"
              value={formData.branch}
              onChange={(e) => setFormData(prev => ({ ...prev, branch: e.target.value }))}
              placeholder="Saddar, Lahore"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="iban">IBAN</Label>
            <Input
              id="iban"
              value={formData.iban}
              onChange={(e) => setFormData(prev => ({ ...prev, iban: e.target.value }))}
              placeholder="PK39MEZN00001234567"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="openingBalance">Opening Balance *</Label>
            <Input
              id="openingBalance"
              type="number"
              value={formData.openingBalance}
              onChange={(e) => setFormData(prev => ({ ...prev, openingBalance: e.target.value }))}
              placeholder="0"
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
              placeholder="Additional notes..."
              rows={3}
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
