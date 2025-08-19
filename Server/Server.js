const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./config/db");
const FarmerRoutes = require("./Routes/Farmer_Routes");
const VendorRoutes = require("./Routes/VendorRoutes");
const BuyerRoute = require("./Routes/Buyer_Route");
const AccountRoutes = require("./Routes/Account_Routes");
const AdvanceRouter = require("./Routes/Advance_Routes");
const SalesRoutes = require("./Routes/Sales_Routes");
const ReciveAbleRoutes = require("./Routes/ReciveAble_Routes");
const ExpensesRouter = require("./Routes/Expenses_Route");
const ReportsRourer = require("./Routes/Reports_Router");
const DashboardRouter = require("./Routes/DashBoared");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/farmer", FarmerRoutes);
app.use("/api/vendor", VendorRoutes);
app.use("/api/buyer", BuyerRoute);
app.use("/api/accounts", AccountRoutes);
app.use("/api/advance", AdvanceRouter);
app.use("/api/sales", SalesRoutes);
app.use("/api/receivables", ReciveAbleRoutes);
app.use("/api/expenses", ExpensesRouter);
app.use("/api/reports", ReportsRourer);
app.use("/api/v1", DashboardRouter);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});