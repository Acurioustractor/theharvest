import Layout from "@/components/Layout";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";

export default function Financials() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-sm text-muted-foreground">Loading financials…</div>
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
                Financials access
              </CardTitle>
              <CardDescription>
                Sign in to view reporting templates and summaries.
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
          <div className="max-w-4xl space-y-8">
            <div>
              <h1 className="text-3xl font-serif font-bold text-[#2c4c3b]">
                Financial Reporting
              </h1>
              <p className="text-muted-foreground mt-2">
                Open-book reporting structure and templates for quarterly reviews.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-xl text-[#2c4c3b]">
                  Quarterly Reporting Template
                </CardTitle>
                <CardDescription>
                  Capture revenue, costs, and revenue-share calculations.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="rounded-lg border p-4">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">
                      Gross Revenue
                    </div>
                    <div className="text-base text-foreground mt-2">
                      Hospitality, workshops, events, retail, subleases.
                    </div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">
                      Operating Costs
                    </div>
                    <div className="text-base text-foreground mt-2">
                      Staffing, utilities, supplies, insurance, maintenance.
                    </div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">
                      Net Profit
                    </div>
                    <div className="text-base text-foreground mt-2">
                      Gross revenue minus operating costs and base rent.
                    </div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">
                      Revenue Share
                    </div>
                    <div className="text-base text-foreground mt-2">
                      50% of net profit up to the target rent.
                    </div>
                  </div>
                </div>
                <p>
                  This template will be expanded with downloadable reports and
                  quarterly uploads once finalized.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
}
