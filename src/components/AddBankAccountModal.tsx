
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

interface AddBankAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account?: any;
  onClose: () => void;
}

export function AddBankAccountModal({ open, onOpenChange, account, onClose }: AddBankAccountModalProps) {
  const [formData, setFormData] = useState({
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Bank account data:", formData);
    handleClose();
  };

  const handleClose = () => {
    onClose();
    setFormData({
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
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Meezan Current"
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
