
'use client';
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getTreasuryTransactions } from "@/lib/data";
import { Landmark, Users, DollarSign, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const chartData = [
  { name: "Jan", total: Math.floor(Math.random() * 50000) + 10000 },
  { name: "Feb", total: Math.floor(Math.random() * 50000) + 10000 },
  { name: "Mar", total: Math.floor(Math.random() * 50000) + 10000 },
  { name: "Apr", total: Math.floor(Math.random() * 50000) + 10000 },
  { name: "May", total: Math.floor(Math.random() * 50000) + 10000 },
  { name: "Jun", total: Math.floor(Math.random() * 50000) + 10000 },
  { name: "Jul", total: Math.floor(Math.random() * 50000) + 10000 },
  { name: "Aug", total: Math.floor(Math.random() * 50000) + 10000 },
  { name: "Sep", total: Math.floor(Math.random() * 50000) + 10000 },
  { name: "Oct", total: Math.floor(Math.random() * 50000) + 10000 },
  { name: "Nov", total: Math.floor(Math.random() * 50000) + 10000 },
  { name: "Dec", total: Math.floor(Math.random() * 50000) + 10000 },
];

export default function TreasuryPage() {
  const transactions = getTreasuryTransactions();
  
  return (
    <>
      <PageHeader
        title="Treasury"
        description="View the DAO's treasury balance, transactions, and financial health."
      />
      <div className="container pb-8 space-y-8">
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Value Locked (TVL)</CardTitle>
                    <Landmark className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">$4,215,831</div>
                    <p className="text-xs text-muted-foreground">+2.1% from last month</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Funds Deployed</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">$2,150,000</div>
                    <p className="text-xs text-muted-foreground">To 45 disaster events</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Unique Donors</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">1,234</div>
                    <p className="text-xs text-muted-foreground">+52 since last week</p>
                </CardContent>
            </Card>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Inflow vs. Outflow</CardTitle>
                    <CardDescription>A chart showing funds in and out over the last year.</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={chartData}>
                            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`}/>
                            <Bar dataKey="total" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>The latest movements in and out of the treasury.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Type</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.map(tx => (
                                <TableRow key={tx.id}>
                                    <TableCell>
                                        <Badge variant={tx.type === 'Inbound' ? 'default' : 'secondary'} className={tx.type === 'Inbound' ? 'bg-green-500/20 text-green-700 border-green-400' : 'bg-red-500/20 text-red-700 border-red-400'}>
                                            {tx.type === 'Inbound' ? <ArrowUpRight className="h-3 w-3 mr-1"/> : <ArrowDownLeft className="h-3 w-3 mr-1"/>}
                                            {tx.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{tx.description}</div>
                                        <div className="text-xs text-muted-foreground">{new Date(tx.date).toLocaleDateString()}</div>
                                    </TableCell>
                                    <TableCell className="text-right font-code">{tx.type === 'Inbound' ? '+' : '-'}${tx.amount.toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
      </div>
    </>
  );
}
