
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { customerService } from "@/services/customerService";
import { Customer } from "@/stores/customerStore";
import {
  Users,
  UserPlus,
  UserCheck,
  ArrowRight,
  TrendingUp,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const DashboardPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalCustomers: 0,
    activeCustomers: 0,
    newCustomers: 0,
    recentCustomers: [] as Customer[],
  });
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get customers data for dashboard metrics
        const customersResponse = await customerService.getCustomers(1, 5);
        
        // Simple metrics calculation from the response
        // In a real app, you'd likely have dedicated API endpoints for these metrics
        const total = customersResponse.meta.total;
        const active = customersResponse.data.filter(
          (c) => c.status === "active"
        ).length;
        const recent = customersResponse.data;
        
        setDashboardData({
          totalCustomers: total,
          activeCustomers: active,
          newCustomers: Math.floor(total * 0.15), // Mocked for demo
          recentCustomers: recent,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };
  
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back to your customer management system
          </p>
        </div>
        <Button onClick={() => navigate("/customers/new")}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </motion.div>
      
      {/* Metrics Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        <motion.div variants={item}>
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Customers
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold">
                  {dashboardData.totalCustomers}
                </div>
              )}
              <p className="text-xs text-muted-foreground pt-1">
                +2.5% from last month
              </p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={item}>
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Active Customers
              </CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold">
                  {dashboardData.activeCustomers}
                </div>
              )}
              <p className="text-xs text-muted-foreground pt-1">
                {Math.round(
                  (dashboardData.activeCustomers /
                    (dashboardData.totalCustomers || 1)) *
                    100
                )}
                % of total
              </p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={item}>
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                New Customers
              </CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold">
                  {dashboardData.newCustomers}
                </div>
              )}
              <p className="text-xs text-muted-foreground pt-1">
                This month
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
      
      {/* Recent Customers */}
      <motion.div
        variants={item}
        initial="hidden"
        animate="show"
        className="grid gap-4 md:grid-cols-2"
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                Array(5)
                  .fill(null)
                  .map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-3 w-[150px]" />
                      </div>
                    </div>
                  ))
              ) : dashboardData.recentCustomers.length > 0 ? (
                dashboardData.recentCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {customer.name
                            .split(" ")
                            .map((part) => part[0])
                            .join("")
                            .toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium leading-none">
                          {customer.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {customer.company || customer.email}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/customers/${customer.id}`)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No customers found
                </p>
              )}
            </div>
            <div className="mt-4 flex justify-center">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/customers")}
              >
                View all customers
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                Array(5)
                  .fill(null)
                  .map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-3 w-[150px]" />
                      </div>
                    </div>
                  ))
              ) : (
                <>
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <TrendingUp className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Sales increased by 24%</p>
                      <p className="text-xs text-muted-foreground">
                        Compared to last month
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <UserPlus className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">New customer acquired</p>
                      <p className="text-xs text-muted-foreground">
                        Acme Inc. signed up 2 hours ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        3 meetings scheduled today
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Starting in 45 minutes
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="mt-4 flex justify-center">
              <Button variant="outline" className="w-full">
                View all activity
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
