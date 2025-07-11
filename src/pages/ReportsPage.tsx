
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  FileText, 
  Users, 
  ShoppingCart, 
  Building2, 
  CreditCard,
  Receipt,
  Clock,
  TrendingDown,
  Banknote,
  Wallet,
  BarChart3,
  Download
} from "lucide-react";
import { FarmerLedgerReport } from "@/components/reports/FarmerLedgerReport";
import { BuyerLedgerReport } from "@/components/reports/BuyerLedgerReport";
import { VendorLedgerReport } from "@/components/reports/VendorLedgerReport";
import { AdvancesReport } from "@/components/reports/AdvancesReport";
import { SalesReport } from "@/components/reports/SalesReport";
import { ReceivablesAgingReport } from "@/components/reports/ReceivablesAgingReport";
import { PayablesAgingReport } from "@/components/reports/PayablesAgingReport";
import { CashbookReport } from "@/components/reports/CashbookReport";
import { BankbookReport } from "@/components/reports/BankbookReport";
import { ProfitLossReport } from "@/components/reports/ProfitLossReport";

const reportTypes = [
  { id: "farmer-ledger", title: "Farmer Ledger", icon: Users, description: "Individual farmer transactions" },
  { id: "buyer-ledger", title: "Buyer Ledger", icon: ShoppingCart, description: "Buyer invoices and payments" },
  { id: "vendor-ledger", title: "Vendor Ledger", icon: Building2, description: "Vendor purchases and payments" },
  { id: "advances", title: "Advances Report", icon: CreditCard, description: "All farmer advances" },
  { id: "sales", title: "Sales Report", icon: Receipt, description: "Sales and commission data" },
  { id: "receivables-aging", title: "Receivables Aging", icon: Clock, description: "Outstanding buyer payments" },
  { id: "payables-aging", title: "Payables Aging", icon: TrendingDown, description: "Outstanding vendor payments" },
  { id: "cashbook", title: "Cashbook", icon: Wallet, description: "All cash transactions" },
  { id: "bankbook", title: "Bankbook", icon: Banknote, description: "All bank transactions" },
  { id: "profit-loss", title: "Profit & Loss", icon: BarChart3, description: "Financial summary" },
];

export function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<string>("");
  const [dateRange, setDateRange] = useState({
    from: new Date().toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });

  const handleQuickReport = (reportId: string) => {
    setSelectedReport(reportId);
  };

  const renderSelectedReport = () => {
    const commonProps = { dateRange };
    
    switch (selectedReport) {
      case "farmer-ledger":
        return <FarmerLedgerReport {...commonProps} />;
      case "buyer-ledger":
        return <BuyerLedgerReport {...commonProps} />;
      case "vendor-ledger":
        return <VendorLedgerReport {...commonProps} />;
      case "advances":
        return <AdvancesReport {...commonProps} />;
      case "sales":
        return <SalesReport {...commonProps} />;
      case "receivables-aging":
        return <ReceivablesAgingReport {...commonProps} />;
      case "payables-aging":
        return <PayablesAgingReport {...commonProps} />;
      case "cashbook":
        return <CashbookReport {...commonProps} />;
      case "bankbook":
        return <BankbookReport {...commonProps} />;
      case "profit-loss":
        return <ProfitLossReport {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">Generate comprehensive business reports</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export All
        </Button>
      </div>

      {!selectedReport ? (
        <>
          {/* Quick Report Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {reportTypes.map((report) => (
              <Card 
                key={report.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleQuickReport(report.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <report.icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-sm">{report.title}</CardTitle>
                  </div>
                  <CardDescription className="text-xs">
                    {report.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          {/* Report Generation Form */}
          <Card>
            <CardHeader>
              <CardTitle>Generate Report</CardTitle>
              <CardDescription>Select report type and date range</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Select Report</Label>
                  <Select value={selectedReport} onValueChange={setSelectedReport}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose report type" />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTypes.map((report) => (
                        <SelectItem key={report.id} value={report.id}>
                          {report.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>From Date</Label>
                  <Input
                    type="date"
                    value={dateRange.from}
                    onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>To Date</Label>
                  <Input
                    type="date"
                    value={dateRange.to}
                    onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => selectedReport && handleQuickReport(selectedReport)}
                  disabled={!selectedReport}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export XLSX
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setSelectedReport("")}>
              ← Back to Reports
            </Button>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export XLSX
              </Button>
            </div>
          </div>
          
          {renderSelectedReport()}
        </div>
      )}
    </div>
  );
}
