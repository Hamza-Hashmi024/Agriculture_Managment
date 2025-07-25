import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  AddPayment,
  GetBuyerInstallments,
  GetBankAccountsWithBalance,
  GetBuyerById,
} from "@/Api/Api";

interface AddPaymentModalProps {
  buyerId: string;
  installmentId?: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AddPaymentModal({
  buyerId,
  installmentId,
  isOpen,
  onClose,
}: AddPaymentModalProps) {
  const [amount, setAmount] = useState("");
  const [selectedInstallments, setSelectedInstallments] = useState<string[]>(
    installmentId ? [installmentId] : []
  );
  const [paymentMode, setPaymentMode] = useState("cash");
  const [bankAccountId, setBankAccountId] = useState<string>("");
  const [refNo, setRefNo] = useState("");
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [notes, setNotes] = useState("");
  const [buyerName, setBuyerName] = useState("Loading...");
  const [installments, setInstallments] = useState<any[]>([]);
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);

  const handleInstallmentChange = (id: string, checked: boolean) => {
    setSelectedInstallments(
      checked
        ? [...selectedInstallments, id]
        : selectedInstallments.filter((i) => i !== id)
    );
  };

  const handleSavePayment = async () => {
    try {
  const payload = {
  buyerId: parseInt(buyerId),
  amount: parseFloat(amount),
  paymentDate,
  paymentMode,
  bankAccountId: paymentMode === "bank" ? parseInt(bankAccountId) : null,
  referenceNo: refNo || null,
  proofFileUrl: null, 
  notes: notes || null,
  installments: selectedInstallments.map((id) => parseInt(id)),
};
      const response = await AddPayment(payload);
      if (response.success) {
        alert("Payment saved successfully!");
        onClose();
      } else {
        alert("Failed to save payment.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert("An error occurred while saving the payment.");
    }
  };

  const getStatusBadgeColor = (status: string) => {
  const normalized = status.toLowerCase();
  return (
    {
      overdue: "text-red-600",
      "due soon": "text-orange-600",
      pending: "text-gray-600",
      partial: "text-yellow-600",
      paid: "text-green-600",
    }[normalized] || "text-gray-600"
  );
};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const buyer = await GetBuyerById(buyerId);
        setBuyerName(buyer.name || "Unknown Buyer");
      } catch (err) {
        console.error("Error fetching buyer:", err);
        setBuyerName("Unknown Buyer");
      }

      try {
        const data = await GetBuyerInstallments(buyerId);
        setInstallments(data);
      } catch (err) {
        console.error("Error fetching installments:", err);
      }

      try {
        const banks = await GetBankAccountsWithBalance();
        console.log("Fetched bank accounts:", banks);
        setBankAccounts(banks);
      } catch (err) {
        console.error("Error fetching bank accounts:", err);
      }
    };

    if (isOpen) fetchData();
  }, [buyerId, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Payment (Buyer)</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Buyer & Amount */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Buyer</Label>
              <Input value={buyerName} disabled className="bg-muted" />
            </div>
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </div>
          </div>

          {/* Installments */}
          <div>
            <Label className="text-base font-medium">Installment(s)</Label>
            <Card className="mt-2">
              <CardContent className="p-4">
                <div className="space-y-3">
                  {installments.map((installment) => (
  <div
    key={installment.id}
    className="flex items-start space-x-3 border-b pb-3"
  >
    <Checkbox
      id={String(installment.id)}
      checked={selectedInstallments.includes(String(installment.id))}
      onCheckedChange={(checked) =>
        handleInstallmentChange(String(installment.id), checked as boolean)
      }
      className="mt-1"
    />
    <div className="flex-1 text-sm space-y-1">
      <div className="grid grid-cols-2 gap-2">
        <span className="font-medium">
          Installment: PKR{" "}
          {Number(installment.installment_amount).toLocaleString()}
        </span>
        <span>
          Date:{" "}
          {new Date(installment.installment_date).toLocaleDateString()}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <span>
          Paid: PKR{" "}
          {Number(installment.paid_amount || 0).toLocaleString()}
        </span>
        <span>
          Remaining: PKR{" "}
          {Number(installment.remaining_amount || 0).toLocaleString()}
        </span>
      </div>

      <span className={`${getStatusBadgeColor(installment.status)} font-semibold capitalize`}>
        Status: {installment.status}
      </span>
    </div>
  </div>
))}

                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Mode */}
          <div>
            <Label className="text-base font-medium">Payment Mode</Label>
            <RadioGroup
              value={paymentMode}
              onValueChange={setPaymentMode}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash">Cash</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bank" id="bank" />
                <Label htmlFor="bank">Bank</Label>
              </div>
            </RadioGroup>
          </div>

          {paymentMode === "bank" && (
            <div>
              <Label>Select Bank Account</Label>
              <Select value={bankAccountId} onValueChange={setBankAccountId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select bank account" />
                </SelectTrigger>
                <SelectContent>
                  {bankAccounts.filter((a) => a.type === "bank").length ===
                  0 ? (
                    <SelectItem disabled>No bank accounts found</SelectItem>
                  ) : (
                    bankAccounts
                      .filter((account) => account.type === "bank")
                      .map((account) => (
                        <SelectItem key={account.id} value={String(account.id)}>
                          {account.title} - PKR{" "}
                          {parseFloat(account.balance).toLocaleString()}
                        </SelectItem>
                      ))
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Reference No. & Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ref-no">Ref No. (Optional)</Label>
              <Input
                id="ref-no"
                value={refNo}
                onChange={(e) => setRefNo(e.target.value)}
                placeholder="Reference number"
              />
            </div>
            <div>
              <Label htmlFor="payment-date">Date</Label>
              <Input
                id="payment-date"
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSavePayment}>Save Payment</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
