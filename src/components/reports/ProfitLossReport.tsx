
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProfitLossReportProps {
  dateRange: { from: string; to: string };
}

export function ProfitLossReport({ dateRange }: ProfitLossReportProps) {
  const [isGenerated, setIsGenerated] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profit & Loss Report</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Date Range: {new Date(dateRange.from).toLocaleDateString()} - {new Date(dateRange.to).toLocaleDateString()}
        </div>
        <Button onClick={() => setIsGenerated(true)}>Generate Report</Button>
        <div className="text-center text-muted-foreground py-8">
          {isGenerated ? "Profit & Loss statement would be displayed here with income, expenses, and net profit calculations" : "Click Generate to view the profit & loss report"}
        </div>
      </CardContent>
    </Card>
  );
}
