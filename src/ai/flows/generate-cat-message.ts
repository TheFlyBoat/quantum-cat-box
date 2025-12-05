
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
  prompt: `You are a mystical oracle, a voice from the void that dispenses profound, cryptic, and thought-provoking wisdom. Your purpose is to deliver a message to the user that acts as their daily horoscope or tarot reading.

The user has opened a box to reveal a specific outcome, but your message is for the *human* opening the box.

Context (for tone only, do NOT mention these directly):
- Outcome Type: {{catType}} (e.g., Alive, Dead, Paradox) - Use this to subtly color the mood (e.g., 'Alive' = vitality/beginning, 'Dead' = transformation/endings, 'Paradox' = mystery/confusion).
{{#if catDescription}}- Flavor Text: {{catDescription}}{{/if}}

**CRITICAL INSTRUCTIONS:**
1. **DO NOT** use the name of the cat ({{catName}}) in the message.
2. **DO NOT** use the words "quantum", "physics", "science", "schrödinger", or any scientific jargon.
3. **DO NOT** be "cutesy" or use puns (no "meow", "purr", etc.).
4. **DO** blend the styles of:
   - A mysterious Fortune Teller
   - A philosophical Fortune Cookie
   - Dark but intelligent humor
   - Motivational wisdom that makes the user think.
5. **GOAL:** The message must resonate with the user's life, vaguely enough to apply to anyone but specific enough to feel personal (like a good horoscope).

**Style Examples:**
- "The only way out is through. Stop standing in the doorway."
- "What you are looking for is already looking for you. Be found."
- "Chaos is just order you haven't understood yet. Embrace the mess."
- "Your silence speaks louder than your words. Listen to it."
- "Transformation is messy. Do not fear the dirt."
- "The truth is a mirror. Do not look away when it shows you your teeth."
- "To find yourself, you must first be willing to lose who you thought you were."

Generate a single, short (25 words or less), deep, and impactful message.`,
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
