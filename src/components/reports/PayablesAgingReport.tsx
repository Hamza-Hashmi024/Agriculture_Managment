
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PayablesAgingReportProps {
  dateRange: { from: string; to: string };
}

export function PayablesAgingReport({ dateRange }: PayablesAgingReportProps) {
  const [isGenerated, setIsGenerated] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payables Aging Report</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Date Range: {new Date(dateRange.from).toLocaleDateString()} - {new Date(dateRange.to).toLocaleDateString()}
        </div>
        <Button onClick={() => setIsGenerated(true)}>Generate Report</Button>
        <div className="text-center text-muted-foreground py-8">
          {isGenerated ? "Payables aging report would be displayed here with vendor outstanding amounts by age" : "Click Generate to view the payables aging report"}
        </div>
      </CardContent>
    </Card>
  );
}
