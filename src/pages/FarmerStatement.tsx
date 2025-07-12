import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Printer } from "lucide-react";

const mockStatementData: Record<string, {
  date: string;
  farmer: string;
  crop: string;
  weight: number;
  rate: number;
  commission: number;
  grossSale: number;
  advances: number;
  expenses: Array<{ description: string; amount: number }>;
}> = {
  "1": {
    date: "12-Jul-2025",
    farmer: "Akbar Ali",
    crop: "Wheat",
    weight: 120,
    rate: 4200,
    commission: 1.5,
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
  const statement = id ? mockStatementData[id] : undefined;

  if (!statement) {
    return <div>Statement not found</div>;
  }

  const totalExpenses = statement.expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const netPayable = statement.grossSale - statement.advances - totalExpenses;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/sales')} className="text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sales
          </Button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Farmer Statement</h1>
            <p className="text-sm text-gray-600">Settlement statement for {statement.farmer}</p>
          </div>
        </div>
        
        <Button variant="outline" size="sm" className="text-gray-700 border-gray-300">
          <Printer className="h-4 w-4 mr-2" />
          Print Statement
        </Button>
      </div>

      <Card className="max-w-4xl mx-auto bg-white shadow-sm">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-lg font-bold text-gray-900">FARMER STATEMENT</CardTitle>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          {/* Basic Details in 2 columns */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Date:</span>
                <span className="text-gray-900">{statement.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Farmer:</span>
                <span className="text-gray-900">{statement.farmer}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Crop:</span>
                <span className="text-gray-900">{statement.crop}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Weight:</span>
                <span className="text-gray-900">{statement.weight} manns</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Rate:</span>
                <span className="text-gray-900">PKR {statement.rate.toLocaleString()}/mann</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Commission:</span>
                <span className="text-gray-900">{statement.commission}%</span>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="space-y-4">
            <div className="flex justify-between py-2">
              <span className="font-medium text-gray-700">Gross Sale:</span>
              <span className="text-gray-900 font-medium">PKR {statement.grossSale.toLocaleString()}</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-red-600">Less Advances:</span>
                <span className="text-red-600">PKR {statement.advances.toLocaleString()}</span>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-red-600">Less Expenses:</span>
                  <span className="text-red-600">PKR {totalExpenses.toLocaleString()}</span>
                </div>
                <div className="ml-4 space-y-1">
                  {statement.expenses.map((expense, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">• {expense.description}:</span>
                      <span className="text-gray-600">PKR {expense.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mt-6">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Net Payable:</span>
                <span className="text-green-600 font-bold text-lg">
                  PKR {netPayable.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Settlement Status */}
          <div className="border-t border-gray-200 pt-4 mt-6">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">Settlement Status:</span>
              <span className="px-3 py-1 rounded text-sm bg-yellow-100 text-yellow-800 border border-yellow-200">
                Pending Payment
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
