import { useEffect, useState, FormEvent } from "react";
import { VisitStrip } from "@/components/VisitStrip";
import { communitySubmit } from "@/lib/api";
import { currentAttribution } from "@/lib/tracking";
import { cn } from "@/lib/utils";
import { setPageSeo } from "@/lib/seo";
import { SiteFooter, SiteNav } from "./HarvestReviewTest";
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

type FormType = "volunteer" | "residency" | "idea" | "business-interest" | "workshop-suggestion" | "story-feature";

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
    id: "volunteer",
    label: "Lend a Hand",
    icon: Hammer,
    tagline: "Garden jobs, work days and practical help. Start with what you can do.",
    fields: [
      { name: "name", label: "Your name", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "phone", label: "Phone", type: "text" },
      {
        name: "helpType",
        label: "Where could you help?",
        type: "select",
        required: true,
        options: [
          { value: "garden", label: "Garden and growing" },
          { value: "making", label: "Building, repair or making" },
          { value: "events", label: "Events and shared meals" },
          { value: "shop", label: "Shop and local goods" },
          { value: "stories", label: "Photos, stories or communications" },
          { value: "anything-useful", label: "Whatever is useful" },
        ],
      },
      { name: "availability", label: "When are you usually available?", type: "text", placeholder: "Weekends, weekdays, occasionally" },
      { name: "message", label: "Anything we should know?", type: "textarea", placeholder: "Skills, tools, accessibility needs, or the kind of job you enjoy" },
    ],
  },
  {
    id: "residency",
    label: "Residencies",
    icon: Palette,
    tagline: "Come create. Artist, enterprise, or workshop leader: find your place here.",
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
      { name: "preferredDates", label: "Preferred timing", type: "text", placeholder: "e.g. spring, later this year, flexible" },
    ],
  },
  {
    id: "idea",
    label: "Share an Idea",
    icon: Lightbulb,
    tagline: "Every good thing starts with someone saying 'what if we...'",
    fields: [
      { name: "name", label: "Your name", type: "text", required: true },
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
    tagline: "Make, grow or run something local? The first shelves are being shaped with local makers and growers. An expression of interest starts a real conversation.",
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
          { value: "shop-shelf", label: "Selling on the shop shelves" },
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
      { name: "description", label: "What would people learn?", type: "textarea", required: true, placeholder: "Describe the workshop: who it's for, what they'd take away" },
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
      { name: "description", label: "Tell us more", type: "textarea", required: true, placeholder: "What would you like to share? Your connection to Witta, your craft, how you got here?" },
      { name: "portfolioUrl", label: "Website or social link", type: "text", placeholder: "https://..." },
    ],
  },
];

function getFieldAutoComplete(fieldName: string) {
  switch (fieldName) {
    case "name":
      return "name";
    case "email":
      return "email";
    case "phone":
      return "tel";
    case "location":
      return "address-level2";
    case "businessName":
      return "organization";
    default:
      return "off";
  }
}

export default function GetInvolved() {
  // Default to the first option rather than an empty chooser: landing on a
  // placeholder asking you to pick makes the page look like it has nothing on
  // it. A ?form= param still wins, so deep links keep working.
  const [activeForm, setActiveForm] = useState<FormType | null>(() => {
    const fallback = FORMS[0]?.id ?? null;
    if (typeof window === "undefined") return fallback;
    const param = new URLSearchParams(window.location.search).get("form");
    return FORMS.some((f) => f.id === param) ? (param as FormType) : fallback;
  });
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const config = activeForm ? FORMS.find((f) => f.id === activeForm) : null;

  useEffect(() => {
    setPageSeo({
      title: "Get Involved · The Harvest Witta",
      description:
        "Start where you are: work days, workshops, residencies, local business ideas and stories at The Harvest in Witta.",
      path: "/get-involved",
    });
  }, []);

  function updateField(name: string, value: string) {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (status === "error") setStatus("idle");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!activeForm) return;
    setStatus("loading");
    try {
      const result = await communitySubmit({ type: activeForm, ...formData, ...currentAttribution() });
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
      <SiteNav />
      {/* Hero */}
      <section className="bg-stone-900 pt-36 pb-16 px-4">
        <div className="container max-w-3xl text-center">
          <h1 className="font-serif text-3xl sm:text-4xl text-amber-400 mb-4">Get Involved</h1>
          <p className="text-stone-400 text-lg leading-relaxed max-w-xl mx-auto">
            The Harvest is built by the people who show up. There's no single way in, so start where you are.
          </p>
          <p className="text-stone-400 leading-relaxed max-w-xl mx-auto mt-4">
            The place is properly under way. The simplest ways in are the garden's regular
            work days and{" "}
            <a href="/membership" className="text-amber-400 underline hover:text-amber-300">
              free membership
            </a>
            . Check the{" "}
            <a href="/whats-on" className="text-amber-400 underline hover:text-amber-300">
              What's On page
            </a>{" "}
            for the current rhythm. No experience is needed.
          </p>
        </div>
      </section>

      {/* Form selector tabs */}
      <section className="bg-stone-800 border-b border-stone-700">
        <div className="container">
          <div
            role="group"
            aria-label="Choose a way to get involved"
            className="flex overflow-x-auto gap-1 py-3 -mx-4 px-4 sm:mx-0 sm:px-0 sm:justify-center"
          >
            {FORMS.map((form) => {
              const Icon = form.icon;
              const isActive = activeForm === form.id;
              return (
                <button
                  key={form.id}
                  id={`get-involved-form-${form.id}`}
                  name="formType"
                  value={form.id}
                  type="button"
                  aria-pressed={isActive}
                  aria-controls="get-involved-form-panel"
                  onClick={() => { setActiveForm(form.id); resetForm(); }}
                  className={cn(
                    "flex shrink-0 items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
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
      <section id="get-involved-form-panel" className="bg-stone-50 py-12 px-4">
        <div className="container max-w-2xl">
          {!config ? (
            <div className="py-12 text-center">
              <h2 className="font-serif text-2xl text-stone-800">Choose a way to get involved</h2>
              <p className="mx-auto mt-3 max-w-lg text-stone-600">
                Pick an option above and we will show only the questions needed for that enquiry.
              </p>
            </div>
          ) : status === "success" ? (
            <div className="text-center py-16 space-y-4">
              <CheckCircle2 className="h-12 w-12 text-amber-500 mx-auto" />
              <h2 className="font-serif text-2xl text-stone-800">Thanks for reaching out</h2>
              <p className="text-stone-600">We've got your submission and we'll be in touch. In the meantime, keep an eye on your inbox.</p>
              <button
                type="button"
                onClick={resetForm}
                className="mt-4 px-6 py-2 rounded-lg bg-stone-800 text-stone-200 text-sm font-medium hover:bg-stone-700 transition-colors"
              >
                Submit another
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-8">
                <h2 className="font-serif text-2xl text-stone-800 mb-2">{config.label}</h2>
                <p className="text-stone-500">{config.tagline}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {config.fields.map((field) => (
                  <div key={field.name}>
                    <label
                      htmlFor={`get-involved-${activeForm}-${field.name}`}
                      className="block text-sm font-medium text-stone-700 mb-1"
                    >
                      {field.label}
                      {field.required && <span aria-hidden="true" className="text-red-500 ml-0.5">*</span>}
                    </label>
                    {field.type === "textarea" ? (
                      <textarea
                        id={`get-involved-${activeForm}-${field.name}`}
                        name={field.name}
                        autoComplete={getFieldAutoComplete(field.name)}
                        required={field.required}
                        placeholder={field.placeholder}
                        value={formData[field.name] || ""}
                        onChange={(e) => updateField(field.name, e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-800 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-y"
                      />
                    ) : field.type === "select" ? (
                      <select
                        id={`get-involved-${activeForm}-${field.name}`}
                        name={field.name}
                        autoComplete={getFieldAutoComplete(field.name)}
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
                        id={`get-involved-${activeForm}-${field.name}`}
                        name={field.name}
                        type={field.name === "phone" ? "tel" : field.type}
                        autoComplete={getFieldAutoComplete(field.name)}
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
                  <p role="alert" className="text-red-600 text-sm">{errorMsg}</p>
                )}

                <p className="text-xs text-stone-500">
                  Used only to follow up about this. See our{" "}
                  <a href="/privacy" className="underline hover:text-stone-700">
                    privacy page
                  </a>{" "}
                  for details.
                </p>

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
            </div>
          )}
        </div>
      </section>

      {/* Movement section */}
      <section className="bg-stone-900 py-16 px-4">
        <div className="container max-w-2xl text-center space-y-6">
          <h3 className="font-serif text-2xl text-amber-400">Building for people who want to belong</h3>
          <p className="text-stone-400 leading-relaxed">
            The Harvest is a community garden and creative gathering place in Witta, on
            Jinibara Country. If you have something to create, teach or grow, there's a
            place for you here.
          </p>
          <p className="text-stone-500 text-sm">
            Listen. Be curious. Take action. Make art.
          </p>
        </div>
      </section>
      <VisitStrip />
      <SiteFooter />
    </div>
  );
}
