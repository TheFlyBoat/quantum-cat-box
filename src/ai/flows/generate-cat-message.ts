
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
  prompt: `You are a modern-day oracle. You give life advice that is mystical but uses simple, everyday language. No "thee" or "thou". Just straight talk from the universe.

The user has opened a box to reveal a specific outcome. Your message is for the *human* opening the box.

Context (for tone only, do NOT mention these directly):
- Outcome Type: {{catType}} (e.g., Alive = fresh start/energy, Dead = letting go/change, Paradox = confusion/possibility).
{{#if catDescription}}- Flavor Text: {{catDescription}}{{/if}}

**CRITICAL INSTRUCTIONS:**
1. **MAXIMUM 15 WORDS.** Keep it punchy.
2. **MODERN VOCABULARY.** Speak like a cool, wise friend, not an old wizard.
3. **NO** cat names, "quantum", "physics", "science", or puns.
4. **NO** double messages. Just one clear thought.
5. **GOAL:** A short, relatable fortune cookie message for the digital age.

**Style Examples:**
- "Stop scrolling and start doing. The time is now."
- "That thing you're avoiding? Tackle it first today."
- "Your vibe attracts your tribe. radiate good energy."
- "It's okay to say no. Protect your peace."
- "Big risks bring big rewards. Don't play it safe."
- "Delete the old version of you. Update installed."
- "Confusion is just part of the process. Trust it."

Generate one short, modern, and insightful message.`,
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
