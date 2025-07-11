
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface BankbookReportProps {
  dateRange: { from: string; to: string };
}

export function BankbookReport({ dateRange }: BankbookReportProps) {
  const [isGenerated, setIsGenerated] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bankbook Report</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Date Range: {new Date(dateRange.from).toLocaleDateString()} - {new Date(dateRange.to).toLocaleDateString()}
        </div>
        <Button onClick={() => setIsGenerated(true)}>Generate Report</Button>
        <div className="text-center text-muted-foreground py-8">
          {isGenerated ? "Bankbook report would be displayed here with all bank transactions by account" : "Click Generate to view the bankbook report"}
        </div>
      </CardContent>
    </Card>
  );
}
