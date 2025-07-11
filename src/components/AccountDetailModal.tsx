
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit, Eye } from "lucide-react";

interface AccountDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: any;
}

export function AccountDetailModal({ open, onOpenChange, account }: AccountDetailModalProps) {
  if (!account) return null;

  const handleViewTransactions = () => {
    console.log("View transactions for account:", account.id);
    // This would open the appropriate book (cashbook/bankbook) filtered for this account
  };

  const handleEditAccount = () => {
    console.log("Edit account:", account.id);
    // This would open the edit modal
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Account Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Account</p>
              <p className="text-lg font-semibold">
                {account.title} ({account.type})
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Current Balance</p>
              <p className="text-lg font-semibold text-green-600">
                PKR {account.balance?.toLocaleString()}
              </p>
            </div>
          </div>

          {account.type === "Bank" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Account No</p>
                  <p>{account.number}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Branch</p>
                  <p>{account.branch}</p>
                </div>
              </div>

              {account.iban && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">IBAN</p>
                  <p className="font-mono text-sm">{account.iban}</p>
                </div>
              )}
            </>
          )}

          {account.notes && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Notes</p>
              <p className="text-sm">{account.notes}</p>
            </div>
          )}

          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={handleViewTransactions}>
              <Eye className="h-4 w-4 mr-2" />
              View Transactions
            </Button>
            
            {account.type === "Bank" && (
              <Button variant="outline" onClick={handleEditAccount}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Account
              </Button>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
