import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Eye, Plus, Download } from "lucide-react";
import { AddPaymentModal } from "@/components/AddPaymentModal";
import { GetAllBuyerReceivables } from "@/Api/Api";

export function ReceivablesPage() {
  const navigate = useNavigate();
  const [selectedBuyer, setSelectedBuyer] = useState<string | null>(null);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [receivables, setReceivables] = useState([]);

  const handleViewBuyer = (buyerId: string) => {
    navigate(`/receivables/buyer/${buyerId}`);
  };

  const parseAmount = (value) => {
    const parsed = parseFloat(value?.toString().replace(/[^\d.]/g, ""));
    return isNaN(parsed) ? 0 : parsed;
  };

  const handleAddPayment = (buyerId: string) => {
    setSelectedBuyer(buyerId);
    setShowAddPayment(true);
  };

  const totalsData = receivables.filter((r) => parseAmount(r.remainingDue) > 0);
  const overdueData = receivables.filter((r) => parseAmount(r.overdueDue) > 0);
  const dueSoonData = receivables.filter((r) => parseAmount(r.dueSoonDue) > 0);

  useEffect(() => {
    const fetchReceivables = async () => {
      try {
        const data = await GetAllBuyerReceivables();
        setReceivables(data);
      } catch (error) {
        console.error("Error fetching receivables:", error);
      }
    };

    fetchReceivables();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Receivables</h1>
          <p className="text-muted-foreground">
            Manage buyer payments and installments
          </p>
        </div>

        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Buyer Receivables</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="totals" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="totals">Totals</TabsTrigger>
              <TabsTrigger value="overdue">Overdue</TabsTrigger>
              <TabsTrigger value="due-soon">Due Soon</TabsTrigger>
            </TabsList>

            <TabsContent value="totals" className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Buyer Name</TableHead>
                    <TableHead>Total Due (Unpaid Installments)</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {totalsData.map((buyer) => (
                    <TableRow key={buyer.buyerId}>
                      <TableCell className="font-medium">
                        {buyer.buyerName}
                      </TableCell>
                      <TableCell>
                        PKR {parseAmount(buyer.remainingDue).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewBuyer(buyer.buyerId)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddPayment(buyer.buyerId)}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Payment
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="overdue" className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Buyer Name</TableHead>
                    <TableHead>Overdue Amount</TableHead>
                    <TableHead>Oldest Due Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {overdueData.map((buyer) => (
                    <TableRow key={buyer.buyerId}>
                      <TableCell className="font-medium">
                        {buyer.buyerName}
                      </TableCell>
                      <TableCell className="text-destructive">
                        PKR {buyer.overdueDue.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="destructive">
                          {buyer.oldestDueDate}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewBuyer(buyer.buyerId)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddPayment(buyer.buyerId)}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Payment
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="due-soon" className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Buyer Name</TableHead>
                    <TableHead>Due Soon Amount</TableHead>
                    <TableHead>Next Due Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dueSoonData.map((buyer) => (
                    <TableRow key={buyer.buyerId}>
                      <TableCell className="font-medium">
                        {buyer.buyerName}
                      </TableCell>
                      <TableCell className="text-orange-600">
                        PKR {buyer.dueSoonDue.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{buyer.nextDueDate}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewBuyer(buyer.buyerId)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddPayment(buyer.buyerId)}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Payment
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {showAddPayment && selectedBuyer && (
        <AddPaymentModal
          buyerId={selectedBuyer}
          isOpen={showAddPayment}
          onClose={() => setShowAddPayment(false)}
        />
      )}
    </div>
  );
}
