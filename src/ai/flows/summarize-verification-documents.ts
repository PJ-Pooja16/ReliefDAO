'use server';

/**
 * @fileOverview Summarizes verification documents using AI to expedite aid delivery verification.
 *
 * - summarizeVerificationDocuments - A function that summarizes verification documents.
 * - SummarizeVerificationDocumentsInput - The input type for the summarizeVerificationDocuments function.
 * - SummarizeVerificationDocumentsOutput - The return type for the summarizeVerificationDocuments function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeVerificationDocumentsInputSchema = z.object({
  photos: z
    .array(z.string())
    .describe(
      'Array of photo data URIs that must include a MIME type and use Base64 encoding. Expected format: data:<mimetype>;base64,<encoded_data>.'
    ),
  receipts: z
    .array(z.string())
    .describe(
      'Array of receipt data URIs that must include a MIME type and use Base64 encoding. Expected format: data:<mimetype>;base64,<encoded_data>.'
    ),
  gpsLocation: z.string().describe('GPS location of the aid delivery.'),
  notes: z.string().describe('Additional notes about the aid delivery.'),
});
export type SummarizeVerificationDocumentsInput = z.infer<
  typeof SummarizeVerificationDocumentsInputSchema
>;

const SummarizeVerificationDocumentsOutputSchema = z.object({
  summary: z
    .string()
    .describe('A concise summary of the verification documents.'),
});
export type SummarizeVerificationDocumentsOutput = z.infer<
  typeof SummarizeVerificationDocumentsOutputSchema
>;

export async function summarizeVerificationDocuments(
  input: SummarizeVerificationDocumentsInput
): Promise<SummarizeVerificationDocumentsOutput> {
  return summarizeVerificationDocumentsFlow(input);
}

const summarizeVerificationDocumentsPrompt = ai.definePrompt({
  name: 'summarizeVerificationDocumentsPrompt',
  input: {schema: SummarizeVerificationDocumentsInputSchema},
  output: {schema: SummarizeVerificationDocumentsOutputSchema},
  prompt: `You are an AI assistant helping to summarize verification documents for aid delivery.

  Given the following information, create a concise summary of the verification:

  Photos: {{#each photos}}{{media url=this}}\n{{/each}}
  Receipts: {{#each receipts}}{{media url=this}}\n{{/each}}
  GPS Location: {{{gpsLocation}}}
  Notes: {{{notes}}}
  `,
});

const summarizeVerificationDocumentsFlow = ai.defineFlow(
  {
    name: 'summarizeVerificationDocumentsFlow',
    inputSchema: SummarizeVerificationDocumentsInputSchema,
    outputSchema: SummarizeVerificationDocumentsOutputSchema,
  },
  async input => {
    const {output} = await summarizeVerificationDocumentsPrompt(input);
    return output!;
  }
);
