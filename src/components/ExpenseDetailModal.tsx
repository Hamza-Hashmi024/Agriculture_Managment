
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Upload, Download, Edit2 } from "lucide-react";

interface ExpenseDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense?: any;
}

export function ExpenseDetailModal({ open, onOpenChange, expense }: ExpenseDetailModalProps) {
  if (!expense) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Paid":
        return <Badge variant="default" className="bg-green-100 text-green-800">Paid</Badge>;
      case "Credit":
        return <Badge variant="destructive">Unpaid (shows in Payables)</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Expense Detail</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Date:</label>
                <p className="text-base font-medium">{expense.date}-2025</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Category:</label>
                <p className="text-base font-medium">{expense.category}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Description:</label>
                <p className="text-base font-medium">{expense.description}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Amount:</label>
                <p className="text-base font-medium">PKR {expense.amount.toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Vendor:</label>
                <p className="text-base font-medium">{expense.vendor}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Payment Mode:</label>
                <p className="text-base font-medium">{expense.paymentMode}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Paid Status:</label>
                <div className="mt-1">
                  {getStatusBadge(expense.status)}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Doc:</label>
                <div className="flex items-center gap-2 mt-1">
                  <span className={expense.hasDoc ? "text-green-600" : "text-red-600"}>
                    {expense.hasDoc ? "✓" : "✗"}
                  </span>
                  {!expense.hasDoc && (
                    <Button size="sm" variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Doc
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Notes:</label>
            <p className="text-base font-medium text-gray-400">—</p>
          </div>

          <div className="flex justify-between pt-4 border-t">
            <div className="flex gap-2">
              <Button variant="outline">
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
