
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Printer } from "lucide-react";

const mockStatementData = {
  1: {
    date: "12-Jul-2025",
    farmer: "Akbar Ali",
    crop: "Wheat",
    weight: 120,
    rate: 4200,
    commission: 2.5,
    grossSale: 504000,
    advances: 35000,
    expenses: [
      { description: "Transport", amount: 5000 },
      { description: "Off-loading", amount: 2500 }
    ]
  }
};

export function FarmerStatement() {
  const { id } = useParams();
  const navigate = useNavigate();
  const statement = mockStatementData[id as keyof typeof mockStatementData];

  if (!statement) {
    return <div>Statement not found</div>;
  }

  const totalExpenses = statement.expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const netPayable = statement.grossSale - statement.advances - totalExpenses;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/sales')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sales
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Farmer Statement</h1>
            <p className="text-muted-foreground">Settlement statement for {statement.farmer}</p>
          </div>
        </div>
        
        <Button variant="outline" size="sm">
          <Printer className="h-4 w-4 mr-2" />
          Print Statement
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-center">FARMER STATEMENT</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Date:</span>
                <span>{statement.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Farmer:</span>
                <span>{statement.farmer}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Crop:</span>
                <span>{statement.crop}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Weight:</span>
                <span>{statement.weight} manns</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Rate:</span>
                <span>PKR {statement.rate.toLocaleString()}/mann</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Commission:</span>
                <span>{statement.commission}%</span>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="border-t pt-6 space-y-4">
            <div className="flex justify-between text-lg">
              <span className="font-medium">Gross Sale:</span>
              <span>PKR {statement.grossSale.toLocaleString()}</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-destructive">
                <span>Less Advances:</span>
                <span>PKR {statement.advances.toLocaleString()}</span>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-destructive">
                  <span>Less Expenses:</span>
                  <span>PKR {totalExpenses.toLocaleString()}</span>
                </div>
                <div className="ml-4 space-y-1">
                  {statement.expenses.map((expense, index) => (
                    <div key={index} className="flex justify-between text-sm text-muted-foreground">
                      <span>• {expense.description}:</span>
                      <span>PKR {expense.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between text-xl font-bold">
                <span>Net Payable:</span>
                <span className={netPayable >= 0 ? "text-green-600" : "text-red-600"}>
                  PKR {netPayable.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Settlement Status */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Settlement Status:</span>
              <span className={`px-3 py-1 rounded-full text-sm ${
                netPayable > 0 ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
              }`}>
                {netPayable > 0 ? "Pending Payment" : "Settled"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
