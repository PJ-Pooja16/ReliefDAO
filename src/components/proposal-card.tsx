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
import type { Proposal } from "@/lib/types";
import { getUserById } from "@/lib/data";
import { Clock, Users, DollarSign } from "lucide-react";

interface ProposalCardProps {
  proposal: Proposal;
}

export function ProposalCard({ proposal }: ProposalCardProps) {
  const user = getUserById(proposal.createdBy);
  const votePercentage = (proposal.votesYes / (proposal.votesYes + proposal.votesNo)) * 100;

  const getAvatarFallback = (name: string) => {
    const parts = name.split(" ");
    if (parts.length > 1) {
      return `${parts[0][0]}${parts[1][0]}`;
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-headline leading-tight pr-4">
            {proposal.title}
          </CardTitle>
          <StatusBadge status={proposal.status} className="flex-shrink-0" />
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
          <Avatar className="h-6 w-6">
            {/* Placeholder for user avatar */}
            <AvatarFallback>{user ? getAvatarFallback(user.name) : "UN"}</AvatarFallback>
          </Avatar>
          <span>By {user?.name || 'Unknown'}</span>
          <span className="font-mono text-xs">(Rep: {user?.reputation || 'N/A'})</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
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
        {proposal.status === "Pending" && (
          <div>
            <div className="mb-1 flex justify-between text-xs text-muted-foreground">
              <span>Votes: {proposal.votesYes}% Yes</span>
              <span>{proposal.votesNo}% No</span>
            </div>
            <Progress value={votePercentage} />
            <div className="mt-1 text-xs text-muted-foreground">
                Voting ends in 12h
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {proposal.status === "Pending" && (
          <Button className="w-full bg-accent hover:bg-accent/90">Vote Now</Button>
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
