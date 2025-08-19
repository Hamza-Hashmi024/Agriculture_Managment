import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CreditCard, Wheat, TrendingUp } from "lucide-react";
import { GetDashboredData } from "@/Api/Api";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Base_Url } from "@/Globle/Base_URL";

export function Dashboard() {
  const [data, setdata] = useState(null);
  

  useEffect(() => {
    const fetchdashbored = async () => {
      try {
        const response = await GetDashboredData();
        setdata(response);
      } catch (err) {
        console.log(err);
      }
    };

    fetchdashbored();
  }, []);




  if (!data) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  // Destructure API data
  const { farmers, advances, sales, netRevenue } = data;

  // Calculate % changes safely
  const farmerGrowth =
    farmers.last_month_farmers > 0
      ? ((farmers.this_month_farmers - farmers.last_month_farmers) /
          farmers.last_month_farmers) *
        100
      : 0;

  const salesGrowth =
    sales.total_sales_last_month > 0
      ? ((parseFloat(sales.total_sales) -
          parseFloat(sales.total_sales_last_month)) /
          parseFloat(sales.total_sales_last_month)) *
        100
      : 0;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to ARHTI Business System
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Farmers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Farmers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {farmers.total_farmers_all_time}
            </div>
            <p className="text-xs text-muted-foreground">
              {farmerGrowth >= 0 ? "+" : ""}
              {farmerGrowth.toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>

        {/* Advances */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Advances
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              PKR {parseFloat(advances.total_advances_amount).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {advances.total_advances_count} active advances
            </p>
          </CardContent>
        </Card>

        {/* Sales */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sales This Month
            </CardTitle>
            <Wheat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              PKR {parseFloat(sales.total_sales).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {salesGrowth >= 0 ? "+" : ""}
              {salesGrowth.toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>

        {/* Net Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              PKR {parseFloat(netRevenue.net_revenue).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Updated real-time</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
  <CardHeader>
    <CardTitle>Recent Activities</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">No activities yet</p>
    </div>
  </CardContent>
</Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 text-left border rounded-lg hover:bg-muted/50 transition-colors">
                <Users className="h-6 w-6 mb-2 text-primary" />
                <p className="font-medium">Add Farmer</p>
                <p className="text-xs text-muted-foreground">
                  Register new farmer
                </p>
              </button>
              <button className="p-4 text-left border rounded-lg hover:bg-muted/50 transition-colors">
                <CreditCard className="h-6 w-6 mb-2 text-primary" />
                <p className="font-medium">New Advance</p>
                <p className="text-xs text-muted-foreground">Process advance</p>
              </button>
              <button className="p-4 text-left border rounded-lg hover:bg-muted/50 transition-colors">
                <Wheat className="h-6 w-6 mb-2 text-primary" />
                <p className="font-medium">Record Sale</p>
                <p className="text-xs text-muted-foreground">Add crop sale</p>
              </button>
              <button className="p-4 text-left border rounded-lg hover:bg-muted/50 transition-colors">
                <TrendingUp className="h-6 w-6 mb-2 text-primary" />
                <p className="font-medium">View Reports</p>
                <p className="text-xs text-muted-foreground">
                  Analytics & insights
                </p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
