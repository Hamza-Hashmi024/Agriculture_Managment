
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Eye, Plus, Download } from "lucide-react";
import { AddPaymentModal } from "@/components/AddPaymentModal";

// Mock data for receivables
const mockReceivables = [
  {
    id: "1",
    buyerName: "Pak Foods",
    totalDue: 210000,
    overdueDue: 140000,
    dueSoonDue: 70000,
    oldestDueDate: "14-Jul-2025",
    nextDueDate: "20-Jul-2025"
  },
  {
    id: "2", 
    buyerName: "Noor Traders",
    totalDue: 85000,
    overdueDue: 0,
    dueSoonDue: 85000,
    oldestDueDate: null,
    nextDueDate: "22-Jul-2025"
  },
  {
    id: "3",
    buyerName: "Safeer Bros.",
    totalDue: 120000,
    overdueDue: 120000,
    dueSoonDue: 0,
    oldestDueDate: "10-Jul-2025",
    nextDueDate: null
  }
];

export function ReceivablesPage() {
  const navigate = useNavigate();
  const [selectedBuyer, setSelectedBuyer] = useState<string | null>(null);
  const [showAddPayment, setShowAddPayment] = useState(false);

  const handleViewBuyer = (buyerId: string) => {
    navigate(`/receivables/buyer/${buyerId}`);
  };

  const handleAddPayment = (buyerId: string) => {
    setSelectedBuyer(buyerId);
    setShowAddPayment(true);
  };

  const totalsData = mockReceivables.filter(r => r.totalDue > 0);
  const overdueData = mockReceivables.filter(r => r.overdueDue > 0);
  const dueSoonData = mockReceivables.filter(r => r.dueSoonDue > 0);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Receivables</h1>
          <p className="text-muted-foreground">Manage buyer payments and installments</p>
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
                    <TableRow key={buyer.id}>
                      <TableCell className="font-medium">{buyer.buyerName}</TableCell>
                      <TableCell>PKR {buyer.totalDue.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewBuyer(buyer.id)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddPayment(buyer.id)}
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
                    <TableRow key={buyer.id}>
                      <TableCell className="font-medium">{buyer.buyerName}</TableCell>
                      <TableCell className="text-destructive">
                        PKR {buyer.overdueDue.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="destructive">{buyer.oldestDueDate}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewBuyer(buyer.id)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddPayment(buyer.id)}
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
                    <TableRow key={buyer.id}>
                      <TableCell className="font-medium">{buyer.buyerName}</TableCell>
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
                            onClick={() => handleViewBuyer(buyer.id)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddPayment(buyer.id)}
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
