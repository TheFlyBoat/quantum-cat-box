
'use server';

/**
 * @fileOverview This file defines the Genkit flow for generating a witty, motivational, or humorous message about a cat.
 *
 * It includes:
 * - generateCatMessage: The main function to trigger the message generation flow.
 * - GenerateCatMessageInput: The input type for the generateCatMessage function (currently empty).
 * - GenerateCatMessageOutput: The output type for the generateCatMessage function, containing the generated message.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCatMessageInputSchema = z.object({
  catId: z.string().describe('Unique identifier of the revealed cat'),
  catName: z.string().describe('Display name of the revealed cat'),
  catType: z.string().describe('Outcome type of the cat (Alive, Dead, Paradox, etc.)'),
  catDescription: z.string().optional().describe('Brief description of the cat to inspire message variety'),
});
export type GenerateCatMessageInput = z.infer<typeof GenerateCatMessageInputSchema>;

const GenerateCatMessageOutputSchema = z.object({
  message: z.string().describe('A witty, motivational, or philosophical message about the cat.'),
});
export type GenerateCatMessageOutput = z.infer<typeof GenerateCatMessageOutputSchema>;

export async function generateCatMessage(input: GenerateCatMessageInput): Promise<GenerateCatMessageOutput> {
  return generateCatMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCatMessagePrompt',
  input: {schema: GenerateCatMessageInputSchema},
  output: {schema: GenerateCatMessageOutputSchema},
  prompt: `You are a feline oracle, a mysterious and witty cat that dispenses cryptic, thought-provoking wisdom. Your tone is that of a sophisticated, slightly aloof self-help guru.

You are speaking specifically about the cat described below. Use the context to craft a personalised fortune that clearly references the cat.

Cat profile:
- Name: {{catName}}
- Type: {{catType}}
{{#if catDescription}}- Description: {{catDescription}}{{/if}}

Generate a single, short (20 words or less) and insightful message.

Your message must blend feline wisdom with mature, motivational, or philosophical insight. It should be clever, concise, and feel like a secret whispered from the universe.

**CRITICAL INSTRUCTIONS:**
- **DO NOT** use puns.
- **DO NOT** use "cutesy" or overly childish language (e.g., "purrfect", "meowgical").
- **DO** aim for a tone that is more sophisticated, reflective, and oracle-like.

Here are some examples of the style you should emulate:
- "The universe is a sunbeam. You decide whether to nap in it."
- "Your comfort zone is just a box. You know what to do with boxes."
- "Seek the vantage point from which your problems look small."
- "That which you are seeking is also seeking you, but it's pretending not to be."
- "Stalk your ambitions with patience. Pounce when the moment is right."
- "Shed the expectations that no longer fit."
- "The best view comes after the hardest climb... or from the highest shelf."

Generate a new, original message in that style.`,
});

async function buildFallbackMessage(input: GenerateCatMessageInput): Promise<GenerateCatMessageOutput> {
  const fallbackModule = await import('@/lib/fallback-messages.json');
  const fallbackPayload = fallbackModule.default as { messages: string[] } | string[];
  const messagePool = Array.isArray(fallbackPayload) ? fallbackPayload : fallbackPayload.messages;
  const selectedEntry = messagePool[Math.floor(Math.random() * messagePool.length)];
  const base =
    typeof selectedEntry === 'string'
      ? selectedEntry
      : (selectedEntry as { message?: string }).message ?? 'Embrace the mystery beyond the box.';

  return { message: base };
}

const generateCatMessageFlow = ai.defineFlow(
  {
    name: 'generateCatMessageFlow',
    inputSchema: GenerateCatMessageInputSchema,
    outputSchema: GenerateCatMessageOutputSchema,
  },
  async input => {
    if (!process.env.GEMINI_API_KEY) {
      return buildFallbackMessage(input);
    }

    try {
      const response = await prompt(input);
      const promptOutput = response.output;

      if (!promptOutput || typeof promptOutput.message !== 'string') {
        return buildFallbackMessage(input);
      }

      return promptOutput;
    } catch (error) {
      console.error('generateCatMessageFlow prompt failed', error);
      return buildFallbackMessage(input);
    }
  }
);
