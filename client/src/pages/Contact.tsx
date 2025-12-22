import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Contact() {
  return (
    <Layout>
      <section className="py-16">
        <div className="container px-4">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-2xl text-[#2c4c3b]">
                  Contact
                </CardTitle>
                <CardDescription>
                  Reach out about partnerships, programming, or site activation.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>
                  If you would like to discuss The Harvest activation, partnership
                  opportunities, or community programming, please get in touch.
                </p>
                <div className="rounded-lg border p-4 bg-muted/30">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">
                    Preferred contact
                  </div>
                  <div className="mt-2 text-base text-foreground">
                    Contact details to be confirmed.
                  </div>
                </div>
                <p>
                  We will respond with next steps, timelines, and any requested
                  documents.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
}
