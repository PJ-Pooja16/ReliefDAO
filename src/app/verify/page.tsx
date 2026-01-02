
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, FileText, Wand2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { summarizeVerificationDocuments } from "@/ai/flows/summarize-verification-documents";

const verifySchema = z.object({
  photos: z.custom<FileList>().refine(files => files.length > 0, "At least one photo is required."),
  receipts: z.custom<FileList>().optional(),
  gpsLocation: z.string().min(1, "GPS location is required."),
  notes: z.string().optional(),
});

type VerifyFormValues = z.infer<typeof verifySchema>;

const fileToDataURI = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

export default function VerifyPage() {
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [summary, setSummary] = useState("");
  const { toast } = useToast();

  const form = useForm<VerifyFormValues>({
    resolver: zodResolver(verifySchema),
  });

  const handleSummarize = async () => {
    const { photos, receipts, gpsLocation, notes } = form.getValues();
    
    if (!photos || photos.length === 0) {
        toast({ variant: "destructive", title: "Missing Photos", description: "Please upload at least one photo." });
        return;
    }
    if (!gpsLocation) {
        toast({ variant: "destructive", title: "Missing Location", description: "Please provide a GPS location." });
        return;
    }

    setIsSummarizing(true);
    setSummary("");
    try {
        const photoDataUris = await Promise.all(Array.from(photos).map(fileToDataURI));
        const receiptDataUris = receipts ? await Promise.all(Array.from(receipts).map(fileToDataURI)) : [];

        const result = await summarizeVerificationDocuments({
            photos: photoDataUris,
            receipts: receiptDataUris,
            gpsLocation,
            notes: notes || "",
        });
        
        setSummary(result.summary);
        toast({ title: "Summary Generated", description: "AI has summarized your verification documents." });

    } catch (error) {
        console.error("Summarization error:", error);
        toast({ variant: "destructive", title: "Summarization Failed", description: "Could not generate summary." });
    } finally {
        setIsSummarizing(false);
    }
  };


  const onSubmit = async (data: VerifyFormValues) => {
    setIsSubmitting(true);
    await new Promise(res => setTimeout(res, 1500)); // Simulate submission
    console.log(data);
    toast({
      title: "Verification Submitted!",
      description: "Your proof of delivery is being processed on-chain.",
    });
    setIsSubmitting(false);
    form.reset();
    setSummary("");
  };

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <PageHeader
          title="Verification Portal"
          description="Upload proof of delivery to complete your proposal and build trust."
        />
        <div className="container pb-12">
          <Card className="max-w-2xl mx-auto">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardHeader>
                  <CardTitle>Submit Proof of Delivery</CardTitle>
                  <CardDescription>
                    Provide the necessary documentation to verify the successful completion of your aid delivery.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField control={form.control} name="photos" render={({ field }) => (
                      <FormItem>
                          <FormLabel>Delivery Photos</FormLabel>
                          <FormControl>
                              <Input type="file" accept="image/*" multiple onChange={e => field.onChange(e.target.files)} />
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                  )} />
                  <FormField control={form.control} name="receipts" render={({ field }) => (
                      <FormItem>
                          <FormLabel>Receipts / Invoices (Optional)</FormLabel>
                          <FormControl>
                              <Input type="file" accept="image/*,application/pdf" multiple onChange={e => field.onChange(e.target.files)} />
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                  )} />
                  <FormField control={form.control} name="gpsLocation" render={({ field }) => (
                      <FormItem>
                          <FormLabel>GPS Location</FormLabel>
                          <FormControl>
                              <Input placeholder="e.g., 12.9716° N, 77.5946° E" {...field} />
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                  )} />
                   <FormField control={form.control} name="notes" render={({ field }) => (
                      <FormItem>
                          <FormLabel>Field Notes (Optional)</FormLabel>
                          <FormControl>
                              <Textarea placeholder="Any additional context or notes from the field..." {...field} />
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                  )} />
                  
                  {summary && (
                      <Card className="bg-muted/50">
                        <CardHeader className="flex flex-row items-center gap-2 pb-2">
                           <FileText className="w-5 h-5 text-primary"/>
                           <CardTitle className="text-base">AI-Generated Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{summary}</p>
                        </CardContent>
                      </Card>
                  )}

                </CardContent>
                <CardFooter className="justify-between gap-4">
                    <Button type="button" variant="outline" onClick={handleSummarize} disabled={isSummarizing}>
                        {isSummarizing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                        {isSummarizing ? 'Summarizing...' : 'Generate Summary'}
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isSubmitting ? "Submitting..." : "Submit Verification"}
                    </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

    