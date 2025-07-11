
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

interface AddPaymentModalProps {
  buyerId: string;
  installmentId?: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const mockBuyerNames: Record<string, string> = {
  "1": "Pak Foods",
  "2": "Noor Traders", 
  "3": "Safeer Bros."
};

const mockInstallments = [
  {
    id: "1",
    invoiceNo: "#INV123",
    crop: "Wheat",
    amount: 40000,
    dueDate: "14-Jul-2025",
    status: "Overdue"
  },
  {
    id: "2", 
    invoiceNo: "#INV120",
    crop: "Maize",
    amount: 60000,
    dueDate: "20-Jul-2025",
    status: "Due Soon"
  },
  {
    id: "3",
    invoiceNo: "#INV124",
    crop: "Rice",
    amount: 70000,
    dueDate: "25-Jul-2025",
    status: "Pending"
  }
];

const bankAccounts = [
  "HBL - Main Account",
  "UBL - Business Account",
  "MCB - Current Account"
];

export function AddPaymentModal({ buyerId, installmentId, isOpen, onClose }: AddPaymentModalProps) {
  const [amount, setAmount] = useState("");
  const [selectedInstallments, setSelectedInstallments] = useState<string[]>(
    installmentId ? [installmentId] : []
  );
  const [paymentMode, setPaymentMode] = useState("cash");
  const [bankAccount, setBankAccount] = useState("");
  const [refNo, setRefNo] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState("");

  const buyerName = mockBuyerNames[buyerId] || "Unknown Buyer";

  const handleInstallmentChange = (installmentId: string, checked: boolean) => {
    if (checked) {
      setSelectedInstallments([...selectedInstallments, installmentId]);
    } else {
      setSelectedInstallments(selectedInstallments.filter(id => id !== installmentId));
    }
  };

  const handleSavePayment = () => {
    // Here you would typically save the payment to your backend
    console.log("Saving payment:", {
      buyerId,
      amount,
      selectedInstallments,
      paymentMode,
      bankAccount,
      refNo,
      paymentDate,
      notes
    });
    onClose();
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      "Overdue": "text-red-600",
      "Due Soon": "text-orange-600", 
      "Pending": "text-gray-600"
    };
    return statusColors[status as keyof typeof statusColors] || "text-gray-600";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Payment (Buyer)</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
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

          <div>
            <Label className="text-base font-medium">Installment(s)</Label>
            <Card className="mt-2">
              <CardContent className="p-4">
                <div className="space-y-3">
                  {mockInstallments.map((installment) => (
                    <div key={installment.id} className="flex items-center space-x-3">
                      <Checkbox
                        id={installment.id}
                        checked={selectedInstallments.includes(installment.id)}
                        onCheckedChange={(checked) => 
                          handleInstallmentChange(installment.id, checked as boolean)
                        }
                      />
                      <div className="flex-1 grid grid-cols-4 gap-4 text-sm">
                        <span className="font-medium">{installment.invoiceNo}</span>
                        <span>{installment.crop}</span>
                        <span>PKR {installment.amount.toLocaleString()}</span>
                        <span className={getStatusBadge(installment.status)}>
                          {installment.dueDate} | {installment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Label className="text-base font-medium">Payment Mode</Label>
            <RadioGroup value={paymentMode} onValueChange={setPaymentMode} className="mt-2">
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
              <Label htmlFor="bank-account">Select Bank Account</Label>
              <Select value={bankAccount} onValueChange={setBankAccount}>
                <SelectTrigger>
                  <SelectValue placeholder="Select bank account" />
                </SelectTrigger>
                <SelectContent>
                  {bankAccounts.map((account) => (
                    <SelectItem key={account} value={account}>
                      {account}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

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

          <div>
            <Label htmlFor="upload-proof">Upload Proof (Optional)</Label>
            <Input
              id="upload-proof"
              type="file"
              accept="image/*,application/pdf"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes"
              className="mt-1"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSavePayment}>
              Save Payment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
