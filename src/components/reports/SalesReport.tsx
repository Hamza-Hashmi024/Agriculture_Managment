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
            <div className="space-y-3">
              {report.map((row) => (
                <div
                  key={row.sale_id}
                  className="border rounded-lg p-3 shadow-sm bg-white"
                >
                  <div>
                    <strong>Date:</strong> {row.date}
                  </div>
                  <div>
                    <strong>Farmer:</strong> {row.farmer}
                  </div>
                  <div>
                    <strong>Buyer:</strong> {row.buyer}
                  </div>
                  <div>
                    <strong>Total Amount:</strong> ₹{row.total_amount}
                  </div>
                  <div>
                    <strong>Commission:</strong> ₹{row.commission}
                  </div>
                  <div>
                    <strong>Net Amount:</strong> ₹{row.net_amount}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
