
import { Routes, Route } from "react-router-dom";
import { Dashboard } from "@/pages/Dashboard";
import { FarmersPage } from "@/pages/FarmersPage";
import { FarmerProfile } from "@/pages/FarmerProfile";
import { AddEditFarmer } from "@/pages/AddEditFarmer";
import { AdvancesPage } from "@/pages/AdvancesPage";
import { AddAdvance } from "@/pages/AddAdvance";
import { SalesLotsPage } from "@/pages/SalesLotsPage";
import { AddSaleLot } from "@/pages/AddSaleLot";
import { BuyerInvoice } from "@/pages/BuyerInvoice";
import { FarmerStatement } from "@/pages/FarmerStatement";
import { PayablesPage } from "@/pages/PayablesPage";
import { FarmerPayableCard } from "@/pages/FarmerPayableCard";
import { VendorPayableCard } from "@/pages/VendorPayableCard";
import { ReceivablesPage } from "@/pages/ReceivablesPage";
import { BuyerReceivableCard } from "@/pages/BuyerReceivableCard";
import { VendorsPage } from "@/pages/VendorsPage";
import { VendorProfile } from "@/pages/VendorProfile";
import { BuyersPage } from "@/pages/BuyersPage";
import { BuyerProfile } from "@/pages/BuyerProfile";
import { ExpensesPage } from "@/pages/ExpensesPage";
import { PlaceholderPage } from "@/pages/PlaceholderPage";
import { CashBankPage } from "@/pages/CashBankPage";
import { ReportsPage } from "@/pages/ReportsPage";

export function MainContent() {
  return (
    <main className="flex-1 overflow-auto">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/farmers" element={<FarmersPage />} />
        <Route path="/farmers/add" element={<AddEditFarmer />} />
        <Route path="/farmers/edit/:id" element={<AddEditFarmer />} />
        <Route path="/farmers/:id" element={<FarmerProfile />} />
        <Route path="/advances" element={<AdvancesPage />} />
        <Route path="/advances/add" element={<AddAdvance />} />
        <Route path="/advances/add/:farmerId" element={<AddAdvance />} />
        <Route path="/sales" element={<SalesLotsPage />} />
        <Route path="/sales/add" element={<AddSaleLot />} />
        <Route path="/sales/invoice/:id" element={<BuyerInvoice />} />
        <Route path="/sales/statement/:id" element={<FarmerStatement />} />
        <Route path="/buyers" element={<BuyersPage />} />
        <Route path="/buyers/:id" element={<BuyerProfile />} />
        <Route path="/receivables" element={<ReceivablesPage />} />
        <Route path="/receivables/buyer/:id" element={<BuyerReceivableCard />} />
        <Route path="/vendors" element={<VendorsPage />} />
        <Route path="/vendors/:id" element={<VendorProfile />} />
        <Route path="/payables" element={<PayablesPage />} />
        <Route path="/payables/farmer/:id" element={<FarmerPayableCard />} />
        <Route path="/payables/vendor/:id" element={<VendorPayableCard />} />
        <Route path="/expenses" element={<ExpensesPage />} />
        <Route path="/cash-bank" element={<CashBankPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/missing-docs" element={<PlaceholderPage title="Missing Docs" />} />
        <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
      </Routes>
    </main>
  );
}
