import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, Loader2, CheckCircle, Store, MapPin, Phone, Mail, Globe, Facebook, Instagram, Image } from "lucide-react";
import { submitBusiness } from "@/lib/api";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

interface BusinessRegistrationDialogProps {
  trigger?: React.ReactNode;
}

const categories = [
  { value: "markets", label: "Markets & Farm Stalls" },
  { value: "arts", label: "Arts & Crafts" },
  { value: "accommodation", label: "Accommodation" },
  { value: "services", label: "Services" },
  { value: "food", label: "Food & Beverage" },
  { value: "wellness", label: "Wellness & Health" },
  { value: "retail", label: "Retail" },
  { value: "other", label: "Other" },
];

export default function BusinessRegistrationDialog({ trigger }: BusinessRegistrationDialogProps) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    facebook: "",
    instagram: "",
    imageUrl: "",
    submittedBy: "",
    submitterEmail: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submitMutation = useMutation({
    mutationFn: submitBusiness,
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Business submitted successfully!");
    },
    onError: (error: Error) => {
      toast.error("Failed to submit business", { description: error.message });
    },
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Business name is required";
    }
    if (!formData.category) {
      newErrors.category = "Please select a category";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (formData.description.trim().length < 20) {
      newErrors.description = "Description must be at least 20 characters";
    }
    if (!formData.submitterEmail.trim()) {
      newErrors.submitterEmail = "Your email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.submitterEmail)) {
      newErrors.submitterEmail = "Please enter a valid email address";
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid business email";
    }
    if (formData.website && !formData.website.startsWith("http")) {
      newErrors.website = "Website must start with http:// or https://";
    }
    if (formData.imageUrl && !formData.imageUrl.startsWith("http")) {
      newErrors.imageUrl = "Image URL must start with http:// or https://";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await submitMutation.mutateAsync({
      name: formData.name,
      category: formData.category as "markets" | "arts" | "accommodation" | "services" | "food" | "wellness" | "retail" | "other",
      description: formData.description,
      address: formData.address || undefined,
      phone: formData.phone || undefined,
      email: formData.email || undefined,
      website: formData.website || undefined,
      facebook: formData.facebook || undefined,
      instagram: formData.instagram || undefined,
      imageUrl: formData.imageUrl || undefined,
      submittedBy: formData.submittedBy || undefined,
      submitterEmail: formData.submitterEmail,
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset form when closing
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: "",
          category: "",
          description: "",
          address: "",
          phone: "",
          email: "",
          website: "",
          facebook: "",
          instagram: "",
          imageUrl: "",
          submittedBy: "",
          submitterEmail: "",
        });
        setErrors({});
      }, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-[#c17c54] hover:bg-[#a86843] text-white">
            <Store className="h-4 w-4 mr-2" />
            Register Your Business
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        {submitted ? (
          <div className="py-8 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <DialogTitle className="font-serif text-2xl text-[#2c4c3b] mb-2">
              Thank You!
            </DialogTitle>
            <DialogDescription className="text-base">
              Your business has been submitted for review. We'll notify you at{" "}
              <span className="font-medium">{formData.submitterEmail}</span> once it's approved.
            </DialogDescription>
            <Button
              className="mt-6 bg-[#2c4c3b] hover:bg-[#1a3326]"
              onClick={() => handleOpenChange(false)}
            >
              Close
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#2c4c3b]/10 rounded-full flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-[#2c4c3b]" />
                </div>
                <div>
                  <DialogTitle className="font-serif text-xl text-[#2c4c3b]">
                    Register Your Business
                  </DialogTitle>
                  <DialogDescription>
                    Join The Harvest community directory
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6 py-4">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[#2c4c3b] uppercase tracking-wide">
                  Basic Information
                </h3>

                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <Store className="h-4 w-4 text-[#c17c54]" />
                      Business Name *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Witta Artisan Bakery"
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Tell us about your business, what you offer, and what makes you unique..."
                      rows={4}
                      className={errors.description ? "border-red-500" : ""}
                    />
                    {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[#c17c54]" />
                      Address
                    </Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="e.g., 123 Main Street, Witta QLD 4552"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[#2c4c3b] uppercase tracking-wide">
                  Contact Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-[#c17c54]" />
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g., 0412 345 678"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-[#c17c54]" />
                      Business Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g., hello@yourbusiness.com"
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                  </div>
                </div>
              </div>

              {/* Online Presence */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[#2c4c3b] uppercase tracking-wide">
                  Online Presence
                </h3>

                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="website" className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-[#c17c54]" />
                      Website
                    </Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://www.yourbusiness.com"
                      className={errors.website ? "border-red-500" : ""}
                    />
                    {errors.website && <p className="text-sm text-red-500">{errors.website}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="facebook" className="flex items-center gap-2">
                        <Facebook className="h-4 w-4 text-[#c17c54]" />
                        Facebook
                      </Label>
                      <Input
                        id="facebook"
                        value={formData.facebook}
                        onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                        placeholder="facebook.com/yourbusiness"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instagram" className="flex items-center gap-2">
                        <Instagram className="h-4 w-4 text-[#c17c54]" />
                        Instagram
                      </Label>
                      <Input
                        id="instagram"
                        value={formData.instagram}
                        onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                        placeholder="@yourbusiness"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imageUrl" className="flex items-center gap-2">
                      <Image className="h-4 w-4 text-[#c17c54]" />
                      Business Image URL
                    </Label>
                    <Input
                      id="imageUrl"
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="https://example.com/your-business-photo.jpg"
                      className={errors.imageUrl ? "border-red-500" : ""}
                    />
                    <p className="text-xs text-muted-foreground">
                      Provide a link to a high-quality image of your business or products
                    </p>
                    {errors.imageUrl && <p className="text-sm text-red-500">{errors.imageUrl}</p>}
                  </div>
                </div>
              </div>

              {/* Submitter Information */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-sm font-semibold text-[#2c4c3b] uppercase tracking-wide">
                  Your Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="submittedBy">Your Name</Label>
                    <Input
                      id="submittedBy"
                      value={formData.submittedBy}
                      onChange={(e) => setFormData({ ...formData, submittedBy: e.target.value })}
                      placeholder="e.g., John Smith"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="submitterEmail">Your Email *</Label>
                    <Input
                      id="submitterEmail"
                      type="email"
                      value={formData.submitterEmail}
                      onChange={(e) => setFormData({ ...formData, submitterEmail: e.target.value })}
                      placeholder="your@email.com"
                      className={errors.submitterEmail ? "border-red-500" : ""}
                    />
                    {errors.submitterEmail && <p className="text-sm text-red-500">{errors.submitterEmail}</p>}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  We'll use this to notify you when your business is approved
                </p>
              </div>

              <DialogFooter className="pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#2c4c3b] hover:bg-[#1a3326]"
                  disabled={submitMutation.isPending}
                >
                  {submitMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    "Submit for Review"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
