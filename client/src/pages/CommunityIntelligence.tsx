import { motion } from "framer-motion";
import { Link } from "wouter";
import { useState, useEffect, useRef, useCallback, type CSSProperties } from "react";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, PieChart, Pie, Cell,
} from "recharts";
import BauhausFooter from "@/components/BauhausFooter";
import { trpc } from "@/lib/trpc";

/* ─────────────────────────────────────
   DESIGN TOKENS
   ───────────────────────────────────── */

const COLORS = {
  bg1: "#0C0A09",
  bg2: "#1C1917",
  gold: "rgba(217,169,78,1)",
  goldDim: "rgba(217,169,78,0.3)",
  blue: "#005EB8",
  green: "#3A6E47",
  red: "#D62C2C",
  yellow: "#F2C900",
  cream: "#F4F4F2",
  creamDim: "rgba(245,240,232,0.5)",
  creamFaint: "rgba(245,240,232,0.15)",
};

const CHART_COLORS = [COLORS.gold, COLORS.blue, COLORS.green, COLORS.red, COLORS.yellow, "#8B5CF6", "#EC4899", "#14B8A6"];

/* ─────────────────────────────────────
   HOOKS
   ───────────────────────────────────── */

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);
  return matches;
}

function useResearchData<T = any>(filename: string, lazy = false) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchedRef = useRef(false);

  const doFetch = useCallback(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    setLoading(true);
    fetch(`/research/data/${filename}`)
      .then(r => { if (!r.ok) throw new Error(`${r.status}`); return r.json(); })
      .then(d => { setData(d); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, [filename]);

  // Eager: fetch on mount
  useEffect(() => {
    if (!lazy) doFetch();
  }, [lazy, doFetch]);

  return { data, loading, error, load: doFetch };
}

function useInView(rootMargin = "-100px") {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { rootMargin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [rootMargin]);
  return { ref, inView };
}

/* ─────────────────────────────────────
   SHARED COMPONENTS
   ───────────────────────────────────── */

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, inView } = useInView();
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}>
      {children}
    </motion.div>
  );
}

function LazySection({ children, onVisible }: { children: React.ReactNode; onVisible?: () => void }) {
  const { ref, inView } = useInView("-200px");
  const called = useRef(false);
  useEffect(() => {
    if (inView && !called.current && onVisible) { called.current = true; onVisible(); }
  }, [inView, onVisible]);
  return <div ref={ref}>{inView ? children : <div style={{ minHeight: 400 }} />}</div>;
}

function SectionHeader({ number, title, subtitle, dark = true }: {
  number: string; title: string; subtitle?: string; dark?: boolean;
}) {
  return (
    <FadeIn>
      <div style={{ marginBottom: 48 }}>
        <p style={{
          fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 13,
          letterSpacing: "0.2em", color: COLORS.gold, marginBottom: 12,
        }}>{number}</p>
        <h2 style={{
          fontFamily: "'Playfair Display', serif", fontSize: 42, fontWeight: 700,
          color: COLORS.cream, lineHeight: 1.15, margin: "0 0 16px",
        }}>{title}</h2>
        {subtitle && (
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: 17, color: COLORS.creamDim,
            lineHeight: 1.6, maxWidth: 600,
          }}>{subtitle}</p>
        )}
      </div>
    </FadeIn>
  );
}

function StatCard({ label, value, sub, delay = 0 }: {
  label: string; value: string; sub?: string; delay?: number;
}) {
  return (
    <FadeIn delay={delay}>
      <div style={{
        background: "rgba(245,240,232,0.04)", border: `1px solid ${COLORS.creamFaint}`,
        borderRadius: 12, padding: "28px 24px", textAlign: "center", minWidth: 140,
      }}>
        <p style={{
          fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700,
          color: COLORS.gold, margin: "0 0 8px",
        }}>{value}</p>
        <p style={{
          fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 11,
          letterSpacing: "0.12em", color: COLORS.cream, margin: "0 0 4px",
        }}>{label}</p>
        {sub && (
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: 12,
            color: COLORS.creamDim, margin: 0,
          }}>{sub}</p>
        )}
      </div>
    </FadeIn>
  );
}

function ChartCard({ title, children, style }: {
  title?: string; children: React.ReactNode; style?: CSSProperties;
}) {
  return (
    <FadeIn>
      <div style={{
        background: "rgba(245,240,232,0.03)", border: `1px solid ${COLORS.creamFaint}`,
        borderRadius: 12, padding: 24, ...style,
      }}>
        {title && (
          <p style={{
            fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 12,
            letterSpacing: "0.1em", color: COLORS.creamDim, marginBottom: 20, margin: "0 0 20px",
          }}>{title}</p>
        )}
        {children}
      </div>
    </FadeIn>
  );
}

function Section({ dark = true, children, style }: {
  dark?: boolean; children: React.ReactNode; style?: CSSProperties;
}) {
  return (
    <section style={{
      backgroundColor: dark ? COLORS.bg1 : COLORS.bg2,
      padding: "100px 24px", ...style,
    }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>{children}</div>
    </section>
  );
}

/* ─────────────────────────────────────
   CENSUS DATA PARSERS
   ───────────────────────────────────── */

function parseAgeGroups(ageStructure: Record<string, number>) {
  const groups: { name: string; value: number }[] = [];
  const ageRanges = ["0-4", "5-14", "15-19", "20-24", "25-34", "35-44", "45-54", "55-64", "65-74", "75-84", "85"];
  for (const range of ageRanges) {
    const key = Object.keys(ageStructure).find(k =>
      k.startsWith("Persons") && k.includes(`Age groups: ${range}`)
    );
    if (key) {
      const label = range === "85" ? "85+" : range;
      groups.push({ name: label, value: ageStructure[key] });
    }
  }
  return groups;
}

function parseOccupations(occupation: Record<string, number>) {
  const occupationTypes = [
    "Professionals", "Managers", "Technicians and Trades Workers",
    "Community and Personal Service Workers", "Clerical and Administrative Workers",
    "Sales Workers", "Labourers", "Machinery Operators and Drivers",
  ];
  return occupationTypes
    .map(type => {
      const key = Object.keys(occupation).find(k =>
        k.startsWith("Persons") && k.includes(`Total | ${type}`)
      );
      return key ? { name: type.replace(" Workers", "").replace(" and ", " & "), value: occupation[key] } : null;
    })
    .filter((x): x is { name: string; value: number } => x !== null && x.value > 0)
    .sort((a, b) => b.value - a.value);
}

function parseEducation(ageStructure: Record<string, number>) {
  const levels = [
    { match: "Year 12 or equivalent", label: "Year 12" },
    { match: "Year 10 or equivalent", label: "Year 10" },
    { match: "Year 11 or equivalent", label: "Year 11" },
    { match: "Year 9 or equivalent", label: "Year 9" },
    { match: "Year 8 or below", label: "Year 8 or below" },
  ];
  return levels
    .map(({ match, label }) => {
      const key = Object.keys(ageStructure).find(k =>
        k.startsWith("Persons") && k.includes(`Highest year of school completed: ${match}`)
      );
      return key ? { name: label, value: ageStructure[key] } : null;
    })
    .filter((x): x is { name: string; value: number } => x !== null && x.value > 0);
}

function parseFieldsOfStudy(occupation: Record<string, number>) {
  const fields = [
    "Health", "Society and Culture", "Education", "Management and Commerce",
    "Engineering and Related Technologies", "Agriculture, Environmental and Related Studies",
    "Food, Hospitality and Personal Services", "Natural and Physical Sciences",
    "Creative Arts", "Information Technology", "Architecture and Building",
  ];
  return fields
    .map(field => {
      const key = Object.keys(occupation).find(k =>
        k.startsWith("Persons") && k.includes(`${field} | Total`)
      );
      return key ? { name: field.split(",")[0].split(" and ")[0], value: occupation[key] } : null;
    })
    .filter((x): x is { name: string; value: number } => x !== null && x.value > 0)
    .sort((a, b) => b.value - a.value);
}

/* ─────────────────────────────────────
   RECHARTS TOOLTIP
   ───────────────────────────────────── */

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: COLORS.bg1, border: `1px solid ${COLORS.creamFaint}`,
      borderRadius: 8, padding: "8px 12px",
    }}>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: COLORS.cream, margin: 0 }}>
        {label}: <strong style={{ color: COLORS.gold }}>{payload[0].value?.toLocaleString()}</strong>
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════
   COMMUNITY VOICE SECTION (Pulse Survey Data)
   ═══════════════════════════════════════ */

function CommunityVoiceSection({ isMobile }: { isMobile: boolean }) {
  const pulseResults = trpc.pulse.results.useQuery(undefined, {
    retry: false,
    // Only fetch if authed (admin) — will silently fail for non-admins
  });

  const responses = pulseResults.data || [];
  if (responses.length === 0) return null;

  // Aggregate: what would people use (demand signals)
  const usageCounts: Record<string, number> = {};
  const barrierCounts: Record<string, number> = {};
  const valueCounts: Record<string, number> = {};
  const frequencyCounts: Record<string, number> = {};
  const timeCounts: Record<string, number> = {};
  const yearsCounts: Record<string, number> = {};
  const heardCounts: Record<string, number> = {};
  const openTexts: string[] = [];
  const skills: string[] = [];

  for (const r of responses) {
    if (r.wouldUse) for (const u of r.wouldUse) usageCounts[u] = (usageCounts[u] || 0) + 1;
    if (r.participationBarriers) for (const b of r.participationBarriers) barrierCounts[b] = (barrierCounts[b] || 0) + 1;
    if (r.communityValues) for (const v of r.communityValues) valueCounts[v] = (valueCounts[v] || 0) + 1;
    if (r.preferredTime) for (const t of r.preferredTime) timeCounts[t] = (timeCounts[t] || 0) + 1;
    if (r.visitFrequency) frequencyCounts[r.visitFrequency] = (frequencyCounts[r.visitFrequency] || 0) + 1;
    if (r.yearsInArea) yearsCounts[r.yearsInArea] = (yearsCounts[r.yearsInArea] || 0) + 1;
    if (r.heardOfHarvest) heardCounts[r.heardOfHarvest] = (heardCounts[r.heardOfHarvest] || 0) + 1;
    if (r.whatsMissing) openTexts.push(r.whatsMissing);
    if (r.skillsToShare) skills.push(r.skillsToShare);
  }

  const toChartData = (counts: Record<string, number>) =>
    Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

  const demandData = toChartData(usageCounts);
  const barrierData = toChartData(barrierCounts);
  const valueData = toChartData(valueCounts);

  return (
    <>
      {/* Demand Signals */}
      <Section dark={false}>
        <SectionHeader
          number="★"
          title="Community Voice"
          subtitle={`${responses.length} pulse survey responses — what people want, what stops them, and what they'd show up for.`}
        />

        {demandData.length > 0 && (
          <ChartCard title="DEMAND SIGNALS — WHAT WOULD PEOPLE USE?">
            <ResponsiveContainer width="100%" height={demandData.length * 40 + 20}>
              <BarChart data={demandData} layout="vertical"
                margin={{ top: 0, right: 10, bottom: 0, left: isMobile ? 100 : 150 }}>
                <CartesianGrid stroke={COLORS.creamFaint} strokeDasharray="3 3" />
                <XAxis type="number" stroke={COLORS.creamDim} fontSize={11} />
                <YAxis dataKey="name" type="category" stroke={COLORS.creamDim} fontSize={11}
                  width={isMobile ? 105 : 155} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill={COLORS.gold} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        <div style={{
          display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: 16, marginTop: 24,
        }}>
          {valueData.length > 0 && (
            <ChartCard title="WHAT PEOPLE VALUE">
              <ResponsiveContainer width="100%" height={valueData.length * 36 + 20}>
                <BarChart data={valueData} layout="vertical"
                  margin={{ top: 0, right: 10, bottom: 0, left: isMobile ? 80 : 120 }}>
                  <XAxis type="number" stroke={COLORS.creamDim} fontSize={11} />
                  <YAxis dataKey="name" type="category" stroke={COLORS.creamDim} fontSize={11}
                    width={isMobile ? 85 : 125} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill={COLORS.green} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          )}

          {barrierData.length > 0 && (
            <ChartCard title="PARTICIPATION BARRIERS">
              <ResponsiveContainer width="100%" height={barrierData.length * 36 + 20}>
                <BarChart data={barrierData} layout="vertical"
                  margin={{ top: 0, right: 10, bottom: 0, left: isMobile ? 80 : 120 }}>
                  <XAxis type="number" stroke={COLORS.creamDim} fontSize={11} />
                  <YAxis dataKey="name" type="category" stroke={COLORS.creamDim} fontSize={11}
                    width={isMobile ? 85 : 125} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill={COLORS.red} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          )}
        </div>

        {/* Open-text responses: What's Missing */}
        {openTexts.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <FadeIn>
              <p style={{
                fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 12,
                letterSpacing: "0.1em", color: COLORS.gold, marginBottom: 20,
              }}>WHAT PEOPLE WISH EXISTED</p>
            </FadeIn>
            <div style={{
              display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
              gap: 12,
            }}>
              {openTexts.slice(0, 8).map((text, i) => (
                <FadeIn key={i} delay={i * 0.05}>
                  <div style={{
                    background: "rgba(245,240,232,0.04)", border: `1px solid ${COLORS.creamFaint}`,
                    borderRadius: 12, padding: 20,
                  }}>
                    <p style={{
                      fontFamily: "'Playfair Display', serif", fontSize: 15, fontStyle: "italic",
                      color: COLORS.cream, lineHeight: 1.6, margin: 0,
                    }}>"{text}"</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        )}

        {/* Skills people would share */}
        {skills.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <FadeIn>
              <p style={{
                fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 12,
                letterSpacing: "0.1em", color: COLORS.gold, marginBottom: 20,
              }}>SKILLS PEOPLE WOULD SHARE</p>
            </FadeIn>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {skills.slice(0, 12).map((skill, i) => (
                <FadeIn key={i} delay={i * 0.03}>
                  <span style={{
                    display: "inline-block", padding: "8px 16px",
                    background: "rgba(245,240,232,0.06)", border: `1px solid ${COLORS.creamFaint}`,
                    borderRadius: 20, fontFamily: "'Inter', sans-serif", fontSize: 13,
                    color: COLORS.cream,
                  }}>{skill}</span>
                </FadeIn>
              ))}
            </div>
          </div>
        )}

        {/* Summary stats */}
        <div style={{
          display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
          gap: 16, marginTop: 32,
        }}>
          <StatCard label="RESPONSES" value={`${responses.length}`} sub="Pulse surveys" />
          <StatCard label="HEARD OF US" value={`${Math.round(((heardCounts["yes"] || 0) / responses.length) * 100)}%`} sub="Know The Harvest" />
          <StatCard label="TOP INTEREST" value={demandData[0]?.name || "—"} sub={`${demandData[0]?.value || 0} people`} />
          <StatCard label="TOP BARRIER" value={barrierData[0]?.name || "—"} sub={`${barrierData[0]?.value || 0} people`} />
        </div>
      </Section>
    </>
  );
}

/* ═══════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════ */

const ACCESS_KEY = "harvest-community-2026";

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === ACCESS_KEY) {
      sessionStorage.setItem("community-auth", "1");
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", backgroundColor: COLORS.bg1, display: "flex",
      alignItems: "center", justifyContent: "center", padding: 24,
    }}>
      <form onSubmit={handleSubmit} style={{ textAlign: "center", maxWidth: 360, width: "100%" }}>
        <p style={{
          fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 13,
          letterSpacing: "0.2em", color: COLORS.gold, marginBottom: 16,
        }}>COMMUNITY INTELLIGENCE</p>
        <p style={{
          fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700,
          color: COLORS.cream, marginBottom: 32,
        }}>This page is restricted</p>
        <input
          type="password"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Enter access key"
          autoFocus
          style={{
            width: "100%", padding: "14px 16px", fontSize: 16,
            fontFamily: "'Inter', sans-serif", background: "rgba(245,240,232,0.06)",
            border: `1px solid ${error ? COLORS.red : COLORS.creamFaint}`,
            borderRadius: 8, color: COLORS.cream, outline: "none",
            boxSizing: "border-box",
          }}
        />
        {error && (
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: 13,
            color: COLORS.red, marginTop: 8,
          }}>Incorrect access key</p>
        )}
        <button type="submit" style={{
          marginTop: 16, padding: "12px 32px", fontFamily: "'Montserrat', sans-serif",
          fontWeight: 900, fontSize: 13, letterSpacing: "0.12em",
          color: COLORS.bg1, background: COLORS.gold, border: "none",
          borderRadius: 8, cursor: "pointer",
        }}>ENTER</button>
      </form>
    </div>
  );
}

export default function CommunityIntelligence() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("community-auth") === "1");
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Eager loads
  const population = useResearchData<{
    records: { year: string; population: number }[];
  }>("qgso-population.json");
  const orgs = useResearchData<{
    totalOrganizations: number;
    byType: Record<string, { name: string; type: string; description: string; url?: string; location: string }[]>;
  }>("community-orgs.json");
  const events = useResearchData<{
    events: { name: string; type: string; schedule: string; location: string; description: string }[];
  }>("local-events.json");

  // Lazy loads
  const census = useResearchData<{
    ageStructure: Record<string, number>;
    income: Record<string, number>;
    occupation: Record<string, number>;
    ancestry: Record<string, number>;
  }>("abs-census.json", true);
  const reviews = useResearchData<{
    venues: { name: string; type: string; rating: number; totalReviews: number;
      sampleReviews: { text: string; rating: number; time: string }[];
      topPositiveThemes: string[]; topNegativeThemes: string[];
    }[];
  }>("google-reviews.json", true);
  const media = useResearchData<{
    articles: { title: string; source: string; date: string; themes: string[]; sentiment: string; url: string }[];
  }>("local-media.json", true);
  const species = useResearchData<{
    totalRecords: number;
    speciesGroups: { group: string; count: number }[];
  }>("ala-species.json", true);
  const facebook = useResearchData<{
    groups: { name: string; estimatedMembers: number; type: string; url: string; activityLevel: string; sentimentThemes: string[] }[];
  }>("facebook-groups.json", true);
  const consultations = useResearchData<{
    consultations: { title: string; url: string; status: string; description: string; category: string; themes: string[] }[];
  }>("council-consultations.json", true);
  const venues = useResearchData<{
    features: { latitude: number; longitude: number; attributes: { Name: string; Owner: string; Classification: string } }[];
  }>("scc-venues.json", true);
  const qldHeritage = useResearchData<{
    records: { name: string; address: string; locality: string; significance: string }[];
  }>("qld-heritage.json", true);

  // Derived data
  const popData = population.data?.records.map(r => ({
    year: r.year, population: r.population,
  })) || [];
  const latestPop = popData.length ? popData[popData.length - 1].population : 0;
  const earliestPop = popData.length ? popData[0].population : 1;
  const growthPct = earliestPop ? Math.round(((latestPop - earliestPop) / earliestPop) * 100) : 0;

  if (!authed) return <PasswordGate onUnlock={() => setAuthed(true)} />;

  return (
    <div style={{ backgroundColor: COLORS.bg1, color: COLORS.cream, minHeight: "100vh" }}>
      {/* ── HERO ── */}
      <section style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", textAlign: "center",
        padding: isMobile ? "60px 20px" : "80px 40px", position: "relative",
        background: `radial-gradient(ellipse at 50% 30%, rgba(217,169,78,0.08), transparent 70%), ${COLORS.bg1}`,
      }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}>
          <p style={{
            fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 13,
            letterSpacing: "0.2em", color: COLORS.gold, marginBottom: 24,
          }}>COMMUNITY INTELLIGENCE</p>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: isMobile ? 40 : 64, fontWeight: 700, color: COLORS.cream,
            lineHeight: 1.1, margin: "0 0 20px", maxWidth: 800,
          }}>Understanding<br />Our Community</h1>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: isMobile ? 16 : 18,
            color: COLORS.creamDim, maxWidth: 560, margin: "0 auto 48px", lineHeight: 1.6,
          }}>
            Data-driven insights for Witta, Maleny & the Sunshine Coast Hinterland.
            14 research datasets telling the story of place, people, and possibility.
          </p>
        </motion.div>

        <div style={{
          display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
          gap: isMobile ? 12 : 16, maxWidth: 680, width: "100%",
        }}>
          <StatCard label="POPULATION" value={latestPop ? latestPop.toLocaleString() : "—"} sub="Maroochy Hinterland 2024" delay={0.1} />
          <StatCard label="GROWTH" value={`+${growthPct}%`} sub="Since 2001" delay={0.2} />
          <StatCard label="BIO RECORDS" value="231K" sub="Species observations" delay={0.3} />
          <StatCard label="ORGANISATIONS" value="19" sub="Community groups" delay={0.4} />
          <StatCard label="MEDIAN AGE" value="56" sub="Years (2021 Census)" delay={0.5} />
          <StatCard label="COMMUNITY RATING" value="4.6" sub="Google Reviews avg" delay={0.6} />
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          style={{ marginTop: 60 }}>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: 13, color: COLORS.creamDim,
            letterSpacing: "0.1em",
          }}>SCROLL TO EXPLORE ↓</p>
        </motion.div>
      </section>

      {/* ── COMMUNITY VOICE (from Pulse Survey) ── */}
      <CommunityVoiceSection isMobile={isMobile} />

      {/* ── 1. OUR PEOPLE ── */}
      <LazySection onVisible={census.load}>
        <Section dark={false}>
          <SectionHeader number="01" title="Our People"
            subtitle="A snapshot of who lives in the Maleny-Witta region — demographics from the 2021 Census and population trends since 2001." />

          {popData.length > 0 && (
            <ChartCard title="POPULATION GROWTH — MAROOCHY HINTERLAND (2001–2024)">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={popData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                  <CartesianGrid stroke={COLORS.creamFaint} strokeDasharray="3 3" />
                  <XAxis dataKey="year" stroke={COLORS.creamDim} fontSize={11}
                    tickFormatter={(v: string) => v.slice(-2)} interval={isMobile ? 4 : 2} />
                  <YAxis stroke={COLORS.creamDim} fontSize={11}
                    tickFormatter={(v: number) => `${(v / 1000).toFixed(1)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="population" stroke={COLORS.gold}
                    strokeWidth={2.5} dot={{ r: 3, fill: COLORS.gold }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          )}

          {census.data && (() => {
            const ageData = parseAgeGroups(census.data.ageStructure);
            return ageData.length > 0 && (
              <div style={{ marginTop: 32 }}>
                <ChartCard title="AGE STRUCTURE — POA 4552 (2021 CENSUS)">
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={ageData} layout="vertical" margin={{ top: 0, right: 10, bottom: 0, left: isMobile ? 30 : 50 }}>
                      <CartesianGrid stroke={COLORS.creamFaint} strokeDasharray="3 3" />
                      <XAxis type="number" stroke={COLORS.creamDim} fontSize={11} />
                      <YAxis dataKey="name" type="category" stroke={COLORS.creamDim} fontSize={11} width={isMobile ? 35 : 55} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" fill={COLORS.gold} radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
            );
          })()}

          {census.data && (
            <div style={{
              display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
              gap: 16, marginTop: 32,
            }}>
              <StatCard label="MEDIAN AGE" value="56" sub="Years (Census 2021)" />
              <StatCard label="INDIGENOUS" value="156" sub="Aboriginal & TSI persons" />
              <StatCard label="HOUSEHOLD SIZE" value="2.3" sub="Average persons" />
            </div>
          )}
        </Section>
      </LazySection>

      {/* ── 2. OUR LIVELIHOODS ── */}
      <LazySection onVisible={census.load}>
        <Section dark>
          <SectionHeader number="02" title="Our Livelihoods"
            subtitle="How the community earns, learns, and contributes — occupations, education, and income from the 2021 Census." />

          {census.data && (() => {
            const occData = parseOccupations(census.data.occupation);
            return occData.length > 0 && (
              <ChartCard title="TOP OCCUPATIONS">
                <ResponsiveContainer width="100%" height={occData.length * 44 + 20}>
                  <BarChart data={occData} layout="vertical" margin={{ top: 0, right: 10, bottom: 0, left: isMobile ? 80 : 140 }}>
                    <CartesianGrid stroke={COLORS.creamFaint} strokeDasharray="3 3" />
                    <XAxis type="number" stroke={COLORS.creamDim} fontSize={11} />
                    <YAxis dataKey="name" type="category" stroke={COLORS.creamDim} fontSize={11} width={isMobile ? 85 : 145} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" fill={COLORS.blue} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            );
          })()}

          {census.data && (() => {
            const eduData = parseEducation(census.data.ageStructure);
            const total = eduData.reduce((s, d) => s + d.value, 0);
            return eduData.length > 0 && (
              <div style={{ marginTop: 32 }}>
                <ChartCard title="HIGHEST YEAR OF SCHOOL COMPLETED">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: 32 }}>
                    <ResponsiveContainer width={isMobile ? "100%" : "45%"} height={240}>
                      <PieChart>
                        <Pie data={eduData} cx="50%" cy="50%" innerRadius={55} outerRadius={90}
                          dataKey="value" paddingAngle={2}>
                          {eduData.map((_, i) => (
                            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div>
                      {eduData.map((d, i) => (
                        <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                          <div style={{ width: 12, height: 12, borderRadius: 2, background: CHART_COLORS[i % CHART_COLORS.length] }} />
                          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: COLORS.creamDim }}>
                            {d.name} — {d.value.toLocaleString()} ({Math.round((d.value / total) * 100)}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </ChartCard>
              </div>
            );
          })()}

          {census.data && (() => {
            const fields = parseFieldsOfStudy(census.data.occupation);
            return fields.length > 0 && (
              <div style={{ marginTop: 32 }}>
                <ChartCard title="FIELDS OF STUDY">
                  <ResponsiveContainer width="100%" height={fields.length * 38 + 20}>
                    <BarChart data={fields} layout="vertical" margin={{ top: 0, right: 10, bottom: 0, left: isMobile ? 80 : 120 }}>
                      <CartesianGrid stroke={COLORS.creamFaint} strokeDasharray="3 3" />
                      <XAxis type="number" stroke={COLORS.creamDim} fontSize={11} />
                      <YAxis dataKey="name" type="category" stroke={COLORS.creamDim} fontSize={11} width={isMobile ? 85 : 125} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" fill={COLORS.green} radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
            );
          })()}

          {census.data && (
            <div style={{
              display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
              gap: 16, marginTop: 32,
            }}>
              <StatCard label="MEDIAN WEEKLY INCOME" value={`$${census.data.income["Median total personal income ($/weekly) | 4552 | Postal Areas | Queensland | 2021"] || 631}`} sub="Personal (2021)" />
              <StatCard label="HOUSEHOLD INCOME" value={`$${census.data.income["Median total household income ($/weekly) | 4552 | Postal Areas | Queensland | 2021"] || 1259}`} sub="Per week (2021)" />
              <StatCard label="MEDIAN RENT" value={`$${census.data.income["Median rent ($/weekly) | 4552 | Postal Areas | Queensland | 2021"] || 370}`} sub="Per week (2021)" />
            </div>
          )}
        </Section>
      </LazySection>

      {/* ── 3. OUR PLACES ── */}
      <LazySection onVisible={() => { venues.load(); qldHeritage.load(); }}>
        <Section dark={false}>
          <SectionHeader number="03" title="Our Places"
            subtitle="Community venues, heritage sites, and the events that bring people together across the hinterland." />

          {/* Heritage Sites */}
          {qldHeritage.data && (
            <>
              <FadeIn>
                <p style={{
                  fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 12,
                  letterSpacing: "0.1em", color: COLORS.gold, marginBottom: 20,
                }}>QUEENSLAND HERITAGE REGISTER</p>
              </FadeIn>
              <div style={{
                display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
                gap: 16, marginBottom: 40,
              }}>
                {qldHeritage.data.records.map((site, i) => (
                  <FadeIn key={site.name} delay={i * 0.05}>
                    <div style={{
                      background: "rgba(245,240,232,0.04)", border: `1px solid ${COLORS.creamFaint}`,
                      borderRadius: 12, padding: 20,
                    }}>
                      <h4 style={{
                        fontFamily: "'Playfair Display', serif", fontSize: 18,
                        color: COLORS.cream, margin: "0 0 6px",
                      }}>{site.name}</h4>
                      <p style={{
                        fontFamily: "'Inter', sans-serif", fontSize: 13,
                        color: COLORS.gold, margin: "0 0 8px",
                      }}>{site.locality} — {site.address}</p>
                      <p style={{
                        fontFamily: "'Inter', sans-serif", fontSize: 13,
                        color: COLORS.creamDim, margin: 0, lineHeight: 1.5,
                      }}>{site.significance?.slice(0, 200)}{site.significance?.length > 200 ? "…" : ""}</p>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </>
          )}

          {/* Community Venues */}
          {venues.data && (
            <>
              <FadeIn>
                <p style={{
                  fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 12,
                  letterSpacing: "0.1em", color: COLORS.gold, marginBottom: 20, marginTop: 20,
                }}>COMMUNITY VENUES</p>
              </FadeIn>
              <div style={{
                display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
                gap: 12, marginBottom: 40,
              }}>
                {venues.data.features.map((v, i) => (
                  <FadeIn key={i} delay={i * 0.03}>
                    <div style={{
                      background: "rgba(245,240,232,0.04)", border: `1px solid ${COLORS.creamFaint}`,
                      borderRadius: 10, padding: 16,
                    }}>
                      <p style={{
                        fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600,
                        color: COLORS.cream, margin: "0 0 4px",
                      }}>{v.attributes.Name || "Community Centre"}</p>
                      <p style={{
                        fontFamily: "'Inter', sans-serif", fontSize: 12,
                        color: COLORS.creamDim, margin: "0 0 8px",
                      }}>{v.attributes.Owner} · {v.attributes.Classification}</p>
                      <a
                        href={`https://www.google.com/maps?q=${v.latitude},${v.longitude}`}
                        target="_blank" rel="noopener noreferrer"
                        style={{
                          fontFamily: "'Inter', sans-serif", fontSize: 12,
                          color: COLORS.gold, textDecoration: "none",
                        }}
                      >Get Directions →</a>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </>
          )}

          {/* Events */}
          {events.data && (
            <>
              <FadeIn>
                <p style={{
                  fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 12,
                  letterSpacing: "0.1em", color: COLORS.gold, marginBottom: 20,
                }}>LOCAL EVENTS</p>
              </FadeIn>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {events.data.events.map((ev, i) => (
                  <FadeIn key={ev.name} delay={i * 0.05}>
                    <div style={{
                      display: "flex", alignItems: isMobile ? "flex-start" : "center",
                      gap: 16, background: "rgba(245,240,232,0.04)",
                      border: `1px solid ${COLORS.creamFaint}`, borderRadius: 10, padding: 16,
                      flexDirection: isMobile ? "column" : "row",
                    }}>
                      <div style={{
                        background: COLORS.goldDim, borderRadius: 8, padding: "6px 12px",
                        fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 11,
                        letterSpacing: "0.08em", color: COLORS.gold, whiteSpace: "nowrap",
                        textTransform: "uppercase",
                      }}>{ev.type.replace(/_/g, " ")}</div>
                      <div style={{ flex: 1 }}>
                        <p style={{
                          fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 600,
                          color: COLORS.cream, margin: "0 0 3px",
                        }}>{ev.name}</p>
                        <p style={{
                          fontFamily: "'Inter', sans-serif", fontSize: 13,
                          color: COLORS.creamDim, margin: 0,
                        }}>{ev.schedule} · {ev.location}</p>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </>
          )}
        </Section>
      </LazySection>

      {/* ── 4. OUR NATURE ── */}
      <LazySection onVisible={species.load}>
        <Section dark>
          <SectionHeader number="04" title="Our Nature"
            subtitle="Biodiversity within 10km of Witta — 231,593 observations recorded by the Atlas of Living Australia." />

          {species.data && (() => {
            const groups = species.data.speciesGroups
              .filter(g => g.group !== "Animals" && g.group !== "Not supplied" && g.count > 200)
              .slice(0, 12);
            return (
              <>
                <ChartCard title="SPECIES GROUPS BY OBSERVATION COUNT">
                  <ResponsiveContainer width="100%" height={groups.length * 38 + 20}>
                    <BarChart data={groups.map(g => ({ name: g.group, count: g.count }))} layout="vertical"
                      margin={{ top: 0, right: 10, bottom: 0, left: isMobile ? 80 : 110 }}>
                      <CartesianGrid stroke={COLORS.creamFaint} strokeDasharray="3 3" />
                      <XAxis type="number" stroke={COLORS.creamDim} fontSize={11}
                        tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)} />
                      <YAxis dataKey="name" type="category" stroke={COLORS.creamDim} fontSize={11} width={isMobile ? 85 : 115} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                        {groups.map((_, i) => (
                          <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                <FadeIn>
                  <div style={{ marginTop: 32 }}>
                    <p style={{
                      fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 12,
                      letterSpacing: "0.1em", color: COLORS.gold, marginBottom: 20,
                    }}>NOTABLE WILDLIFE</p>
                    <div style={{
                      display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
                      gap: 12,
                    }}>
                      {[
                        { name: "Koala", latin: "Phascolarctos cinereus", status: "Endangered" },
                        { name: "Platypus", latin: "Ornithorhynchus anatinus", status: "Near Threatened" },
                        { name: "Greater Glider", latin: "Petauroides volans", status: "Endangered" },
                        { name: "Richmond Birdwing", latin: "Ornithoptera richmondia", status: "Vulnerable" },
                      ].map((s, i) => (
                        <div key={s.name} style={{
                          background: "rgba(245,240,232,0.04)", border: `1px solid ${COLORS.creamFaint}`,
                          borderRadius: 10, padding: 16, textAlign: "center",
                        }}>
                          <p style={{
                            fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700,
                            color: COLORS.cream, margin: "0 0 4px",
                          }}>{s.name}</p>
                          <p style={{
                            fontFamily: "'Inter', sans-serif", fontSize: 12, fontStyle: "italic",
                            color: COLORS.creamDim, margin: "0 0 6px",
                          }}>{s.latin}</p>
                          <span style={{
                            fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 10,
                            letterSpacing: "0.08em", color: COLORS.red, textTransform: "uppercase",
                            background: "rgba(214,44,44,0.15)", padding: "3px 8px", borderRadius: 4,
                          }}>{s.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </FadeIn>

                <div style={{
                  display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
                  gap: 16, marginTop: 32,
                }}>
                  <StatCard label="TOTAL RECORDS" value="231,593" sub="Biodiversity observations" />
                  <StatCard label="BIRD RECORDS" value="151,780" sub="Most observed group" />
                  <StatCard label="SPECIES GROUPS" value={`${species.data.speciesGroups.length}`} sub="Taxonomic groups recorded" />
                </div>
              </>
            );
          })()}
        </Section>
      </LazySection>

      {/* ── 5. WHAT PEOPLE SAY ── */}
      <LazySection onVisible={() => { reviews.load(); media.load(); }}>
        <Section dark={false}>
          <SectionHeader number="05" title="What People Say"
            subtitle="Community sentiment from Google Reviews of 30 local venues and 101 media articles from the Sunshine Coast News." />

          {/* Top-rated venues */}
          {reviews.data && (() => {
            const topVenues = [...reviews.data.venues]
              .filter(v => v.totalReviews >= 5)
              .sort((a, b) => b.rating - a.rating || b.totalReviews - a.totalReviews)
              .slice(0, 8);
            return (
              <>
                <ChartCard title="TOP-RATED VENUES">
                  <ResponsiveContainer width="100%" height={topVenues.length * 40 + 20}>
                    <BarChart data={topVenues.map(v => ({ name: v.name.length > 25 ? v.name.slice(0, 25) + "…" : v.name, rating: v.rating, reviews: v.totalReviews }))}
                      layout="vertical" margin={{ top: 0, right: 40, bottom: 0, left: isMobile ? 80 : 140 }}>
                      <CartesianGrid stroke={COLORS.creamFaint} strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 5]} stroke={COLORS.creamDim} fontSize={11} />
                      <YAxis dataKey="name" type="category" stroke={COLORS.creamDim} fontSize={11} width={isMobile ? 85 : 145} />
                      <Tooltip content={({ active, payload }: any) => {
                        if (!active || !payload?.length) return null;
                        return (
                          <div style={{ background: COLORS.bg1, border: `1px solid ${COLORS.creamFaint}`, borderRadius: 8, padding: "8px 12px" }}>
                            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: COLORS.cream, margin: 0 }}>
                              {payload[0].payload.name}: <strong style={{ color: COLORS.gold }}>{payload[0].value}★</strong> ({payload[0].payload.reviews} reviews)
                            </p>
                          </div>
                        );
                      }} />
                      <Bar dataKey="rating" fill={COLORS.gold} radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                {/* Sample reviews */}
                <div style={{ marginTop: 32 }}>
                  <FadeIn>
                    <p style={{
                      fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 12,
                      letterSpacing: "0.1em", color: COLORS.gold, marginBottom: 20,
                    }}>VOICES FROM THE COMMUNITY</p>
                  </FadeIn>
                  <div style={{
                    display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
                    gap: 16,
                  }}>
                    {reviews.data.venues
                      .flatMap(v => v.sampleReviews.filter(r => r.text.length > 50).map(r => ({ ...r, venue: v.name })))
                      .slice(0, 6)
                      .map((r, i) => (
                        <FadeIn key={i} delay={i * 0.05}>
                          <div style={{
                            background: "rgba(245,240,232,0.04)", border: `1px solid ${COLORS.creamFaint}`,
                            borderRadius: 12, padding: 20,
                          }}>
                            <p style={{
                              fontFamily: "'Playfair Display', serif", fontSize: 15, fontStyle: "italic",
                              color: COLORS.cream, lineHeight: 1.6, margin: "0 0 12px",
                            }}>"{r.text.slice(0, 180)}{r.text.length > 180 ? "…" : ""}"</p>
                            <p style={{
                              fontFamily: "'Inter', sans-serif", fontSize: 12,
                              color: COLORS.gold, margin: 0,
                            }}>{"★".repeat(r.rating)} — {r.venue}</p>
                          </div>
                        </FadeIn>
                      ))}
                  </div>
                </div>
              </>
            );
          })()}

          {/* Media coverage */}
          {media.data && (() => {
            const themeCounts: Record<string, number> = {};
            const sentimentCounts = { positive: 0, neutral: 0, negative: 0 };
            for (const a of media.data.articles) {
              for (const t of a.themes) {
                themeCounts[t] = (themeCounts[t] || 0) + 1;
              }
              if (a.sentiment in sentimentCounts) {
                sentimentCounts[a.sentiment as keyof typeof sentimentCounts]++;
              }
            }
            const themeData = Object.entries(themeCounts)
              .map(([name, value]) => ({ name: name.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()), value }))
              .sort((a, b) => b.value - a.value)
              .slice(0, 10);
            const sentimentData = [
              { name: "Positive", value: sentimentCounts.positive, fill: COLORS.green },
              { name: "Neutral", value: sentimentCounts.neutral, fill: COLORS.gold },
              { name: "Negative", value: sentimentCounts.negative, fill: COLORS.red },
            ];

            return (
              <div style={{ marginTop: 48 }}>
                <FadeIn>
                  <p style={{
                    fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 12,
                    letterSpacing: "0.1em", color: COLORS.gold, marginBottom: 20,
                  }}>MEDIA COVERAGE — 101 ARTICLES</p>
                </FadeIn>

                <div style={{
                  display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: 16,
                }}>
                  <ChartCard title="TOP THEMES">
                    <ResponsiveContainer width="100%" height={themeData.length * 32 + 20}>
                      <BarChart data={themeData} layout="vertical" margin={{ top: 0, right: 10, bottom: 0, left: isMobile ? 80 : 110 }}>
                        <XAxis type="number" stroke={COLORS.creamDim} fontSize={11} />
                        <YAxis dataKey="name" type="category" stroke={COLORS.creamDim} fontSize={11} width={isMobile ? 85 : 115} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="value" fill={COLORS.blue} radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartCard>

                  <ChartCard title="MEDIA SENTIMENT">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: 24 }}>
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie data={sentimentData} cx="50%" cy="50%" innerRadius={45} outerRadius={75}
                            dataKey="value" paddingAngle={3}>
                            {sentimentData.map((d, i) => (
                              <Cell key={i} fill={d.fill} />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div>
                        {sentimentData.map(d => (
                          <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                            <div style={{ width: 12, height: 12, borderRadius: 2, background: d.fill }} />
                            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: COLORS.creamDim }}>
                              {d.name}: {d.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </ChartCard>
                </div>
              </div>
            );
          })()}
        </Section>
      </LazySection>

      {/* ── 6. COMMUNITY FABRIC ── */}
      <LazySection onVisible={facebook.load}>
        <Section dark>
          <SectionHeader number="06" title="Community Fabric"
            subtitle="The organisations, groups, and digital communities that connect people across the hinterland." />

          {/* Organizations by type */}
          {orgs.data && (
            <>
              <FadeIn>
                <p style={{
                  fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 12,
                  letterSpacing: "0.1em", color: COLORS.gold, marginBottom: 20,
                }}>19 COMMUNITY ORGANISATIONS</p>
              </FadeIn>
              {Object.entries(orgs.data.byType).map(([type, orgList]) => (
                <div key={type} style={{ marginBottom: 24 }}>
                  <FadeIn>
                    <p style={{
                      fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 11,
                      letterSpacing: "0.1em", color: COLORS.creamDim, marginBottom: 12,
                      textTransform: "uppercase",
                    }}>{type.replace(/_/g, " ")}</p>
                  </FadeIn>
                  <div style={{
                    display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
                    gap: 12,
                  }}>
                    {orgList.map((org, i) => (
                      <FadeIn key={org.name} delay={i * 0.03}>
                        <div style={{
                          background: "rgba(245,240,232,0.04)", border: `1px solid ${COLORS.creamFaint}`,
                          borderRadius: 10, padding: 16,
                        }}>
                          <p style={{
                            fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 600,
                            color: COLORS.cream, margin: "0 0 4px",
                          }}>{org.name}</p>
                          <p style={{
                            fontFamily: "'Inter', sans-serif", fontSize: 13,
                            color: COLORS.creamDim, margin: "0 0 8px", lineHeight: 1.5,
                          }}>{org.description.slice(0, 120)}{org.description.length > 120 ? "…" : ""}</p>
                          <div style={{ display: "flex", gap: 12 }}>
                            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: COLORS.gold }}>{org.location}</span>
                            {org.url && (
                              <a href={org.url} target="_blank" rel="noopener noreferrer"
                                style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: COLORS.gold, textDecoration: "none" }}>
                                Website →
                              </a>
                            )}
                          </div>
                        </div>
                      </FadeIn>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Facebook groups */}
          {facebook.data && (
            <div style={{ marginTop: 40 }}>
              <FadeIn>
                <p style={{
                  fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 12,
                  letterSpacing: "0.1em", color: COLORS.gold, marginBottom: 20,
                }}>DIGITAL COMMUNITIES — {facebook.data.groups.length} FACEBOOK GROUPS</p>
              </FadeIn>
              <div style={{
                display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
                gap: 12,
              }}>
                {[...facebook.data.groups]
                  .sort((a, b) => b.estimatedMembers - a.estimatedMembers)
                  .map((g, i) => (
                    <FadeIn key={g.name} delay={i * 0.03}>
                      <div style={{
                        background: "rgba(245,240,232,0.04)", border: `1px solid ${COLORS.creamFaint}`,
                        borderRadius: 10, padding: 16, display: "flex", justifyContent: "space-between",
                        alignItems: "center",
                      }}>
                        <div>
                          <p style={{
                            fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600,
                            color: COLORS.cream, margin: "0 0 4px",
                          }}>{g.name}</p>
                          <p style={{
                            fontFamily: "'Inter', sans-serif", fontSize: 12,
                            color: COLORS.creamDim, margin: 0,
                          }}>{g.activityLevel.replace(/_/g, " ")} activity</p>
                        </div>
                        <p style={{
                          fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700,
                          color: COLORS.gold, margin: 0, whiteSpace: "nowrap",
                        }}>{g.estimatedMembers >= 1000 ? `${(g.estimatedMembers / 1000).toFixed(0)}k` : g.estimatedMembers}</p>
                      </div>
                    </FadeIn>
                  ))}
              </div>
            </div>
          )}
        </Section>
      </LazySection>

      {/* ── 7. COUNCIL & POLICY ── */}
      <LazySection onVisible={consultations.load}>
        <Section dark={false}>
          <SectionHeader number="07" title="Council & Policy"
            subtitle="13 consultations and strategy documents shaping the future of the Sunshine Coast Hinterland." />

          {consultations.data && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {consultations.data.consultations.map((c, i) => (
                <FadeIn key={c.title} delay={i * 0.04}>
                  <div style={{
                    background: "rgba(245,240,232,0.04)", border: `1px solid ${COLORS.creamFaint}`,
                    borderRadius: 12, padding: 20,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8, flexWrap: "wrap" }}>
                      <span style={{
                        fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 10,
                        letterSpacing: "0.08em", textTransform: "uppercase",
                        color: c.status === "open" ? COLORS.green : COLORS.creamDim,
                        background: c.status === "open" ? "rgba(58,110,71,0.2)" : "rgba(245,240,232,0.08)",
                        padding: "3px 8px", borderRadius: 4,
                      }}>{c.status}</span>
                      <span style={{
                        fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 10,
                        letterSpacing: "0.08em", textTransform: "uppercase",
                        color: COLORS.gold, background: COLORS.goldDim,
                        padding: "3px 8px", borderRadius: 4,
                      }}>{c.category.replace(/_/g, " ")}</span>
                    </div>
                    <h4 style={{
                      fontFamily: "'Inter', sans-serif", fontSize: 16, fontWeight: 600,
                      color: COLORS.cream, margin: "0 0 6px",
                    }}>{c.title}</h4>
                    <p style={{
                      fontFamily: "'Inter', sans-serif", fontSize: 13,
                      color: COLORS.creamDim, margin: "0 0 10px", lineHeight: 1.5,
                    }}>{c.description.slice(0, 200)}{c.description.length > 200 ? "…" : ""}</p>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {c.themes.slice(0, 4).map(t => (
                        <span key={t} style={{
                          fontFamily: "'Inter', sans-serif", fontSize: 11,
                          color: COLORS.creamDim, background: "rgba(245,240,232,0.06)",
                          padding: "2px 8px", borderRadius: 4,
                        }}>{t.replace(/_/g, " ")}</span>
                      ))}
                    </div>
                    {c.url && (
                      <a href={c.url} target="_blank" rel="noopener noreferrer"
                        style={{
                          display: "inline-block", marginTop: 10,
                          fontFamily: "'Inter', sans-serif", fontSize: 12,
                          color: COLORS.gold, textDecoration: "none",
                        }}>Read More →</a>
                    )}
                  </div>
                </FadeIn>
              ))}
            </div>
          )}
        </Section>
      </LazySection>

      {/* ── 8. OPPORTUNITIES ── */}
      <Section dark>
        <SectionHeader number="08" title="Opportunities for The Harvest"
          subtitle="Cross-referencing community data with our three zones — where the gaps are, and what we can grow." />

        <div style={{
          display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
          gap: 20,
        }}>
          {[
            {
              zone: "Garden",
              emoji: "🌱",
              color: COLORS.green,
              insights: [
                "129 agriculture & environment-qualified workers in the region",
                "Strong interest in local produce (markets, farm trails)",
                "Council environment strategy aligns with regenerative agriculture",
                "Community groups like Barung Landcare already active",
              ],
            },
            {
              zone: "Kitchen",
              emoji: "🍳",
              color: COLORS.gold,
              insights: [
                "Food quality is the #1 positive theme in Google Reviews",
                "130 food & hospitality-qualified workers",
                "Witta Markets rated 4.6★ with 158 reviews",
                "Sunshine Coast Harvest Trail shows tourism appetite",
              ],
            },
            {
              zone: "Art Space",
              emoji: "🎨",
              color: COLORS.blue,
              insights: [
                "Active arts community: Maleny Arts Council, Upfront Club",
                "Creative Arts graduates in the workforce (93 people)",
                "Council Arts & Heritage Levy shows policy support",
                "Montville arts precinct demonstrates market demand",
              ],
            },
          ].map((z, i) => (
            <FadeIn key={z.zone} delay={i * 0.1}>
              <div style={{
                background: "rgba(245,240,232,0.04)", border: `1px solid ${COLORS.creamFaint}`,
                borderRadius: 12, padding: 24, height: "100%",
              }}>
                <p style={{ fontSize: 32, margin: "0 0 12px" }}>{z.emoji}</p>
                <h3 style={{
                  fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700,
                  color: z.color, margin: "0 0 16px",
                }}>{z.zone}</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {z.insights.map((insight, j) => (
                    <li key={j} style={{
                      fontFamily: "'Inter', sans-serif", fontSize: 14,
                      color: COLORS.creamDim, lineHeight: 1.6, marginBottom: 8,
                      paddingLeft: 16, position: "relative",
                    }}>
                      <span style={{
                        position: "absolute", left: 0, color: z.color,
                      }}>•</span>
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn>
          <div style={{ textAlign: "center", marginTop: 60 }}>
            <p style={{
              fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700,
              color: COLORS.cream, marginBottom: 24,
            }}>Ready to shape what grows here?</p>
            <Link href="/contact" style={{
              display: "inline-block", fontFamily: "'Montserrat', sans-serif",
              fontWeight: 900, fontSize: 13, letterSpacing: "0.15em",
              color: COLORS.bg1, background: COLORS.gold,
              padding: "14px 36px", borderRadius: 8, textDecoration: "none",
            }}>GET IN TOUCH</Link>
          </div>
        </FadeIn>
      </Section>

      {/* ── DATA SOURCES FOOTER ── */}
      <Section dark={false} style={{ padding: "60px 24px" }}>
        <FadeIn>
          <p style={{
            fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 12,
            letterSpacing: "0.1em", color: COLORS.gold, marginBottom: 24,
          }}>DATA SOURCES</p>
          <div style={{
            display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
            gap: 8,
          }}>
            {[
              { name: "Australian Bureau of Statistics", desc: "2021 Census, Estimated Resident Population", url: "https://www.abs.gov.au" },
              { name: "Queensland Government", desc: "Heritage Register, Population Statistics", url: "https://data.qld.gov.au" },
              { name: "Atlas of Living Australia", desc: "Biodiversity observations (10km radius)", url: "https://www.ala.org.au" },
              { name: "Sunshine Coast Council", desc: "GIS data, Heritage overlay, Consultations", url: "https://www.sunshinecoast.qld.gov.au" },
              { name: "Google Reviews", desc: "30 local venues, ratings & reviews", url: "https://maps.google.com" },
              { name: "Sunshine Coast News", desc: "101 articles, local media coverage", url: "https://www.sunshinecoastnews.com.au" },
              { name: "Facebook Groups", desc: "13 community groups, member counts", url: "https://www.facebook.com" },
              { name: "Community Research", desc: "Local events, organisations directory", url: "#" },
            ].map(s => (
              <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
                style={{
                  display: "block", padding: "10px 14px", borderRadius: 8,
                  background: "rgba(245,240,232,0.03)", border: `1px solid ${COLORS.creamFaint}`,
                  textDecoration: "none",
                }}>
                <p style={{
                  fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600,
                  color: COLORS.cream, margin: "0 0 2px",
                }}>{s.name}</p>
                <p style={{
                  fontFamily: "'Inter', sans-serif", fontSize: 12,
                  color: COLORS.creamDim, margin: 0,
                }}>{s.desc}</p>
              </a>
            ))}
          </div>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: 12, color: COLORS.creamDim,
            marginTop: 20, opacity: 0.6,
          }}>Data fetched February 2026. Population figures from QGSO/ABS. Census data from 2021.</p>
        </FadeIn>
      </Section>

      <BauhausFooter isMobile={isMobile} />
    </div>
  );
}
