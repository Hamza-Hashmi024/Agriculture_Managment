import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GetCashbook } from "@/Api/Api";

interface CashbookReportProps {
  dateRange: { from: string; to: string };
}

export function CashbookReport({ dateRange }: CashbookReportProps) {
  const [isGenerated, setIsGenerated] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    try {
      setLoading(true);
      const result = await GetCashbook(dateRange.from, dateRange.to);
      setData(result);
      setIsGenerated(true);
    } catch (error) {
      console.error("Error generating cashbook report:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cashbook Report</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Date Range: {new Date(dateRange.from).toLocaleDateString()} -{" "}
          {new Date(dateRange.to).toLocaleDateString()}
        </div>

        <Button onClick={generateReport} disabled={loading}>
          {loading ? "Generating..." : "Generate Report"}
        </Button>

        {!isGenerated && (
          <div className="text-center text-muted-foreground py-8">
            Click Generate to view the cashbook report
          </div>
        )}

        {isGenerated && (
          <div className="overflow-x-auto">
            {data.length > 0 ? (
              <table className="min-w-full border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border">Date</th>
                    <th className="px-4 py-2 border">Description</th>
                    <th className="px-4 py-2 border">Type</th>
                    <th className="px-4 py-2 border">Amount</th>
                    <th className="px-4 py-2 border">Running Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, index) => (
                    <tr key={index} className="text-center">
                      <td className="px-4 py-2 border">
                        {new Date(row.txn_date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 border">{row.description}</td>
                      <td className="px-4 py-2 border">{row.type}</td>
                      <td className="px-4 py-2 border">{row.amount}</td>
                      <td className="px-4 py-2 border">{row.running_balance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No transactions found for this period
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
