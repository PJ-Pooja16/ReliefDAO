'use server';

/**
 * @fileOverview AI-powered proposal generator for disaster relief.
 *
 * - generateDisasterProposal - A function that generates a disaster relief proposal.
 * - GenerateDisasterProposalInput - The input type for the generateDisasterProposal function.
 * - GenerateDisasterProposalOutput - The return type for the generateDisasterProposal function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDisasterProposalInputSchema = z.object({
  disasterName: z.string().describe('The name of the disaster.'),
  disasterType: z.string().describe('The type of disaster (e.g., flood, earthquake).'),
  locationData: z.string().describe('Geographical location data of the disaster.'),
  resourceAvailability: z.string().describe('Information on available resources.'),
  historicalFundingData: z.string().describe('Historical funding data for similar disasters.'),
});
export type GenerateDisasterProposalInput = z.infer<typeof GenerateDisasterProposalInputSchema>;

const GenerateDisasterProposalOutputSchema = z.object({
  proposalDraft: z.string().describe('The generated disaster relief proposal draft.'),
});
export type GenerateDisasterProposalOutput = z.infer<typeof GenerateDisasterProposalOutputSchema>;

export async function generateDisasterProposal(input: GenerateDisasterProposalInput): Promise<GenerateDisasterProposalOutput> {
  return generateDisasterProposalFlow(input);
}

const proposalPrompt = ai.definePrompt({
  name: 'proposalPrompt',
  input: {schema: GenerateDisasterProposalInputSchema},
  output: {schema: GenerateDisasterProposalOutputSchema},
  prompt: `You are an AI assistant specialized in drafting disaster relief proposals.

  Based on the following information, generate a comprehensive disaster relief proposal draft, that adheres to modern aid principles like:
    *   Transparency
    *   Efficiency
    *   Local Empowerment

  Disaster Name: {{{disasterName}}}
  Disaster Type: {{{disasterType}}}
  Location Data: {{{locationData}}}
  Resource Availability: {{{resourceAvailability}}}
  Historical Funding Data: {{{historicalFundingData}}}

  The proposal draft should include the following sections:
  1.  Executive Summary
  2.  Problem Statement
  3.  Proposed Solution
  4.  Budget Breakdown
  5.  Verification Plan
  6.  Impact Measurement

  Optimize the proposal based on historical funding data to increase its chances of approval, taking into account transparency, efficiency, and local empowerment.

  Proposal Draft:`, 
});

const generateDisasterProposalFlow = ai.defineFlow(
  {
    name: 'generateDisasterProposalFlow',
    inputSchema: GenerateDisasterProposalInputSchema,
    outputSchema: GenerateDisasterProposalOutputSchema,
  },
  async input => {
    const {output} = await proposalPrompt(input);
    return output!;
  }
);
