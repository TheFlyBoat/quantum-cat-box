
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
  try {
    return await generateCatMessageFlow(input);
  } catch (error) {
    console.error('[Genkit Server Action Error]:', error);
    return buildFallbackMessage(input);
  }
}

const prompt = ai.definePrompt({
  name: 'generateCatMessagePrompt',
  input: {schema: GenerateCatMessageInputSchema},
  output: {schema: GenerateCatMessageOutputSchema},
  config: {
    maxOutputTokens: 120,
    temperature: 0.7,
  },
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

const STATE_FALLBACK_MESSAGES: Record<'alive' | 'dead' | 'paradox', string[]> = {
  alive: [
    'A fresh perspective changes everything. Embrace the spark.',
    'Life is unfolding with vibrant momentum. Step forward boldly.',
    'Energy flows where attention goes. Awaken to today.',
    'Every sunrise brings an unwritten story. Claim yours.',
  ],
  dead: [
    'Every ending is a beginning disguised as a goodbye.',
    'Let go of what was to make room for what will be.',
    'In quiet stillness, wisdom finds its deepest voice.',
    'Transformation begins when you release what was.',
  ],
  paradox: [
    'Embrace the contradiction. That is where possibility lives.',
    'Two truths can exist at once; balance is found in between.',
    'When nothing is certain, everything becomes possible.',
    'The mystery itself holds the answer you seek.',
  ],
};

const DEFAULT_FALLBACK_MESSAGE = 'Embrace the mystery beyond the box.';

async function buildFallbackMessage(input: GenerateCatMessageInput): Promise<GenerateCatMessageOutput> {
  const outcomeKey = (input?.catType || '').toLowerCase();
  let statePool: string[] | undefined;
  if (outcomeKey.includes('alive')) {
    statePool = STATE_FALLBACK_MESSAGES.alive;
  } else if (outcomeKey.includes('dead')) {
    statePool = STATE_FALLBACK_MESSAGES.dead;
  } else if (outcomeKey.includes('paradox')) {
    statePool = STATE_FALLBACK_MESSAGES.paradox;
  }

  if (statePool && statePool.length > 0) {
    const message = statePool[Math.floor(Math.random() * statePool.length)];
    return { message };
  }

  try {
    const fallbackModule = await import('@/lib/fallback-messages.json');
    const fallbackPayload = fallbackModule.default as { messages: string[] } | string[];
    const messagePool = Array.isArray(fallbackPayload) ? fallbackPayload : fallbackPayload.messages;
    if (messagePool && messagePool.length > 0) {
      const selectedEntry = messagePool[Math.floor(Math.random() * messagePool.length)];
      const base =
        typeof selectedEntry === 'string'
          ? selectedEntry
          : (selectedEntry as { message?: string }).message;
      if (base && base.trim()) {
        return { message: base.trim() };
      }
    }
  } catch (err) {
    console.error('[Genkit Server Action Error]: Failed to load fallback messages JSON:', err);
  }

  return { message: DEFAULT_FALLBACK_MESSAGE };
}

const generateCatMessageFlow = ai.defineFlow(
  {
    name: 'generateCatMessageFlow',
    inputSchema: GenerateCatMessageInputSchema,
    outputSchema: GenerateCatMessageOutputSchema,
  },
  async input => {
    const rawApiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_GENAI_API_KEY ||
      process.env.GOOGLE_API_KEY;

    const apiKey = rawApiKey?.trim();

    if (!apiKey) {
      console.warn('[Genkit Server Action]: GEMINI_API_KEY is not configured or empty. Using fallback message.');
      return buildFallbackMessage(input);
    }

    try {
      const response = await prompt(input);
      const promptOutput = response.output;

      if (!promptOutput || typeof promptOutput.message !== 'string' || !promptOutput.message.trim()) {
        console.error('[Genkit Server Action Error]: Empty or invalid output structure from Gemini prompt:', promptOutput);
        return buildFallbackMessage(input);
      }

      return { message: promptOutput.message.trim() };
    } catch (error) {
      console.error('[Genkit Server Action Error]:', error);
      return buildFallbackMessage(input);
    }
  }
);
