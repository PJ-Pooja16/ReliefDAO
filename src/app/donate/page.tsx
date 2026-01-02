import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function DonatePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <PageHeader
          title="Donate"
          description="Your contribution powers our rapid response efforts. Thank you for your support."
        />
        <div className="container pb-12">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-6 text-center text-muted-foreground">
              Donation form coming soon.
            </CardContent>
          </Card>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
