import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function MyProposalsPage() {
  return (
    <>
      <PageHeader
        title="My Proposals"
        description="Manage and track the status of all proposals you have submitted."
      />
      <div className="container pb-8">
        <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
                My Proposals section is not yet implemented.
            </CardContent>
        </Card>
      </div>
    </>
  );
}
