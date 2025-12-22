import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Calendar, Clock, MapPin, Mail, User, CheckCircle, XCircle, Loader2, ShieldAlert, LogIn, Building2, Phone, Globe, Facebook, Instagram } from "lucide-react";
import { listPendingEvents, listPendingBusinesses, updateEventStatus, updateBusinessStatus } from "@/lib/api";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";

export default function AdminDashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [processingEventId, setProcessingEventId] = useState<number | null>(null);
  const [processingBusinessId, setProcessingBusinessId] = useState<number | null>(null);

  // Fetch pending events
  const {
    data: pendingEvents,
    isLoading: eventsLoading,
    refetch: refetchEvents,
  } = useQuery({
    queryKey: ["admin-events", "pending"],
    queryFn: listPendingEvents,
    enabled: isAuthenticated && user?.role === "admin",
  });

  // Fetch pending businesses
  const {
    data: pendingBusinesses,
    isLoading: businessesLoading,
    refetch: refetchBusinesses,
  } = useQuery({
    queryKey: ["admin-businesses", "pending"],
    queryFn: listPendingBusinesses,
    enabled: isAuthenticated && user?.role === "admin",
  });

  // Mutation for updating event status
  const updateEventStatusMutation = useMutation({
    mutationFn: ({ eventId, status }: { eventId: number; status: "approved" | "rejected" }) =>
      updateEventStatus(eventId, status),
    onSuccess: (_, variables) => {
      toast.success(`Event ${variables.status === "approved" ? "approved" : "rejected"} successfully`);
      refetchEvents();
      setProcessingEventId(null);
    },
    onError: (error: Error) => {
      toast.error("Failed to update event", { description: error.message });
      setProcessingEventId(null);
    },
  });

  // Mutation for updating business status
  const updateBusinessStatusMutation = useMutation({
    mutationFn: ({ businessId, status }: { businessId: number; status: "approved" | "rejected" }) =>
      updateBusinessStatus(businessId, status),
    onSuccess: (_, variables) => {
      toast.success(`Business ${variables.status === "approved" ? "approved" : "rejected"} successfully`);
      refetchBusinesses();
      setProcessingBusinessId(null);
    },
    onError: (error: Error) => {
      toast.error("Failed to update business", { description: error.message });
      setProcessingBusinessId(null);
    },
  });

  const handleApproveEvent = async (eventId: number) => {
    setProcessingEventId(eventId);
    await updateEventStatusMutation.mutateAsync({ eventId, status: "approved" });
  };

  const handleRejectEvent = async (eventId: number) => {
    setProcessingEventId(eventId);
    await updateEventStatusMutation.mutateAsync({ eventId, status: "rejected" });
  };

  const handleApproveBusiness = async (businessId: number) => {
    setProcessingBusinessId(businessId);
    await updateBusinessStatusMutation.mutateAsync({ businessId, status: "approved" });
  };

  const handleRejectBusiness = async (businessId: number) => {
    setProcessingBusinessId(businessId);
    await updateBusinessStatusMutation.mutateAsync({ businessId, status: "rejected" });
  };

  // Loading state
  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#2c4c3b]" />
        </div>
      </Layout>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Card className="max-w-md w-full mx-4">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-[#2c4c3b]/10 rounded-full flex items-center justify-center mb-4">
                <LogIn className="h-8 w-8 text-[#2c4c3b]" />
              </div>
              <CardTitle className="font-serif text-2xl text-[#2c4c3b]">Admin Access Required</CardTitle>
              <CardDescription>
                Please sign in to access the admin dashboard.
              </CardDescription>
            </CardHeader>
            <CardFooter className="justify-center">
              <Button 
                className="bg-[#2c4c3b] hover:bg-[#1a3326]"
                onClick={() => window.location.href = getLoginUrl()}
              >
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </CardFooter>
          </Card>
        </div>
      </Layout>
    );
  }

  // Not admin
  if (user?.role !== "admin") {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Card className="max-w-md w-full mx-4">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <ShieldAlert className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="font-serif text-2xl text-red-600">Access Denied</CardTitle>
              <CardDescription>
                You don't have permission to access the admin dashboard. Please contact the site administrator.
              </CardDescription>
            </CardHeader>
            <CardFooter className="justify-center">
              <Button 
                variant="outline"
                onClick={() => window.location.href = "/"}
              >
                Return to Home
              </Button>
            </CardFooter>
          </Card>
        </div>
      </Layout>
    );
  }

  const getEventCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      market: "bg-green-100 text-green-800",
      community: "bg-blue-100 text-blue-800",
      arts: "bg-purple-100 text-purple-800",
      workshop: "bg-orange-100 text-orange-800",
      music: "bg-pink-100 text-pink-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const getBusinessCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      markets: "bg-green-100 text-green-800",
      arts: "bg-purple-100 text-purple-800",
      accommodation: "bg-blue-100 text-blue-800",
      services: "bg-orange-100 text-orange-800",
      food: "bg-red-100 text-red-800",
      wellness: "bg-teal-100 text-teal-800",
      retail: "bg-yellow-100 text-yellow-800",
      other: "bg-gray-100 text-gray-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const totalPending = (pendingEvents?.length || 0) + (pendingBusinesses?.length || 0);

  return (
    <Layout>
      {/* Header */}
      <section className="bg-[#2c4c3b] text-white py-12">
        <div className="container px-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold">Admin Dashboard</h1>
              <p className="text-white/80">Manage community submissions</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/70">
            <User className="h-4 w-4" />
            <span>Signed in as {user?.name || user?.email || "Admin"}</span>
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="py-12 bg-[#f8f5f2] min-h-[60vh]">
        <div className="container px-4">
          <Tabs defaultValue="events" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="events" className="gap-2">
                <Calendar className="h-4 w-4" />
                Events
                {pendingEvents && pendingEvents.length > 0 && (
                  <Badge variant="secondary" className="bg-[#c17c54] text-white ml-2">
                    {pendingEvents.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="businesses" className="gap-2">
                <Building2 className="h-4 w-4" />
                Businesses
                {pendingBusinesses && pendingBusinesses.length > 0 && (
                  <Badge variant="secondary" className="bg-[#c17c54] text-white ml-2">
                    {pendingBusinesses.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
            </TabsList>

            {/* Events Tab */}
            <TabsContent value="events">
              {eventsLoading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-[#2c4c3b]" />
                  <span className="ml-3 text-muted-foreground">Loading pending events...</span>
                </div>
              ) : pendingEvents && pendingEvents.length > 0 ? (
                <div className="grid gap-6">
                  {pendingEvents.map((event) => (
                    <Card key={event.id} className="border-l-4 border-l-[#c17c54]">
                      <CardHeader>
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div>
                            <CardTitle className="font-serif text-xl text-[#2c4c3b] mb-2">
                              {event.title}
                            </CardTitle>
                            <div className="flex flex-wrap gap-2">
                              <Badge className={getEventCategoryColor(event.category)}>
                                {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                              </Badge>
                              <Badge variant="outline" className="border-[#c17c54] text-[#c17c54]">
                                Pending Review
                              </Badge>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Submitted {new Date(event.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-gray-600">{event.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-[#c17c54]" />
                            <span>{new Date(event.date).toLocaleDateString('en-AU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-[#c17c54]" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-[#c17c54]" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-[#c17c54]" />
                            <span>{event.contactEmail}</span>
                          </div>
                        </div>

                        {event.submittedBy && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="h-4 w-4" />
                            <span>Submitted by: {event.submittedBy}</span>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="flex gap-3 pt-4 border-t">
                        <Button
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleApproveEvent(event.id)}
                          disabled={processingEventId === event.id}
                        >
                          {processingEventId === event.id ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <CheckCircle className="h-4 w-4 mr-2" />
                          )}
                          Approve
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="border-red-300 text-red-600 hover:bg-red-50"
                              disabled={processingEventId === event.id}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Reject Event Submission?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to reject "{event.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => handleRejectEvent(event.id)}
                              >
                                Reject Event
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="text-center py-16">
                  <CardContent>
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="font-serif text-xl text-[#2c4c3b] mb-2">All Caught Up!</h3>
                    <p className="text-muted-foreground">
                      There are no pending event submissions to review.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Businesses Tab */}
            <TabsContent value="businesses">
              {businessesLoading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-[#2c4c3b]" />
                  <span className="ml-3 text-muted-foreground">Loading pending businesses...</span>
                </div>
              ) : pendingBusinesses && pendingBusinesses.length > 0 ? (
                <div className="grid gap-6">
                  {pendingBusinesses.map((business) => (
                    <Card key={business.id} className="border-l-4 border-l-[#2c4c3b]">
                      <CardHeader>
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div>
                            <CardTitle className="font-serif text-xl text-[#2c4c3b] mb-2">
                              {business.name}
                            </CardTitle>
                            <div className="flex flex-wrap gap-2">
                              <Badge className={getBusinessCategoryColor(business.category)}>
                                {business.category.charAt(0).toUpperCase() + business.category.slice(1)}
                              </Badge>
                              <Badge variant="outline" className="border-[#c17c54] text-[#c17c54]">
                                Pending Review
                              </Badge>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Submitted {new Date(business.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-gray-600">{business.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                          {business.address && (
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-4 w-4 text-[#c17c54]" />
                              <span>{business.address}</span>
                            </div>
                          )}
                          {business.phone && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-4 w-4 text-[#c17c54]" />
                              <span>{business.phone}</span>
                            </div>
                          )}
                          {business.email && (
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-4 w-4 text-[#c17c54]" />
                              <span>{business.email}</span>
                            </div>
                          )}
                          {business.website && (
                            <div className="flex items-center gap-2 text-sm">
                              <Globe className="h-4 w-4 text-[#c17c54]" />
                              <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-[#2c4c3b] hover:underline truncate">
                                {business.website}
                              </a>
                            </div>
                          )}
                          {business.facebook && (
                            <div className="flex items-center gap-2 text-sm">
                              <Facebook className="h-4 w-4 text-[#c17c54]" />
                              <span className="truncate">{business.facebook}</span>
                            </div>
                          )}
                          {business.instagram && (
                            <div className="flex items-center gap-2 text-sm">
                              <Instagram className="h-4 w-4 text-[#c17c54]" />
                              <span>{business.instagram}</span>
                            </div>
                          )}
                        </div>

                        {business.imageUrl && (
                          <div className="pt-4 border-t">
                            <p className="text-sm text-muted-foreground mb-2">Business Image:</p>
                            <img 
                              src={business.imageUrl} 
                              alt={business.name} 
                              className="max-w-xs rounded-lg shadow-md"
                              onError={(e) => (e.currentTarget.style.display = 'none')}
                            />
                          </div>
                        )}

                        <div className="flex flex-col gap-1 pt-4 border-t text-sm text-muted-foreground">
                          {business.submittedBy && (
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <span>Submitted by: {business.submittedBy}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <span>Contact: {business.submitterEmail}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex gap-3 pt-4 border-t">
                        <Button
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleApproveBusiness(business.id)}
                          disabled={processingBusinessId === business.id}
                        >
                          {processingBusinessId === business.id ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <CheckCircle className="h-4 w-4 mr-2" />
                          )}
                          Approve
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="border-red-300 text-red-600 hover:bg-red-50"
                              disabled={processingBusinessId === business.id}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Reject Business Submission?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to reject "{business.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => handleRejectBusiness(business.id)}
                              >
                                Reject Business
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="text-center py-16">
                  <CardContent>
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="font-serif text-xl text-[#2c4c3b] mb-2">All Caught Up!</h3>
                    <p className="text-muted-foreground">
                      There are no pending business submissions to review.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Stats Tab */}
            <TabsContent value="stats">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-medium text-muted-foreground">Total Pending</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-[#c17c54]">
                      {totalPending}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-medium text-muted-foreground">Pending Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-[#2c4c3b]">
                      {pendingEvents?.length || 0}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-medium text-muted-foreground">Pending Businesses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-[#2c4c3b]">
                      {pendingBusinesses?.length || 0}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-medium text-muted-foreground">Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-medium text-green-600">
                      System Active
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
}
