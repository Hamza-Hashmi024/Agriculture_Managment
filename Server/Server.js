const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require("./config/db")
const FarmerRoutes = require("./Routes/Farmer_Routes");

dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); 
app.use("/api/farmer" , FarmerRoutes );




app.get('/', (req, res) => {
  res.send('Server is running');
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});