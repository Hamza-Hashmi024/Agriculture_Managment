
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

// Mock data
const mockAccounts = [
  {
    id: "cashbox",
    type: "Cashbox",
    title: "Cash on Hand",
    number: "—",
    branch: "—",
    balance: 170000,
    iban: "",
    openingBalance: 200000,
    openingDate: "2025-07-01",
    notes: ""
  },
  {
    id: "1",
    type: "Bank",
    title: "Meezan Current",
    number: "0123-4567",
    branch: "Saddar, LHR",
    balance: 220000,
    iban: "PK39MEZN00001234567",
    openingBalance: 200000,
    openingDate: "2025-07-01",
    notes: ""
  },
  {
    id: "2",
    type: "Bank",
    title: "HBL Savings",
    number: "9999-2222",
    branch: "Model Town, LHR",
    balance: 200000,
    iban: "PK88HBL99992222",
    openingBalance: 180000,
    openingDate: "2025-07-01",
    notes: ""
  }
];

export function CashBankPage() {
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showAddTransfer, setShowAddTransfer] = useState(false);
  const [showCashbook, setShowCashbook] = useState(false);
  const [showBankbook, setShowBankbook] = useState(false);
  const [showAccountDetail, setShowAccountDetail] = useState(false);
  const [showDailyClosing, setShowDailyClosing] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [editingAccount, setEditingAccount] = useState<any>(null);

  const totalCash = mockAccounts.find(acc => acc.type === "Cashbox")?.balance || 0;
  const totalBank = mockAccounts.filter(acc => acc.type === "Bank").reduce((sum, acc) => sum + acc.balance, 0);
  const openingCash = 200000;
  const openingBank = 350000;

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
            <div className="text-2xl font-bold">PKR {openingCash.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Cash on Hand</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">PKR {totalCash.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Opening Balance (Bank)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">PKR {openingBank.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Bank Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">PKR {totalBank.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setShowAddAccount(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Account
        </Button>
        <Button variant="outline" onClick={() => setShowAddTransfer(true)}>
          <ArrowLeftRight className="h-4 w-4 mr-2" />
          Add Transfer
        </Button>
        <Button variant="outline" onClick={() => setShowCashbook(true)}>
          <BookOpen className="h-4 w-4 mr-2" />
          View Cashbook
        </Button>
        <Button variant="outline" onClick={() => setShowBankbook(true)}>
          <Landmark className="h-4 w-4 mr-2" />
          View Bankbook
        </Button>
        <Button variant="outline" onClick={() => setShowDailyClosing(true)}>
          <Eye className="h-4 w-4 mr-2" />
          Daily Closing
        </Button>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export
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
                <TableHead>Number</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAccounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      account.type === "Cashbox" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-blue-100 text-blue-700"
                    }`}>
                      {account.type}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">{account.title}</TableCell>
                  <TableCell>{account.number}</TableCell>
                  <TableCell>{account.branch}</TableCell>
                  <TableCell className="text-right font-medium">
                    PKR {account.balance.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewAccount(account)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {account.type === "Bank" && (
                        <Button
                          variant="ghost"
                          size="sm"  
                          onClick={() => handleEditAccount(account)}
                        >
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
        accounts={mockAccounts}
      />

      <CashbookModal
        open={showCashbook}
        onOpenChange={setShowCashbook}
      />

      <BankbookModal
        open={showBankbook}
        onOpenChange={setShowBankbook}
        accounts={mockAccounts.filter(acc => acc.type === "Bank")}
      />

      <AccountDetailModal
        open={showAccountDetail}
        onOpenChange={setShowAccountDetail}
        account={selectedAccount}
      />

      <DailyCashClosingModal
        open={showDailyClosing}
        onOpenChange={setShowDailyClosing}
        systemClosing={totalCash}
      />
    </div>
  );
}
