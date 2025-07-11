
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Printer, MessageSquare, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const mockInvoiceData = {
  1: {
    date: "12-Jul-2025",
    buyer: "Pak Foods",
    farmer: "Akbar Ali",
    crop: "Wheat",
    weight: 120,
    rate: 4200,
    commission: 2.5,
    buyerExpenses: [
      { description: "Packaging", amount: 3000, source: "Cashbox" },
      { description: "Onward Transport", amount: 2000, source: "Bank" }
    ],
    upfrontPaid: 50000,
    paymentMode: "Cash",
    installments: [
      { amount: 40000, dueDate: "15-Aug-2025", status: "Pending" },
      { amount: 40000, dueDate: "14-Sep-2025", status: "Pending" }
    ]
  }
};

export function BuyerInvoice() {
  const { id } = useParams();
  const navigate = useNavigate();
  const invoice = mockInvoiceData[id as keyof typeof mockInvoiceData];

  if (!invoice) {
    return <div>Invoice not found</div>;
  }

  const saleAmount = invoice.weight * invoice.rate;
  const buyerExpenseTotal = invoice.buyerExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalAmount = saleAmount + buyerExpenseTotal;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/sales')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sales
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Buyer Invoice</h1>
            <p className="text-muted-foreground">Sale Invoice for {invoice.buyer}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print Invoice
          </Button>
          <Button variant="outline" size="sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            Send via WhatsApp
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">BUYER INVOICE / SALE INVOICE</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Invoice Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Date:</span>
                  <span>{invoice.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Buyer:</span>
                  <span>{invoice.buyer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Farmer:</span>
                  <span>{invoice.farmer}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Crop:</span>
                  <span>{invoice.crop}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Weight:</span>
                  <span>{invoice.weight} manns</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Rate:</span>
                  <span>PKR {invoice.rate.toLocaleString()}/mann</span>
                </div>
              </div>
            </div>

            {/* Sale Amount */}
            <div className="border-t pt-4">
              <div className="flex justify-between text-lg">
                <span className="font-medium">Sale Amount:</span>
                <span>PKR {saleAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Buyer-side Expenses */}
            {invoice.buyerExpenses.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium">Buyer-side Expenses:</h3>
                {invoice.buyerExpenses.map((expense, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span>{expense.description}:</span>
                    <div className="flex items-center gap-2">
                      <span>PKR {expense.amount.toLocaleString()}</span>
                      <Badge variant="outline" className="text-xs">
                        {expense.source}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Total Amount */}
            <div className="border-t pt-4">
              <div className="flex justify-between text-xl font-bold">
                <span>Total Amount Due:</span>
                <span>PKR {totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment Details */}
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium">Upfront Paid:</span>
                <span>PKR {invoice.upfrontPaid.toLocaleString()} ({invoice.paymentMode})</span>
              </div>

              {invoice.installments.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Installments:</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Amount</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoice.installments.map((installment, index) => (
                        <TableRow key={index}>
                          <TableCell>PKR {installment.amount.toLocaleString()}</TableCell>
                          <TableCell>{installment.dueDate}</TableCell>
                          <TableCell>
                            <Badge variant={installment.status === "Pending" ? "destructive" : "default"}>
                              {installment.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>

            {/* Balance Due */}
            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Balance Due:</span>
                <span className="text-destructive">
                  PKR {(totalAmount - invoice.upfrontPaid - invoice.installments.reduce((sum, inst) => sum + inst.amount, 0)).toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
