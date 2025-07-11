
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Printer, Download } from "lucide-react";
import { AddPaymentModal } from "@/components/AddPaymentModal";

const mockBuyerData: Record<string, {
  name: string;
  totalUnpaid: number;
  unpaidInstallments: Array<{
    id: string;
    invoiceNo: string;
    crop: string;
    amount: number;
    dueDate: string;
    status: string;
  }>;
  payments: Array<{
    id: string;
    date: string;
    amount: number;
    mode: string;
    bank?: string;
    refNo?: string;
    invoiceNo: string;
    notes?: string;
  }>;
}> = {
  "1": {
    name: "Pak Foods",
    totalUnpaid: 210000,
    unpaidInstallments: [
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
    ],
    payments: [
      {
        id: "1",
        date: "14-Jul-2025",
        amount: 40000,
        mode: "Bank",
        bank: "HBL",
        refNo: "12345",
        invoiceNo: "#INV123",
        notes: "Full pay"
      },
      {
        id: "2",
        date: "10-Jul-2025",
        amount: 70000,
        mode: "Cash",
        invoiceNo: "#INV122",
        notes: "Full pay"
      }
    ]
  }
};

export function BuyerReceivableCard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [selectedInstallment, setSelectedInstallment] = useState<string | null>(null);

  const buyer = id ? mockBuyerData[id] : undefined;

  if (!buyer) {
    return <div>Buyer not found</div>;
  }

  const handleAddPayment = (installmentId?: string) => {
    setSelectedInstallment(installmentId || null);
    setShowAddPayment(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Overdue":
        return <Badge variant="destructive">{status}</Badge>;
      case "Due Soon":
        return <Badge variant="secondary">{status}</Badge>;
      case "Pending":
        return <Badge variant="outline">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/receivables')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Receivables
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Buyer Receivable Card</h1>
            <p className="text-muted-foreground">Receivables for {buyer.name}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print Statement
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Buyer: {buyer.name}</span>
              <span className="text-lg">Total Unpaid: PKR {buyer.totalUnpaid.toLocaleString()}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Button onClick={() => handleAddPayment()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Payment
              </Button>
            </div>

            <Tabs defaultValue="installments" className="w-full">
              <TabsList>
                <TabsTrigger value="installments">Unpaid Installments</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
              </TabsList>

              <TabsContent value="installments" className="mt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Crop</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {buyer.unpaidInstallments.map((installment) => (
                      <TableRow key={installment.id}>
                        <TableCell className="font-medium">{installment.invoiceNo}</TableCell>
                        <TableCell>{installment.crop}</TableCell>
                        <TableCell>PKR {installment.amount.toLocaleString()}</TableCell>
                        <TableCell>{installment.dueDate}</TableCell>
                        <TableCell>{getStatusBadge(installment.status)}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddPayment(installment.id)}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Payment
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="payments" className="mt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Mode</TableHead>
                      <TableHead>Bank</TableHead>
                      <TableHead>Ref</TableHead>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {buyer.payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{payment.date}</TableCell>
                        <TableCell>PKR {payment.amount.toLocaleString()}</TableCell>
                        <TableCell>{payment.mode}</TableCell>
                        <TableCell>{payment.bank || "—"}</TableCell>
                        <TableCell>{payment.refNo || ""}</TableCell>
                        <TableCell>{payment.invoiceNo}</TableCell>
                        <TableCell>{payment.notes || ""}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {showAddPayment && (
        <AddPaymentModal
          buyerId={id!}
          installmentId={selectedInstallment}
          isOpen={showAddPayment}
          onClose={() => setShowAddPayment(false)}
        />
      )}
    </div>
  );
}
