import { getDisasterById, getProposalsByDisasterId } from "@/lib/data";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProposalCard } from "@/components/proposal-card";
import { Progress } from "@/components/ui/progress";
import Link from 'next/link';
import {
  FilePlus2,
  HandHeart,
  Share2,
  DollarSign,
  Landmark,
  ShieldCheck,
  Users,
  AlertTriangle,
  Calendar,
  MapPin,
} from "lucide-react";

export default function DisasterDetailPage({ params }: { params: { id: string } }) {
  const disaster = getDisasterById(params.id);
  
  if (!disaster) {
    notFound();
  }

  const proposals = getProposalsByDisasterId(disaster.id);
  const fundingPercentage = (disaster.fundsRaised / disaster.fundsNeeded) * 100;

  const stats = [
    { label: "Funds Raised", value: `$${(disaster.fundsRaised / 1000).toFixed(0)}k`, icon: DollarSign },
    { label: "Funds Deployed", value: `$${(disaster.fundsDeployed / 1000).toFixed(0)}k`, icon: Landmark },
    { label: "Proposals Funded", value: disaster.proposalsFunded, icon: FilePlus2 },
    { label: "Verified Deliveries", value: disaster.verifiedDeliveries, icon: ShieldCheck },
  ];

  const overviewInfo = [
    { label: "Disaster Type", value: disaster.type, icon: AlertTriangle },
    { label: "Date Started", value: new Date(disaster.dateStarted).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), icon: Calendar },
    { label: "Location", value: disaster.location, icon: MapPin },
    { label: "Affected Population", value: `${disaster.affected.toLocaleString()} people`, icon: Users },
  ];

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <PageHeader title={disaster.name}>
            <StatusBadge status={disaster.status} className="px-3 py-1.5 text-sm"/>
        </PageHeader>
        <div className="container pb-12">
            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-5 mb-6">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="proposals">Proposals</TabsTrigger>
                    <TabsTrigger value="resources">Resources</TabsTrigger>
                    <TabsTrigger value="updates">Updates</TabsTrigger>
                    <TabsTrigger value="transparency">Transparency</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-bold font-headline mb-4">Funding Status</h3>
                                    <div className="flex justify-between items-baseline mb-2">
                                        <span className="text-2xl font-bold font-code text-primary">${disaster.fundsRaised.toLocaleString()}</span>
                                        <span className="text-sm text-muted-foreground">Goal: ${disaster.fundsNeeded.toLocaleString()}</span>
                                    </div>
                                    <Progress value={fundingPercentage} className="w-full h-3"/>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                                {stats.map((stat, index) => (
                                    <div key={index} className="text-center">
                                        <stat.icon className="mx-auto h-6 w-6 text-muted-foreground mb-2"/>
                                        <div className="text-xl font-bold">{stat.value}</div>
                                        <div className="text-xs text-muted-foreground">{stat.label}</div>
                                    </div>
                                ))}
                                </CardContent>
                            </Card>
                        </div>
                        <div className="space-y-6">
                             <Card>
                                <CardContent className="p-6 space-y-4">
                                    {overviewInfo.map((info, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <info.icon className="h-5 w-5 mt-0.5 text-muted-foreground flex-shrink-0"/>
                                            <div>
                                                <p className="text-sm text-muted-foreground">{info.label}</p>
                                                <p className="font-semibold">{info.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                             <div className="space-y-2">
                                <Button asChild size="lg" className="w-full">
                                    <Link href="/proposals/create">Submit Proposal</Link>
                                </Button>
                                <Button asChild size="lg" variant="secondary" className="w-full">
                                    <Link href="/donate">Donate</Link>
                                </Button>
                                <Button size="lg" variant="outline" className="w-full">
                                    <Share2 className="mr-2 h-4 w-4"/> Share
                                </Button>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="proposals">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {proposals.map(proposal => (
                            <ProposalCard key={proposal.id} proposal={proposal} />
                        ))}
                    </div>
                </TabsContent>
                
                <TabsContent value="resources">
                    <Card><CardContent className="p-6 text-center text-muted-foreground">Resources coming soon.</CardContent></Card>
                </TabsContent>
                <TabsContent value="updates">
                    <Card><CardContent className="p-6 text-center text-muted-foreground">Live updates coming soon.</CardContent></Card>
                </TabsContent>
                <TabsContent value="transparency">
                     <Card><CardContent className="p-6 text-center text-muted-foreground">Transparency dashboard coming soon.</CardContent></Card>
                </TabsContent>

            </Tabs>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
