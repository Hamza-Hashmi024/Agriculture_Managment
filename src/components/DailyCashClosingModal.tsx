
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

interface DailyCashClosingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  systemClosing: number;
}

export function DailyCashClosingModal({ open, onOpenChange, systemClosing }: DailyCashClosingModalProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    actualCash: "",
    notes: ""
  });

  const actualAmount = parseFloat(formData.actualCash) || 0;
  const difference = actualAmount - systemClosing;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Cash closing data:", {
      ...formData,
      systemClosing,
      difference
    });
    handleClose();
  };

  const handleClose = () => {
    onOpenChange(false);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      actualCash: "",
      notes: ""
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Daily Cash Closing</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>System Calculated Closing</Label>
            <div className="p-3 bg-muted rounded-md">
              <p className="text-lg font-semibold">PKR {systemClosing.toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="actualCash">Enter Actual Cash on Hand *</Label>
            <Input
              id="actualCash"
              type="number"
              step="0.01"
              value={formData.actualCash}
              onChange={(e) => setFormData(prev => ({ ...prev, actualCash: e.target.value }))}
              placeholder="0.00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Difference</Label>
            <div className={`p-3 rounded-md ${
              difference === 0 
                ? "bg-green-50 border border-green-200" 
                : difference > 0 
                  ? "bg-blue-50 border border-blue-200"
                  : "bg-red-50 border border-red-200"
            }`}>
              <p className={`text-lg font-semibold ${
                difference === 0 
                  ? "text-green-700" 
                  : difference > 0 
                    ? "text-blue-700"
                    : "text-red-700"
              }`}>
                PKR {Math.abs(difference).toLocaleString()}
                {difference > 0 && " (Excess)"}
                {difference < 0 && " (Short)"}
                {difference === 0 && " (Match)"}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Notes about the closing..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Save Closing</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
