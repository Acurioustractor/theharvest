import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sparkles,
  Utensils,
  Leaf,
  Users,
  Hammer,
  Heart,
  ChevronRight,
  ChevronLeft,
  Check,
  Loader2,
  TreeDeciduous,
  Coffee,
  BookOpen,
  Sun,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

interface QuizAnswer {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface QuizQuestion {
  id: string;
  question: string;
  description?: string;
  answers: QuizAnswer[];
  multiSelect?: boolean;
}

type PersonaId = "regular" | "maker" | "gatherer" | "grower" | "explorer";

interface PersonaResult {
  id: PersonaId;
  title: string;
  tagline: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  recommendations: { label: string; href: string }[];
  ghlTags: string[];
}

const quizQuestions: QuizQuestion[] = [
  {
    id: "motivation",
    question: "What draws you to The Harvest?",
    description: "Pick the option that resonates most",
    answers: [
      {
        id: "food",
        label: "Good food & coffee",
        description: "I'm here for the seasonal menu and quality produce",
        icon: Utensils,
      },
      {
        id: "community",
        label: "Meeting people",
        description: "I want to connect with my local community",
        icon: Users,
      },
      {
        id: "learning",
        label: "Learning new skills",
        description: "Workshops and hands-on experiences interest me",
        icon: BookOpen,
      },
      {
        id: "nature",
        label: "Being in nature",
        description: "I want to spend time in gardens and green spaces",
        icon: TreeDeciduous,
      },
    ],
  },
  {
    id: "frequency",
    question: "How often might you visit?",
    answers: [
      {
        id: "weekly",
        label: "Weekly regular",
        description: "This could become my go-to spot",
        icon: Coffee,
      },
      {
        id: "events",
        label: "For events & markets",
        description: "I'll come for special occasions",
        icon: Sparkles,
      },
      {
        id: "occasional",
        label: "Occasional explorer",
        description: "When I'm in the area or have time",
        icon: Sun,
      },
      {
        id: "first-time",
        label: "This is my first time",
        description: "Just discovering what you're about",
        icon: Heart,
      },
    ],
  },
  {
    id: "interests",
    question: "What would you love to try?",
    description: "Select all that interest you",
    multiSelect: true,
    answers: [
      {
        id: "breakfast",
        label: "Seasonal breakfast",
        description: "Food made with local ingredients",
        icon: Utensils,
      },
      {
        id: "plants",
        label: "Garden centre",
        description: "Native and productive plants",
        icon: Leaf,
      },
      {
        id: "workshop",
        label: "Workshops",
        description: "Pottery, preserving, crafts",
        icon: Hammer,
      },
      {
        id: "venue",
        label: "Host an event",
        description: "Venue hire for gatherings",
        icon: Users,
      },
    ],
  },
];

const personaResults: Record<PersonaId, PersonaResult> = {
  regular: {
    id: "regular",
    title: "The Regular",
    tagline: "A place at your table awaits",
    description:
      "You're the heart of what we're building. Regulars become neighbours, and neighbours become community. We can't wait to know your name.",
    icon: Coffee,
    color: "bg-amber-500",
    recommendations: [
      { label: "View this week's menu", href: "/visit" },
      { label: "Become a member", href: "/membership" },
      { label: "Join the newsletter", href: "/" },
    ],
    ghlTags: ["quiz-regular", "high-frequency", "community-builder"],
  },
  maker: {
    id: "maker",
    title: "The Maker",
    tagline: "Get your hands dirty with us",
    description:
      "You want to learn, create, and take something home. Our workshops are designed for curious hands and open minds. No experience necessary.",
    icon: Hammer,
    color: "bg-purple-500",
    recommendations: [
      { label: "Browse upcoming workshops", href: "/whats-on" },
      { label: "See the makers shed", href: "/explore" },
      { label: "Join the waitlist", href: "/" },
    ],
    ghlTags: ["quiz-maker", "workshop-interested", "hands-on-learner"],
  },
  gatherer: {
    id: "gatherer",
    title: "The Gatherer",
    tagline: "Bring your people together",
    description:
      "You're looking for the right space to host something meaningful. Whether it's a celebration, workshop, or community meeting, we've got room.",
    icon: Users,
    color: "bg-blue-500",
    recommendations: [
      { label: "Explore venue hire", href: "/venue-hire" },
      { label: "See our spaces", href: "/explore" },
      { label: "Get in touch", href: "/contact" },
    ],
    ghlTags: ["quiz-gatherer", "venue-interested", "event-host"],
  },
  grower: {
    id: "grower",
    title: "The Grower",
    tagline: "Take something home to plant",
    description:
      "You have a patch of earth that needs nurturing. Our garden centre has plants suited to this climate, plus advice from people who actually grow things.",
    icon: Leaf,
    color: "bg-green-500",
    recommendations: [
      { label: "Visit the garden centre", href: "/visit" },
      { label: "See gardening workshops", href: "/whats-on" },
      { label: "Read our story", href: "/journey" },
    ],
    ghlTags: ["quiz-grower", "garden-interested", "plant-buyer"],
  },
  explorer: {
    id: "explorer",
    title: "The Explorer",
    tagline: "Welcome! Let's show you around",
    description:
      "You're curious about what's happening here. That's exactly how most of us started. Come for a meal, wander the gardens, and see what resonates.",
    icon: Sparkles,
    color: "bg-rose-500",
    recommendations: [
      { label: "Plan your first visit", href: "/visit" },
      { label: "See what's on", href: "/whats-on" },
      { label: "Our transformation story", href: "/journey" },
    ],
    ghlTags: ["quiz-explorer", "first-timer", "curious-visitor"],
  },
};

function determinePersona(answers: Record<string, string | string[]>): PersonaResult {
  const motivation = answers.motivation as string;
  const frequency = answers.frequency as string;
  const interests = (answers.interests as string[]) || [];

  // Simple scoring logic
  if (frequency === "weekly" || motivation === "food") {
    return personaResults.regular;
  }

  if (motivation === "learning" || interests.includes("workshop")) {
    return personaResults.maker;
  }

  if (interests.includes("venue") || motivation === "community") {
    return personaResults.gatherer;
  }

  if (motivation === "nature" || interests.includes("plants")) {
    return personaResults.grower;
  }

  return personaResults.explorer;
}

interface VisitorQuizProps {
  trigger?: React.ReactNode;
  onComplete?: (persona: PersonaResult, email?: string) => void;
}

export function VisitorQuiz({ trigger, onComplete }: VisitorQuizProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [showResult, setShowResult] = useState(false);
  const [persona, setPersona] = useState<PersonaResult | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = quizQuestions[currentStep];
  const progress = ((currentStep + 1) / quizQuestions.length) * 100;

  const handleAnswer = (answerId: string) => {
    if (currentQuestion.multiSelect) {
      const current = (answers[currentQuestion.id] as string[]) || [];
      const updated = current.includes(answerId)
        ? current.filter((id) => id !== answerId)
        : [...current, answerId];
      setAnswers({ ...answers, [currentQuestion.id]: updated });
    } else {
      setAnswers({ ...answers, [currentQuestion.id]: answerId });

      // Auto-advance for single-select
      setTimeout(() => {
        if (currentStep < quizQuestions.length - 1) {
          setCurrentStep(currentStep + 1);
        } else {
          calculateResult();
        }
      }, 300);
    }
  };

  const calculateResult = () => {
    const result = determinePersona(answers);
    setPersona(result);
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentStep < quizQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      calculateResult();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const quizMutation = trpc.quiz.submit.useMutation();

  const handleEmailSubmit = async () => {
    if (!name.trim() || !email.trim() || !persona) return;

    setIsSubmitting(true);

    try {
      await quizMutation.mutateAsync({
        name: name.trim(),
        email: email.trim(),
        persona: persona.id,
        motivation: answers.motivation as string | undefined,
        frequency: answers.frequency as string | undefined,
        interests: (answers.interests as string[]) || undefined,
      });

      onComplete?.(persona, email);
      toast.success(`Welcome, ${persona.title}!`, {
        description: "We've personalized your experience and added you to our community.",
      });
    } catch {
      toast.error("Something went wrong", {
        description: "Your quiz result is still valid — we just couldn't save your email.",
      });
    } finally {
      setIsSubmitting(false);
    }

    resetAndClose();
  };

  const skipEmail = () => {
    if (persona) {
      onComplete?.(persona);
      resetAndClose();
    }
  };

  const resetAndClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setCurrentStep(0);
      setAnswers({});
      setShowResult(false);
      setPersona(null);
      setName("");
      setEmail("");
    }, 300);
  };

  const isCurrentAnswered = currentQuestion.multiSelect
    ? ((answers[currentQuestion.id] as string[]) || []).length > 0
    : !!answers[currentQuestion.id];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-amber-500 hover:bg-amber-600 text-black">
            <Sparkles className="mr-2 h-5 w-5" />
            Find Your Harvest Role
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg p-0 overflow-hidden">
        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key={`question-${currentStep}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {/* Progress Bar */}
              <div className="h-1 bg-stone-100">
                <motion.div
                  className="h-full bg-amber-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <div className="p-6">
                <DialogHeader>
                  <DialogTitle className="text-xl font-serif">
                    {currentQuestion.question}
                  </DialogTitle>
                  {currentQuestion.description && (
                    <DialogDescription>
                      {currentQuestion.description}
                    </DialogDescription>
                  )}
                </DialogHeader>

                <div className="mt-6 space-y-3">
                  {currentQuestion.answers.map((answer) => {
                    const isSelected = currentQuestion.multiSelect
                      ? ((answers[currentQuestion.id] as string[]) || []).includes(
                          answer.id
                        )
                      : answers[currentQuestion.id] === answer.id;

                    return (
                      <button
                        key={answer.id}
                        onClick={() => handleAnswer(answer.id)}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                          isSelected
                            ? "border-amber-500 bg-amber-50"
                            : "border-stone-200 hover:border-stone-300"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                              isSelected ? "bg-amber-500 text-white" : "bg-stone-100"
                            }`}
                          >
                            <answer.icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium text-stone-800">{answer.label}</p>
                            <p className="text-sm text-stone-500">{answer.description}</p>
                          </div>
                          {isSelected && (
                            <Check className="h-5 w-5 text-amber-500 ml-auto shrink-0" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Navigation */}
                <div className="flex gap-3 mt-6">
                  {currentStep > 0 && (
                    <Button variant="outline" onClick={handleBack}>
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                  )}
                  {currentQuestion.multiSelect && (
                    <Button
                      className="ml-auto bg-amber-500 hover:bg-amber-600 text-black"
                      onClick={handleNext}
                      disabled={!isCurrentAnswered}
                    >
                      {currentStep === quizQuestions.length - 1 ? "See Results" : "Next"}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              {persona && (
                <div>
                  {/* Persona Header */}
                  <div className={`${persona.color} p-8 text-center text-white`}>
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <persona.icon className="h-10 w-10" />
                    </div>
                    <p className="text-sm font-medium opacity-80 mb-1">You are</p>
                    <h2 className="text-3xl font-serif font-bold mb-2">
                      {persona.title}
                    </h2>
                    <p className="text-lg opacity-90">{persona.tagline}</p>
                  </div>

                  <div className="p-6">
                    <p className="text-stone-600 mb-6">{persona.description}</p>

                    {/* Recommendations */}
                    <div className="space-y-2 mb-6">
                      <h4 className="text-sm font-semibold text-stone-500 uppercase tracking-wide">
                        Recommended for you
                      </h4>
                      {persona.recommendations.map((rec) => (
                        <Link key={rec.href} href={rec.href}>
                          <button
                            onClick={resetAndClose}
                            className="w-full p-3 text-left rounded-lg bg-stone-50 hover:bg-stone-100 transition-colors flex items-center justify-between"
                          >
                            <span className="font-medium text-stone-800">
                              {rec.label}
                            </span>
                            <ChevronRight className="h-4 w-4 text-stone-400" />
                          </button>
                        </Link>
                      ))}
                    </div>

                    {/* Email Capture */}
                    <div className="border-t pt-6">
                      <p className="text-sm text-stone-600 mb-3">
                        Get personalized updates based on your interests?
                      </p>
                      <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                        <Input
                          type="text"
                          placeholder="Your name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="min-w-0"
                        />
                        <Input
                          type="email"
                          placeholder="Your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="min-w-0"
                        />
                        <Button
                          onClick={handleEmailSubmit}
                          disabled={!name.trim() || !email.trim() || isSubmitting}
                          className="bg-amber-500 hover:bg-amber-600 text-black"
                        >
                          {isSubmitting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Join"
                          )}
                        </Button>
                      </div>
                      <button
                        onClick={skipEmail}
                        className="text-sm text-stone-400 hover:text-stone-600 mt-3"
                      >
                        Skip for now
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

export { personaResults };
