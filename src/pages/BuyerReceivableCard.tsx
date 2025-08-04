
import { useState , useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Printer, Download, User, MapPin, Phone } from "lucide-react";
import { AddPaymentModal } from "@/components/AddPaymentModal";
import { GetBuyerReceivableCard } from "@/Api/Api";



type Installment = {
  id: string;
  invoice_no: string;
  crop: string;
  amount: number;
  dueDate: string;
  status: string;
};

type Payment = {
  id: string;
  date: string;
  amount: number;
  mode: string;
  bank?: string | null;
  refNo?: string | null;
  invoice_no?: string | null;
  notes?: string;
};

type Buyer = {
  name: string;
  address: string;
  phone: string;
  mobile: string;
  totalUnpaid: number;
  unpaidInstallments: Installment[];
  payments: Payment[];
};


export function BuyerReceivableCard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [selectedInstallment, setSelectedInstallment] = useState<string | null>(null);
  const [buyer, setBuyer] = useState<Buyer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const data = await GetBuyerReceivableCard(id);
        setBuyer(data);
      } catch (err) {
        setError("Failed to fetch buyer data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);


  if (loading) return <div className="p-6">Loading buyer data...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!buyer) return <div className="p-6">Buyer not found</div>;








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
        {/* Buyer Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Buyer Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground">Name</h4>
                <p className="text-base">{buyer.name}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  Address
                </h4>
                <p className="text-base">{buyer.address}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  Contact Numbers
                </h4>
                <p className="text-base">Phone: {buyer.phone}</p>
                
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Receivables Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Receivables Summary</span>
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
                       <TableCell className="font-medium">{installment.invoice_no}</TableCell>
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
                        <TableCell>{payment.invoice_no}</TableCell>
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
