
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface VendorLedgerReportProps {
  dateRange: { from: string; to: string };
}

export function VendorLedgerReport({ dateRange }: VendorLedgerReportProps) {
  const [selectedVendor, setSelectedVendor] = useState<string>("");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendor Ledger Report</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Select Vendor</Label>
            <Select value={selectedVendor} onValueChange={setSelectedVendor}>
              <SelectTrigger>
                <SelectValue placeholder="Choose vendor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">AgriMart</SelectItem>
                <SelectItem value="2">Kissan Store</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Date Range</Label>
            <div className="text-sm text-muted-foreground">
              {new Date(dateRange.from).toLocaleDateString()} - {new Date(dateRange.to).toLocaleDateString()}
            </div>
          </div>
        </div>
        <Button disabled={!selectedVendor}>Generate Report</Button>
        <div className="text-center text-muted-foreground py-8">
          Select a vendor and click Generate to view the ledger report
        </div>
      </CardContent>
    </Card>
  );
}
