import { getDisasterById, getProposalsByDisasterId } from "@/lib/data";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProposalCard } from "@/components/proposal-card";
import { Progress } from "@/components/ui/progress";
import Link from 'next/link';
import Image from 'next/image';
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
  FileText,
  Vote,
} from "lucide-react";

export default function DisasterDetailPage({ params }: { params: { id: string } }) {
  const disaster = getDisasterById(params.id);
  
  if (!disaster) {
    notFound();
  }

  const proposals = getProposalsByDisasterId(disaster.id);
  const fundingPercentage = (disaster.fundsRaised / disaster.fundsNeeded) * 100;
  const approvedProposals = proposals.filter(p => p.status === 'Approved' || p.status === 'Completed').length;
  const pendingProposals = proposals.filter(p => p.status === 'Pending').length;

  const stats = [
    { label: "Funds Raised", value: `$${(disaster.fundsRaised / 1000).toFixed(0)}k`, icon: DollarSign },
    { label: "Funds Deployed", value: `$${(disaster.fundsDeployed / 1000).toFixed(0)}k`, icon: Landmark },
    { label: "Funded Proposals", value: approvedProposals, icon: FileText },
    { label: "Pending Proposals", value: pendingProposals, icon: Vote },
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
                    <TabsTrigger value="map">Live Map</TabsTrigger>
                    <TabsTrigger value="updates">Updates</TabsTrigger>
                    <TabsTrigger value="transparency">Transparency</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Funding Status</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-between items-baseline mb-2">
                                        <span className="text-3xl font-bold font-code text-primary">${disaster.fundsRaised.toLocaleString()}</span>
                                        <span className="text-sm text-muted-foreground">Goal: ${disaster.fundsNeeded.toLocaleString()}</span>
                                    </div>
                                    <Progress value={fundingPercentage} className="w-full h-3"/>
                                     <p className="text-sm text-muted-foreground mt-2">{fundingPercentage.toFixed(0)}% of funding goal reached.</p>
                                </CardContent>
                            </Card>
                            <Card>
                                 <CardHeader>
                                    <CardTitle>Response Statistics</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {stats.map((stat, index) => (
                                    <div key={index} className="text-center p-4 rounded-lg bg-muted/50">
                                        <stat.icon className="mx-auto h-7 w-7 text-primary mb-2"/>
                                        <div className="text-2xl font-bold">{stat.value}</div>
                                        <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                                    </div>
                                ))}
                                </CardContent>
                            </Card>
                        </div>
                        <div className="space-y-6">
                             <Card>
                                <CardHeader>
                                    <CardTitle>Disaster Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
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
                     {proposals.length === 0 && (
                        <Card>
                            <CardContent className="p-10 text-center text-muted-foreground">
                                <p>No proposals have been submitted for this disaster yet.</p>
                                <Button asChild className="mt-4">
                                    <Link href="/proposals/create">Be the first to submit a proposal</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
                
                <TabsContent value="map">
                    <Card>
                        <CardHeader>
                            <CardTitle>Affected Area Map</CardTitle>
                            <CardDescription>Live map showing the disaster area and operational zones.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="relative aspect-video w-full rounded-lg overflow-hidden border">
                                <Image 
                                    src="https://images.unsplash.com/photo-1599580506456-98a361730453?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtYXAlMjBkYW5nZXIlMjB6b25lfGVufDB8fHx8MTc2NzUyMjE2MHww&ixlib=rb-4.1.0&q=80&w=1080" 
                                    alt="Affected Area Map"
                                    fill
                                    objectFit="cover"
                                    data-ai-hint="map danger zone"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            </div>
                             <div className="mt-4 flex flex-wrap gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full bg-red-500/50 border border-red-700"></div>
                                    <span>High Danger Zone</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full bg-yellow-500/50 border border-yellow-700"></div>
                                    <span>Moderate Impact Zone</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full bg-green-500/50 border border-green-700"></div>
                                    <span>Relief Operations Area</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
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
