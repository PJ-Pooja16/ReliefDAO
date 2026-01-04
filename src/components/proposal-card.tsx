

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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Proposal, User as AppUser } from "@/lib/types";
import { Clock, Users, DollarSign, ArrowRight } from "lucide-react";
import { useDoc, useFirebase, useMemoFirebase, useUser } from "@/firebase";
import { doc } from "firebase/firestore";

interface ProposalCardProps {
  proposal: Proposal;
}

export function ProposalCard({ proposal }: ProposalCardProps) {
  const { firestore } = useFirebase();
  const { user: authUser } = useUser();
  
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
  
  return (
    <Card className="transition-shadow hover:shadow-md flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <Link href={`/proposals/${proposal.id}`} className="hover:underline pr-4">
            <CardTitle className="text-lg font-headline leading-tight">
              {proposal.title}
            </CardTitle>
          </Link>
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
        {(proposal.status === 'Pending' || proposal.status === 'Approved' || proposal.status === 'Rejected') && (
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>{proposal.votesNo} No</span>
                <span>{proposal.votesYes} Yes</span>
            </div>
            <Progress value={isNaN(votePercentage) ? 0 : votePercentage} className="h-2" />
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full" variant="secondary">
          <Link href={`/proposals/${proposal.id}`}>
             View & Vote <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
