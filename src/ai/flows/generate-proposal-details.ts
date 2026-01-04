
'use server';

/**
 * @fileOverview Generates a detailed proposal plan using AI.
 *
 * - generateProposalDetails - A function that generates a detailed plan for a relief proposal.
 * - GenerateProposalDetailsInput - The input type for the generateProposalDetails function.
 * - GenerateProposalDetailsOutput - The return type for the generateProposalDetails function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateProposalDetailsInputSchema = z.object({
  disasterName: z.string().describe('The name of the disaster event.'),
  proposalTitle: z.string().describe('The title of the proposal.'),
  category: z.string().describe('The category of aid (e.g., Food, Medical).'),
  amount: z.number().describe('The amount of funding requested.'),
  timeline: z.string().describe('The expected timeline for completion.'),
});
export type GenerateProposalDetailsInput = z.infer<typeof GenerateProposalDetailsInputSchema>;

const GenerateProposalDetailsOutputSchema = z.object({
  detailedPlan: z.string().describe('A detailed, multi-paragraph plan for executing the proposal.'),
});
export type GenerateProposalDetailsOutput = z.infer<typeof GenerateProposalDetailsOutputSchema>;

export async function generateProposalDetails(
  input: GenerateProposalDetailsInput
): Promise<GenerateProposalDetailsOutput> {
  return generateProposalDetailsFlow(input);
}

const generateProposalDetailsPrompt = ai.definePrompt({
  name: 'generateProposalDetailsPrompt',
  input: { schema: GenerateProposalDetailsInputSchema },
  output: { schema: GenerateProposalDetailsOutputSchema },
  prompt: `You are an expert NGO coordinator drafting a funding proposal. Write a detailed execution plan based on the following information.

The plan should be professional, actionable, and instill confidence in potential donors. Break it down into logical sections like "Objective," "Execution Strategy," "Budget Allocation," and "Impact Measurement."

Disaster: {{{disasterName}}}
Proposal Title: {{{proposalTitle}}}
Category: {{{category}}}
Requested Amount: \${{{amount}}}
Timeline: {{{timeline}}}

Generate a detailed plan based on these inputs. For example, if the category is "Food", the plan should mention sourcing, logistics, and distribution methods.
`,
});

const generateProposalDetailsFlow = ai.defineFlow(
  {
    name: 'generateProposalDetailsFlow',
    inputSchema: GenerateProposalDetailsInputSchema,
    outputSchema: Generate-proposal-detailsOutputSchema,
  },
  async input => {
    const { output } = await generateProposalDetailsPrompt(input);
    return output!;
  }
);
