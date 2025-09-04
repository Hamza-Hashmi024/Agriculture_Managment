import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "@/Context/AuthContext";
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
import { AddBuyerForm } from "@/pages/AddBuyerForm";
import ChequePage from "@/pages/CheckList";
import ThemeSettings from "@/pages/ThemeSettings";

import LoginForm from "../components/Auth/LoginForm";
import ForgotPasswordForm from "./Auth/ForgotPasswordForm";
import ResetPasswordForm from "../components/Auth/ResetPasswordForm";
import UsersPage from "@/pages/UsersPage";

export function MainContent() {
  const { user } = useContext(AuthContext);

  // Protected Route wrapper
  const ProtectedRoute = ({ children, adminOnly = false }: { children: JSX.Element; adminOnly?: boolean }) => {
    if (!user) return <Navigate to="/login" replace />;
    if (adminOnly && user.role !== "admin") return <Navigate to="/" replace />;
    return children;
  };



  return (
    <main className="flex-1 overflow-auto">
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/reset-password/:token" element={<ResetPasswordForm token={""} />} />

        {/* Protected app routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/farmers"
          element={
            <ProtectedRoute>
              <FarmersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmers/add"
          element={
            <ProtectedRoute>
              <AddEditFarmer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmers/edit/:id"
          element={
            <ProtectedRoute>
              <AddEditFarmer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmers/:id"
          element={
            <ProtectedRoute>
              <FarmerProfile />
            </ProtectedRoute>
          }
        />

        {/* Admin-only route example */}
        <Route
          path="/users"
          element={
            <ProtectedRoute adminOnly>
              <UsersPage />
            </ProtectedRoute>
          }
        />

        {/* Other routes remain protected */}
        <Route
          path="/advances"
          element={
            <ProtectedRoute>
              <AdvancesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/advances/add"
          element={
            <ProtectedRoute>
              <AddAdvance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/advances/add/:farmerId"
          element={
            <ProtectedRoute>
              <AddAdvance />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sales"
          element={
            <ProtectedRoute>
              <SalesLotsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales/add"
          element={
            <ProtectedRoute>
              <AddSaleLot />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales/invoice/:id"
          element={
            <ProtectedRoute>
              <BuyerInvoice />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales/statement/:id"
          element={
            <ProtectedRoute>
              <FarmerStatement />
            </ProtectedRoute>
          }
        />

        {/* Buyers / Vendors / Payables / Receivables */}
        <Route
          path="/buyers"
          element={
            <ProtectedRoute>
              <BuyersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/buyers/:id"
          element={
            <ProtectedRoute>
              <BuyerProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/buyers/add"
          element={
            <ProtectedRoute>
              <AddBuyerForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendors"
          element={
            <ProtectedRoute>
              <VendorsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendors/:id"
          element={
            <ProtectedRoute>
              <VendorProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/receivables"
          element={
            <ProtectedRoute>
              <ReceivablesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/receivables/buyer/:id"
          element={
            <ProtectedRoute>
              <BuyerReceivableCard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payables"
          element={
            <ProtectedRoute>
              <PayablesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payables/farmer/:id"
          element={
            <ProtectedRoute>
              <FarmerPayableCard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payables/vendor/:id"
          element={
            <ProtectedRoute>
              <VendorPayableCard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/expenses"
          element={
            <ProtectedRoute>
              <ExpensesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cash-bank"
          element={
            <ProtectedRoute>
              <CashBankPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <ReportsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/check-list"
          element={
            <ProtectedRoute>
              <ChequePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/theme-settings"
          element={
            <ProtectedRoute>
              <ThemeSettings />
            </ProtectedRoute>
          }
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  );
}