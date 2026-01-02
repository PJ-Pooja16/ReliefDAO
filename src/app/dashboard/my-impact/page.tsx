import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function MyImpactPage() {
  return (
    <>
      <PageHeader
        title="My Impact"
        description="Track your contributions, reputation, and the difference you've made."
      />
      <div className="container pb-8">
        <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
                My Impact tracking is not yet implemented.
            </CardContent>
        </Card>
      </div>
    </>
  );
}
