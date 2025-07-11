
import { Routes, Route } from "react-router-dom";
import { Dashboard } from "@/pages/Dashboard";
import { FarmersPage } from "@/pages/FarmersPage";
import { FarmerProfile } from "@/pages/FarmerProfile";
import { AddEditFarmer } from "@/pages/AddEditFarmer";
import { AdvancesPage } from "@/pages/AdvancesPage";
import { AddAdvance } from "@/pages/AddAdvance";
import { PlaceholderPage } from "@/pages/PlaceholderPage";

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
        <Route path="/sales" element={<PlaceholderPage title="Sales/Lots" />} />
        <Route path="/buyers" element={<PlaceholderPage title="Buyers" />} />
        <Route path="/receivables" element={<PlaceholderPage title="Receivables" />} />
        <Route path="/vendors" element={<PlaceholderPage title="Vendors" />} />
        <Route path="/payables" element={<PlaceholderPage title="Payables" />} />
        <Route path="/expenses" element={<PlaceholderPage title="Expenses" />} />
        <Route path="/cash-bank" element={<PlaceholderPage title="Cash/Bank" />} />
        <Route path="/reports" element={<PlaceholderPage title="Reports" />} />
        <Route path="/missing-docs" element={<PlaceholderPage title="Missing Docs" />} />
        <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
      </Routes>
    </main>
  );
}
