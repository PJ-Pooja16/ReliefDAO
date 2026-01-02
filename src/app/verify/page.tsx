import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function VerifyPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <PageHeader
          title="Verification Portal"
          description="Upload proof of delivery to complete your proposal and build trust."
        />
        <div className="container pb-12">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-6 text-center text-muted-foreground">
              Verification upload form coming soon.
            </CardContent>
          </Card>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
