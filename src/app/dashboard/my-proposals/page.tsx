
"use client";

import { PageHeader } from "@/components/page-header";
import { ProposalCard } from "@/components/proposal-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Proposal } from "@/lib/types";
import Link from "next/link";
import { useCollection, useFirebase, useMemoFirebase, useUser } from "@/firebase";
import { collection, query, where } from "firebase/firestore";

export default function MyProposalsPage() {
  const { user, isUserLoading } = useUser();
  const { firestore } = useFirebase();

  const proposalsCollectionRef = useMemoFirebase(() => firestore ? collection(firestore, 'proposals') : null, [firestore]);
  const myProposalsQuery = useMemoFirebase(() => (proposalsCollectionRef && user) ? query(proposalsCollectionRef, where("createdBy", "==", user.uid)) : null, [proposalsCollectionRef, user]);
  const { data: myProposals, isLoading: areMyProposalsLoading } = useCollection<Proposal>(myProposalsQuery);

  if (isUserLoading || areMyProposalsLoading) {
    return (
       <>
        <PageHeader
          title="My Proposals"
          description="Manage and track the status of all proposals you have submitted."
        />
        <div className="container pb-8 text-center">
            <p>Loading your proposals...</p>
        </div>
       </>
    )
  }

  return (
    <>
      <PageHeader
        title="My Proposals"
        description="Manage and track the status of all proposals you have submitted."
      />
      <div className="container pb-8">
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
      </div>
    </>
  );
}
