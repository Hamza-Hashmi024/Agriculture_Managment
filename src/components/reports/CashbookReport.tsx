
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CashbookReportProps {
  dateRange: { from: string; to: string };
}

export function CashbookReport({ dateRange }: CashbookReportProps) {
  const [isGenerated, setIsGenerated] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cashbook Report</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Date Range: {new Date(dateRange.from).toLocaleDateString()} - {new Date(dateRange.to).toLocaleDateString()}
        </div>
        <Button onClick={() => setIsGenerated(true)}>Generate Report</Button>
        <div className="text-center text-muted-foreground py-8">
          {isGenerated ? "Cashbook report would be displayed here with all cash transactions, debits, credits, and running balance" : "Click Generate to view the cashbook report"}
        </div>
      </CardContent>
    </Card>
  );
}
