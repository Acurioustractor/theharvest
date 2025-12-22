import Layout from "@/components/Layout";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";

export default function Proposal() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-sm text-muted-foreground">Loading proposal…</div>
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
                Proposal access
              </CardTitle>
              <CardDescription>
                Sign in to view the proposal documents.
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
                Proposal for The Harvest Activation
              </h1>
              <p className="text-muted-foreground mt-2">
                Draft proposal summary for partners and stakeholders.
              </p>
            </div>

            <div className="space-y-6 text-sm leading-relaxed text-foreground">
              <p>Dear Grant and Michelle,</p>
              <p>
                Thank you for the wonderful conversation today and for your
                openness to exploring how we might activate The Harvest together.
                Following our discussion, we would like to put forward a formal
                proposal for your consideration.
              </p>
            </div>

            <div className="space-y-8">
              <section className="space-y-4">
                <h2 className="text-xl font-serif text-[#2c4c3b]">
                  Proposed Lease Terms
                </h2>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    Property and Duration: Lease of the entire site (building
                    ~500 sqm plus garden centre and outdoor spaces). Initial term
                    of 13 months commencing 1 January 2026, with an option to
                    extend for 2 additional years.
                  </p>
                  <p>
                    Rental Structure: Market rate valuation of $200 per sqm
                    annually ($100,000/year for building). Base rent set at
                    $100 per sqm ($50,000/year) with a revenue share arrangement
                    to reach market rate, targeting full market equivalent by
                    mid-2026.
                  </p>
                  <p>
                    Commencement and Transition: Lease start 1 January 2026 with
                    Q1 2026 as a ramp-up period for handover and preparation.
                    Early access from 1 January for preparation works while we
                    are locally available.
                  </p>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-serif text-[#2c4c3b]">
                  Garden Centre and Outdoor Spaces
                </h2>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    We propose to manage the establishment of the garden space
                    and nursery in alignment with your vision. Our commitment:
                  </p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Develop the garden to generate $20-30K annual value.</li>
                    <li>
                      Open to rental adjustment once the garden centre is
                      operationally established.
                    </li>
                    <li>
                      Coordinate with Cath and other community members as
                      discussed.
                    </li>
                  </ul>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-serif text-[#2c4c3b]">
                  Property Investment Fund
                </h2>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    We propose a $100,000 capital improvement fund focused on
                    outdoor spaces and site activation. A Curious Tractor manages
                    the fund while Grant and Michelle remain key decision makers.
                  </p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Joint management approach aligned to shared vision.</li>
                    <li>Funds directed toward infrastructure that enhances community value.</li>
                    <li>Transparent reporting and approvals on spend.</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-serif text-[#2c4c3b]">
                  Operating Principles
                </h2>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Single point of contact: A Curious Tractor as site managers.</li>
                  <li>Comprehensive management of operations and programming.</li>
                  <li>Values alignment for long-term community impact.</li>
                  <li>Open-book transparency with regular reporting.</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-serif text-[#2c4c3b]">The Vision</h2>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Commercial kitchen and hospitality venue.</li>
                  <li>Workshop and event spaces.</li>
                  <li>Micro-provider support and social enterprise incubation.</li>
                  <li>Garden centre and farm-to-plate programming.</li>
                  <li>Community gatherings and educational workshops.</li>
                  <li>Support for marginalized people, homeschoolers, and vocational training.</li>
                </ul>
              </section>
            </div>

            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                We are ready to finalize a commercial lease agreement, develop a
                values appendix, begin preparation work in January, and commence
                phase 1 garden centre development.
              </p>
              <p>
                With gratitude and excitement,
                <br />
                Nic & Ben
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
