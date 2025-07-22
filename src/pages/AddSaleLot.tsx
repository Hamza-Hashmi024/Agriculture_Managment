import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GetAllFarmer, GetAllCrops , GetBankAccountsWithBalance ,GetAllBuyers } from "@/Api/Api";

interface Expense {
  id: string;
  description: string;
  customDescription?: string;
  amount: number;
  source: string;
  bankAccount?: string;
  refNo?: string;
}

interface Installment {
  id: string;
  percentage: number;
  amount: number;
  dueWithinDays: number;
  dueDate: string;
}

export function AddSaleLot() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [buyers, setBuyers] = useState([]);

  // Lot Details
  const [farmer, setFarmer] = useState("");
  const [farmersList, setFarmersList] = useState([]);
  const [cropsList, setCropsList] = useState([]);
  const [crop, setCrop] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [weight, setWeight] = useState("");
  const [rate, setRate] = useState("");
  const [commission, setCommission] = useState("");

  // Expenses
  const [farmerExpenses, setFarmerExpenses] = useState<Expense[]>([]);
  const [buyerExpenses, setBuyerExpenses] = useState<Expense[]>([]);

  // Buyer Details
  const [buyer, setBuyer] = useState("");
  const [upfrontPayment, setUpfrontPayment] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [installments, setInstallments] = useState<Installment[]>([]);

  // Fetch farmers , Crops from API
  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const farmers = await GetAllFarmer();
        setFarmersList(farmers);
        setFarmer(farmers.length > 0 ? farmers[0].name : "");
      } catch (error) {
        console.error("Error fetching farmers:", error);
      }
    };

    const fetchCrops = async () => {
      try {
        const crops = await GetAllCrops();
        setCropsList(crops);
        setCrop(crops.length > 0 ? crops[0].name : "");
      } catch (error) {
        console.error("Error fetching crops:", error);
      }
    };

    const fetchBankAccounts = async () => {
      try {
        const accounts = await GetBankAccountsWithBalance();
        setBankAccounts(accounts);
      } catch (error) {
        console.error("Error fetching bank accounts:", error);
      }
    };

    const fetchBuyers = async () => {
      try {
        const buyersData = await GetAllBuyers();
        setBuyers(buyersData);
        setBuyer(buyersData.length > 0 ? buyersData[0].name : "");
      } catch (error) {
        console.error("Error fetching buyers:", error);
      }
    };


    fetchFarmers();
    fetchCrops();
    fetchBankAccounts();
    fetchBuyers();
  }, []);

  const calculateTotalBuyerPayable = () => {
    const saleAmount = (parseFloat(weight) || 0) * (parseFloat(rate) || 0);
    const buyerExpenseTotal = buyerExpenses.reduce(
      (sum, exp) => sum + exp.amount,
      0
    );
    return saleAmount + buyerExpenseTotal;
  };

  const calculateRemainingAmount = () => {
    const totalPayable = calculateTotalBuyerPayable();
    const upfront = parseFloat(upfrontPayment) || 0;
    return totalPayable - upfront;
  };

  const calculateInstallmentSubtotal = () => {
    return installments.reduce((sum, inst) => sum + inst.amount, 0);
  };

  const isStep1Valid = () => {
    return farmer && crop && arrivalDate && weight && rate && commission;
  };

  const isPaymentBalanced = () => {
    const totalPayable = calculateTotalBuyerPayable();
    const upfront = parseFloat(upfrontPayment) || 0;
    const installmentTotal = calculateInstallmentSubtotal();
    return Math.abs(upfront + installmentTotal - totalPayable) < 0.01; // Allow for floating point precision
  };

  const addExpense = (type: "farmer" | "buyer") => {
    const newExpense: Expense = {
      id: Date.now().toString(),
      description: "",
      amount: 0,
      source: "cashbox",
    };

    if (type === "farmer") {
      setFarmerExpenses([...farmerExpenses, newExpense]);
    } else {
      setBuyerExpenses([...buyerExpenses, newExpense]);
    }
  };

  const updateExpense = (
    id: string,
    field: string,
    value: string | number,
    type: "farmer" | "buyer"
  ) => {
    const updateExpenses =
      type === "farmer" ? setFarmerExpenses : setBuyerExpenses;
    const expenses = type === "farmer" ? farmerExpenses : buyerExpenses;

    updateExpenses(
      expenses.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp))
    );
  };

  const removeExpense = (id: string, type: "farmer" | "buyer") => {
    if (type === "farmer") {
      setFarmerExpenses(farmerExpenses.filter((exp) => exp.id !== id));
    } else {
      setBuyerExpenses(buyerExpenses.filter((exp) => exp.id !== id));
    }
  };

  const addInstallment = () => {
    const newInstallment: Installment = {
      id: Date.now().toString(),
      percentage: 0,
      amount: 0,
      dueWithinDays: 30,
      dueDate: "",
    };
    setInstallments([...installments, newInstallment]);
  };

  const updateInstallment = (id: string, field: string, value: number) => {
    setInstallments(
      installments.map((inst) => {
        if (inst.id === id) {
          const updated = { ...inst, [field]: value };

          // Auto-calculate amount when percentage changes
          if (field === "percentage") {
            const remainingAmount = calculateRemainingAmount();
            updated.amount = (remainingAmount * value) / 100;
          }

          // Auto-calculate percentage when amount changes
          if (field === "amount") {
            const remainingAmount = calculateRemainingAmount();
            updated.percentage =
              remainingAmount > 0 ? (value / remainingAmount) * 100 : 0;
          }

          return updated;
        }
        return inst;
      })
    );
  };

  const removeInstallment = (id: string) => {
    setInstallments(installments.filter((inst) => inst.id !== id));
  };

  const handleSaveAndGenerate = () => {
    if (!isPaymentBalanced()) {
      alert(
        "Error: The sum of upfront payment and installments must equal the total buyer payable amount."
      );
      return;
    }
    navigate("/sales");
  };

  const renderStep1 = () => (
    <Card>
      <CardHeader>
        <CardTitle>Step 1: Lot Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="farmer" className="text-red-500">
              Farmer *
            </Label>
            <Select value={farmer} onValueChange={setFarmer} required>
              <SelectTrigger>
                <SelectValue placeholder="Select farmer" />
              </SelectTrigger>
              <SelectContent>
                {farmersList.map((f: any) => (
                  <SelectItem key={f.id} value={f.name}>
                    {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="crop" className="text-red-500">
              Crop *
            </Label>
            <Select value={crop} onValueChange={setCrop} required>
              <SelectTrigger>
                <SelectValue placeholder="Select crop" />
              </SelectTrigger>
              <SelectContent>
                {cropsList.map((c: any) => (
                  <SelectItem key={c.id} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="arrivalDate" className="text-red-500">
              Arrival Date *
            </Label>
            <Input
              id="arrivalDate"
              type="date"
              value={arrivalDate}
              onChange={(e) => setArrivalDate(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="weight" className="text-red-500">
              Weight (manns) *
            </Label>
            <Input
              id="weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter weight"
              required
            />
          </div>
          <div>
            <Label htmlFor="rate" className="text-red-500">
              Rate per mann *
            </Label>
            <Input
              id="rate"
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="Enter rate"
              required
            />
          </div>
          <div>
            <Label htmlFor="commission" className="text-red-500">
              Commission % *
            </Label>
            <Input
              id="commission"
              type="number"
              value={commission}
              onChange={(e) => setCommission(e.target.value)}
              placeholder="Enter commission percentage"
              required
            />
          </div>
        </div>
        {!isStep1Valid() && (
          <p className="text-red-500 text-sm">* All fields are mandatory</p>
        )}
      </CardContent>
    </Card>
  );

  const renderExpenseTable = (
    expenses: Expense[],
    type: "farmer" | "buyer"
  ) => {
    const expenseOptions =
      type === "farmer"
        ? [
            { value: "transport", label: "Transport" },
            { value: "offloading", label: "Offloading" },
            { value: "other", label: "Other" },
          ]
        : [
            { value: "packing", label: "Packing" },
            { value: "transport", label: "Transport" },
            { value: "other", label: "Other" },
          ];

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">
            {type === "farmer" ? "Farmer-side Expenses" : "Buyer-side Expenses"}
          </h3>
          <Button onClick={() => addExpense(type)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add {type === "farmer" ? "Farmer" : "Buyer"} Expense
          </Button>
        </div>

        {expenses.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Bank Account</TableHead>
                <TableHead>Ref No.</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>
                    <div className="space-y-2">
                      <Select
                        value={expense.description}
                        onValueChange={(value) =>
                          updateExpense(expense.id, "description", value, type)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select description" />
                        </SelectTrigger>
                        <SelectContent>
                          {expenseOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {expense.description === "other" && (
                        <Input
                          value={expense.customDescription || ""}
                          onChange={(e) =>
                            updateExpense(
                              expense.id,
                              "customDescription",
                              e.target.value,
                              type
                            )
                          }
                          placeholder="Enter custom description"
                        />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={expense.amount || ""}
                      onChange={(e) =>
                        updateExpense(
                          expense.id,
                          "amount",
                          parseFloat(e.target.value) || 0,
                          type
                        )
                      }
                      placeholder="Amount"
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={expense.source}
                      onValueChange={(value) =>
                        updateExpense(expense.id, "source", value, type)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cashbox">Cashbox</SelectItem>
                        <SelectItem value="bank">Bank</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                 <TableCell>
  {expense.source === "bank" && (
    <Select
      value={expense.bankAccount || ""}
      onValueChange={(value) =>
        updateExpense(expense.id, "bankAccount", value, type)
      }
    >
      <SelectTrigger>
        <SelectValue placeholder="Select bank" />
      </SelectTrigger>
      <SelectContent>
        {bankAccounts.map((account: any) => (
          <SelectItem key={account.id} value={account.id}>
            {account.title} - Rs. {account.balance}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )}
</TableCell>

                  <TableCell>
                    <Input
                      value={expense.refNo || ""}
                      onChange={(e) =>
                        updateExpense(expense.id, "refNo", e.target.value, type)
                      }
                      placeholder="Reference No."
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExpense(expense.id, type)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    );
  };

  const renderStep2 = () => (
    <Card>
      <CardHeader>
        <CardTitle>Step 2: Farmer-side Expenses</CardTitle>
      </CardHeader>
      <CardContent>{renderExpenseTable(farmerExpenses, "farmer")}</CardContent>
    </Card>
  );

  const renderStep3 = () => (
    <Card>
      <CardHeader>
        <CardTitle>Step 3: Buyer Details & Expenses</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="buyer">Buyer</Label>
         <Select value={buyer} onValueChange={setBuyer} required>
  <SelectTrigger>
    <SelectValue placeholder="Select buyer" />
  </SelectTrigger>
  <SelectContent>
    {buyers.map((buyerObj: any) => (
      <SelectItem key={buyerObj.id} value={buyerObj.name}>
        {buyerObj.name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
        </div>

        {renderExpenseTable(buyerExpenses, "buyer")}
      </CardContent>
    </Card>
  );

  const renderStep4 = () => (
    <Card>
      <CardHeader>
        <CardTitle>Step 4: Buyer Payment & Installment Schedule</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-muted rounded-lg">
          <h3 className="text-lg font-semibold mb-2">
            Total Buyer Payable: PKR{" "}
            {calculateTotalBuyerPayable().toLocaleString()}
          </h3>
          <p className="text-sm text-muted-foreground">
            Weight × Rate + Buyer-side Expenses
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="upfrontPayment">Upfront Payment</Label>
            <Input
              id="upfrontPayment"
              type="number"
              value={upfrontPayment}
              onChange={(e) => setUpfrontPayment(e.target.value)}
              placeholder="Amount"
            />
          </div>
          <div>
            <Label htmlFor="paymentMode">Payment Mode</Label>
            <Select value={paymentMode} onValueChange={setPaymentMode}>
              <SelectTrigger>
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="bank">Bank</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {paymentMode === "bank" && (
            <div>
              <Label>Bank Account</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select bank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meezan-1234">Meezan - 1234</SelectItem>
                  <SelectItem value="hbl-4432">HBL - 4432</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-md font-medium">
              Installments (Remaining: PKR{" "}
              {calculateRemainingAmount().toLocaleString()})
            </h4>
            <Button onClick={addInstallment} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Installment
            </Button>
          </div>

          {installments.length > 0 && (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Percentage (%)</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Within (days)</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {installments.map((installment) => (
                    <TableRow key={installment.id}>
                      <TableCell>
                        <Input
                          type="number"
                          value={installment.percentage || ""}
                          onChange={(e) =>
                            updateInstallment(
                              installment.id,
                              "percentage",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          placeholder="Percentage"
                          min="0"
                          max="100"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={installment.amount || ""}
                          onChange={(e) =>
                            updateInstallment(
                              installment.id,
                              "amount",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          placeholder="Amount"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={installment.dueWithinDays || ""}
                          onChange={(e) => {
                            const newInstallments = installments.map((inst) =>
                              inst.id === installment.id
                                ? {
                                    ...inst,
                                    dueWithinDays:
                                      parseInt(e.target.value) || 0,
                                  }
                                : inst
                            );
                            setInstallments(newInstallments);
                          }}
                          placeholder="Days"
                        />
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {installment.dueWithinDays
                            ? new Date(
                                Date.now() +
                                  installment.dueWithinDays *
                                    24 *
                                    60 *
                                    60 *
                                    1000
                              ).toLocaleDateString()
                            : "Not set"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeInstallment(installment.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-sm">
                  <span>Upfront Payment:</span>
                  <span>
                    PKR {(parseFloat(upfrontPayment) || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Installments Subtotal:</span>
                  <span>
                    PKR {calculateInstallmentSubtotal().toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-lg font-semibold border-t pt-2">
                  <span>Total:</span>
                  <span>
                    PKR{" "}
                    {(
                      (parseFloat(upfrontPayment) || 0) +
                      calculateInstallmentSubtotal()
                    ).toLocaleString()}
                  </span>
                </div>
                {!isPaymentBalanced() && (
                  <p className="text-red-500 text-sm mt-2">
                    ⚠️ Total payment (
                    {(
                      (parseFloat(upfrontPayment) || 0) +
                      calculateInstallmentSubtotal()
                    ).toLocaleString()}
                    ) does not match buyer payable (
                    {calculateTotalBuyerPayable().toLocaleString()})
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => navigate("/sales")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Sales
        </Button>
        <div>
          <h1 className="text-3xl font-bold">New Sale / Crop Lot</h1>
          <p className="text-muted-foreground">Step {currentStep} of 4</p>
        </div>
      </div>

      <div className="space-y-6">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}

        <div className="flex justify-between">
          <Button
            variant="outline"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep(currentStep - 1)}
          >
            Previous
          </Button>

          <div className="flex gap-2">
            {currentStep < 4 ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={currentStep === 1 && !isStep1Valid()}
              >
                Next
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => navigate("/sales")}>
                  Cancel
                </Button>
                <Button onClick={handleSaveAndGenerate}>
                  Save & Generate Invoice
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
