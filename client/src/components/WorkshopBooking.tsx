import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  Hammer,
  Calendar,
  Users,
  Clock,
  MapPin,
  ChevronRight,
  Check,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface Workshop {
  id: string;
  title: string;
  description: string;
  instructor: string;
  date: string;
  time: string;
  duration: string;
  capacity: number;
  spotsLeft: number;
  price: number;
  category: "pottery" | "preserving" | "woodwork" | "gardening" | "cooking" | "crafts";
  image?: string;
}

// Sample workshop data - in production this would come from the API
const sampleWorkshops: Workshop[] = [
  {
    id: "pottery-basics",
    title: "Pottery Basics: Hand Building",
    description:
      "Learn the fundamentals of hand-building pottery. Create your own bowl or cup using traditional pinch and coil techniques.",
    instructor: "Emma Chen",
    date: "2024-02-15",
    time: "10:00 AM",
    duration: "3 hours",
    capacity: 12,
    spotsLeft: 4,
    price: 85,
    category: "pottery",
  },
  {
    id: "seasonal-preserves",
    title: "Seasonal Preserving Workshop",
    description:
      "Transform seasonal fruits into delicious jams and preserves. Take home 3 jars of your own creation.",
    instructor: "Sarah Williams",
    date: "2024-02-20",
    time: "9:00 AM",
    duration: "4 hours",
    capacity: 8,
    spotsLeft: 2,
    price: 95,
    category: "preserving",
  },
  {
    id: "native-garden",
    title: "Native Garden Design",
    description:
      "Learn to design a water-wise native garden suited to the Sunshine Coast hinterland. Includes plants to take home.",
    instructor: "Tom Mitchell",
    date: "2024-02-25",
    time: "2:00 PM",
    duration: "2.5 hours",
    capacity: 15,
    spotsLeft: 8,
    price: 65,
    category: "gardening",
  },
  {
    id: "sourdough",
    title: "Sourdough from Scratch",
    description:
      "Master the art of sourdough bread. Learn to create and maintain a starter, mix dough, and bake the perfect loaf.",
    instructor: "Marco Rossi",
    date: "2024-03-02",
    time: "8:00 AM",
    duration: "5 hours",
    capacity: 10,
    spotsLeft: 6,
    price: 110,
    category: "cooking",
  },
];

const categoryColors = {
  pottery: "bg-purple-100 text-purple-700",
  preserving: "bg-amber-100 text-amber-700",
  woodwork: "bg-orange-100 text-orange-700",
  gardening: "bg-green-100 text-green-700",
  cooking: "bg-red-100 text-red-700",
  crafts: "bg-blue-100 text-blue-700",
};

interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  attendees: string;
  dietaryRequirements: string;
  specialRequests: string;
}

function WorkshopBookingDialog({ workshop }: { workshop: Workshop }) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"form" | "confirm" | "success">("form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<BookingFormData>({
    name: "",
    email: "",
    phone: "",
    attendees: "1",
    dietaryRequirements: "",
    specialRequests: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep("confirm");
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);

    // Simulate API call - in production this would submit to GHL
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setStep("success");

    toast.success("Booking request submitted!", {
      description: "We'll confirm your spot within 24 hours.",
    });
  };

  const resetAndClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setStep("form");
      setFormData({
        name: "",
        email: "",
        phone: "",
        attendees: "1",
        dietaryRequirements: "",
        specialRequests: "",
      });
    }, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-full bg-amber-500 hover:bg-amber-600 text-black"
          disabled={workshop.spotsLeft === 0}
        >
          {workshop.spotsLeft === 0 ? "Sold Out" : "Book Now"}
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <AnimatePresence mode="wait">
          {step === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <DialogHeader>
                <DialogTitle className="text-xl font-serif">
                  Book: {workshop.title}
                </DialogTitle>
                <DialogDescription>
                  {workshop.date} at {workshop.time} · ${workshop.price} per person
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, email: e.target.value }))
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="0400 000 000"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="attendees">Number of Attendees</Label>
                  <Select
                    value={formData.attendees}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, attendees: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from(
                        { length: Math.min(workshop.spotsLeft, 4) },
                        (_, i) => (
                          <SelectItem key={i + 1} value={String(i + 1)}>
                            {i + 1} {i === 0 ? "person" : "people"}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dietary">Dietary Requirements (optional)</Label>
                  <Input
                    id="dietary"
                    placeholder="Vegetarian, allergies, etc."
                    value={formData.dietaryRequirements}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        dietaryRequirements: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requests">Special Requests (optional)</Label>
                  <Textarea
                    id="requests"
                    placeholder="Any other information we should know?"
                    value={formData.specialRequests}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        specialRequests: e.target.value,
                      }))
                    }
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-black"
                >
                  Continue to Confirm
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </motion.div>
          )}

          {step === "confirm" && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <DialogHeader>
                <DialogTitle className="text-xl font-serif">
                  Confirm Your Booking
                </DialogTitle>
              </DialogHeader>

              <div className="mt-4 space-y-4">
                <div className="bg-stone-50 rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold text-stone-800">
                    {workshop.title}
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-stone-600">
                    <Calendar className="h-4 w-4" />
                    {workshop.date} at {workshop.time}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-stone-600">
                    <Users className="h-4 w-4" />
                    {formData.attendees}{" "}
                    {parseInt(formData.attendees) === 1 ? "person" : "people"}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-stone-600">
                      ${workshop.price} × {formData.attendees}
                    </span>
                    <span className="font-medium">
                      ${workshop.price * parseInt(formData.attendees)}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500">
                    Payment will be collected at the workshop
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep("form")}
                  >
                    Back
                  </Button>
                  <Button
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-black"
                    onClick={handleConfirm}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Confirm Booking
                        <Check className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-800 mb-2">
                Booking Request Submitted!
              </h3>
              <p className="text-stone-600 mb-6">
                We'll confirm your spot and send details to {formData.email} within
                24 hours.
              </p>
              <Button onClick={resetAndClose}>Close</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

interface WorkshopCardProps {
  workshop: Workshop;
}

export function WorkshopCard({ workshop }: WorkshopCardProps) {
  const spotsClass =
    workshop.spotsLeft <= 2
      ? "text-red-600 bg-red-50"
      : workshop.spotsLeft <= 5
        ? "text-amber-600 bg-amber-50"
        : "text-green-600 bg-green-50";

  return (
    <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
      {workshop.image && (
        <div className="h-40 overflow-hidden">
          <img
            src={workshop.image}
            alt={workshop.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${categoryColors[workshop.category]}`}
          >
            {workshop.category}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${spotsClass}`}>
            {workshop.spotsLeft === 0
              ? "Sold out"
              : `${workshop.spotsLeft} spots left`}
          </span>
        </div>

        <h3 className="text-lg font-serif font-bold text-stone-800 mb-2">
          {workshop.title}
        </h3>

        <p className="text-sm text-stone-600 mb-4 line-clamp-2">
          {workshop.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-stone-500">
            <Calendar className="h-4 w-4" />
            {new Date(workshop.date).toLocaleDateString("en-AU", {
              weekday: "short",
              day: "numeric",
              month: "short",
            })}
          </div>
          <div className="flex items-center gap-2 text-sm text-stone-500">
            <Clock className="h-4 w-4" />
            {workshop.time} · {workshop.duration}
          </div>
          <div className="flex items-center gap-2 text-sm text-stone-500">
            <Users className="h-4 w-4" />
            With {workshop.instructor}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-serif font-bold text-stone-800">
            ${workshop.price}
          </span>
          <span className="text-sm text-stone-500">per person</span>
        </div>

        <WorkshopBookingDialog workshop={workshop} />
      </CardContent>
    </Card>
  );
}

interface WorkshopBookingListProps {
  category?: Workshop["category"];
  limit?: number;
}

export function WorkshopBookingList({ category, limit }: WorkshopBookingListProps) {
  const filteredWorkshops = category
    ? sampleWorkshops.filter((w) => w.category === category)
    : sampleWorkshops;

  const displayedWorkshops = limit
    ? filteredWorkshops.slice(0, limit)
    : filteredWorkshops;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayedWorkshops.map((workshop) => (
        <WorkshopCard key={workshop.id} workshop={workshop} />
      ))}
    </div>
  );
}

export { sampleWorkshops };
