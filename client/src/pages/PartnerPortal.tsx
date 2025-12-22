import Layout from "@/components/Layout";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";

const portalItems = [
  {
    title: "Strategic Analysis",
    description: "SWOT, market data, and strategic roadmap.",
    href: "/strategic-analysis",
  },
  {
    title: "Proposal",
    description: "Formal proposal and vision summary.",
    href: "/proposal",
  },
  {
    title: "Lease Draft",
    description: "Commercial lease draft and schedules.",
    href: "/lease-draft",
  },
  {
    title: "Financials",
    description: "Open-book reporting and templates.",
    href: "/financials",
  },
];

export default function PartnerPortal() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-sm text-muted-foreground">Loading portal…</div>
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
                Partner Portal
              </CardTitle>
              <CardDescription>
                Sign in to access partner documents and reporting.
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
          <div className="max-w-3xl mb-10">
            <h1 className="text-3xl font-serif font-bold text-[#2c4c3b]">
              Partner Portal
            </h1>
            <p className="text-muted-foreground mt-3">
              Welcome {user?.name || user?.email || "partner"}. Access strategic
              documents, proposal materials, and reporting below.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {portalItems.map(item => (
              <Card key={item.href} className="h-full">
                <CardHeader>
                  <CardTitle className="font-serif text-xl text-[#2c4c3b]">
                    {item.title}
                  </CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href={item.href}>Open</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
