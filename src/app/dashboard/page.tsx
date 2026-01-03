
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { ProposalCard } from "@/components/proposal-card";
import { getDisasters } from "@/lib/data";
import { 
    FilePlus2, Camera, Siren, BarChart, History, Award, Users, Landmark, FileText, 
    ShieldCheck, UserCog, LineChart, HandHeart, AlertTriangle 
} from "lucide-react";
import type { Proposal, User } from "@/lib/types";
import { useCollection, useDoc, useFirebase, useMemoFirebase, useUser } from "@/firebase";
import { collection, doc, query, where, limit } from "firebase/firestore";
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const chartData = [
  { name: "Jan", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Feb", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Mar", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Apr", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "May", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Jun", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Jul", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Aug", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Sep", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Oct", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Nov", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Dec", total: Math.floor(Math.random() * 5000) + 1000 },
]

export default function DashboardPage() {
    const { user, isUserLoading } = useUser();
    const { firestore } = useFirebase();

    const userDocRef = useMemoFirebase(() => user ? doc(firestore, "users", user.uid) : null, [firestore, user]);
    const { data: currentUser, isLoading: isCurrentUserLoading } = useDoc<User>(userDocRef);

    const proposalsCollectionRef = useMemoFirebase(() => firestore ? collection(firestore, 'proposals') : null, [firestore]);
    
    // For Responder
    const myProposalsQuery = useMemoFirebase(() => (proposalsCollectionRef && currentUser && currentUser.role === 'Responder') ? query(proposalsCollectionRef, where("createdBy", "==", currentUser.id)) : null, [proposalsCollectionRef, currentUser]);
    const { data: myProposals, isLoading: areMyProposalsLoading } = useCollection<Proposal>(myProposalsQuery);

    // For Validator
    const pendingProposalsQuery = useMemoFirebase(() => (proposalsCollectionRef && currentUser && currentUser.role === 'Validator') ? query(proposalsCollectionRef, where("status", "==", "Pending"), limit(3)) : null, [proposalsCollectionRef, currentUser]);
    const { data: pendingProposals, isLoading: arePendingProposalsLoading } = useCollection<Proposal>(pendingProposalsQuery);

    // For Donor
    const recentDonationsQuery = useMemoFirebase(() => (currentUser && currentUser.role === 'Donor') ? query(collection(firestore, "users", currentUser.id, 'donations'), limit(5)) : null, [currentUser, firestore]);
    const { data: recentDonations } = useCollection(recentDonationsQuery);


    const ResponderDashboard = ({ user }: { user: User }) => {
        const disasters = getDisasters();
        const activeDisaster = disasters.find(d => d.id === 'd1'); // Mock active disaster

        return (
            <>
                <PageHeader
                    title="Responder Dashboard"
                    description={`Welcome back, ${user.name}. Here's what's happening.`}
                />
                <div className="container pb-8">
                    <div className="mb-8 grid gap-4 sm:grid-cols-3">
                        <Button asChild size="lg" className="h-auto py-4">
                            <Link href="/proposals/create" className="flex flex-col items-center">
                                <FilePlus2 className="h-6 w-6 mb-1"/>
                                <span>Create Proposal</span>
                            </Link>
                        </Button>
                         <Button asChild size="lg" className="h-auto py-4" variant="secondary">
                            <Link href="/dashboard/my-proposals" className="flex flex-col items-center">
                                <History className="h-6 w-6 mb-1"/>
                                <span>My Proposals</span>
                            </Link>
                        </Button>
                        <Button asChild size="lg" className="h-auto py-4" variant="outline">
                            <Link href="/verify" className="flex flex-col items-center">
                                <Camera className="h-6 w-6 mb-1"/>
                                <span>Upload Proof</span>
                            </Link>
                        </Button>
                    </div>

                    {activeDisaster && (
                        <section className="mb-8">
                            <h2 className="text-2xl font-bold font-headline mb-4">Active Disaster In Your Area</h2>
                            <Card className="bg-destructive/10 border-destructive/20">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-destructive"><Siren/> {activeDisaster.name}</CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        Started: {new Date(activeDisaster.dateStarted).toLocaleDateString()} | Affected Population: {activeDisaster.affected.toLocaleString()}
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                        <div>
                                            <div className="font-bold text-2xl font-code text-primary">${activeDisaster.fundsRaised.toLocaleString()}</div>
                                            <div className="text-sm text-muted-foreground">Funds Available</div>
                                        </div>
                                        <div>
                                            <div className="font-bold text-2xl">{activeDisaster.proposals.length}</div>
                                            <div className="text-sm text-muted-foreground">Active Proposals</div>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button asChild className="w-full">
                                        <Link href={`/disasters/${activeDisaster.id}`}>Create Proposal For This</Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        </section>
                    )}
                    
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold font-headline mb-4">My Active Proposals</h2>
                        {areMyProposalsLoading && <p>Loading proposals...</p>}
                        {myProposals && myProposals.length > 0 ? (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {myProposals.map((proposal) => (
                                    <ProposalCard key={proposal.id} proposal={proposal} />
                                ))}
                            </div>
                        ) : (
                            <Card>
                                <CardContent className="p-10 text-center text-muted-foreground">
                                <p>You haven't submitted any proposals yet.</p>
                                <Button asChild className="mt-4">
                                    <Link href="/proposals/create">Create Your First Proposal</Link>
                                </Button>
                                </CardContent>
                            </Card>
                        )}
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold font-headline mb-4">Performance Metrics</h2>
                        <div className="grid gap-4 md:grid-cols-3">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Proposals Completed</CardTitle>
                                    <History className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                <div className="text-2xl font-bold">8</div>
                                <p className="text-xs text-muted-foreground">100% success rate</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Avg. Delivery Time</CardTitle>
                                <BarChart className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                <div className="text-2xl font-bold">18h</div>
                                <p className="text-xs text-muted-foreground">from funding to delivery</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Reputation Score</CardTitle>
                                <Award className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                <div className="text-2xl font-bold">{user.reputation}/100</div>
                                <p className="text-xs text-muted-foreground">Top 5% of responders</p>
                                </CardContent>
                            </Card>
                        </div>
                    </section>
                </div>
            </>
        );
    }

    const AdminDashboard = ({ user }: { user: User }) => (
        <>
            <PageHeader
                title="Admin Dashboard"
                description={`Welcome back, ${user.name}. Here's the system overview.`}
            />
            <div className="container pb-8 space-y-8">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Treasury Value</CardTitle>
                            <Landmark className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">$4,215,831</div>
                            <p className="text-xs text-muted-foreground">+2.1% from last month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+1,234</div>
                            <p className="text-xs text-muted-foreground">+12.2% from last month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Disasters</CardTitle>
                            <Siren className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">3</div>
                            <p className="text-xs text-muted-foreground">Across 2 countries</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Proposals</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">12</div>
                            <p className="text-xs text-muted-foreground">Awaiting validation</p>
                        </CardContent>
                    </Card>
                </div>
                 <Card>
                    <CardHeader>
                        <CardTitle>Treasury Growth</CardTitle>
                        <CardDescription>A chart showing the treasury balance over the last year.</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={350}>
                            <RechartsBarChart data={chartData}>
                                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`}/>
                                <Bar dataKey="total" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                            </RechartsBarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </>
    )

    const DonorDashboard = ({ user }: { user: User }) => (
         <>
            <PageHeader
                title="Donor Dashboard"
                description={`Welcome back, ${user.name}. Thank you for your support.`}
            />
            <div className="container pb-8 space-y-8">
                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Donated</CardTitle>
                            <HandHeart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">12.5 SOL</div>
                            <p className="text-xs text-muted-foreground">across 8 donations</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Proposals Funded</CardTitle>
                           <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">5</div>
                            <p className="text-xs text-muted-foreground">You've helped fund 5 critical proposals</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Voting Power</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">125</div>
                            <p className="text-xs text-muted-foreground">Based on your contributions</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Reputation</CardTitle>
                            <Award className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{user.reputation}/100</div>
                            <p className="text-xs text-muted-foreground">Top 20% of donors</p>
                        </CardContent>
                    </Card>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Impact</CardTitle>
                        <CardDescription>Your latest contributions are helping these efforts.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {recentDonations && recentDonations.length > 0 ? (
                        <ul className="space-y-4">
                            {recentDonations.map(donation => (
                                <li key={donation.id} className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Donation to {donation.disasterId.replace('d', 'Disaster ')}</p>
                                        <p className="text-sm text-muted-foreground">{new Date(donation.timestamp).toLocaleDateString()}</p>
                                    </div>
                                    <div className="font-bold font-code text-primary">{donation.amount.toFixed(2)} SOL</div>
                                </li>
                            ))}
                        </ul>
                        ) : (
                            <p className="text-muted-foreground text-center">No recent donations.</p>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/dashboard/my-impact">View Full Impact History</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </>
    )

    const ValidatorDashboard = ({ user }: { user: User }) => (
         <>
            <PageHeader
                title="Validator Dashboard"
                description={`Welcome back, ${user.name}. Here are proposals awaiting verification.`}
            />
            <div className="container pb-8 space-y-8">
                 <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">12</div>
                            <p className="text-xs text-muted-foreground">proposals need review</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Verifications Completed</CardTitle>
                            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">152</div>
                            <p className="text-xs text-muted-foreground">in the last 30 days</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Reputation Score</CardTitle>
                            <Award className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{user.reputation}/100</div>
                            <p className="text-xs text-muted-foreground">Top 10% of validators</p>
                        </CardContent>
                    </Card>
                 </div>
                 <Card>
                    <CardHeader>
                        <CardTitle>Highest Priority Proposals</CardTitle>
                        <CardDescription>These proposals require your immediate attention for voting.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                         {arePendingProposalsLoading ? (
                             <p>Loading proposals...</p>
                         ) : pendingProposals && pendingProposals.length > 0 ? (
                            pendingProposals.map(p => <ProposalCard key={p.id} proposal={p} />)
                         ) : (
                             <p className="text-muted-foreground col-span-full text-center">No proposals are currently pending validation.</p>
                         )}
                    </CardContent>
                     <CardFooter>
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/dashboard/validator">View All Pending Proposals</Link>
                        </Button>
                    </CardFooter>
                 </Card>
            </div>
        </>
    )

    if (isUserLoading || isCurrentUserLoading) {
        return <div className="flex-1 flex items-center justify-center">Loading...</div>;
    }

    if (!currentUser) {
        return <div className="flex-1 flex items-center justify-center">User not found.</div>;
    }

    if (currentUser.role === 'Admin') {
        return <AdminDashboard user={currentUser} />;
    }
    if (currentUser.role === 'Donor') {
        return <DonorDashboard user={currentUser} />;
    }
    if (currentUser.role === 'Validator') {
        return <ValidatorDashboard user={currentUser} />;
    }

    // Default to Responder
    return <ResponderDashboard user={currentUser} />;
}
