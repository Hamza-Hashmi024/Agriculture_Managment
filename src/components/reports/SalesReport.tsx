
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SalesReportProps {
  dateRange: { from: string; to: string };
}

export function SalesReport({ dateRange }: SalesReportProps) {
  const [isGenerated, setIsGenerated] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Report</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Date Range: {new Date(dateRange.from).toLocaleDateString()} - {new Date(dateRange.to).toLocaleDateString()}
        </div>
        <Button onClick={() => setIsGenerated(true)}>Generate Report</Button>
        <div className="text-center text-muted-foreground py-8">
          {isGenerated ? "Sales report would be displayed here with lot details, farmers, buyers, and commission data" : "Click Generate to view the sales report"}
        </div>
      </CardContent>
    </Card>
  );
}
