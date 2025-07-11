
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface VendorPurchase {
  id: string;
  vendor: string;
  category: string;
  totalAmount: number;
  description: string;
  paymentMode: "full" | "credit" | "partial";
  paidNow: number;
  fundingSource: string;
  referenceNo: string;
  invoice: File | null;
}

export function AddAdvance() {
  const navigate = useNavigate();
  const { farmerId } = useParams();
  
  const [formData, setFormData] = useState({
    farmer: farmerId || "",
    date: new Date().toISOString().split('T')[0],
    receivingType: "self",
    receiverName: "",
    advanceType: "cash",
    // Cash advance fields
    cashAmount: 0,
    cashFundingSource: "",
    cashReference: "",
    cashProof: null as File | null,
    // Acknowledgement
    thumbprint: false,
    signedForm: null as File | null
  });

  const [vendorPurchases, setVendorPurchases] = useState<VendorPurchase[]>([
    {
      id: "1",
      vendor: "",
      category: "",
      totalAmount: 0,
      description: "",
      paymentMode: "full",
      paidNow: 0,
      fundingSource: "",
      referenceNo: "",
      invoice: null
    }
  ]);

  const mockFarmers = [
    { id: "1", name: "Akbar Ali", cnic: "35201-1234567-1" },
    { id: "2", name: "Rafiq Ahmad", cnic: "35203-2345678-2" },
    { id: "3", name: "Muhammad Hassan", cnic: "35205-3456789-3" }
  ];

  const addVendorPurchase = () => {
    const newPurchase: VendorPurchase = {
      id: Date.now().toString(),
      vendor: "",
      category: "",
      totalAmount: 0,
      description: "",
      paymentMode: "full",
      paidNow: 0,
      fundingSource: "",
      referenceNo: "",
      invoice: null
    };
    setVendorPurchases([...vendorPurchases, newPurchase]);
  };

  const removeVendorPurchase = (id: string) => {
    if (vendorPurchases.length > 1) {
      setVendorPurchases(vendorPurchases.filter(p => p.id !== id));
    }
  };

  const updateVendorPurchase = (id: string, field: keyof VendorPurchase, value: any) => {
    setVendorPurchases(purchases =>
      purchases.map(p => p.id === id ? { ...p, [field]: value } : p)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.farmer || !formData.date) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (formData.advanceType === "cash" && !formData.cashAmount) {
      toast({
        title: "Validation Error",
        description: "Please enter cash amount.",
        variant: "destructive"
      });
      return;
    }

    if (formData.advanceType === "inkind") {
      const hasInvalidPurchase = vendorPurchases.some(p => 
        !p.vendor || !p.category || !p.totalAmount || !p.invoice
      );
      
      if (hasInvalidPurchase) {
        toast({
          title: "Validation Error",
          description: "Please complete all vendor purchase details and upload invoices.",
          variant: "destructive"
        });
        return;
      }
    }

    toast({
      title: "Advance Added",
      description: "Advance has been successfully recorded.",
    });

    navigate("/advances");
  };

  const selectedFarmer = mockFarmers.find(f => f.id === formData.farmer);

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/advances")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Advances
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Add Advance</h1>
          <p className="text-muted-foreground">Record a new advance for farmer</p>
        </div>
      </div>

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="farmer">Farmer *</Label>
                  <Select 
                    value={formData.farmer} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, farmer: value }))}
                    disabled={!!farmerId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select farmer" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockFarmers.map((farmer) => (
                        <SelectItem key={farmer.id} value={farmer.id}>
                          {farmer.name} ({farmer.cnic})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {farmerId && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Locked: {selectedFarmer?.name}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label>Receiving</Label>
                <RadioGroup
                  value={formData.receivingType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, receivingType: value }))}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="self" id="self" />
                    <Label htmlFor="self">Self</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">Someone else</Label>
                  </div>
                </RadioGroup>
                
                {formData.receivingType === "other" && (
                  <div className="mt-2">
                    <Input
                      placeholder="Enter receiver name"
                      value={formData.receiverName}
                      onChange={(e) => setFormData(prev => ({ ...prev, receiverName: e.target.value }))}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Step 1: Choose Advance Type</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={formData.advanceType}
                onValueChange={(value) => setFormData(prev => ({ ...prev, advanceType: value }))}
                className="flex gap-6 mb-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash">Cash</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="inkind" id="inkind" />
                  <Label htmlFor="inkind">In-Kind</Label>
                </div>
              </RadioGroup>

              {formData.advanceType === "cash" && (
                <div className="space-y-4 p-4 border rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="amount">Amount *</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={formData.cashAmount}
                        onChange={(e) => setFormData(prev => ({ ...prev, cashAmount: Number(e.target.value) }))}
                        placeholder="0"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="fundingSource">Funding Source *</Label>
                      <Select 
                        value={formData.cashFundingSource} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, cashFundingSource: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cashbox">Cashbox</SelectItem>
                          <SelectItem value="hbl">HBL Bank</SelectItem>
                          <SelectItem value="ubl">UBL Bank</SelectItem>
                          <SelectItem value="mcb">MCB Bank</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="reference">Reference No. (Optional)</Label>
                    <Input
                      id="reference"
                      value={formData.cashReference}
                      onChange={(e) => setFormData(prev => ({ ...prev, cashReference: e.target.value }))}
                      placeholder="Enter reference number"
                    />
                  </div>

                  <div>
                    <Label htmlFor="proof">Upload Proof/Receipt (Optional)</Label>
                    <Input
                      id="proof"
                      type="file"
                      onChange={(e) => setFormData(prev => ({ ...prev, cashProof: e.target.files?.[0] || null }))}
                    />
                  </div>
                </div>
              )}

              {formData.advanceType === "inkind" && (
                <div className="space-y-6">
                  {vendorPurchases.map((purchase, index) => (
                    <div key={purchase.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Vendor Purchase {index + 1}</h4>
                        {vendorPurchases.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeVendorPurchase(purchase.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Vendor *</Label>
                            <Select 
                              value={purchase.vendor} 
                              onValueChange={(value) => updateVendorPurchase(purchase.id, "vendor", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select vendor" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="agrimart">AgriMart</SelectItem>
                                <SelectItem value="kissan">Kissan Agri</SelectItem>
                                <SelectItem value="farmsupply">Farm Supply Co.</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label>Category *</Label>
                            <Select 
                              value={purchase.category} 
                              onValueChange={(value) => updateVendorPurchase(purchase.id, "category", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pesticides">Pesticides</SelectItem>
                                <SelectItem value="fertilizers">Fertilizers</SelectItem>
                                <SelectItem value="seeds">Seeds</SelectItem>
                                <SelectItem value="equipment">Equipment</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <Label>Total Amount *</Label>
                          <Input
                            type="number"
                            value={purchase.totalAmount}
                            onChange={(e) => updateVendorPurchase(purchase.id, "totalAmount", Number(e.target.value))}
                            placeholder="0"
                          />
                        </div>

                        <div>
                          <Label>Description (Optional)</Label>
                          <Textarea
                            value={purchase.description}
                            onChange={(e) => updateVendorPurchase(purchase.id, "description", e.target.value)}
                            placeholder="List items purchased"
                            rows={2}
                          />
                        </div>

                        <div>
                          <Label>Payment Mode *</Label>
                          <RadioGroup
                            value={purchase.paymentMode}
                            onValueChange={(value) => updateVendorPurchase(purchase.id, "paymentMode", value as any)}
                            className="flex gap-6"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="full" id={`full-${purchase.id}`} />
                              <Label htmlFor={`full-${purchase.id}`}>Paid Full</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="credit" id={`credit-${purchase.id}`} />
                              <Label htmlFor={`credit-${purchase.id}`}>Credit</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="partial" id={`partial-${purchase.id}`} />
                              <Label htmlFor={`partial-${purchase.id}`}>Partial</Label>
                            </div>
                          </RadioGroup>
                        </div>

                        {(purchase.paymentMode === "full" || purchase.paymentMode === "partial") && (
                          <div className="space-y-4 p-3 bg-muted/50 rounded">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label>Paid Now *</Label>
                                <Input
                                  type="number"
                                  value={purchase.paidNow}
                                  onChange={(e) => updateVendorPurchase(purchase.id, "paidNow", Number(e.target.value))}
                                  placeholder="0"
                                />
                              </div>

                              <div>
                                <Label>Funding Source *</Label>
                                <Select 
                                  value={purchase.fundingSource} 
                                  onValueChange={(value) => updateVendorPurchase(purchase.id, "fundingSource", value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select source" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="cashbox">Cashbox</SelectItem>
                                    <SelectItem value="hbl">HBL Bank</SelectItem>
                                    <SelectItem value="ubl">UBL Bank</SelectItem>
                                    <SelectItem value="mcb">MCB Bank</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div>
                              <Label>Reference No. (Optional)</Label>
                              <Input
                                value={purchase.referenceNo}
                                onChange={(e) => updateVendorPurchase(purchase.id, "referenceNo", e.target.value)}
                                placeholder="Enter reference number"
                              />
                            </div>

                            {purchase.paymentMode === "partial" && (
                              <div>
                                <Label>Balance Payable</Label>
                                <Input
                                  value={`PKR ${(purchase.totalAmount - purchase.paidNow).toLocaleString()}`}
                                  disabled
                                  className="bg-muted"
                                />
                              </div>
                            )}
                          </div>
                        )}

                        <div>
                          <Label>Upload Vendor Invoice/Receipt *</Label>
                          <Input
                            type="file"
                            onChange={(e) => updateVendorPurchase(purchase.id, "invoice", e.target.files?.[0] || null)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={addVendorPurchase}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Vendor Purchase
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Step 2: Farmer Acknowledgement (Optional)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="thumbprint"
                  checked={formData.thumbprint}
                  onChange={(e) => setFormData(prev => ({ ...prev, thumbprint: e.target.checked }))}
                />
                <Label htmlFor="thumbprint">Capture Thumbprint</Label>
                <Button type="button" variant="outline" size="sm" disabled={!formData.thumbprint}>
                  <Upload className="h-4 w-4 mr-2" />
                  Capture
                </Button>
              </div>

              <div>
                <Label htmlFor="signedForm">Upload Signed Form</Label>
                <Input
                  id="signedForm"
                  type="file"
                  onChange={(e) => setFormData(prev => ({ ...prev, signedForm: e.target.files?.[0] || null }))}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="submit">
              Save & Close
            </Button>
            <Button type="button" variant="outline">
              Save & Add Another Advance
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate("/advances")}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
