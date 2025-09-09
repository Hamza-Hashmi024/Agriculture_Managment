import { Routes, Route, Navigate } from "react-router-dom";
import { useContext , useEffect} from "react";
import { AuthContext } from "@/Context/AuthContext";

// Pages
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
import { CashBankPage } from "@/pages/CashBankPage";
import { ReportsPage } from "@/pages/ReportsPage";
import { AddBuyerForm } from "@/pages/AddBuyerForm";
import ChequePage from "@/pages/CheckList";
import ThemeSettings from "@/pages/ThemeSettings";
import UsersPage from "@/pages/UsersPage";
import Settings from "@/pages/Settings";
import Unauthorized from "@/pages/unauthorized";
import { useTheme } from "@/Context/ThemeContext";
// Auth Components
import LoginForm from "../components/Auth/LoginForm";
import ResetPasswordForm from "../components/Auth/ResetPasswordForm";
import { EmployeePage } from "@/pages/EmployeePage";

// ProtectedRoute Component
import ProtectedRoute from "@/components/Auth/ProtectedRoute";

export function MainContent() {
  const { user } = useContext(AuthContext);
  const { theme } = useTheme();

  const backgroundColor = theme.mode === "dark" ? "#1e1e1e" : "#ffffff";
  const color = theme.mode === "dark"
    ? `hsl(${theme.foreground})` // dark mode → use theme foreground
    : `hsl(${theme.foreground})`; // light mode → use theme foreground
       useEffect(() => {
    console.log("🎨 MainContent theme changed:", theme);
    console.log("Applied backgroundColor:", backgroundColor);
    console.log("Applied color:", color);
  }, [theme, backgroundColor, color]);

  return (
      <main
      className="flex-1 overflow-auto p-4 transition-colors duration-300"
      style={{ backgroundColor, color }}
    >
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/reset-password" element={<ResetPasswordForm />} />

        {/* Dashboard */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Farmers */}
        <Route path="/farmers" element={<ProtectedRoute><FarmersPage /></ProtectedRoute>} />
        <Route path="/farmers/add" element={<ProtectedRoute><AddEditFarmer /></ProtectedRoute>} />
        <Route path="/farmers/edit/:id" element={<ProtectedRoute><AddEditFarmer /></ProtectedRoute>} />
        <Route path="/farmers/:id" element={<ProtectedRoute><FarmerProfile /></ProtectedRoute>} />

        {/* Users (Admin only) */}
        <Route path="/users" element={<ProtectedRoute adminOnly><UsersPage /></ProtectedRoute>} />

        {/* Advances */}
        <Route path="/advances" element={<ProtectedRoute><AdvancesPage /></ProtectedRoute>} />
        <Route path="/advances/add" element={<ProtectedRoute><AddAdvance /></ProtectedRoute>} />
        <Route path="/advances/add/:farmerId" element={<ProtectedRoute><AddAdvance /></ProtectedRoute>} />

        {/* Sales */}
        <Route path="/sales" element={<ProtectedRoute><SalesLotsPage /></ProtectedRoute>} />
        <Route path="/sales/add" element={<ProtectedRoute><AddSaleLot /></ProtectedRoute>} />
        <Route path="/sales/invoice/:id" element={<ProtectedRoute><BuyerInvoice /></ProtectedRoute>} />
        <Route path="/sales/statement/:id" element={<ProtectedRoute><FarmerStatement /></ProtectedRoute>} />

        {/* Buyers */}
        <Route path="/buyers" element={<ProtectedRoute><BuyersPage /></ProtectedRoute>} />
        <Route path="/buyers/:id" element={<ProtectedRoute><BuyerProfile /></ProtectedRoute>} />
        <Route path="/buyers/add" element={<ProtectedRoute><AddBuyerForm /></ProtectedRoute>} />

        {/* Vendors */}
        <Route path="/vendors" element={<ProtectedRoute><VendorsPage /></ProtectedRoute>} />
        <Route path="/vendors/:id" element={<ProtectedRoute><VendorProfile /></ProtectedRoute>} />

        {/* Receivables */}
        <Route path="/receivables" element={<ProtectedRoute><ReceivablesPage /></ProtectedRoute>} />
        <Route path="/receivables/buyer/:id" element={<ProtectedRoute><BuyerReceivableCard /></ProtectedRoute>} />

        {/* Payables */}
        <Route path="/payables" element={<ProtectedRoute><PayablesPage /></ProtectedRoute>} />
        <Route path="/payables/farmer/:id" element={<ProtectedRoute><FarmerPayableCard /></ProtectedRoute>} />
        <Route path="/payables/vendor/:id" element={<ProtectedRoute><VendorPayableCard /></ProtectedRoute>} />

        {/* Expenses */}
        <Route path="/expenses" element={<ProtectedRoute><ExpensesPage /></ProtectedRoute>} />
        <Route path="/employees" element={< EmployeePage/>} />

        {/* Cash / Bank */}
        <Route path="/cash-bank" element={<ProtectedRoute><CashBankPage /></ProtectedRoute>} />

        {/* Reports */}
        <Route path="/reports" element={<ProtectedRoute allowedRoles={["admin", "manager"]}><ReportsPage /></ProtectedRoute>} />

        {/* CheckList */}
        <Route path="/check-list" element={<ProtectedRoute><ChequePage /></ProtectedRoute>} />

        {/* Settings */}
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/theme-settings" element={<ProtectedRoute><ThemeSettings /></ProtectedRoute>} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  );
}