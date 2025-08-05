
import { useState , useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Plus, Download, Eye, CreditCard } from "lucide-react";
import { AddPaymentModal } from "@/components/AddPaymentModal";
import { GetAllBuyersWithReceivables } from "@/Api/Api";

import { useNavigate } from "react-router-dom";



export function BuyersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [outstandingOnly, setOutstandingOnly] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedBuyerId, setSelectedBuyerId] = useState<string>("");
  
  const [buyers, setBuyers] = useState<any[]>([]);
  const [newBuyer, setNewBuyer] = useState({
    name: "",
    contacts: "",
    bankName: "",
    accountNo: "",
    iban: "",
    walletNumber: "",
    walletType: "",
    notes: ""
  });

const filteredBuyers = buyers.filter(buyer => {
  const matchesSearch = buyer.name.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesFilter = outstandingOnly ? buyer.netReceivable > 0 : true;
  return matchesSearch && matchesFilter;
});

  const navigate = useNavigate();


  const handleAddPayment = (buyerId: string) => {
    setSelectedBuyerId(buyerId);
    setIsPaymentModalOpen(true);
  };

useEffect(() => {
  const fetchBuyers = async () => {
    try {
      const response = await GetAllBuyersWithReceivables();

      if (Array.isArray(response)) {
        const mapped = response.map((buyer: any, index: number) => ({
          id: (index + 1).toString(),
          name: buyer.buyerName,
          netReceivable: buyer.netReceivable,
          lastSale: buyer.lastSaleDate,
          lastPayment: buyer.lastPaymentDate,
        }));

        setBuyers(mapped);
      } else {
        console.error("Unexpected response format", response);
      }
    } catch (error) {
      console.error("Error fetching buyers:", error);
    }
  };

  fetchBuyers();
}, []);


  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Buyers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search Buyer"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="outstanding-only"
                checked={outstandingOnly}
                onCheckedChange={(checked) => setOutstandingOnly(checked as boolean)}
              />
              <Label htmlFor="outstanding-only">Outstanding Only</Label>
            </div>

          
                <Button onClick={() => navigate("/buyers/add")} >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Buyer
                </Button>
            

            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Buyer Name</TableHead>
                <TableHead>Net Receivable</TableHead>
                <TableHead>Last Sale</TableHead>
                <TableHead>Last Payment</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBuyers.map((buyer) => (
                <TableRow key={buyer.id}>
                  <TableCell className="font-medium">{buyer.name}</TableCell>
                  <TableCell>
                    <span className={buyer.netReceivable > 0 ? "text-orange-600 font-medium" : "text-green-600"}>
                      PKR {buyer.netReceivable.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>{buyer.lastSale}</TableCell>
                  <TableCell>{buyer.lastPayment || "—"}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/buyers/${buyer.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </Button>
                      {buyer.netReceivable > 0 && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleAddPayment(buyer.id)}
                        >
                          <CreditCard className="h-4 w-4 mr-1" />
                          Add Payment
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredBuyers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No buyers found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>

      <AddPaymentModal
        buyerId={selectedBuyerId}
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      />
    </div>
  );
}
