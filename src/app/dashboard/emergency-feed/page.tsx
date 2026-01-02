import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function EmergencyFeedPage() {
  return (
    <>
      <PageHeader
        title="Emergency Feed"
        description="Real-time alerts and updates from global monitoring systems."
      />
      <div className="container pb-8">
        <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
                Emergency feed is not yet implemented.
            </CardContent>
        </Card>
      </div>
    </>
  );
}
