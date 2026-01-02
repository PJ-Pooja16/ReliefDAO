
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { ProposalCard } from "@/components/proposal-card";
import { getDisasters, getUserById as originalGetUserById } from "@/lib/data";
import { FilePlus2, Camera, Siren, BarChart, History, Award, ShieldCheck, UserCog } from "lucide-react";
import type { Proposal, User, UserRole } from "@/lib/types";

// Mock user data based on role
const MOCK_USERS: Record<UserRole, User> = {
  Responder: { id: "u-responder", name: "Rajesh", role: "Responder", reputation: 92 },
  Donor: { id: "u-donor", name: "Sarah", role: "Donor", reputation: 85 },
  Validator: { id: "u-validator", name: "Dr. Mehta", role: "Validator", reputation: 98 },
  Admin: { id: "u-admin", name: "Vijay", role: "Admin", reputation: 100 },
};

const MOCK_USER_ID = "u-current";

export default function DashboardPage() {
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        const storedRole = localStorage.getItem('userRole') as UserRole | null;
        const role = storedRole && MOCK_USERS[storedRole] ? storedRole : 'Responder';
        setCurrentUser({ ...MOCK_USERS[role], id: MOCK_USER_ID });
    }, []);

    // Wrapper function to handle mock user
    const getUserById = (id: string): User | undefined => {
        if (id === MOCK_USER_ID && currentUser) {
            return currentUser;
        }
        return originalGetUserById(id);
    };

    const ResponderDashboard = ({ user }: { user: User }) => {
        const disasters = getDisasters();
        const activeDisaster = disasters.find(d => d.id === 'd1'); // Mock active disaster in user's area
        const [myProposals, setMyProposals] = useState<Proposal[]>([]);

        useEffect(() => {
            try {
            const storedProposals: Proposal[] = JSON.parse(localStorage.getItem('proposals') || '[]');
            const filteredProposals = storedProposals.filter(p => p.createdBy === MOCK_USER_ID);
            setMyProposals(filteredProposals);
            } catch (error) {
            console.error("Failed to parse proposals from localStorage", error);
            setMyProposals([]);
            }
        }, []);

        return (
            <>
                <PageHeader
                    title="Responder Dashboard"
                    description={`Welcome back, ${user.name}. Here's what's happening.`}
                />
                <div className="container pb-8">
                    {/* Quick Actions */}
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

                    {/* Active Disaster in Area */}
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
                    
                    {/* My Active Proposals */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold font-headline mb-4">My Active Proposals</h2>
                        {myProposals.length > 0 ? (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {myProposals.map((proposal) => (
                                <ProposalCard key={proposal.id} proposal={proposal} getUserById={getUserById} />
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

                    {/* Performance Metrics */}
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
            <div className="container pb-8">
                <Card>
                    <CardHeader><CardTitle>Treasury Management</CardTitle></CardHeader>
                    <CardContent className="text-muted-foreground">Admin Treasury controls coming soon.</CardContent>
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
            <div className="container pb-8">
                <Card>
                    <CardHeader><CardTitle>My Impact</CardTitle></CardHeader>
                    <CardContent className="text-muted-foreground">Donor impact tracking coming soon.</CardContent>
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
            <div className="container pb-8">
                <Card>
                    <CardHeader><CardTitle>Pending Verifications</CardTitle></CardHeader>
                    <CardContent className="text-muted-foreground">Verification queue coming soon.</CardContent>
                </Card>
            </div>
        </>
    )

    if (!currentUser) {
        // You can render a loading state here
        return <div className="flex-1 flex items-center justify-center">Loading...</div>;
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
