import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  MessageSquareHeart,
  PenLine,
  Heart,
  Sparkles,
  ChevronRight,
  Users,
  BookOpen,
  Mic,
} from "lucide-react";
import { toast } from "sonner";
import { useSeason } from "@/contexts/SeasonalContext";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

function StorySubmissionDialog() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    story: "",
    consent: false,
    anonymous: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consent) {
      toast.error("Please agree to the consent statement to share your story.");
      return;
    }

    setIsSubmitting(true);

    // Simulate submission - in production this would go to the API
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success("Thank you for sharing your story!", {
      description: "Our team will review it and may reach out if we'd like to feature it.",
    });

    setFormData({
      name: "",
      email: "",
      story: "",
      consent: false,
      anonymous: false,
    });
    setIsSubmitting(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
        >
          <PenLine className="mr-2 h-5 w-5" />
          Share Your Story
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">
            Share Your Harvest Story
          </DialogTitle>
          <DialogDescription>
            Tell us how The Harvest has touched your life. Your story may inspire
            others and help us understand our impact.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                placeholder="How you'd like to be credited"
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
                placeholder="So we can reach you if needed"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                required
              />
              <p className="text-xs text-stone-500">
                We'll never share your email. It's only for follow-up.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="story">Your Story</Label>
              <Textarea
                id="story"
                placeholder="What does The Harvest mean to you? How has it impacted your life?"
                className="min-h-[150px]"
                value={formData.story}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, story: e.target.value }))
                }
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="anonymous"
                checked={formData.anonymous}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    anonymous: checked as boolean,
                  }))
                }
              />
              <Label htmlFor="anonymous" className="text-sm text-stone-600 leading-relaxed">
                Share my story anonymously (first name and initial only)
              </Label>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="consent"
                checked={formData.consent}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    consent: checked as boolean,
                  }))
                }
                required
              />
              <Label htmlFor="consent" className="text-sm text-stone-600 leading-relaxed">
                I consent to The Harvest reviewing and potentially sharing my
                story on their website, social media, and marketing materials.
                I understand I can request removal at any time.
              </Label>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 text-black"
            disabled={isSubmitting || !formData.consent}
          >
            {isSubmitting ? "Submitting..." : "Submit Your Story"}
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function Stories() {
  const { data: seasonalData } = useSeason();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-b from-amber-50 to-white overflow-hidden">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium bg-amber-100 text-amber-700 rounded-full">
              <MessageSquareHeart className="h-4 w-4" />
              Community Voices
            </span>

            <h1 className="text-5xl md:text-6xl font-serif font-bold text-stone-800 mb-6">
              Your Story <span className="text-amber-600">Matters</span>
            </h1>

            <p className="text-xl text-stone-600 mb-10 leading-relaxed">
              The Harvest is being shaped by the stories of people who believe in what we're building.
              Whether you've visited an event or just want to share why this matters to you,
              your voice is part of what makes this place special.
            </p>

            <StorySubmissionDialog />
          </motion.div>
        </div>
      </section>

      {/* Why Share Section */}
      <section className="py-24 bg-white">
        <div className="container">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-4"
            >
              Why share your story?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-stone-600 max-w-2xl mx-auto">
              Your words help others understand what we're building together
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp}>
              <Card className="h-full border-0 shadow-md bg-gradient-to-br from-amber-50 to-white">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
                    <Heart className="h-8 w-8 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-stone-800 mb-3">
                    Inspire Others
                  </h3>
                  <p className="text-stone-600 leading-relaxed">
                    Your story might be exactly what someone needs to hear before
                    they take their first step through our door.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="h-full border-0 shadow-md bg-gradient-to-br from-green-50 to-white">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-stone-800 mb-3">
                    Build Community
                  </h3>
                  <p className="text-stone-600 leading-relaxed">
                    When we share our experiences, we create connections.
                    Your story becomes part of our collective memory.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="h-full border-0 shadow-md bg-gradient-to-br from-purple-50 to-white">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-stone-800 mb-3">
                    Shape Our Future
                  </h3>
                  <p className="text-stone-600 leading-relaxed">
                    Your feedback helps us understand what's working and what
                    we can do better. Every voice matters.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Story Prompts */}
      <section className="py-24 bg-stone-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-4">
                Not sure where to start?
              </h2>
              <p className="text-stone-600">
                Here are some questions to help you reflect on your experience
              </p>
            </div>

            <div className="space-y-4">
              {[
                "What brought you to The Harvest for the first time?",
                "What keeps you coming back?",
                "Is there a moment here that stands out in your memory?",
                "How has your experience here affected your week or your life?",
                "What would you tell someone who's never visited?",
              ].map((prompt, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4 bg-white rounded-lg p-5 shadow-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                    <BookOpen className="h-4 w-4 text-amber-600" />
                  </div>
                  <p className="text-stone-700 leading-relaxed">{prompt}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-stone-900 text-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <Mic className="h-12 w-12 text-amber-400 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              Ready to Share?
            </h2>
            <p className="text-xl text-stone-300 mb-10 leading-relaxed">
              Every person who walks through our doors brings their own story.
              We'd love to hear yours. It doesn't have to be long – just honest.
            </p>
            <StorySubmissionDialog />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
