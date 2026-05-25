import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

const shopOfferOptions = [
  { value: "produce", label: "Produce from the garden, farm, or kitchen" },
  { value: "made-goods", label: "Something made by hand" },
  { value: "food", label: "Food, preserves, ferments, baking, or drinks" },
  { value: "consignment", label: "Shared shelf or consignment idea" },
  { value: "help-shape", label: "I want to help shape the shop" },
] as const;

interface ShopInterestSectionProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  body?: string;
}

export function ShopInterestSection({
  id = "shop-interest",
  eyebrow = "Shop interest",
  title = "Put something real on the first shelf.",
  body = "The Shop starts small: produce, made goods, food, useful objects, and people who want to help test the shape before it becomes too polished.",
}: ShopInterestSectionProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [offerType, setOfferType] = useState<(typeof shopOfferOptions)[number]["value"]>("produce");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [readiness, setReadiness] = useState("");

  const mutation = trpc.shopInterest.submit.useMutation({
    onSuccess: () => {
      toast.success("Shop interest saved.");
      setName("");
      setEmail("");
      setPhone("");
      setOfferType("produce");
      setDescription("");
      setLocation("");
      setReadiness("");
    },
    onError: (error) => {
      toast.error("Could not save shop interest", {
        description: error.message || "Please try again.",
      });
    },
  });

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    mutation.mutate({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      offerType,
      description: description.trim(),
      location: location.trim(),
      readiness: readiness.trim(),
    });
  };

  return (
    <section id={id} className="scroll-mt-28 border-y border-stone-200 bg-[#FFFDF7] py-20 md:py-28">
      <div className="container">
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[0.85fr_1fr] md:items-start">
          <div>
            <p className="font-mono text-sm uppercase tracking-[0.2em] text-[#8B4A2A]">
              {eyebrow}
            </p>
            <h2 className="mt-3 text-4xl font-black leading-[0.98] text-[#1C1917] md:text-5xl">
              {title}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-stone-700">
              {body}
            </p>
          </div>

          <form onSubmit={submit} className="border border-stone-300 bg-[#F5F0E8] p-5 md:p-7">
            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500">
                    Name
                  </span>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                    maxLength={120}
                    className="h-12 w-full rounded-none border border-stone-300 bg-white px-3 text-stone-900"
                    placeholder="Your name"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500">
                    Email
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    className="h-12 w-full rounded-none border border-stone-300 bg-white px-3 text-stone-900"
                    placeholder="you@example.com"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500">
                    Phone, optional
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    maxLength={60}
                    className="h-12 w-full rounded-none border border-stone-300 bg-white px-3 text-stone-900"
                    placeholder="For a call or text back"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500">
                    Location
                  </span>
                  <input
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    required
                    maxLength={180}
                    className="h-12 w-full rounded-none border border-stone-300 bg-white px-3 text-stone-900"
                    placeholder="Witta, Maleny, Montville..."
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500">
                  What fits best?
                </span>
                <select
                  value={offerType}
                  onChange={(event) => setOfferType(event.target.value as typeof offerType)}
                  className="h-12 w-full rounded-none border border-stone-300 bg-white px-3 text-stone-900"
                >
                  {shopOfferOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500">
                  What could go on the shelf?
                </span>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  required
                  maxLength={2000}
                  className="min-h-32 w-full rounded-none border border-stone-300 bg-white px-3 py-3 text-stone-900"
                  placeholder="At least a sentence: what you grow, make, cook, stock, or want to help test."
                />
              </label>

              <label className="block">
                <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500">
                  Timing
                </span>
                <input
                  value={readiness}
                  onChange={(event) => setReadiness(event.target.value)}
                  required
                  maxLength={180}
                  className="h-12 w-full rounded-none border border-stone-300 bg-white px-3 text-stone-900"
                  placeholder="Tell us roughly when you could start."
                />
              </label>

              <button
                type="submit"
                disabled={mutation.isPending}
                className="mt-2 inline-flex h-12 items-center justify-center gap-2 bg-[#C4922A] px-5 font-semibold text-stone-950 transition hover:bg-[#E0AD43] disabled:opacity-60"
              >
                {mutation.isPending ? "Saving..." : "Express shop interest"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
