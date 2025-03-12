
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { customerService } from "@/services/customerService";
import { useCustomerStore, Customer } from "@/stores/customerStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Plus, Search, Filter, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

const CustomersPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { filterStatus, searchQuery, setFilterStatus, setSearchQuery } =
    useCustomerStore();
  
  // Use React Query to manage the API fetch state
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["customers", page, limit, filterStatus, searchQuery],
    queryFn: () =>
      customerService.getCustomers(page, limit, {
        status: filterStatus,
        search: searchQuery,
      }),
  });
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };
  
  const handleStatusChange = (value: string) => {
    setFilterStatus(value === "all" ? null : value);
  };
  
  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
    lead: "bg-blue-100 text-blue-800",
  };
  
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">
            Manage and view all your customer information
          </p>
        </div>
        <Button onClick={() => navigate("/customers/new")}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </motion.div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Customer List</CardTitle>
          <CardDescription>
            View and manage all your customers in one place
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <form
              onSubmit={handleSearch}
              className="flex-1 flex space-x-2"
            >
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit">Search</Button>
            </form>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={filterStatus || "all"}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="lead">Lead</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {isLoading ? (
            <div className="py-8 flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="py-8 text-center text-destructive">
              <p>Failed to load customers. Please try again.</p>
              <Button
                variant="outline"
                onClick={() => refetch()}
                className="mt-2"
              >
                Retry
              </Button>
            </div>
          ) : data?.data.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No customers found</p>
              <Button
                variant="outline"
                onClick={() => navigate("/customers/new")}
                className="mt-2"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add your first customer
              </Button>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Last Contact</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.data.map((customer: Customer) => (
                      <TableRow
                        key={customer.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => navigate(`/customers/${customer.id}`)}
                      >
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={customer.avatar} alt={customer.name} />
                              <AvatarFallback>
                                {customer.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{customer.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {customer.company || customer.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={statusColors[customer.status]}
                          >
                            {customer.status.charAt(0).toUpperCase() +
                              customer.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {customer.type.charAt(0).toUpperCase() +
                            customer.type.slice(1)}
                        </TableCell>
                        <TableCell>
                          {customer.lastContact
                            ? format(new Date(customer.lastContact), "PP")
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          {format(new Date(customer.createdAt), "PP")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {(page - 1) * limit + 1} to{" "}
                  {Math.min(page * limit, data?.meta.total || 0)} of{" "}
                  {data?.meta.total} entries
                </p>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page <= 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={
                      page >= Math.ceil((data?.meta.total || 0) / limit)
                    }
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomersPage;
