
"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { ProposalCard } from "@/components/proposal-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Proposal } from "@/lib/types";
import Link from "next/link";
import { getUserById } from "@/lib/data";

// A mock current user. In a real app, this would come from an auth context.
const MOCK_USER_ID = "u-current";

export default function MyProposalsPage() {
  const [myProposals, setMyProposals] = useState<Proposal[]>([]);

  useEffect(() => {
    try {
      const storedProposals: Proposal[] = JSON.parse(localStorage.getItem('proposals') || '[]');
      // In a real app, we would filter by the currently logged-in user's ID.
      // For now, we mock this by assigning a specific ID on creation.
      const filteredProposals = storedProposals.filter(p => p.createdBy === MOCK_USER_ID);
      setMyProposals(filteredProposals);
    } catch (error) {
      console.error("Failed to parse proposals from localStorage", error);
      setMyProposals([]);
    }
  }, []);

  // Add a mock user for the proposals created client-side
  const mockUser = { id: MOCK_USER_ID, name: "Me", role: "Responder" as const, reputation: 85 };
  const originalGetUserById = getUserById;
  (getUserById as any) = (id: string) => {
    if (id === MOCK_USER_ID) return mockUser;
    return originalGetUserById(id);
  }


  return (
    <>
      <PageHeader
        title="My Proposals"
        description="Manage and track the status of all proposals you have submitted."
      />
      <div className="container pb-8">
        {myProposals.length > 0 ? (
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
      </div>
    </>
  );
}
