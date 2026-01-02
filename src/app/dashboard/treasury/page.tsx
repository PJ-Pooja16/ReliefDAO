import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function TreasuryPage() {
  return (
    <>
      <PageHeader
        title="Treasury"
        description="View the DAO's treasury balance, transactions, and financial health."
      />
      <div className="container pb-8">
        <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
                Treasury dashboard is not yet implemented.
            </CardContent>
        </Card>
      </div>
    </>
  );
}
