
import { useState } from "react";
import { Search, Plus, Download, Eye, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddEditExpenseModal } from "@/components/AddEditExpenseModal";
import { ExpenseDetailModal } from "@/components/ExpenseDetailModal";

// Mock data for expenses
const mockExpenses = [
  {
    id: "1",
    date: "01-Jul",
    category: "Rent",
    description: "July Office Rent",
    amount: 20000,
    paymentMode: "Bank",
    status: "Paid",
    vendor: "Expense",
    hasDoc: true,
  },
  {
    id: "2",
    date: "05-Jul",
    category: "Utilities",
    description: "WAPDA June Bill",
    amount: 8000,
    paymentMode: "Credit",
    status: "Credit",
    vendor: "Expense",
    hasDoc: false,
  },
  {
    id: "3",
    date: "07-Jul",
    category: "Food",
    description: "Team Lunch",
    amount: 3500,
    paymentMode: "Cash",
    status: "Paid",
    vendor: "Expense",
    hasDoc: true,
  },
  {
    id: "4",
    date: "09-Jul",
    category: "Salary",
    description: "July – Ghulam",
    amount: 18000,
    paymentMode: "Cash",
    status: "Paid",
    vendor: "Expense",
    hasDoc: false,
  },
  {
    id: "5",
    date: "10-Jul",
    category: "Diesel",
    description: "Tractor Fuel",
    amount: 5500,
    paymentMode: "Cash",
    status: "Paid",
    vendor: "Kissan Agri",
    hasDoc: true,
  },
];

export function ExpensesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any>(null);
  const [viewingExpense, setViewingExpense] = useState<any>(null);

  const filteredExpenses = mockExpenses.filter((expense) => {
    const matchesSearch = 
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || expense.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || expense.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Paid":
        return <Badge variant="default" className="bg-green-100 text-green-800">Paid</Badge>;
      case "Credit":
        return <Badge variant="destructive">Credit</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleEdit = (expense: any) => {
    setEditingExpense(expense);
  };

  const handleView = (expense: any) => {
    setViewingExpense(expense);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">EXPENSES</h1>
        <div className="flex gap-2">
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search: Description/Category"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Rent">Rent</SelectItem>
                <SelectItem value="Utilities">Utilities</SelectItem>
                <SelectItem value="Food">Food</SelectItem>
                <SelectItem value="Salary">Salary</SelectItem>
                <SelectItem value="Diesel">Diesel</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Credit">Credit</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Mode</TableHead>
                <TableHead>Paid/Credit</TableHead>
                <TableHead>Vendor/Expense</TableHead>
                <TableHead>Doc</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{expense.date}</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell className="font-medium">
                    PKR {expense.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>{expense.paymentMode}</TableCell>
                  <TableCell>{getStatusBadge(expense.status)}</TableCell>
                  <TableCell>{expense.vendor}</TableCell>
                  <TableCell>
                    <span className={expense.hasDoc ? "text-green-600" : "text-red-600"}>
                      {expense.hasDoc ? "✓" : "✗"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(expense)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(expense)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddEditExpenseModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        expense={null}
      />

      <AddEditExpenseModal
        open={!!editingExpense}
        onOpenChange={(open) => !open && setEditingExpense(null)}
        expense={editingExpense}
      />

      <ExpenseDetailModal
        open={!!viewingExpense}
        onOpenChange={(open) => !open && setViewingExpense(null)}
        expense={viewingExpense}
      />
    </div>
  );
}
