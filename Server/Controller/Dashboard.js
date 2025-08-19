const db = require('../config/db');


const DashboaredData = (req, res) => {
  const queries = {
    Total_Farmer: `
      SELECT 
        (SELECT COUNT(*) 
         FROM farmers 
         WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) 
           AND YEAR(created_at) = YEAR(CURRENT_DATE())) AS total_farmers,
        (SELECT COUNT(*) 
         FROM farmers 
         WHERE MONTH(created_at) = MONTH(CURRENT_DATE() - INTERVAL 1 MONTH) 
           AND YEAR(created_at) = YEAR(CURRENT_DATE() - INTERVAL 1 MONTH)) AS last_month_farmers
    `,
    Active_Advances: `
      SELECT 
        IFNULL(SUM(amount), 0) AS total_advances_amount,
        COUNT(*) AS total_advances_count
      FROM advances
      WHERE MONTH(date) = MONTH(CURRENT_DATE())
        AND YEAR(date) = YEAR(CURRENT_DATE());
    `,
    LastMonthSale: `
      SELECT 
        (SELECT IFNULL(SUM(weight * rate), 0) 
         FROM sales 
         WHERE MONTH(arrival_date) = MONTH(CURRENT_DATE()) 
           AND YEAR(arrival_date) = YEAR(CURRENT_DATE())) AS total_sales,
        (SELECT IFNULL(SUM(weight * rate), 0) 
         FROM sales 
         WHERE MONTH(arrival_date) = MONTH(CURRENT_DATE() - INTERVAL 1 MONTH) 
           AND YEAR(arrival_date) = YEAR(CURRENT_DATE() - INTERVAL 1 MONTH)) AS total_sales_last_month
    `,
    Net_Revinew: `
      SELECT 
        (IFNULL(SUM(s.weight * s.rate),0) - IFNULL(SUM(a.amount),0)) AS net_revenue
      FROM farmers f
      LEFT JOIN sales s 
        ON f.id = s.farmer_id 
       AND MONTH(s.arrival_date) = MONTH(CURRENT_DATE())
       AND YEAR(s.arrival_date) = YEAR(CURRENT_DATE())
      LEFT JOIN advances a 
        ON f.id = a.farmer_id 
       AND MONTH(a.date) = MONTH(CURRENT_DATE())
       AND YEAR(a.date) = YEAR(CURRENT_DATE());
    `
  };

  // Run all queries in parallel
  Promise.all([
    new Promise((resolve, reject) => db.query(queries.Total_Farmer, (err, result) => err ? reject(err) : resolve(result[0]))),
    new Promise((resolve, reject) => db.query(queries.Active_Advances, (err, result) => err ? reject(err) : resolve(result[0]))),
    new Promise((resolve, reject) => db.query(queries.LastMonthSale, (err, result) => err ? reject(err) : resolve(result[0]))),
    new Promise((resolve, reject) => db.query(queries.Net_Revinew, (err, result) => err ? reject(err) : resolve(result[0])))
  ])
  .then(([farmerData, advancesData, salesData, netRevenueData]) => {
    res.json({
      farmers: farmerData,
      advances: advancesData,
      sales: salesData,
      netRevenue: netRevenueData
    });
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({ message: "An error occurred while fetching dashboard data", error: err });
  });
};

module.exports = {
    DashboaredData
}