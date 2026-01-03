'use client';

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser, useCollection, useFirebase, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import type { Donation } from "@/lib/types"; // Assuming a Donation type exists
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";

export default function MyImpactPage() {
    const { user } = useUser();
    const { firestore } = useFirebase();

    // The user's donations are stored in a subcollection for security and scalability.
    const userDonationsRef = useMemoFirebase(() =>
        user ? collection(firestore, 'users', user.uid, 'donations') : null
    , [firestore, user]);

    const { data: donations, isLoading } = useCollection<Donation>(userDonationsRef);
    
    const totalDonated = donations ? donations.reduce((acc, d) => acc + d.amount, 0) : 0;
    const totalDonations = donations ? donations.length : 0;

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <PageHeader
          title="My Impact"
          description="Track your contributions and the difference you've made."
        />
        <div className="container pb-8">
            <div className="grid gap-6 md:grid-cols-3 mb-8">
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Donated</CardTitle>
                        <span className="text-muted-foreground text-2xl font-bold font-code">SOL</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalDonated.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">across {totalDonations} donations</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Proposals Funded</CardTitle>
                        <span className="text-muted-foreground text-2xl">🗳️</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">5</div>
                        <p className="text-xs text-muted-foreground">You helped fund 5 critical proposals</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Reputation</CardTitle>
                        <span className="text-muted-foreground text-2xl">✨</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">85</div>
                        <p className="text-xs text-muted-foreground">Top 20% of donors</p>
                    </CardContent>
                </Card>
            </div>
          <Card>
            <CardHeader>
                <CardTitle>Donation History</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <p className="text-muted-foreground text-center">Loading your donation history...</p>
                ) : donations && donations.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Disaster</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className="text-right">Tx</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {donations.map(donation => (
                                <TableRow key={donation.id}>
                                    <TableCell>{format(new Date(donation.timestamp), 'MMM d, yyyy')}</TableCell>
                                    <TableCell>{donation.disasterId.replace('d', 'Disaster ')}</TableCell>
                                    <TableCell><Badge variant="secondary">{donation.amount.toFixed(2)} SOL</Badge></TableCell>
                                    <TableCell>{donation.donationType}</TableCell>
                                    <TableCell className="text-right font-mono text-xs">
                                        <a href="#" className="underline hover:text-primary">View</a>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                     <p className="text-muted-foreground text-center py-10">You haven't made any donations yet.</p>
                )}
            </CardContent>
        </Card>
      </div>
      </main>
      <SiteFooter />
    </>
  );
}
