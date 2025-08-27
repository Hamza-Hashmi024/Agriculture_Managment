import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast"
import { Pencil } from "lucide-react"; 
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GetAllCheques  ,  UpdateChequeStatus , GetBankAccountsWithBalance } from "@/Api/Api";

interface Cheque {
  id: number;
  cheque_no: string;
  cheque_date: string;
  bank_name: string;
  amount: number;
  status: "pending" | "cleared" | "bounced" | "outstanding";
  buyer_name: string;
  sale_date: string;
}

const ChequePage: React.FC = () => {
  const [cheques, setCheques] = useState<Cheque[]>([]);
  const [Banks ,  setBanks] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [selectedCheque, setSelectedCheque] = useState<Cheque | null>(null);
  const [open, setOpen] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    const fetchCheques = async () => {
      try {
        const response = await GetAllCheques();
        setCheques(response);
      } catch (err) {
        console.error("Error fetching cheques:", err);
      }
    };

    const fetchBanks =  async() => {
      try {
        const response = await GetBankAccountsWithBalance();
        setBanks(response);
      } catch (err) {
        console.error("Error fetching banks:", err);
      }
    };

    fetchCheques();
    fetchBanks();

  }, []);

  // Filter logic
  const filteredCheques = cheques.filter((c) => {
    const matchesStatus = filter === "all" || c.status === filter;
    const matchesSearch =
      c.bank_name.toLowerCase().includes(search.toLowerCase()) ||
      c.cheque_no.toLowerCase().includes(search.toLowerCase()) ||
      c.status.toLowerCase().includes(search.toLowerCase()) ||
      c.buyer_name.toLowerCase().includes(search.toLowerCase());
    const matchesDate =
      (!dateFrom || new Date(c.cheque_date) >= new Date(dateFrom)) &&
      (!dateTo || new Date(c.cheque_date) <= new Date(dateTo));
    return matchesStatus && matchesSearch && matchesDate;
  });

  

const handleStatusUpdate = async (
  chequeId: number,
  newStatus: Cheque["status"]  // 👈 yahan string nahi, exact union type
) => {
  try {
    await UpdateChequeStatus(chequeId, newStatus);

    setCheques((prev: Cheque[]) =>
      prev.map((c) =>
        c.id === chequeId ? { ...c, status: newStatus } : c
      )
    );

    setSelectedCheque((prev) =>
      prev ? { ...prev, status: newStatus } : prev
    );

  toast({
  title: "Cheque Status Updated",
  description: `This cheque is now marked as ${newStatus.toUpperCase()}`,
  variant: newStatus === "bounced" ? "destructive" : "default",
});
  } catch (err) {
    toast({
      title: "Error",
      description: "Failed to update cheque status",
      variant: "destructive",
    });
  }
};



  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-200 text-yellow-800";
      case "cleared":
        return "bg-green-200 text-green-800";
      case "bounced":
        return "bg-red-200 text-red-800";
      case "outstanding":
        return "bg-blue-200 text-blue-800";
      default:
        return "";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Cheque Management</CardTitle>
        <p className="text-muted-foreground">
          Manage, track and update all your cheques in one place.
        </p>
      </CardHeader>

      {/* Filters */}
      <Card className="shadow-sm border rounded-xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Search</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Status */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select onValueChange={setFilter} defaultValue="all">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cleared">Cleared</SelectItem>
                  <SelectItem value="bounced">Bounced</SelectItem>
                  <SelectItem value="outstanding">Outstanding</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search */}
            <div className="space-y-2">
              <Label>Search</Label>
              <Input
                type="text"
                placeholder="Bank, Cheque No, Buyer or Status"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Date From */}
            <div className="space-y-2">
              <Label>Date From</Label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Date To */}
            <div className="space-y-2">
              <Label>Date To</Label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cheque Table */}
      <Card className="shadow-sm border rounded-xl">
        <CardHeader>
          <CardTitle >Check/List ({cheques.length})  </CardTitle>
        </CardHeader>
        <CardContent>
          
            <Table>
              <TableHeader>
                <TableRow>
                  
                  <TableHead>Cheque No</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Bank</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Sale Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCheques.map((cheque, index) => (
                  <TableRow key={`${cheque.id}-${index}`} className="hover:bg-gray-50">
                    <TableCell>{cheque.cheque_no}</TableCell>
                    <TableCell>{new Date(cheque.cheque_date).toLocaleDateString()}</TableCell>
                    <TableCell>{cheque.bank_name}</TableCell>
                    <TableCell>Rs. {cheque.amount?.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(cheque.status)}>
                        {cheque.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{cheque.buyer_name}</TableCell>
                    <TableCell>{new Date(cheque.sale_date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedCheque(cheque);
                          setOpen(true);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredCheques.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-gray-500">
                      No cheques found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          
        </CardContent>
      </Card>

      {/* Cheque Detail Modal */}
    <Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="max-w-md rounded-2xl shadow-lg p-6">
    <DialogHeader className="border-b pb-3 mb-4">
      <DialogTitle className="text-2xl font-semibold tracking-tight text-gray-800">
        Cheque Details
      </DialogTitle>
    </DialogHeader>

    {selectedCheque && (
      <div className="space-y-4">
        {/* Cheque Info in Grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500 font-medium">Cheque No</p>
            <p className="font-semibold">{selectedCheque.cheque_no}</p>
          </div>
          <div>
            <p className="text-gray-500 font-medium">Date</p>
            <p className="font-semibold">
              {new Date(selectedCheque.cheque_date).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-gray-500 font-medium">Bank</p>
            <p className="font-semibold">{selectedCheque.bank_name}</p>
          </div>
          <div>
            <p className="text-gray-500 font-medium">Amount</p>
            <p className="font-semibold text-green-600">
              Rs. {selectedCheque.amount?.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-gray-500 font-medium">Buyer</p>
            <p className="font-semibold">{selectedCheque.buyer_name}</p>
          </div>
          <div>
            <p className="text-gray-500 font-medium">Sale Date</p>
            <p className="font-semibold">
              {new Date(selectedCheque.sale_date).toLocaleDateString()}
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-gray-500 font-medium">Status</p>
            <span
              className={`px-3 py-1 inline-block rounded-full text-xs font-semibold ${
                selectedCheque.status === "cleared"
                  ? "bg-green-100 text-green-700"
                  : selectedCheque.status === "bounced"
                  ? "bg-red-100 text-red-700"
                  : selectedCheque.status === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {selectedCheque.status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-4 border-t">
          <Button
            variant="default"
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={() => setSelectedCheque({ ...selectedCheque, status: "cleared" })}
          >
            Mark as Cleared
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleStatusUpdate(selectedCheque.id, "bounced")}
          >
            Mark as Bounced
          </Button>
          <Button
            variant="outline"
            onClick={() => handleStatusUpdate(selectedCheque.id, "outstanding")}
          >
            Mark as Outstanding
          </Button>
          <Button
            variant="outline"
            className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
            onClick={() => handleStatusUpdate(selectedCheque.id, "pending")}
          >
            Mark as Pending
          </Button>
        </div>

        {/* EXTRA FORM when status = cleared */}
        {selectedCheque.status === "cleared" && (
          <div className="space-y-3 border-t pt-4">
            <h3 className="text-lg font-semibold">Deposit Options</h3>
            <div className="space-y-2">
              <Label>Select Bank Account</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose Bank Account" />
                </SelectTrigger>
                <SelectContent>
                  {Banks.map((bank) => (
                    <SelectItem key={bank.id} value={bank.id.toString()}>
                      {bank.title} (Balance: Rs. {bank.balance.toLocaleString()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={() => handleStatusUpdate(selectedCheque.id, "cleared")}
            >
              Confirm Deposit
            </Button>
          </div>
        )}
      </div>
    )}
  </DialogContent>
</Dialog>



    </div>
  );
};

export default ChequePage;
