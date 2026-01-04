
'use client';
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast }from "@/hooks/use-toast";
import { Landmark, Users, Siren, FileText } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { addDocumentNonBlocking, useFirebase } from "@/firebase";
import { collection } from "firebase/firestore";

const newDisasterSchema = z.object({
    name: z.string().min(5, "Name must be at least 5 characters"),
    location: z.string().min(3, "Location is required"),
    type: z.string().min(3, "Type is required"),
    date: z.string().min(1, "Date is required"),
    affected: z.coerce.number().min(1, "Number affected is required"),
    goal: z.coerce.number().min(1000, "Funding goal must be at least $1000"),
});
type NewDisasterForm = z.infer<typeof newDisasterSchema>;


export default function AdminDashboardPage() {
  const { toast } = useToast();
  const { firestore } = useFirebase();

  const form = useForm<NewDisasterForm>({
      resolver: zodResolver(newDisasterSchema),
      defaultValues: {
          name: "",
          location: "",
          type: "",
          affected: 0,
          goal: 100000,
      }
  });

  const onSubmit = (data: NewDisasterForm) => {
    if (!firestore) return;
    const disastersCollection = collection(firestore, 'disasters');
    const newDisaster = {
        name: data.name,
        location: data.location,
        type: data.type,
        dateStarted: data.date,
        affected: data.affected,
        fundsNeeded: data.goal,
        fundsRaised: 0,
        fundsDeployed: 0,
        status: 'Active',
        impact: 'Newly created event',
        alertLevel: 4, // Default to high alert
        proposals: [],
        proposalsFunded: 0,
        verifiedDeliveries: 0,
        image: { // Default image, can be changed later
            id: 'placeholder',
            url: 'https://picsum.photos/seed/disaster/600/400',
            hint: 'disaster relief',
        }
    };

    // This is a non-blocking fire-and-forget operation
    addDocumentNonBlocking(disastersCollection, newDisaster);

    toast({
      title: "Disaster Created",
      description: `${data.name} has been added to the active disasters list.`,
    });
    form.reset();
  };

  return (
    <>
        <PageHeader
          title="Admin Dashboard"
          description="Oversee and manage the ReliefDAO platform."
        />
        <div className="container pb-12 space-y-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Treasury Value</CardTitle>
                            <Landmark className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">$4,215,831</div>
                            <p className="text-xs text-muted-foreground">+2.1% from last month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+1,234</div>
                            <p className="text-xs text-muted-foreground">+12.2% from last month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Disasters</CardTitle>
                            <Siren className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">3</div>
                            <p className="text-xs text-muted-foreground">Across 2 countries</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Proposals</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">12</div>
                            <p className="text-xs text-muted-foreground">Awaiting validation</p>
                        </CardContent>
                    </Card>
            </div>
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle>Create New Disaster Event</CardTitle>
                    <CardDescription>Add a new disaster to the platform to begin the response process.</CardDescription>
                </CardHeader>
                <CardContent>
                   <Form {...form}>
                     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem><FormLabel>Disaster Name</FormLabel><FormControl><Input placeholder="e.g., Gujarat Cyclone 2026" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="location" render={({ field }) => (
                                <FormItem><FormLabel>Location</FormLabel><FormControl><Input placeholder="e.g., Gujarat, India" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <FormField control={form.control} name="type" render={({ field }) => (
                                <FormItem><FormLabel>Disaster Type</FormLabel><FormControl><Input placeholder="e.g., Cyclone" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="date" render={({ field }) => (
                                <FormItem><FormLabel>Start Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <FormField control={form.control} name="affected" render={({ field }) => (
                                <FormItem><FormLabel>Estimated Affected Population</FormLabel><FormControl><Input type="number" placeholder="50000" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="goal" render={({ field }) => (
                                <FormItem><FormLabel>Initial Funding Goal ($)</FormLabel><FormControl><Input type="number" placeholder="100000" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        <Button type="submit">Create Disaster Event</Button>
                     </form>
                   </Form>
                </CardContent>
            </Card>
        </div>
    </>
  );
}
