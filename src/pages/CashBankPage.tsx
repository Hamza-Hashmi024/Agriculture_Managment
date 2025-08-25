import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Edit, Download, ArrowLeftRight, BookOpen, Landmark } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddBankAccountModal } from "@/components/AddBankAccountModal";
import { AddTransferModal } from "@/components/AddTransferModal";
import { CashbookModal } from "@/components/CashbookModal";
import { BankbookModal } from "@/components/BankbookModal";
import { AccountDetailModal } from "@/components/AccountDetailModal";
import { DailyCashClosingModal } from "@/components/DailyCashClosingModal";
import { GetAccountSummary } from "@/Api/Api";

export function CashBankPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [summary, setSummary] = useState({
    openingCash: 0,
    totalCash: 0,
    openingBank: 0,
    totalBank: 0
  });
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showAddTransfer, setShowAddTransfer] = useState(false);
  const [showCashbook, setShowCashbook] = useState(false);
  const [showBankbook, setShowBankbook] = useState(false);
  const [showAccountDetail, setShowAccountDetail] = useState(false);
  const [showDailyClosing, setShowDailyClosing] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [editingAccount, setEditingAccount] = useState<any>(null);

  useEffect(() => {
    GetAccountSummary()
      .then((data) => {
        const accountsData = data || [];
        setAccounts(accountsData);

        // Compute summary
        const openingCash = accountsData
          .filter(a => a.account_type === "Cash")
          .reduce((sum, a) => sum + parseFloat(a.opening_balance), 0);
        const totalCash = accountsData
          .filter(a => a.account_type === "Cash")
          .reduce((sum, a) => sum + parseFloat(a.current_balance), 0);
        const openingBank = accountsData
          .filter(a => a.account_type === "Bank")
          .reduce((sum, a) => sum + parseFloat(a.opening_balance), 0);
        const totalBank = accountsData
          .filter(a => a.account_type === "Bank")
          .reduce((sum, a) => sum + parseFloat(a.current_balance), 0);

        setSummary({ openingCash, totalCash, openingBank, totalBank });
      })
      .catch(err => console.log(err));
  }, []);

  const handleViewAccount = (account: any) => {
    setSelectedAccount(account);
    setShowAccountDetail(true);
  };

  const handleEditAccount = (account: any) => {
    setEditingAccount(account);
    setShowAddAccount(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Cash / Bank</h1>
          <p className="text-muted-foreground">Manage cash and bank accounts</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Opening Balance (Cash)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">PKR {summary.openingCash.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Cash on Hand</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">PKR {summary.totalCash.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Opening Balance (Bank)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">PKR {summary.openingBank.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Bank Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">PKR {summary.totalBank.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setShowAddAccount(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Account
        </Button>
        <Button variant="outline" onClick={() => setShowAddTransfer(true)}>
          <ArrowLeftRight className="h-4 w-4 mr-2" /> Add Transfer
        </Button>
        <Button variant="outline" onClick={() => setShowCashbook(true)}>
          <BookOpen className="h-4 w-4 mr-2" /> View Cashbook
        </Button>
        <Button variant="outline" onClick={() => setShowBankbook(true)}>
          <Landmark className="h-4 w-4 mr-2" /> View Bankbook
        </Button>
        <Button variant="outline" onClick={() => setShowDailyClosing(true)}>
          <Eye className="h-4 w-4 mr-2" /> Daily Closing
        </Button>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" /> Export
        </Button>
      </div>

      {/* Accounts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account Type</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="text-right">Opening Balance</TableHead>
                <TableHead className="text-right">Inflow</TableHead>
                <TableHead className="text-right">Outflow</TableHead>
                <TableHead className="text-right">Current Balance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account) => (
                <TableRow key={account.account_id}>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      account.account_type === "Cash" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                    }`}>
                      {account.account_type}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">{account.account_title}</TableCell>
                  <TableCell className="text-right">PKR {parseFloat(account.opening_balance).toLocaleString()}</TableCell>
                  <TableCell className="text-right">PKR {parseFloat(account.total_inflow).toLocaleString()}</TableCell>
                  <TableCell className="text-right">PKR {parseFloat(account.total_outflow).toLocaleString()}</TableCell>
                  <TableCell className="text-right font-bold">PKR {parseFloat(account.current_balance).toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleViewAccount(account)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {account.account_type === "Bank" && (
                        <Button variant="ghost" size="sm" onClick={() => handleEditAccount(account)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modals */}
      <AddBankAccountModal
        open={showAddAccount}
        onOpenChange={setShowAddAccount}
        account={editingAccount}
        onClose={() => {
          setShowAddAccount(false);
          setEditingAccount(null);
        }}
      />

      <AddTransferModal
        open={showAddTransfer}
        onOpenChange={setShowAddTransfer}
        accounts={accounts.filter(acc => acc.account_type === "Bank")}
      />

      <CashbookModal
        open={showCashbook}
        onOpenChange={setShowCashbook}
      />

      <BankbookModal
        open={showBankbook}
        onOpenChange={setShowBankbook}
        accounts={accounts.filter(acc => acc.account_type === "Bank")}
      />

      <AccountDetailModal
        open={showAccountDetail}
        onOpenChange={setShowAccountDetail}
        account={selectedAccount}
      />

      <DailyCashClosingModal
        open={showDailyClosing}
        onOpenChange={setShowDailyClosing}
        systemClosing={summary.totalCash}
      />
    </div>
  );
}
