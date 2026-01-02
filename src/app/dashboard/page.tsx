
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { ProposalCard } from "@/components/proposal-card";
import { getDisasters, getUserById as originalGetUserById } from "@/lib/data";
import { FilePlus2, Camera, Siren, BarChart, History, Award } from "lucide-react";
import type { Proposal, User } from "@/lib/types";

// A mock current user. In a real app, this would come from an auth context.
const MOCK_USER_ID = "u-current";
const mockUser: User = { id: MOCK_USER_ID, name: "Me", role: "Responder" as const, reputation: 85 };

// Wrapper function to handle mock user
const getUserById = (id: string): User | undefined => {
  if (id === MOCK_USER_ID) {
    return mockUser;
  }
  return originalGetUserById(id);
};

export default function DashboardPage() {
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
        description="Welcome back, Rajesh. Here's what's happening."
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
                        <CardDescription>
                            Started: {new Date(activeDisaster.dateStarted).toLocaleDateString()} | Affected Population: {activeDisaster.affected.toLocaleString()}
                        </CardDescription>
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
                  <div className="text-2xl font-bold">92/100</div>
                  <p className="text-xs text-muted-foreground">Top 5% of responders</p>
                </CardContent>
              </Card>
            </div>
        </section>
      </div>
    </>
  );

    