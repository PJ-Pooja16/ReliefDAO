import { PageHeader } from "@/components/page-header";
import { getDisasters } from "@/lib/data";
import { DisasterCard } from "@/components/disaster-card";

export default function ActiveDisastersPage() {
    const disasters = getDisasters();
  return (
    <>
      <PageHeader
        title="Active Disasters"
        description="Browse all ongoing and recent disaster response efforts."
      />
      <div className="container pb-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {disasters.map(disaster => (
              <DisasterCard key={disaster.id} disaster={disaster} />
            ))}
          </div>
      </div>
    </>
  );
}
