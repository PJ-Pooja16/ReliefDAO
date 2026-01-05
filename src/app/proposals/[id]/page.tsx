'use client';

import { notFound, useRouter, useParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  useDoc,
  useFirebase,
  useMemoFirebase,
  useUser,
  addDocumentNonBlocking,
  updateDocumentNonBlocking,
  useCollection,
} from '@/firebase';
import type { Proposal, User as AppUser, Vote } from '@/lib/types';
import {
  doc,
  collection,
  serverTimestamp,
} from 'firebase/firestore';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { PageHeader } from '@/components/page-header';
import { Loader2, ThumbsUp, ThumbsDown, CheckCircle, XCircle, ShieldCheck } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StatusBadge } from '@/components/status-badge';
import { Progress } from '@/components/ui/progress';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useState, useMemo, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  Connection,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
  PublicKey,
} from '@solana/web3.js';

// The DAO's public treasury wallet address for recording votes.
const DAO_VOTE_ADDRESS = 'Vote111111111111111111111111111111111111111'; // Example address

export default function ProposalDetailPage() {
  const params = useParams();
  const proposalId = params.id as string;
  const { firestore } = useFirebase();
  const { user: authUser, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const { connected, publicKey, sendTransaction, wallet } = useWallet();
  const [isVoting, setIsVoting] = useState<false | 'yes' | 'no'>(false);
  
  useEffect(() => {
    if (!isUserLoading && !authUser) {
      router.push('/login');
    }
  }, [authUser, isUserLoading, router]);

  const proposalRef = useMemoFirebase(
    () => (firestore && proposalId && authUser ? doc(firestore, 'proposals', proposalId) : null),
    [firestore, proposalId, authUser]
  );
  const { data: proposal, isLoading: isProposalLoading } = useDoc<Proposal>(
    proposalRef
  );
  
  const votesRef = useMemoFirebase(() => (firestore && proposalId) ? collection(firestore, `proposals/${proposalId}/votes`) : null, [firestore, proposalId]);
  const { data: votes } = useCollection<Vote>(votesRef);

  const userDocRef = useMemoFirebase(
    () => (firestore && proposal?.createdBy ? doc(firestore, 'users', proposal.createdBy) : null),
    [firestore, proposal?.createdBy]
  );
  const { data: creator } = useDoc<AppUser>(userDocRef);

  const currentUserDocRef = useMemoFirebase(
    () => (firestore && authUser ? doc(firestore, 'users', authUser.uid) : null),
    [firestore, authUser]
  );
  const { data: currentUser } = useDoc<AppUser>(currentUserDocRef);
  
  const userHasVoted = useMemo(() => {
    if (!authUser || !votes) return false;
    return votes.some(vote => vote.voterId === authUser.uid);
  }, [authUser, votes]);

  const handleVote = async (decision: 'yes' | 'no') => {
    if (!publicKey || !authUser || !proposal) {
      toast({
        variant: 'destructive',
        title: 'Cannot Vote',
        description: 'Please connect your wallet and log in to vote.',
      });
      return;
    }
    
    if (userHasVoted) {
      toast({
        variant: "destructive",
        title: "Already Voted",
        description: "You have already cast your vote for this proposal."
      });
      return;
    }

    setIsVoting(decision);
    let signature = '';
    let isSimulation = false;

    try {
      const network = 'https://api.devnet.solana.com';
      const connection = new Connection(network);

      // A tiny amount of SOL to record the transaction on-chain
      const lamports = 0.0001 * LAMPORTS_PER_SOL;

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(DAO_VOTE_ADDRESS),
          lamports: lamports,
        })
      );

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      signature = await sendTransaction(transaction, connection);
      
      toast({
        title: 'Vote Cast!',
        description: `Your vote has been recorded on-chain.`,
      });

    } catch (error: any) {
      console.error('Voting failed', error);

       if (error.message.includes('insufficient lamports') || (wallet?.adapter.name === 'Phantom' && error.code === 4001)) {
           isSimulation = true;
           signature = `simulated_${Date.now()}`;
           toast({
                title: 'Vote Simulation Successful!',
                description: `A real transaction would have been sent to vote ${decision}.`,
            });
       } else {
            toast({
                variant: 'destructive',
                title: 'Vote Failed',
                description: error.message || 'An unknown error occurred.',
            });
            setIsVoting(false);
            return; // Stop execution if it's a real, non-simulation error
       }
    }

    try {
        // Record vote in Firestore
        if (proposal.id) {
            const votesColRef = collection(firestore, `proposals/${proposal.id}/votes`);
            const newVote = {
                proposalId: proposal.id,
                voterId: authUser.uid,
                decision: decision === 'yes',
                createdAt: serverTimestamp(),
                txSignature: signature,
            };
            addDocumentNonBlocking(votesColRef, newVote);

            // Update proposal vote counts
            const proposalDocRef = doc(firestore, `proposals/${proposal.id}`);
            const currentYes = proposal.votesYes || 0;
            const currentNo = proposal.votesNo || 0;

            const updatedVotes = decision === 'yes'
                ? { votesYes: currentYes + 1 }
                : { votesNo: currentNo + 1 };

            updateDocumentNonBlocking(proposalDocRef, updatedVotes);
        }
    } catch (dbError: any) {
        console.error('Failed to record vote in DB', dbError);
        toast({
            variant: 'destructive',
            title: 'Database Error',
            description: 'Your vote was sent on-chain, but failed to record in our database. Please contact support.',
        });
    } finally {
        setIsVoting(false);
    }
  };

  const getAvatarFallback = (name: string) => {
    const parts = name.split(' ');
    if (parts.length > 1) {
      return `${parts[0][0]}${parts[1][0]}`;
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (isProposalLoading || isUserLoading || !authUser || !proposalId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!proposal) {
    // This can happen briefly while loading or if the user is redirected.
    // Or if the document doesn't exist.
     if (!isProposalLoading) {
      notFound();
    }
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const votePercentage =
    (proposal.votesYes / (proposal.votesYes + proposal.votesNo)) * 100;
  const canVote =
    proposal.status === 'Pending' && currentUser?.role === 'Validator';

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <PageHeader
          title="Proposal Details"
          description="Review the full proposal and cast your vote."
        />
        <div className="container pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-2xl font-headline">
                      {proposal.title}
                    </CardTitle>
                    <StatusBadge status={proposal.status} />
                  </div>
                  {creator && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>
                          {getAvatarFallback(creator.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span>
                        By {creator.name} (Rep: {creator.reputation})
                      </span>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{proposal.description}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Verification Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2">
                    {proposal.verificationPlan.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Voting Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Progress value={isNaN(votePercentage) ? 0 : votePercentage} className="h-3" />
                  <div className="flex justify-between text-sm">
                    <div className="font-bold flex items-center">
                       <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                       Approve: {proposal.votesYes}
                    </div>
                     <div className="font-bold flex items-center">
                       <XCircle className="h-4 w-4 mr-2 text-red-500" />
                       Reject: {proposal.votesNo}
                    </div>
                  </div>
                </CardContent>
                {canVote && (
                  <CardFooter className="flex flex-col gap-2">
                    {!connected ? (
                       <div className="w-full text-center p-4 border-dashed border-2 rounded-lg flex flex-col items-center gap-4">
                          <p className="text-muted-foreground text-sm">Connect your wallet to vote.</p>
                          <WalletMultiButton />
                        </div>
                    ) : userHasVoted ? (
                         <div className="w-full text-center p-4 bg-muted rounded-lg">
                            <p className="text-muted-foreground font-medium flex items-center justify-center">
                               <ShieldCheck className="h-4 w-4 mr-2 text-green-600"/> Your vote has been recorded.
                            </p>
                        </div>
                    ) : (
                      <>
                        <Button className="w-full" onClick={() => handleVote('yes')} disabled={!!isVoting}>
                          {isVoting === 'yes' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ThumbsUp className="mr-2 h-4 w-4" />}
                          Approve
                        </Button>
                        <Button className="w-full" variant="destructive" onClick={() => handleVote('no')} disabled={!!isVoting}>
                           {isVoting === 'no' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ThumbsDown className="mr-2 h-4 w-4" />}
                          Reject
                        </Button>
                      </>
                    )}
                  </CardFooter>
                )}
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                   <p><strong>Amount:</strong> ${proposal.amountRequested.toLocaleString()}</p>
                   <p><strong>Beneficiaries:</strong> {proposal.beneficiaries.toLocaleString()}</p>
                   <p><strong>Location:</strong> {proposal.location}</p>
                   <p><strong>Timeline:</strong> {proposal.timeline}</p>
                   <p><strong>Category:</strong> {proposal.category}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
