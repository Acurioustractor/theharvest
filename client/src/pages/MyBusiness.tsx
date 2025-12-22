import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Building2, MapPin, Phone, Mail, Globe, Facebook, Instagram, Loader2, LogIn, Save, CheckCircle, Image, Search } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";

export default function MyBusiness() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [claimDialogOpen, setClaimDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch user's business
  const { data: myBusiness, isLoading: businessLoading, refetch } = trpc.businesses.myBusiness.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Fetch unclaimed businesses for claiming
  const { data: unclaimedBusinesses, isLoading: unclaimedLoading } = trpc.businesses.unclaimed.useQuery(undefined, {
    enabled: isAuthenticated && !myBusiness,
  });

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    facebook: "",
    instagram: "",
    imageUrl: "",
  });

  // Update form when business data loads
  const initializeForm = () => {
    if (myBusiness) {
      setFormData({
        name: myBusiness.name || "",
        description: myBusiness.description || "",
        address: myBusiness.address || "",
        phone: myBusiness.phone || "",
        email: myBusiness.email || "",
        website: myBusiness.website || "",
        facebook: myBusiness.facebook || "",
        instagram: myBusiness.instagram || "",
        imageUrl: myBusiness.imageUrl || "",
      });
    }
  };

  // Mutations
  const updateProfile = trpc.businesses.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("Business profile updated successfully!");
      setIsEditing(false);
      setIsSaving(false);
      refetch();
    },
    onError: (error) => {
      toast.error("Failed to update profile", { description: error.message });
      setIsSaving(false);
    },
  });

  const claimBusiness = trpc.businesses.claim.useMutation({
    onSuccess: () => {
      toast.success("Business claimed successfully! You can now manage your profile.");
      setClaimDialogOpen(false);
      refetch();
    },
    onError: (error) => {
      toast.error("Failed to claim business", { description: error.message });
    },
  });

  const handleSave = async () => {
    if (!myBusiness) return;
    setIsSaving(true);
    await updateProfile.mutateAsync({
      businessId: myBusiness.id,
      ...formData,
    });
  };

  const handleClaim = async (businessId: number) => {
    await claimBusiness.mutateAsync({ businessId });
  };

  const filteredUnclaimed = unclaimedBusinesses?.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

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
              <CardTitle className="font-serif text-2xl text-[#2c4c3b]">Sign In Required</CardTitle>
              <CardDescription>
                Please sign in to manage your business profile.
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

  // Loading business
  if (businessLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#2c4c3b]" />
          <span className="ml-3 text-muted-foreground">Loading your business...</span>
        </div>
      </Layout>
    );
  }

  // No business yet - show claim or register options
  if (!myBusiness) {
    return (
      <Layout>
        {/* Header */}
        <section className="bg-[#2c4c3b] text-white py-12">
          <div className="container px-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold">My Business</h1>
                <p className="text-white/80">Manage your business profile</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-[#f8f5f2] min-h-[60vh]">
          <div className="container px-4 max-w-2xl">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-[#c17c54]/10 rounded-full flex items-center justify-center mb-4">
                  <Building2 className="h-8 w-8 text-[#c17c54]" />
                </div>
                <CardTitle className="font-serif text-2xl text-[#2c4c3b]">No Business Profile Yet</CardTitle>
                <CardDescription className="text-base">
                  You haven't claimed or registered a business yet. You can either claim an existing approved business or register a new one.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Dialog open={claimDialogOpen} onOpenChange={setClaimDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-[#2c4c3b] hover:bg-[#1a3326]">
                      <Search className="h-4 w-4 mr-2" />
                      Claim Existing Business
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="font-serif text-xl text-[#2c4c3b]">Claim Your Business</DialogTitle>
                      <DialogDescription>
                        Search for your business in our directory and claim it to manage your profile.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search by business name..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>

                      {unclaimedLoading ? (
                        <div className="flex justify-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin text-[#2c4c3b]" />
                        </div>
                      ) : filteredUnclaimed.length > 0 ? (
                        <div className="space-y-3 max-h-[300px] overflow-y-auto">
                          {filteredUnclaimed.map((business) => (
                            <Card key={business.id} className="cursor-pointer hover:border-[#2c4c3b] transition-colors">
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start gap-4">
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-[#2c4c3b] truncate">{business.name}</h4>
                                    <p className="text-sm text-muted-foreground line-clamp-2">{business.description}</p>
                                    <Badge variant="outline" className="mt-2 text-xs">
                                      {business.category}
                                    </Badge>
                                  </div>
                                  <Button 
                                    size="sm" 
                                    className="bg-[#c17c54] hover:bg-[#a06543] shrink-0"
                                    onClick={() => handleClaim(business.id)}
                                    disabled={claimBusiness.isPending}
                                  >
                                    {claimBusiness.isPending ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      "Claim"
                                    )}
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          {searchTerm ? "No businesses found matching your search." : "No unclaimed businesses available."}
                        </div>
                      )}
                    </div>

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setClaimDialogOpen(false)}>
                        Cancel
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or</span>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full border-[#2c4c3b] text-[#2c4c3b] hover:bg-[#2c4c3b]/5"
                  onClick={() => window.location.href = "/local-enterprises"}
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Register New Business
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </Layout>
    );
  }

  // Has business - show management dashboard
  return (
    <Layout>
      {/* Header */}
      <section className="bg-[#2c4c3b] text-white py-12">
        <div className="container px-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold">My Business</h1>
              <p className="text-white/80">Manage your business profile</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-600">
              <CheckCircle className="h-3 w-3 mr-1" />
              Verified Owner
            </Badge>
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="py-12 bg-[#f8f5f2] min-h-[60vh]">
        <div className="container px-4">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="font-serif text-2xl text-[#2c4c3b]">{myBusiness.name}</CardTitle>
                      <CardDescription>
                        Edit your business information below
                      </CardDescription>
                    </div>
                    {!isEditing ? (
                      <Button 
                        onClick={() => {
                          initializeForm();
                          setIsEditing(true);
                        }}
                        className="bg-[#c17c54] hover:bg-[#a06543]"
                      >
                        Edit Profile
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleSave}
                          disabled={isSaving}
                          className="bg-[#2c4c3b] hover:bg-[#1a3326]"
                        >
                          {isSaving ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <Save className="h-4 w-4 mr-2" />
                          )}
                          Save Changes
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isEditing ? (
                    // Edit Mode
                    <div className="grid gap-6">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Business Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          rows={4}
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            value={formData.website}
                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                            placeholder="https://"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="facebook">Facebook</Label>
                          <Input
                            id="facebook"
                            value={formData.facebook}
                            onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                            placeholder="Facebook page URL"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="instagram">Instagram</Label>
                          <Input
                            id="instagram"
                            value={formData.instagram}
                            onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                            placeholder="@username"
                          />
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="imageUrl">Profile Image URL</Label>
                        <Input
                          id="imageUrl"
                          value={formData.imageUrl}
                          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                          placeholder="https://example.com/image.jpg"
                        />
                        {formData.imageUrl && (
                          <div className="mt-2">
                            <img 
                              src={formData.imageUrl} 
                              alt="Preview" 
                              className="max-w-xs rounded-lg shadow-md"
                              onError={(e) => (e.currentTarget.style.display = 'none')}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                        <p className="text-gray-700">{myBusiness.description}</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        {myBusiness.address && (
                          <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-[#c17c54] mt-0.5" />
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
                              <p className="text-gray-700">{myBusiness.address}</p>
                            </div>
                          </div>
                        )}
                        {myBusiness.phone && (
                          <div className="flex items-start gap-3">
                            <Phone className="h-5 w-5 text-[#c17c54] mt-0.5" />
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                              <p className="text-gray-700">{myBusiness.phone}</p>
                            </div>
                          </div>
                        )}
                        {myBusiness.email && (
                          <div className="flex items-start gap-3">
                            <Mail className="h-5 w-5 text-[#c17c54] mt-0.5" />
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                              <p className="text-gray-700">{myBusiness.email}</p>
                            </div>
                          </div>
                        )}
                        {myBusiness.website && (
                          <div className="flex items-start gap-3">
                            <Globe className="h-5 w-5 text-[#c17c54] mt-0.5" />
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground">Website</h3>
                              <a href={myBusiness.website} target="_blank" rel="noopener noreferrer" className="text-[#2c4c3b] hover:underline">
                                {myBusiness.website}
                              </a>
                            </div>
                          </div>
                        )}
                        {myBusiness.facebook && (
                          <div className="flex items-start gap-3">
                            <Facebook className="h-5 w-5 text-[#c17c54] mt-0.5" />
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground">Facebook</h3>
                              <p className="text-gray-700">{myBusiness.facebook}</p>
                            </div>
                          </div>
                        )}
                        {myBusiness.instagram && (
                          <div className="flex items-start gap-3">
                            <Instagram className="h-5 w-5 text-[#c17c54] mt-0.5" />
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground">Instagram</h3>
                              <p className="text-gray-700">{myBusiness.instagram}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {myBusiness.imageUrl && (
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                            <Image className="h-4 w-4" />
                            Profile Image
                          </h3>
                          <img 
                            src={myBusiness.imageUrl} 
                            alt={myBusiness.name} 
                            className="max-w-md rounded-lg shadow-md"
                            onError={(e) => (e.currentTarget.style.display = 'none')}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview">
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-xl text-[#2c4c3b]">Public Preview</CardTitle>
                  <CardDescription>
                    This is how your business appears in the Local Enterprises directory
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg overflow-hidden max-w-md">
                    {myBusiness.imageUrl && (
                      <div className="aspect-video bg-gray-100">
                        <img 
                          src={myBusiness.imageUrl} 
                          alt={myBusiness.name}
                          className="w-full h-full object-cover"
                          onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <Badge className="mb-2 bg-[#2c4c3b]">{myBusiness.category}</Badge>
                      <h3 className="font-serif text-lg font-semibold text-[#2c4c3b]">{myBusiness.name}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{myBusiness.description}</p>
                      {myBusiness.address && (
                        <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{myBusiness.address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
}
