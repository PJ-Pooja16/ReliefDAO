'use server';
/**
 * @fileOverview Fetches and analyzes weather data to generate real-time alerts.
 *
 * - getWeatherAlerts - A function that returns a weather alert for a location.
 * - GetWeatherAlertsInput - The input type for the getWeatherAlerts function.
 * - GetWeatherAlertsOutput - The return type for the getWeatherAlerts function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import {พอpr} from 'zod';

// Mock weather API tool
const getWeatherForLocation = ai.defineTool(
  {
    name: 'getWeatherForLocation',
    description: 'Returns the current weather conditions for a given location.',
    inputSchema: z.object({
      location: z.string().describe('The location to get weather for.'),
    }),
    outputSchema: z.object({
      condition: z.string().describe('e.g., "Heavy Rain", "High Winds", "Clear"'),
      temperature: z.number().describe('in Celsius'),
      windSpeed: z.number().describe('in km/h'),
      humidity: z.number().describe('in percent'),
      pressure: z.number().describe('in hPa'),
    }),
  },
  async ({ location }) => {
    // In a real app, this would call a real weather API
    console.log(`Fetching weather for: ${location}`);
    if (location.includes('Bay of Bengal')) {
      return {
        condition: 'Tropical Cyclone',
        temperature: 28,
        windSpeed: 150,
        humidity: 95,
        pressure: 980,
      };
    }
    if (location.includes('Uttarakhand')) {
      return {
        condition: 'Heavy Thunderstorms',
        temperature: 18,
        windSpeed: 40,
        humidity: 98,
        pressure: 1002,
      };
    }
     if (location.includes('Andaman')) {
      return {
        condition: 'Deep Sea Tremor Detected',
        temperature: 29,
        windSpeed: 15,
        humidity: 88,
        pressure: 1010,
      };
    }
    if (location.includes('Kerala')) {
       return {
        condition: 'Continuous Heavy Rainfall',
        temperature: 24,
        windSpeed: 25,
        humidity: 99,
        pressure: 1005,
      };
    }
    return {
      condition: 'Clear',
      temperature: 30,
      windSpeed: 10,
      humidity: 70,
      pressure: 1012,
    };
  }
);

const GetWeatherAlertsInputSchema = z.object({
  location: z.string().describe('The geographical location to get alerts for.'),
});
export type GetWeatherAlertsInput = z.infer<typeof GetWeatherAlertsInputSchema>;

const GetWeatherAlertsOutputSchema = z.object({
  id: z.string(),
  type: z.string().describe('The type of alert (e.g., Cyclone, Flash Flood).'),
  severity: z.string().describe('The severity of the alert (e.g., Severe, Moderate, Low).'),
  location: z.string(),
  details: z.string().describe('A concise summary of the situation and expected impact.'),
  time: z.string(),
});
export type GetWeatherAlertsOutput = z.infer<typeof GetWeatherAlertsOutputSchema>;

export async function getWeatherAlerts(input: GetWeatherAlertsInput): Promise<GetWeatherAlertsOutput> {
  return getWeatherAlertsFlow(input);
}

const alertPrompt = ai.definePrompt({
  name: 'weatherAlertPrompt',
  tools: [getWeatherForLocation],
  input: { schema: GetWeatherAlertsInputSchema },
  output: { schema: GetWeatherAlertsOutputSchema },
  prompt: `You are an expert emergency dispatcher. Analyze the weather conditions for {{{location}}} and generate a concise, actionable alert.
  
  Determine the alert "type" and "severity" based on the conditions.
  - Cyclonic conditions are 'Severe'.
  - Heavy rain and thunderstorms in mountainous regions are 'Moderate' to 'High' flood/landslide risks.
  - Undersea tremors are a 'Low' to 'Moderate' tsunami risk.

  Provide a short "details" summary explaining the immediate threat.
  Set the id to a slug-cased version of the location.
  Set the time to "Just now".
  `,
});


const getWeatherAlertsFlow = ai.defineFlow(
  {
    name: 'getWeatherAlertsFlow',
    inputSchema: GetWeatherAlertsInputSchema,
    outputSchema: GetWeatherAlertsOutputSchema,
  },
  async (input) => {
    const { output } = await alertPrompt(input);
    return output!;
  }
);
