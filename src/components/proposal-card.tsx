
"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Proposal, User as AppUser } from "@/lib/types";
import { Clock, Users, DollarSign, ThumbsUp, ThumbsDown } from "lucide-react";
import { useDoc, useFirebase, useMemoFirebase, useUser, addDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase";
import { collection, doc, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

interface ProposalCardProps {
  proposal: Proposal;
}

export function ProposalCard({ proposal }: ProposalCardProps) {
  const { firestore } = useFirebase();
  const { user: authUser } = useUser();
  const { toast } = useToast();
  
  const userDocRef = useMemoFirebase(() => proposal.createdBy ? doc(firestore, "users", proposal.createdBy) : null, [firestore, proposal.createdBy]);
  const { data: user } = useDoc<AppUser>(userDocRef);

  const currentUserDocRef = useMemoFirebase(() => authUser ? doc(firestore, "users", authUser.uid) : null, [firestore, authUser]);
  const { data: currentUser } = useDoc<AppUser>(currentUserDocRef);
  
  const votePercentage = (proposal.votesYes / (proposal.votesYes + proposal.votesNo)) * 100;

  const getAvatarFallback = (name: string) => {
    const parts = name.split(" ");
    if (parts.length > 1) {
      return `${parts[0][0]}${parts[1][0]}`;
    }
    return name.substring(0, 2).toUpperCase();
  };
  
  const handleVote = async (decision: 'yes' | 'no') => {
    if (!authUser || !proposal.id) return;

    // 1. Add a vote to the subcollection
    const votesColRef = collection(firestore, `proposals/${proposal.id}/votes`);
    const newVote = {
        proposalId: proposal.id,
        voterId: authUser.uid,
        decision: decision === 'yes',
        createdAt: serverTimestamp(),
    };
    addDocumentNonBlocking(votesColRef, newVote);

    // 2. Update the vote counts on the proposal document
    const proposalDocRef = doc(firestore, `proposals/${proposal.id}`);
    const updatedVotes = decision === 'yes'
        ? { votesYes: (proposal.votesYes || 0) + 1 }
        : { votesNo: (proposal.votesNo || 0) + 1 };
    
    updateDocumentNonBlocking(proposalDocRef, updatedVotes);
    
    toast({
        title: "Vote Cast!",
        description: `Your vote to ${decision === 'yes' ? 'approve' : 'reject'} has been recorded.`,
    });
  }

  return (
    <Card className="transition-shadow hover:shadow-md flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-headline leading-tight pr-4">
            {proposal.title}
          </CardTitle>
          <StatusBadge status={proposal.status} className="flex-shrink-0" />
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback>{user ? getAvatarFallback(user.name) : "UN"}</AvatarFallback>
          </Avatar>
          <span>By {user?.name || 'Unknown'}</span>
          <span className="font-mono text-xs">(Rep: {user?.reputation || 'N/A'})</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex-grow">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <DollarSign className="h-4 w-4 text-green-500" />
            <div>
              <div className="font-bold text-foreground">
                ${proposal.amountRequested.toLocaleString()}
              </div>
              <div>Requested</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4 text-blue-500" />
            <div>
              <div className="font-bold text-foreground">
                {proposal.beneficiaries.toLocaleString()}
              </div>
              <div>Beneficiaries</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4 text-orange-500" />
            <div>
              <div className="font-bold text-foreground">
                {proposal.timeline}
              </div>
              <div>Timeline</div>
            </div>
          </div>
        </div>
        {proposal.status === 'Pending' && currentUser?.role === 'Validator' && (
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>{proposal.votesNo} No</span>
                <span>{proposal.votesYes} Yes</span>
            </div>
            <Progress value={votePercentage} className="h-2" />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-stretch gap-2">
         {proposal.status === 'Pending' && currentUser?.role === 'Validator' && (
          <div className="flex gap-2 w-full">
            <Button variant="outline" className="w-full" onClick={() => handleVote('no')}>
              <ThumbsDown className="mr-2 h-4 w-4"/> Reject
            </Button>
            <Button className="w-full" onClick={() => handleVote('yes')}>
              <ThumbsUp className="mr-2 h-4 w-4"/> Approve
            </Button>
          </div>
        )}
        {proposal.status === "Approved" && (
          <Button variant="secondary" className="w-full">Track Delivery</Button>
        )}
         {proposal.status === "Completed" && (
          <Button variant="outline" className="w-full">View Report</Button>
        )}
      </CardFooter>
    </Card>
  );
}
