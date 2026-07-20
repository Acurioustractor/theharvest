import { useId, useState } from "react";
import { Link } from "wouter";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { PlusCircle, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

export function EventSubmissionDialog({ onEventSubmitted }: { onEventSubmitted?: () => void }) {
  const idPrefix = useId();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [category, setCategory] = useState<string>("");
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const ids = {
    title: `${idPrefix}-event-title`,
    date: `${idPrefix}-event-date`,
    time: `${idPrefix}-event-time`,
    location: `${idPrefix}-event-location`,
    category: `${idPrefix}-event-category`,
    categoryError: `${idPrefix}-event-category-error`,
    description: `${idPrefix}-event-description`,
    contact: `${idPrefix}-event-contact`,
    submittedBy: `${idPrefix}-event-submitted-by`,
    submitError: `${idPrefix}-event-submit-error`,
  };

  const submitEventMutation = trpc.events.submit.useMutation({
    onSuccess: () => {
      setOpen(false);
      toast.success("Event submitted successfully!", {
        description: "Your event has been sent for review and will appear on the calendar once approved."
      });
      onEventSubmitted?.();
    },
    onError: (error) => {
      setSubmitError(error.message || "Please try again later.");
      toast.error("Failed to submit event", {
        description: error.message || "Please try again later."
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!category) {
      setCategoryError("Please select a category");
      return;
    }

    setCategoryError(null);
    setSubmitError(null);
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
        submittedBy: String(formData.get("submittedBy") || "").trim(),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setCategoryError(null);
      setSubmitError(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-[#8B4A2A] hover:bg-[#6f3820] text-white gap-2">
          <PlusCircle className="h-4 w-4" />
          Submit Event
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Submit Community Event</DialogTitle>
          <DialogDescription>
            Share your upcoming event with the Witta and Maleny community. All submissions are reviewed before publishing.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 py-4"
          aria-busy={isSubmitting}
          aria-describedby={submitError ? ids.submitError : undefined}
        >
          <div className="grid gap-2">
            <Label htmlFor={ids.title}>Event Title</Label>
            <Input
              id={ids.title}
              name="title"
              autoComplete="off"
              required
              placeholder="e.g., Witta Spring Fair"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor={ids.date}>Date</Label>
              <Input id={ids.date} name="date" type="date" autoComplete="off" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={ids.time}>Time</Label>
              <Input id={ids.time} name="time" autoComplete="off" placeholder="e.g., 9:00 AM - 2:00 PM" required />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor={ids.location}>Location</Label>
            <Input id={ids.location} name="location" autoComplete="off" placeholder="e.g., Witta Recreational Club" required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor={ids.category}>Category</Label>
            <Select
              name="category"
              value={category}
              onValueChange={(value) => {
                setCategory(value);
                setCategoryError(null);
              }}
            >
              <SelectTrigger
                id={ids.category}
                aria-required="true"
                aria-invalid={Boolean(categoryError)}
                aria-describedby={categoryError ? ids.categoryError : undefined}
                className={categoryError ? "border-red-500" : undefined}
              >
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
            {categoryError && (
              <p id={ids.categoryError} role="alert" className="text-sm text-red-600">
                {categoryError}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor={ids.description}>Description</Label>
            <Textarea 
              id={ids.description}
              name="description"
              autoComplete="off"
              placeholder="Tell us about your event..." 
              className="h-24" 
              required 
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor={ids.contact}>Contact Email</Label>
            <Input
              id={ids.contact}
              name="contact"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor={ids.submittedBy}>Your Name</Label>
            <Input
              id={ids.submittedBy}
              name="submittedBy"
              autoComplete="name"
              placeholder="Your name or organization"
              required
            />
          </div>

          <p className="text-xs text-stone-600">
            Used only to review and get in touch about this event. See our{" "}
            <Link href="/privacy" className="underline hover:text-stone-700">
              privacy page
            </Link>{" "}
            for details.
          </p>

          {submitError && (
            <p id={ids.submitError} role="alert" className="text-sm text-red-600">
              We couldn't submit your event. {submitError}
            </p>
          )}

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full bg-[#2c4c3b] hover:bg-[#1a3326]">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
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
