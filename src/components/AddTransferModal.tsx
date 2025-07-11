
import { useState } from "react";
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

interface AddTransferModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accounts: any[];
}

export function AddTransferModal({ open, onOpenChange, accounts }: AddTransferModalProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    fromAccount: "",
    toAccount: "",
    amount: "",
    referenceNo: "",
    notes: ""
  });

  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: string[] = [];

    if (formData.fromAccount === formData.toAccount) {
      newErrors.push("Cannot transfer to the same account");
    }

    if (!formData.fromAccount || !formData.toAccount) {
      newErrors.push("Please select both from and to accounts");
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.push("Please enter a valid amount");
    }

    // Check if from account has sufficient balance
    const fromAccount = accounts.find(acc => acc.id === formData.fromAccount);
    if (fromAccount && parseFloat(formData.amount) > fromAccount.balance) {
      newErrors.push("Insufficient balance in source account");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log("Transfer data:", formData);
    handleClose();
  };

  const handleClose = () => {
    onOpenChange(false);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      fromAccount: "",
      toAccount: "",
      amount: "",
      referenceNo: "",
      notes: ""
    });
    setErrors([]);
  };

  const getAvailableToAccounts = () => {
    return accounts.filter(acc => acc.id !== formData.fromAccount);
  };

  const selectedFromAccount = accounts.find(acc => acc.id === formData.fromAccount);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Transfer</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <ul className="text-red-700 text-sm space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fromAccount">From *</Label>
            <Select
              value={formData.fromAccount}
              onValueChange={(value) => setFormData(prev => ({ ...prev, fromAccount: value, toAccount: "" }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select source account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.title} - PKR {account.balance.toLocaleString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="toAccount">To *</Label>
            <Select
              value={formData.toAccount}
              onValueChange={(value) => setFormData(prev => ({ ...prev, toAccount: value }))}
              required
              disabled={!formData.fromAccount}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select destination account" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableToAccounts().map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="0.00"
              required
            />
            {selectedFromAccount && (
              <p className="text-sm text-muted-foreground">
                Available: PKR {selectedFromAccount.balance.toLocaleString()}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="referenceNo">Reference No</Label>
            <Input
              id="referenceNo"
              value={formData.referenceNo}
              onChange={(e) => setFormData(prev => ({ ...prev, referenceNo: e.target.value }))}
              placeholder="Optional reference number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Optional notes..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Save Transfer</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
