import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import type { Disaster } from "@/lib/types";
import { Users, Target, FileText, ArrowRight } from "lucide-react";

interface DisasterCardProps {
  disaster: Disaster;
}

export function DisasterCard({ disaster }: DisasterCardProps) {
  const fundingPercentage = (disaster.fundsRaised / disaster.fundsNeeded) * 100;

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="p-0 relative">
        <StatusBadge status={disaster.status} className="absolute top-3 right-3 z-10" />
        <Link href={`/disasters/${disaster.id}`} className="block">
          <Image
            src={disaster.image.url}
            alt={disaster.name}
            width={600}
            height={400}
            className="w-full h-48 object-cover"
            data-ai-hint={disaster.image.hint}
          />
        </Link>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <Link href={`/disasters/${disaster.id}`} className="hover:underline">
            <CardTitle className="text-lg font-bold font-headline mb-2">{disaster.name}</CardTitle>
        </Link>
        
        <div className="space-y-3 text-sm text-muted-foreground">
           <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            <span><span className="font-bold text-foreground">${(disaster.fundsRaised / 1000).toFixed(0)}k</span> raised of ${(disaster.fundsNeeded / 1000).toFixed(0)}k</span>
          </div>
          <Progress value={fundingPercentage} className="h-2" />
          <div className="flex justify-between items-center">
             <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{disaster.impact}</span>
            </div>
            <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>{disaster.proposals.length} Proposals</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-muted/50">
        <Button asChild className="w-full">
          <Link href={`/disasters/${disaster.id}`}>
            View Details <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
