import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileBarChart,
  Users,
  ShoppingCart,
  Truck,
  TrendingUp,
  Calendar as CalendarCheck,
  AlertTriangle,
  CreditCard,
  Banknote,
  PieChart,
  Download
} from "lucide-react";

// Import all report components
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
  { id: "farmer-ledger", name: "Farmer Ledger", icon: Users, description: "Individual farmer transaction history" },
  { id: "buyer-ledger", name: "Buyer Ledger", icon: ShoppingCart, description: "Buyer invoices and payments" },
  { id: "vendor-ledger", name: "Vendor Ledger", icon: Truck, description: "Vendor purchases and payments" },
  { id: "advances-report", name: "Advances Report", icon: TrendingUp, description: "All advances given to farmers" },
  { id: "sales-report", name: "Sales Report", icon: FileBarChart, description: "Sales transactions and commissions" },
  { id: "receivables-aging", name: "Receivables Aging", icon: CalendarCheck, description: "Outstanding buyer payments" },
  { id: "payables-aging", name: "Payables Aging", icon: AlertTriangle, description: "Outstanding vendor payments" },
  { id: "cashbook", name: "Cashbook", icon: Banknote, description: "Cash transactions record" },
  { id: "bankbook", name: "Bankbook", icon: CreditCard, description: "Bank account transactions" },
  { id: "profit-loss", name: "Profit & Loss", icon: PieChart, description: "Financial performance summary" },
];

export function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<string>("");
  const [fromDate, setFromDate] = useState<Date | undefined>(new Date());
  const [toDate, setToDate] = useState<Date | undefined>(new Date());

  const handleQuickReport = (reportId: string) => {
    setSelectedReport(reportId);
  };

  const dateRange = {
    from: fromDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
    to: toDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0]
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
      case "advances-report":
        return <AdvancesReport {...commonProps} />;
      case "sales-report":
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
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Enhanced Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-inter">Reports & Analytics</h1>
        <p className="text-muted-foreground font-inter">Generate comprehensive reports for your agricultural business</p>
      </div>

      {/* Quick Access Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          return (
            <Card 
              key={report.id} 
              className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 border-border bg-card",
                selectedReport === report.id && "ring-2 ring-primary bg-primary/5"
              )}
              onClick={() => handleQuickReport(report.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-sm font-medium leading-tight font-inter text-foreground">{report.name}</CardTitle>
                <CardDescription className="text-xs leading-tight text-muted-foreground font-inter">{report.description}</CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {/* Report Generation Controls */}
      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground font-inter">
            <FileBarChart className="h-5 w-5" />
            Generate Report
          </CardTitle>
          <CardDescription className="text-muted-foreground font-inter">
            Select report type, set date range, and generate your business reports
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Report Type</Label>
              <Select value={selectedReport} onValueChange={setSelectedReport}>
                <SelectTrigger className="focus-ring">
                  <SelectValue placeholder="Choose a report type" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((report) => (
                    <SelectItem key={report.id} value={report.id}>
                      {report.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">From Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal focus-ring",
                      !fromDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fromDate ? format(fromDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={fromDate}
                    onSelect={setFromDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">To Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal focus-ring",
                      !toDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {toDate ? format(toDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={toDate}
                    onSelect={setToDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={() => selectedReport && console.log("Generate report")} 
              disabled={!selectedReport}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-inter flex items-center gap-2 shadow-sm"
            >
              <FileBarChart className="h-4 w-4" />
              Generate Report
            </Button>
            <Button variant="outline" className="border-border text-foreground hover:bg-accent font-inter flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Display */}
      {selectedReport && (
        <div className="animate-fade-in">
          {renderSelectedReport()}
        </div>
      )}
    </div>
  );
}
