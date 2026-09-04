import { Link } from "wouter";
import { EditableText } from "@/components/EditableText";

/**
 * Shared visit-basics strip: answers "can I just turn up, and when?" on every
 * page that carries it. Copy lives in page="visit-strip" slots, so one admin
 * edit updates every page at once. Keep claims inside the comms map: the
 * Friday and Saturday pizza rhythm, no booking needed, dates land with members first,
 * membership is free. No prices, no fixed opening hours beyond the rhythm.
 */
export function VisitStrip() {
  return (
    <section className="border-y border-amber-200 bg-amber-50 py-10">
      <div className="mx-auto max-w-4xl px-5 md:px-8">
        <p className="mb-2 text-sm font-medium uppercase tracking-wide text-amber-700">
          Visiting
        </p>
        <EditableText
          page="visit-strip"
          slot="title"
          defaultContent="DIY pizza on Friday and Saturday"
          as="h2"
          className="mb-2 font-serif text-2xl font-bold text-stone-800 md:text-3xl"
        />
        <EditableText
          page="visit-strip"
          slot="detail"
          defaultContent="Friday 3pm to 8pm, pizza and a community movie night. Saturday 12pm to 8pm. Turn up, no booking needed. Weeks can vary, and dates land with members first."
          as="p"
          className="mb-6 max-w-2xl text-stone-600"
          multiline
        />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <a
            href="/whats-on#pizza-rsvp"
            className="inline-flex items-center justify-center rounded-md bg-amber-500 px-6 py-3 font-semibold text-black transition-colors hover:bg-amber-600"
          >
            See dates and RSVP
          </a>
          <p className="text-sm text-stone-500">
            No booking needed. Membership is free.{" "}
            <Link
              href="/membership"
              className="text-amber-700 underline underline-offset-4 hover:text-amber-800"
            >
              Become a member
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
