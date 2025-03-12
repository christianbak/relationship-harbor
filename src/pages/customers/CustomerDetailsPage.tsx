
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { customerService } from "@/services/customerService";
import { Customer, Contact, Activity } from "@/stores/customerStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Pencil,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Building,
  Loader2,
  ArrowLeft,
  Plus,
  Calendar,
  MessageSquare,
  FileText,
  CheckCircle,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";

const CustomerDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Fetch customer data
  const {
    data: customer,
    isLoading: isLoadingCustomer,
    error: customerError,
  } = useQuery({
    queryKey: ["customer", id],
    queryFn: () => (id ? customerService.getCustomerById(id) : null),
    enabled: !!id,
  });
  
  // Fetch customer contacts
  const {
    data: contacts = [],
    isLoading: isLoadingContacts,
  } = useQuery({
    queryKey: ["customerContacts", id],
    queryFn: () => (id ? customerService.getCustomerContacts(id) : []),
    enabled: !!id,
  });
  
  // Fetch customer activities
  const {
    data: activities = [],
    isLoading: isLoadingActivities,
  } = useQuery({
    queryKey: ["customerActivities", id],
    queryFn: () => (id ? customerService.getCustomerActivities(id) : []),
    enabled: !!id,
  });
  
  if (isLoadingCustomer) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (customerError || !customer) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold">Customer not found</h2>
        <p className="text-muted-foreground mt-2">
          The customer you're looking for doesn't exist or you don't have
          permission to view it.
        </p>
        <Button
          className="mt-4"
          variant="outline"
          onClick={() => navigate("/customers")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Customers
        </Button>
      </div>
    );
  }
  
  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
    lead: "bg-blue-100 text-blue-800",
  };
  
  const activityIcons: Record<string, React.ReactNode> = {
    call: <Phone className="h-4 w-4" />,
    email: <Mail className="h-4 w-4" />,
    meeting: <Calendar className="h-4 w-4" />,
    note: <MessageSquare className="h-4 w-4" />,
    task: <CheckCircle className="h-4 w-4" />,
  };
  
  const handleEdit = () => {
    toast({
      title: "Feature coming soon",
      description: "Editing functionality will be available in a future update.",
    });
  };
  
  const handleDelete = () => {
    toast({
      title: "Feature coming soon",
      description: "Delete functionality will be available in a future update.",
    });
  };
  
  const handleAddContact = () => {
    toast({
      title: "Feature coming soon",
      description: "Adding contacts will be available in a future update.",
    });
  };
  
  const handleAddActivity = () => {
    toast({
      title: "Feature coming soon",
      description: "Adding activities will be available in a future update.",
    });
  };
  
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/customers")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {customer.name}
            </h1>
            <p className="text-muted-foreground">
              {customer.company || customer.email}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </motion.div>
      
      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
          <div className="flex overflow-x-auto">
            <TabsTrigger
              value="overview"
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="contacts"
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Contacts
            </TabsTrigger>
            <TabsTrigger
              value="activities"
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Activities & Notes
            </TabsTrigger>
            <TabsTrigger
              value="documents"
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Documents
            </TabsTrigger>
          </div>
        </TabsList>
        
        <TabsContent value="overview" className="pt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-6">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={customer.avatar} alt={customer.name} />
                    <AvatarFallback className="text-lg">
                      {customer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">{customer.name}</h3>
                    <Badge
                      variant="outline"
                      className={statusColors[customer.status]}
                    >
                      {customer.status.charAt(0).toUpperCase() +
                        customer.status.slice(1)}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{customer.email}</span>
                  </div>
                  
                  {customer.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{customer.phone}</span>
                    </div>
                  )}
                  
                  {customer.company && (
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>{customer.company}</span>
                    </div>
                  )}
                  
                  {customer.address && (
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        {customer.address.street && (
                          <div>{customer.address.street}</div>
                        )}
                        {(customer.address.city || customer.address.state) && (
                          <div>
                            {customer.address.city}
                            {customer.address.city && customer.address.state
                              ? `, ${customer.address.state}`
                              : customer.address.state}
                            {customer.address.zipCode &&
                              ` ${customer.address.zipCode}`}
                          </div>
                        )}
                        {customer.address.country && (
                          <div>{customer.address.country}</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <Separator className="my-6" />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Created On</p>
                    <p>
                      {format(new Date(customer.createdAt), "PPP")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Updated</p>
                    <p>
                      {format(new Date(customer.updatedAt), "PPP")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Customer Type</p>
                    <p>
                      {customer.type.charAt(0).toUpperCase() +
                        customer.type.slice(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Last Contact
                    </p>
                    <p>
                      {customer.lastContact
                        ? format(new Date(customer.lastContact), "PPP")
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                {customer.notes ? (
                  <div className="whitespace-pre-wrap">{customer.notes}</div>
                ) : (
                  <div className="text-center py-6">
                    <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No notes yet</p>
                    <Button size="sm" className="mt-2">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Note
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="contacts" className="pt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Contacts</CardTitle>
                <CardDescription>
                  People associated with this customer
                </CardDescription>
              </div>
              <Button onClick={handleAddContact}>
                <Plus className="mr-2 h-4 w-4" />
                Add Contact
              </Button>
            </CardHeader>
            <CardContent>
              {isLoadingContacts ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : contacts.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">
                    No contacts found for this customer
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Primary</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contacts.map((contact: Contact) => (
                        <TableRow key={contact.id}>
                          <TableCell className="font-medium">
                            {contact.name}
                          </TableCell>
                          <TableCell>{contact.position || "—"}</TableCell>
                          <TableCell>{contact.email}</TableCell>
                          <TableCell>{contact.phone || "—"}</TableCell>
                          <TableCell>
                            {contact.isPrimary ? (
                              <Badge>Primary</Badge>
                            ) : (
                              "—"
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activities" className="pt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Activities & Notes</CardTitle>
                <CardDescription>
                  Track all interactions with this customer
                </CardDescription>
              </div>
              <Button onClick={handleAddActivity}>
                <Plus className="mr-2 h-4 w-4" />
                Add Activity
              </Button>
            </CardHeader>
            <CardContent>
              {isLoadingActivities ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : activities.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">
                    No activities recorded for this customer
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {activities.map((activity: Activity) => (
                    <div
                      key={activity.id}
                      className="flex space-x-4 border-b pb-4 last:border-0"
                    >
                      <div className="mt-1 bg-primary/10 p-2 rounded-full h-fit">
                        {activityIcons[activity.type] || (
                          <FileText className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">
                            {activity.title}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(activity.createdAt), "PPp")}
                          </p>
                        </div>
                        {activity.description && (
                          <p className="mt-1 text-sm text-muted-foreground">
                            {activity.description}
                          </p>
                        )}
                        <div className="mt-2 flex items-center text-xs text-muted-foreground">
                          <span>
                            Added by{" "}
                            <span className="font-medium">
                              {activity.createdBy}
                            </span>
                          </span>
                          {activity.dueDate && (
                            <span className="ml-4 flex items-center">
                              <Calendar className="mr-1 h-3 w-3" />
                              Due: {format(new Date(activity.dueDate), "PP")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>
                Files and documents related to this customer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">
                  Document management coming soon
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  This feature will be available in a future update
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerDetailsPage;
