import { useState  , useEffect} from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Printer, Download, FileText } from "lucide-react";
import { GetFarmerPayableSummary } from "@/Api/Api";

type FarmerData = {
  name: string;
  netPayable: number;
  sales: any[];
  payments: any[];
};

export function FarmerPayableCard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("sales");
 
const [FarmerPayables, setFarmerPayables] = useState<FarmerData | undefined>();
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    paymentMode: "cash",
    bankAccount: "",
    refNo: "",
    date: new Date().toISOString().split('T')[0],
    uploadProof: "",
    notes: ""
  });

const farmer = FarmerPayables;


 useEffect(() => {
    const fetchFarmerSummary = async () => {
      try {
        const data = await GetFarmerPayableSummary(id);
             const mappedData = {
          name: data.farmer_name,
          netPayable: Number(data.net_payable),
          totalSales: Number(data.total_sales),
          sales: data.sales_history.map((sale, index) => ({
            id: index + 1, 
            date: sale.sale_date,
            crop: sale.crop,
            amount: Number(sale.sale_amount),
            commission:
              (Number(sale.sale_amount) * Number(sale.commission_percent)) /
              100,
          })),
          payments: data.payment_history.map((payment, index) => ({
            id: index + 1,
            date: payment.payment_date,
            amount: Number(payment.payment_amount),
            mode: payment.payment_mode,
            bank: payment.bank_reference,
            ref: payment.bank_reference,
            notes: payment.notes,
          })),
        };


        setFarmerPayables(mappedData);
      } catch (error) {
        console.log(error);
      }
    };

    if (id) {
      fetchFarmerSummary();
    }
  }, [id]);

  
 if (!FarmerPayables) {
  return (
    <div className="p-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Loading farmer data...</h1>
        <Button asChild className="mt-4">
          <Link to="/payables">Back to Payables</Link>
        </Button>
      </div>
    </div>
  );
}
  const handlePaymentSubmit = () => {
    console.log("Payment submitted:", paymentForm);
    setPaymentDialog(false);
    // Reset form
    setPaymentForm({
      amount: "",
      paymentMode: "cash",
      bankAccount: "",
      refNo: "",
      date: new Date().toISOString().split('T')[0],
      uploadProof: "",
      notes: ""
    });
  };

  const openPaymentModal = () => {
    setPaymentForm({
      ...paymentForm,
      amount: farmer.netPayable.toString()
    });
    setPaymentDialog(true);
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/payables")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Payables
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Farmer Payable Card</h1>
          <p className="text-muted-foreground">Payment details for {farmer.name}</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Farmer Payable Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Farmer</label>
              <p className="text-lg font-semibold">{farmer.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Net Payable</label>
              <p className="text-lg font-semibold text-red-600">PKR {farmer.netPayable.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={openPaymentModal} disabled={farmer.netPayable <= 0}>
              Add Payment
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print Statement
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Sales History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Crop</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Statement</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {farmer.sales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>{sale.date}</TableCell>
                      <TableCell>{sale.crop}</TableCell>
                      <TableCell>PKR {sale.amount.toLocaleString()}</TableCell>
                      <TableCell>PKR {sale.commission.toLocaleString()}</TableCell>
                      <TableCell>
                        <Button asChild variant="ghost" size="sm">
                          <Link to={`/sales/statement/${sale.id}`}>
                            <FileText className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead>Bank</TableHead>
                    <TableHead>Ref</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {farmer.payments.length > 0 ? (
                    farmer.payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{payment.date}</TableCell>
                        <TableCell>PKR {payment.amount.toLocaleString()}</TableCell>
                        <TableCell>{payment.mode}</TableCell>
                        <TableCell>{payment.bank}</TableCell>
                        <TableCell>{payment.ref}</TableCell>
                        <TableCell>{payment.notes}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        No payments found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Payment Modal */}
      <Dialog open={paymentDialog} onOpenChange={setPaymentDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Farmer</Label>
              <Input value={farmer.name} disabled className="bg-muted" />
            </div>
            
            <div>
              <Label>Amount to pay (max: {farmer.netPayable.toLocaleString()})</Label>
              <Input 
                type="number" 
                max={farmer.netPayable}
                value={paymentForm.amount}
                onChange={(e) => setPaymentForm({...paymentForm, amount: e.target.value})}
                placeholder="Enter amount"
              />
            </div>

            <div>
              <Label>Payment Mode</Label>
              <RadioGroup 
                value={paymentForm.paymentMode} 
                onValueChange={(value) => setPaymentForm({...paymentForm, paymentMode: value})}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash">Cash</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bank" id="bank" />
                  <Label htmlFor="bank">Bank</Label>
                </div>
              </RadioGroup>
            </div>

            {paymentForm.paymentMode === "bank" && (
              <div>
                <Label>Select Bank Account</Label>
                <Select value={paymentForm.bankAccount} onValueChange={(value) => setPaymentForm({...paymentForm, bankAccount: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select bank account" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="account1">Main Business Account - ***4567</SelectItem>
                    <SelectItem value="account2">Secondary Account - ***8901</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label>Reference No. (optional)</Label>
              <Input 
                value={paymentForm.refNo}
                onChange={(e) => setPaymentForm({...paymentForm, refNo: e.target.value})}
                placeholder="Enter reference number"
              />
            </div>

            <div>
              <Label>Date</Label>
              <Input 
                type="date"
                value={paymentForm.date}
                onChange={(e) => setPaymentForm({...paymentForm, date: e.target.value})}
              />
            </div>

            <div>
              <Label>Upload Proof (optional)</Label>
              <Input 
                type="file"
                onChange={(e) => setPaymentForm({...paymentForm, uploadProof: e.target.value})}
              />
            </div>

            <div>
              <Label>Notes (optional)</Label>
              <Textarea 
                value={paymentForm.notes}
                onChange={(e) => setPaymentForm({...paymentForm, notes: e.target.value})}
                placeholder="Enter any notes"
                rows={3}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handlePaymentSubmit} className="flex-1">
                Save Payment
              </Button>
              <Button variant="outline" onClick={() => setPaymentDialog(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
