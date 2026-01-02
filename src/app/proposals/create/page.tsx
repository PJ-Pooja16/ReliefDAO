"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { getDisasters } from "@/lib/data";
import { generateDisasterProposal } from "@/ai/flows/generate-disaster-proposal";
import { useToast } from "@/hooks/use-toast";
import { Wand2, Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";

const proposalSchema = z.object({
  disaster: z.string().min(1, "Please select a disaster."),
  title: z.string().min(5, "Title must be at least 5 characters."),
  category: z.string().min(1, "Please select a category."),
  amount: z.coerce.number().min(1, "Amount must be greater than 0."),
  timeline: z.string().min(1, "Timeline is required."),
  description: z.string().min(20, "Description must be at least 20 characters."),
  beneficiaries: z.coerce.number().min(1, "Number of beneficiaries is required."),
  location: z.string().min(3, "Location is required."),
  verification: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one verification method.",
  }),
});

type ProposalFormValues = z.infer<typeof proposalSchema>;

const verificationMethods = [
  { id: "gps", label: "GPS Stamped Photos" },
  { id: "signatures", label: "Recipient Signatures" },
  { id: "video", label: "Video Documentation" },
  { id: "third-party", label: "Third-party Verification" },
];

export default function CreateProposalPage() {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const disasters = getDisasters();

  const form = useForm<ProposalFormValues>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      disaster: "",
      title: "",
      category: "",
      amount: 0,
      timeline: "",
      description: "",
      beneficiaries: 0,
      location: "",
      verification: [],
    },
  });

  const handleGenerate = async () => {
    const { disaster: disasterId, title } = form.getValues();
    if (!disasterId || !title) {
        toast({
            variant: "destructive",
            title: "Missing Information",
            description: "Please select a disaster and enter a title before generating."
        });
        return;
    }
    
    const disaster = disasters.find(d => d.id === disasterId);
    if (!disaster) return;

    setIsGenerating(true);
    try {
        const result = await generateDisasterProposal({
            disasterName: disaster.name,
            disasterType: disaster.type,
            locationData: disaster.location,
            resourceAvailability: "Standard local resources, community volunteers available.",
            historicalFundingData: "Similar food distribution proposals for floods were funded at an average of $12,000 for 1500 families.",
        });
        form.setValue("description", result.proposalDraft);
        toast({
            title: "Proposal Draft Generated",
            description: "The detailed plan has been populated by AI.",
        });
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Generation Failed",
            description: "Could not generate proposal draft. Please try again.",
        });
    } finally {
        setIsGenerating(false);
    }
  };

  const nextStep = async () => {
    let isValid = false;
    if (step === 1) {
        isValid = await form.trigger(["disaster", "title", "category", "amount", "timeline"]);
    } else if (step === 2) {
        isValid = await form.trigger(["description", "beneficiaries", "location"]);
    }
    
    if (isValid) setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  const onSubmit = (data: ProposalFormValues) => {
    console.log(data);
    toast({
        title: "Proposal Submitted!",
        description: "Your proposal is now pending community review and voting.",
    });
  };
  
  const progress = (step / 3) * 100;

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <PageHeader title="Create a New Proposal" description="Follow the steps to submit your relief proposal for community voting." />
        <div className="container pb-12">
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
                <Progress value={progress} className="mb-4"/>
                <CardTitle>Step {step}: {step === 1 ? 'Basic Info' : step === 2 ? 'Detailed Plan' : 'Verification & Submit'}</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className={step === 1 ? 'block' : 'hidden'}>
                    <div className="space-y-4">
                        <FormField control={form.control} name="disaster" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Disaster</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select a disaster" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {disasters.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="title" render={({ field }) => (
                            <FormItem><FormLabel>Proposal Title</FormLabel><FormControl><Input placeholder="e.g., Emergency Food Kits" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="category" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {['Food', 'Medical', 'Shelter', 'Transport', 'Other'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="amount" render={({ field }) => (
                                <FormItem><FormLabel>Amount Requested ($)</FormLabel><FormControl><Input type="number" placeholder="15000" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="timeline" render={({ field }) => (
                                <FormItem><FormLabel>Timeline</FormLabel><FormControl><Input placeholder="e.g., 48 hours" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                    </div>
                  </div>

                  <div className={step === 2 ? 'block' : 'hidden'}>
                    <div className="space-y-4">
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem>
                                <div className="flex justify-between items-center">
                                    <FormLabel>Detailed Plan</FormLabel>
                                    <Button type="button" variant="outline" size="sm" onClick={handleGenerate} disabled={isGenerating}>
                                        {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                                        Generate with AI
                                    </Button>
                                </div>
                                <FormControl><Textarea placeholder="Describe your plan..." {...field} rows={8} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="beneficiaries" render={({ field }) => (
                                <FormItem><FormLabel>Number of Beneficiaries</FormLabel><FormControl><Input type="number" placeholder="2000" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="location" render={({ field }) => (
                                <FormItem><FormLabel>Primary Location</FormLabel><FormControl><Input placeholder="e.g., Koramangala, Bengaluru" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                    </div>
                  </div>

                  <div className={step === 3 ? 'block' : 'hidden'}>
                    <div className="space-y-4">
                        <FormField control={form.control} name="verification" render={() => (
                             <FormItem>
                                <div className="mb-4">
                                    <FormLabel className="text-base">Verification Plan</FormLabel>
                                    <p className="text-sm text-muted-foreground">How will you prove aid was delivered successfully?</p>
                                </div>
                                {verificationMethods.map((item) => (
                                <FormField key={item.id} control={form.control} name="verification" render={({ field }) => (
                                    <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value?.includes(item.id)}
                                                onCheckedChange={(checked) => {
                                                return checked
                                                    ? field.onChange([...field.value, item.id])
                                                    : field.onChange(field.value?.filter((value) => value !== item.id));
                                                }}
                                            />
                                        </FormControl>
                                        <FormLabel className="font-normal">{item.label}</FormLabel>
                                    </FormItem>
                                    )}
                                />
                                ))}
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                  </div>

                  <div className="flex justify-between">
                    {step > 1 ? (
                        <Button type="button" variant="outline" onClick={prevStep}>
                            <ArrowLeft className="mr-2 h-4 w-4"/> Previous
                        </Button>
                    ) : <div></div>}
                    {step < 3 ? (
                        <Button type="button" onClick={nextStep}>
                            Next <ArrowRight className="ml-2 h-4 w-4"/>
                        </Button>
                    ) : (
                        <Button type="submit">Submit Proposal</Button>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
