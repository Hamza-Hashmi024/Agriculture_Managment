import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GetSalesReport } from "@/Api/Api";

interface SalesReportProps {
  dateRange: { from: string; to: string };
}

export function SalesReport({ dateRange }: SalesReportProps) {
  const [isGenerated, setIsGenerated] = useState(false);
  const [report, setReport] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const data = await GetSalesReport(dateRange.from, dateRange.to);
      setReport(data);
      setIsGenerated(true);
    } catch (error) {
      console.error("Error loading sales report:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Report</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Date Range:{" "}
          {new Date(dateRange.from).toLocaleDateString()} -{" "}
          {new Date(dateRange.to).toLocaleDateString()}
        </div>

        <Button onClick={handleGenerate} disabled={loading}>
          {loading ? "Generating..." : "Generate Report"}
        </Button>

        <div className="py-6">
          {!isGenerated && (
            <div className="text-center text-muted-foreground">
              Click Generate to view the sales report
            </div>
          )}

          {isGenerated && report.length === 0 && (
            <div className="text-center text-muted-foreground">
              No sales found in this date range
            </div>
          )}

          {report.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-3 py-2">Date</th>
                    <th className="border px-3 py-2">Farmer</th>
                    <th className="border px-3 py-2">Buyer</th>
                    <th className="border px-3 py-2">Crop</th>
                    <th className="border px-3 py-2">Weight (kg)</th>
                    <th className="border px-3 py-2">Rate (₹)</th>
                    <th className="border px-3 py-2">Gross Amount (₹)</th>
                    <th className="border px-3 py-2">Commission %</th>
                    <th className="border px-3 py-2">Commission (₹)</th>
                    <th className="border px-3 py-2">Buyer Payable (₹)</th>
                    <th className="border px-3 py-2">Net Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {report.map((row) => (
                    <tr key={row.sale_id} className="text-center">
                      <td className="border px-3 py-2">{row.date}</td>
                      <td className="border px-3 py-2">{row.farmer}</td>
                      <td className="border px-3 py-2">{row.buyer}</td>
                      <td className="border px-3 py-2">{row.crop}</td>
                      <td className="border px-3 py-2">{row.weight}</td>
                      <td className="border px-3 py-2">{row.rate}</td>
                      <td className="border px-3 py-2">{row.gross_amount}</td>
                      <td className="border px-3 py-2">{row.commission_percent}%</td>
                      <td className="border px-3 py-2">{row.commission_amount}</td>
                      <td className="border px-3 py-2">{row.total_buyer_payable}</td>
                      <td className="border px-3 py-2 font-semibold">{row.net_amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}