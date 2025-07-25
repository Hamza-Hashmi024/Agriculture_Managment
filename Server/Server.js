const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require("./config/db")
const FarmerRoutes = require("./Routes/Farmer_Routes");
const VendorRoutes = require("./Routes/VendorRoutes");
const BuyerRoute = require("./Routes/Buyer_Route")

dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); 
app.use("/api/farmer" , FarmerRoutes );
app.use("/api/vendor" ,  VendorRoutes);
app.use("/api/buyer" , BuyerRoute)




app.get('/', (req, res) => {
  res.send('Server is running');
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});