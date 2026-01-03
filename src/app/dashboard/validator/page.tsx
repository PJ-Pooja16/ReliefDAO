
'use client';

import { PageHeader } from '@/components/page-header';
import { ProposalCard } from '@/components/proposal-card';
import { Card, CardContent } from '@/components/ui/card';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import type { Proposal } from '@/lib/types';
import { collection, query, where } from 'firebase/firestore';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ValidatorPage() {
  const { firestore } = useFirebase();

  const proposalsCollectionRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'proposals') : null),
    [firestore]
  );
  const pendingProposalsQuery = useMemoFirebase(
    () =>
      proposalsCollectionRef
        ? query(proposalsCollectionRef, where('status', '==', 'Pending'))
        : null,
    [proposalsCollectionRef]
  );
  const {
    data: pendingProposals,
    isLoading: areProposalsLoading,
  } = useCollection<Proposal>(pendingProposalsQuery);

  if (areProposalsLoading) {
    return (
      <>
        <PageHeader
          title="Validator Panel"
          description="Review and vote on submitted proposals."
        />
        <div className="container pb-8 text-center">
          <p>Loading pending proposals...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Validator Panel"
        description="Review and vote on submitted proposals to ensure they meet the DAO's standards before funding."
      />
      <div className="container pb-12">
        {pendingProposals && pendingProposals.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pendingProposals.map((proposal) => (
              <ProposalCard key={proposal.id} proposal={proposal} />
            ))}
          </div>
        ) : (
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-10 text-center text-muted-foreground">
              <p>There are no proposals currently pending verification.</p>
              <Button asChild className="mt-4" variant="outline">
                <Link href="/dashboard/active-disasters">
                  View Active Disasters
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
