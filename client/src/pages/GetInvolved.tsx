import { useState, FormEvent } from "react";
import { communitySubmit } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  Palette,
  Building2,
  Lightbulb,
  Store,
  BookOpen,
  Hammer,
  ArrowRight,
  Loader2,
  CheckCircle2,
} from "lucide-react";

type FormType = "residency" | "idea" | "business-interest" | "workshop-suggestion" | "story-feature";

interface FormConfig {
  id: FormType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  tagline: string;
  fields: FieldDef[];
}

interface FieldDef {
  name: string;
  label: string;
  type: "text" | "email" | "textarea" | "select" | "number";
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

const FORMS: FormConfig[] = [
  {
    id: "residency",
    label: "Residencies",
    icon: Palette,
    tagline: "Come create. Artist, enterprise, or workshop — find your place here.",
    fields: [
      { name: "name", label: "Your name", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "phone", label: "Phone", type: "text" },
      { name: "location", label: "Where are you based?", type: "text" },
      {
        name: "residencyType",
        label: "Type of residency",
        type: "select",
        required: true,
        options: [
          { value: "artist", label: "Artist in Residence" },
          { value: "enterprise", label: "Enterprise in Residence" },
          { value: "workshop-leader", label: "Workshop Leader" },
          { value: "storyteller", label: "Storyteller / Writer" },
          { value: "other", label: "Something else" },
        ],
      },
      { name: "title", label: "What would you work on?", type: "text", required: true, placeholder: "Project or idea name" },
      { name: "description", label: "Tell us more", type: "textarea", required: true, placeholder: "What draws you here? What would you create, build, or share?" },
      { name: "portfolioUrl", label: "Portfolio or website", type: "text", placeholder: "https://..." },
      { name: "durationWeeks", label: "Ideal duration (weeks)", type: "number" },
      { name: "preferredDates", label: "Preferred timing", type: "text", placeholder: "e.g. March 2026, flexible, etc." },
    ],
  },
  {
    id: "idea",
    label: "Share an Idea",
    icon: Lightbulb,
    tagline: "Every good thing starts with someone saying 'what if we...'",
    fields: [
      { name: "name", label: "Your name", type: "text" },
      { name: "email", label: "Email", type: "email", required: true },
      {
        name: "ideaType",
        label: "What kind of idea?",
        type: "select",
        required: true,
        options: [
          { value: "event", label: "Event idea" },
          { value: "workshop", label: "Workshop idea" },
          { value: "enterprise", label: "Enterprise / business idea" },
          { value: "collaboration", label: "Collaboration" },
          { value: "general", label: "General suggestion" },
          { value: "other", label: "Other" },
        ],
      },
      { name: "title", label: "Idea in a sentence", type: "text", required: true },
      { name: "description", label: "Tell us more", type: "textarea", required: true, placeholder: "What's the idea? Who's it for? How could it work?" },
    ],
  },
  {
    id: "business-interest",
    label: "Local Businesses",
    icon: Store,
    tagline: "Run a local business? Let's find ways to work together.",
    fields: [
      { name: "name", label: "Your name", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "phone", label: "Phone", type: "text" },
      { name: "businessName", label: "Business name", type: "text", required: true },
      {
        name: "interestType",
        label: "What are you interested in?",
        type: "select",
        required: true,
        options: [
          { value: "info-session", label: "Attending an info session" },
          { value: "expression-of-interest", label: "Expression of interest" },
          { value: "partnership", label: "Partnership opportunity" },
          { value: "stall-booking", label: "Market stall / pop-up booking" },
          { value: "other", label: "Something else" },
        ],
      },
      { name: "message", label: "Anything else?", type: "textarea", placeholder: "Tell us about your business and what you're looking for" },
    ],
  },
  {
    id: "workshop-suggestion",
    label: "Suggest a Workshop",
    icon: Hammer,
    tagline: "Know something worth teaching? We'll help you share it.",
    fields: [
      { name: "name", label: "Your name", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "title", label: "Workshop title or topic", type: "text", required: true },
      { name: "description", label: "What would people learn?", type: "textarea", required: true, placeholder: "Describe the workshop — who it's for, what they'd take away" },
    ],
  },
  {
    id: "story-feature",
    label: "Be Featured",
    icon: BookOpen,
    tagline: "Everyone has a story. Share yours with the community.",
    fields: [
      { name: "name", label: "Your name", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "title", label: "What's your story about?", type: "text", required: true, placeholder: "A sentence or two" },
      { name: "description", label: "Tell us more", type: "textarea", required: true, placeholder: "What would you like to share? Your connection to Witta, your craft, your journey?" },
      { name: "portfolioUrl", label: "Website or social link", type: "text", placeholder: "https://..." },
    ],
  },
];

export default function GetInvolved() {
  const [activeForm, setActiveForm] = useState<FormType>("residency");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const config = FORMS.find((f) => f.id === activeForm)!;

  function updateField(name: string, value: string) {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (status === "error") setStatus("idle");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const result = await communitySubmit({ type: activeForm, ...formData });
      if (result.success) {
        setStatus("success");
      } else {
        setErrorMsg(result.error || "Something went wrong.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Could not connect. Please try again.");
      setStatus("error");
    }
  }

  function resetForm() {
    setFormData({});
    setStatus("idle");
    setErrorMsg("");
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-stone-900 pt-28 pb-16 px-4">
        <div className="container max-w-3xl text-center">
          <h1 className="font-serif text-3xl sm:text-4xl text-amber-400 mb-4">Get Involved</h1>
          <p className="text-stone-400 text-lg leading-relaxed max-w-xl mx-auto">
            The Harvest is built by the people who show up. There's no single way in — just start where you are.
          </p>
        </div>
      </section>

      {/* Form selector tabs */}
      <section className="bg-stone-800 border-b border-stone-700">
        <div className="container">
          <div className="flex overflow-x-auto gap-1 py-3 -mx-4 px-4 sm:mx-0 sm:px-0 sm:justify-center">
            {FORMS.map((form) => {
              const Icon = form.icon;
              const isActive = activeForm === form.id;
              return (
                <button
                  key={form.id}
                  onClick={() => { setActiveForm(form.id); resetForm(); }}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                    isActive
                      ? "bg-amber-500 text-black"
                      : "text-stone-400 hover:text-stone-200 hover:bg-stone-700"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {form.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Form area */}
      <section className="bg-stone-50 py-12 px-4">
        <div className="container max-w-2xl">
          {status === "success" ? (
            <div className="text-center py-16 space-y-4">
              <CheckCircle2 className="h-12 w-12 text-amber-500 mx-auto" />
              <h2 className="font-serif text-2xl text-stone-800">Thanks for reaching out</h2>
              <p className="text-stone-600">We've got your submission and we'll be in touch. In the meantime, keep an eye on your inbox.</p>
              <button
                onClick={resetForm}
                className="mt-4 px-6 py-2 rounded-lg bg-stone-800 text-stone-200 text-sm font-medium hover:bg-stone-700 transition-colors"
              >
                Submit another
              </button>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="font-serif text-2xl text-stone-800 mb-2">{config.label}</h2>
                <p className="text-stone-500">{config.tagline}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {config.fields.map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-0.5">*</span>}
                    </label>
                    {field.type === "textarea" ? (
                      <textarea
                        required={field.required}
                        placeholder={field.placeholder}
                        value={formData[field.name] || ""}
                        onChange={(e) => updateField(field.name, e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-800 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-y"
                      />
                    ) : field.type === "select" ? (
                      <select
                        required={field.required}
                        value={formData[field.name] || ""}
                        onChange={(e) => updateField(field.name, e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      >
                        <option value="">Select...</option>
                        {field.options?.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        required={field.required}
                        placeholder={field.placeholder}
                        value={formData[field.name] || ""}
                        onChange={(e) => updateField(field.name, e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-800 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    )}
                  </div>
                ))}

                {status === "error" && (
                  <p className="text-red-600 text-sm">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg bg-amber-500 text-black font-medium text-sm hover:bg-amber-400 transition-colors disabled:opacity-60"
                >
                  {status === "loading" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                  Submit
                </button>
              </form>
            </>
          )}
        </div>
      </section>

      {/* Movement section */}
      <section className="bg-stone-900 py-16 px-4">
        <div className="container max-w-2xl text-center space-y-6">
          <h3 className="font-serif text-2xl text-amber-400">Building for people who want to belong</h3>
          <p className="text-stone-400 leading-relaxed">
            The Harvest draws on the spirit of the Bauhaus — where artists, makers, thinkers and builders
            lived and worked side by side. Not a retreat from the world, but a workshop for it.
            From anywhere in Australia or the world, if you have something to create, teach, or grow —
            there's a place for you here.
          </p>
          <p className="text-stone-500 text-sm">
            Listen. Be curious. Take action. Make art.
          </p>
        </div>
      </section>
    </div>
  );
}
