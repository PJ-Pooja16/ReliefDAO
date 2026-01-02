import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage your account settings and preferences."
      />
      <div className="container pb-8">
        <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
                Settings page is not yet implemented.
            </CardContent>
        </Card>
      </div>
    </>
  );
}
