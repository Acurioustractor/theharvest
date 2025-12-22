import Layout from "@/components/Layout";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";

export default function LeaseDraft() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-sm text-muted-foreground">Loading lease draft…</div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Card className="max-w-md w-full mx-4">
            <CardHeader className="text-center">
              <CardTitle className="font-serif text-2xl text-[#2c4c3b]">
                Lease draft access
              </CardTitle>
              <CardDescription>
                Sign in to view the commercial lease draft.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full bg-[#2c4c3b] hover:bg-[#1a3326]"
                onClick={() => (window.location.href = getLoginUrl())}
              >
                Sign in
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-16">
        <div className="container px-4">
          <div className="max-w-4xl space-y-10">
            <div>
              <h1 className="text-3xl font-serif font-bold text-[#2c4c3b]">
                Commercial Lease Agreement — Draft
              </h1>
              <p className="text-muted-foreground mt-2">
                The Harvest, Witta, Queensland.
              </p>
            </div>

            <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
              <section className="space-y-2">
                <h2 className="text-lg font-serif text-[#2c4c3b]">Parties</h2>
                <p>Landlord: Grant Luff and Michelle Luff.</p>
                <p>Tenant: A Curious Tractor Pty Ltd (ABN: to be inserted).</p>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-serif text-[#2c4c3b]">Premises</h2>
                <p>Building approx. 500 sqm plus garden centre and outdoor spaces.</p>
                <p>Permitted use includes community hub, hospitality, events, workshops, and social enterprise support.</p>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-serif text-[#2c4c3b]">Term</h2>
                <p>Commencement date: 1 January 2026.</p>
                <p>Initial term: 13 months, expiring 31 January 2027.</p>
                <p>Option to extend for 2 additional years (notice required 90 days prior).</p>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-serif text-[#2c4c3b]">Rent</h2>
                <p>Base rent: $50,000 per annum payable monthly.</p>
                <p>Revenue share to reach target rent of $100,000 per annum, with quarterly reporting.</p>
                <p>Ramp-up period: 50% base rent for Q1 2026.</p>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-serif text-[#2c4c3b]">Capital Improvement Fund</h2>
                <p>$100,000 fund managed by Tenant with Landlord approval on expenditures.</p>
                <p>Quarterly reporting and improvements vest to Landlord at end of lease.</p>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-serif text-[#2c4c3b]">Maintenance and Repairs</h2>
                <p>Landlord: structural integrity, roof, external walls, building insurance.</p>
                <p>Tenant: internal fixtures, day-to-day maintenance, gardens, equipment, pest control.</p>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-serif text-[#2c4c3b]">Subletting</h2>
                <p>Subletting permitted for aligned uses; Tenant remains liable for obligations.</p>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-serif text-[#2c4c3b]">Schedules</h2>
                <p>Schedule A: Site plan (to be attached).</p>
                <p>Schedule B: Community Values Framework.</p>
                <p>Schedule C: Financial Reporting Template.</p>
              </section>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
