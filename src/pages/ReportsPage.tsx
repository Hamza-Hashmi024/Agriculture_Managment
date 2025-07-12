
import React, { useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Users,
  ShoppingCart,
  Truck,
  TrendingUp,
  Calendar as CalendarCheck,
  AlertTriangle,
  CreditCard,
  Banknote,
  PieChart,
  FileBarChart
} from "lucide-react";

// Import modal components
import { FarmerLedgerModal } from "@/components/reports/FarmerLedgerModal";
import { BuyerLedgerModal } from "@/components/reports/BuyerLedgerModal";
import { AdvancesModal } from "@/components/reports/AdvancesModal";
import { SimpleReportModal } from "@/components/reports/SimpleReportModal";
import { VendorLedgerReport } from "@/components/reports/VendorLedgerReport";
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
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const handleReportClick = (reportId: string) => {
    setActiveModal(reportId);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Enhanced Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-inter">Reports & Analytics</h1>
        <p className="text-muted-foreground font-inter">Click on any report to generate it with custom parameters</p>
      </div>

      {/* Report Cards - Now clickable to open modals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          return (
            <Card 
              key={report.id} 
              className="cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 border-border bg-card hover:bg-accent/50"
              onClick={() => handleReportClick(report.id)}
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

      {/* Modals */}
      <FarmerLedgerModal 
        isOpen={activeModal === "farmer-ledger"} 
        onClose={closeModal} 
      />
      
      <BuyerLedgerModal 
        isOpen={activeModal === "buyer-ledger"} 
        onClose={closeModal} 
      />
      
      <AdvancesModal 
        isOpen={activeModal === "advances-report"} 
        onClose={closeModal} 
      />

      <SimpleReportModal
        isOpen={activeModal === "vendor-ledger"}
        onClose={closeModal}
        title="Vendor Ledger Report"
        reportComponent={VendorLedgerReport}
      />

      <SimpleReportModal
        isOpen={activeModal === "sales-report"}
        onClose={closeModal}
        title="Sales Report"
        reportComponent={SalesReport}
      />

      <SimpleReportModal
        isOpen={activeModal === "receivables-aging"}
        onClose={closeModal}
        title="Receivables Aging Report"
        reportComponent={ReceivablesAgingReport}
      />

      <SimpleReportModal
        isOpen={activeModal === "payables-aging"}
        onClose={closeModal}
        title="Payables Aging Report"
        reportComponent={PayablesAgingReport}
      />

      <SimpleReportModal
        isOpen={activeModal === "cashbook"}
        onClose={closeModal}
        title="Cashbook Report"
        reportComponent={CashbookReport}
      />

      <SimpleReportModal
        isOpen={activeModal === "bankbook"}
        onClose={closeModal}
        title="Bankbook Report"
        reportComponent={BankbookReport}
      />

      <SimpleReportModal
        isOpen={activeModal === "profit-loss"}
        onClose={closeModal}
        title="Profit & Loss Report"
        reportComponent={ProfitLossReport}
      />
    </div>
  );
}
