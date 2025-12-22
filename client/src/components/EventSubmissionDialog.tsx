import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { PlusCircle, Loader2 } from "lucide-react";
import { submitEvent } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

export function EventSubmissionDialog({ onEventSubmitted }: { onEventSubmitted?: () => void }) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [category, setCategory] = useState<string>("");

  const submitEventMutation = useMutation({
    mutationFn: submitEvent,
    onSuccess: () => {
      setOpen(false);
      toast.success("Event submitted successfully!", {
        description: "Your event has been sent for review and will appear on the calendar once approved."
      });
      onEventSubmitted?.();
    },
    onError: (error: Error) => {
      toast.error("Failed to submit event", {
        description: error.message || "Please try again later."
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      await submitEventMutation.mutateAsync({
        title: formData.get("title") as string,
        date: formData.get("date") as string,
        time: formData.get("time") as string,
        location: formData.get("location") as string,
        category: category as "market" | "community" | "arts" | "workshop" | "music",
        description: formData.get("description") as string,
        contactEmail: formData.get("contact") as string,
        submittedBy: formData.get("submittedBy") as string || undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#c17c54] hover:bg-[#a06543] text-white gap-2">
          <PlusCircle className="h-4 w-4" />
          Submit Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Submit Community Event</DialogTitle>
          <DialogDescription>
            Share your upcoming event with the Witta and Maleny community. All submissions are reviewed before publishing.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Event Title</Label>
            <Input id="title" name="title" required placeholder="e.g., Witta Spring Fair" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" name="date" type="date" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="time">Time</Label>
              <Input id="time" name="time" placeholder="e.g., 9:00 AM - 2:00 PM" required />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" placeholder="e.g., Witta Recreational Club" required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select required value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="market">Market</SelectItem>
                <SelectItem value="community">Community</SelectItem>
                <SelectItem value="arts">Arts & Culture</SelectItem>
                <SelectItem value="workshop">Workshop</SelectItem>
                <SelectItem value="music">Live Music</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              name="description"
              placeholder="Tell us about your event..." 
              className="h-24" 
              required 
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="contact">Contact Email</Label>
            <Input id="contact" name="contact" type="email" placeholder="your@email.com" required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="submittedBy">Your Name (optional)</Label>
            <Input id="submittedBy" name="submittedBy" placeholder="Your name or organization" />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting || !category} className="w-full bg-[#2c4c3b] hover:bg-[#1a3326]">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Event"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
