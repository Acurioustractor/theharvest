import { Link } from "wouter";

interface Project {
  name: string;
  href: string;
  tagline: string;
}

const projects: Project[] = [
  {
    name: "A Curious Tractor",
    href: "http://localhost:3000",
    tagline: "Regenerative innovation studio",
  },
  {
    name: "ACT Farm",
    href: "http://localhost:3001",
    tagline: "Regenerative tourism & residencies",
  },
  {
    name: "Empathy Ledger",
    href: "http://localhost:3003",
    tagline: "Storytelling & cultural wisdom",
  },
  {
    name: "JusticeHub",
    href: "http://localhost:3002",
    tagline: "Youth justice & community services",
  },
  {
    name: "Goods on Country",
    href: "https://goodsoncountry.netlify.app",
    tagline: "Funding the commons through goods",
  },
];

interface UnifiedFooterProps {
  currentProject?: string;
  showProjects?: boolean;
  customLinks?: Array<{ label: string; href: string }>;
  contactEmail?: string;
}

export default function UnifiedFooter({
  currentProject,
  showProjects = true,
  customLinks = [],
  contactEmail = "hi@act.place",
}: UnifiedFooterProps) {
  const filteredProjects = currentProject
    ? projects.filter((p) => p.name !== currentProject)
    : projects;

  return (
    <footer className="border-t border-stone-200 bg-stone-50 py-12">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Column 1: About */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold uppercase tracking-wider text-stone-800">
              A Curious Tractor
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              A regenerative innovation studio stewarding a working farm on
              Jinibara Country. We cultivate seeds of impact through listening,
              curiosity, action, and art.
            </p>

            {/* Custom Links */}
            {customLinks.length > 0 && (
              <nav className="space-y-2 pt-4">
                {customLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                  >
                    <span className="block text-sm text-stone-600 transition hover:text-stone-900">
                      {link.label}
                    </span>
                  </Link>
                ))}
              </nav>
            )}
          </div>

          {/* Column 2: ACT Ecosystem */}
          {showProjects && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-800">
                ACT Ecosystem
              </h3>
              <nav className="space-y-3">
                {filteredProjects.map((project) => (
                  <a
                    key={project.name}
                    href={project.href}
                    className="group block"
                  >
                    <div className="text-sm font-medium text-stone-800 transition group-hover:text-amber-600">
                      {project.name}
                    </div>
                    <div className="text-xs text-stone-500">
                      {project.tagline}
                    </div>
                  </a>
                ))}
              </nav>
            </div>
          )}

          {/* Column 3: Connect */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-800">
              Connect
            </h3>

            <div className="space-y-3">
              <a
                href={`mailto:${contactEmail}`}
                className="block text-sm text-stone-600 transition hover:text-stone-900"
              >
                {contactEmail}
              </a>

              <div className="pt-4">
                <h4 className="mb-2 text-sm font-medium text-stone-800">
                  Stay Connected
                </h4>
                <p className="mb-3 text-xs text-stone-500">
                  Get updates about our ecosystem
                </p>
                <form className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-1 rounded border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:border-amber-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded bg-amber-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-amber-600"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 flex flex-col gap-4 border-t border-stone-200 pt-8 text-xs text-stone-500 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p>
              We acknowledge the Jinibara people as the Traditional Custodians
              of the land on which we work and live. We pay our respects to
              Elders past and present, and extend that respect to all Aboriginal
              and Torres Strait Islander peoples.
            </p>
          </div>

          <div className="flex gap-4">
            <span>© {new Date().getFullYear()} A Curious Tractor</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
