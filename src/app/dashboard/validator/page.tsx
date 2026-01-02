
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function ValidatorPage() {
  return (
    <>
      <PageHeader
        title="Validator Panel"
        description="Review and verify submitted proposals."
      />
      <div className="container pb-12">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-6 text-center text-muted-foreground">
            Validator dashboard coming soon.
          </CardContent>
        </Card>
      </div>
    </>
  );
}

    