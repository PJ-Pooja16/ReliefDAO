import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { DisasterCard } from "@/components/disaster-card";
import { getDisasters } from "@/lib/data";
import { FilePlus2, HandHeart, CheckCircle, Siren, BarChart, History, Award } from "lucide-react";

export default function DashboardPage() {
    const disasters = getDisasters();
    const activeDisasters = disasters.filter(d => d.status === 'Active' || d.status === 'Response Ongoing');

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Welcome back. Here's an overview of the current situation."
      />
      <div className="container pb-8">
        {/* Emergency Alert Banner */}
        <Alert variant="destructive" className="mb-8 bg-destructive/10 border-destructive/20 text-destructive-foreground">
            <Siren className="h-5 w-5 text-destructive" />
          <AlertTitle className="text-lg font-bold text-destructive">FLOOD ALERT: Bengaluru</AlertTitle>
          <AlertDescription className="text-destructive/90 flex items-center justify-between">
            Response Level 3 Initiated. Fast-track voting for emergency proposals is active.
            <Button asChild variant="destructive" size="sm">
                <Link href="/disasters/d1">View Details</Link>
            </Button>
          </AlertDescription>
        </Alert>

        {/* Quick Actions */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <Button asChild size="lg" className="h-auto py-4">
                <Link href="/proposals/create" className="flex flex-col items-center">
                    <FilePlus2 className="h-6 w-6 mb-1"/>
                    <span>Create Proposal</span>
                </Link>
            </Button>
            <Button asChild size="lg" className="h-auto py-4" variant="secondary">
                <Link href="/donate" className="flex flex-col items-center">
                    <HandHeart className="h-6 w-6 mb-1"/>
                    <span>Donate to Relief</span>
                </Link>
            </Button>
            <Button asChild size="lg" className="h-auto py-4" variant="outline">
                <Link href="/verify" className="flex flex-col items-center">
                    <CheckCircle className="h-6 w-6 mb-1"/>
                    <span>Verify Delivery</span>
                </Link>
            </Button>
        </div>
        
        {/* Live Disasters Grid */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold font-headline mb-4">Live Disasters</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeDisasters.map(disaster => (
              <DisasterCard key={disaster.id} disaster={disaster} />
            ))}
          </div>
        </section>

        {/* My Activity */}
        <section>
          <h2 className="text-2xl font-bold font-headline mb-4">My Activity</h2>
           <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Recent Votes</CardTitle>
                  <History className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">in the last 7 days</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Donations This Month</CardTitle>
                  <HandHeart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-code">$150.00</div>
                  <p className="text-xs text-muted-foreground">+20% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Reputation Score</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">85/100</div>
                  <p className="text-xs text-muted-foreground">Top 15% of members</p>
                </CardContent>
              </Card>
            </div>
        </section>
      </div>
    </>
  );
}
