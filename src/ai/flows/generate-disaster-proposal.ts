'use server';
/**
 * @fileOverview Generates a detailed plan for a disaster relief proposal.
 *
 * - generateDisasterProposal - A function that generates a proposal plan.
 * - GenerateDisasterProposalInput - The input type for the function.
 * - GenerateDisasterProposalOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateDisasterProposalInputSchema = z.object({
  title: z.string().describe('The title of the disaster relief proposal.'),
  description: z.
    string().
    describe(
      'A brief, one-sentence description from the user about the goal of the proposal.'
    ),
});
export type GenerateDisasterProposalInput = z.infer<
  typeof GenerateDisasterProposalInputSchema
>;

const GenerateDisasterProposalOutputSchema = z.object({
  plan: z
    .string()
    .describe(
      'A concise and simple 3-4 sentence paragraph. This plan should outline the main goal, key actions to be taken, and the expected outcome. It should be written in a clear and direct style, suitable for a proposal document.'
    ),
});
export type GenerateDisasterProposalOutput = z.infer<
  typeof GenerateDisasterProposalOutputSchema
>;

export async function generateDisasterProposal(
  input: GenerateDisasterProposalInput
): Promise<GenerateDisasterProposalOutput> {
  return generateDisasterProposalFlow(input);
}

const generateDisasterProposalPrompt = ai.definePrompt({
  name: 'generateDisasterProposalPrompt',
  input: { schema: GenerateDisasterProposalInputSchema },
  output: { schema: GenerateDisasterProposalOutputSchema },
  prompt: `
    You are an expert in disaster relief planning.
    Based on the proposal title "{{title}}" and the user's goal "{{description}}", generate a concise and simple 3-4 sentence paragraph that outlines a detailed plan.

    The plan should clearly state:
    1. The primary objective.
    2. The key actions to be taken.
    3. The expected outcome or impact.

    Keep the language clear, direct, and professional.
  `,
});

const generateDisasterProposalFlow = ai.defineFlow(
  {
    name: 'generateDisasterProposalFlow',
    inputSchema: GenerateDisasterProposalInputSchema,
    outputSchema: GenerateDisasterProposalOutputSchema,
  },
  async (input) => {
    const { output } = await generateDisasterProposalPrompt(input);
    return output!;
  }
);
