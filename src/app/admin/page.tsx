import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <PageHeader
          title="Admin Panel"
          description="DAO Core Team access only."
        />
        <div className="container pb-12">
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-6 text-center text-muted-foreground">
              Admin dashboard coming soon.
            </CardContent>
          </Card>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
