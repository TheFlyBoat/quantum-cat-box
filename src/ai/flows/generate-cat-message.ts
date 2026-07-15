
'use server';

/**
 * @fileOverview Genkit flow for generating a short, human-focused fortune inspired by a revealed cat state.
 *
 * It includes:
 * - generateCatMessage: The main function to trigger the message generation flow.
 * - GenerateCatMessageInput: Validated cat context supplied to the prompt.
 * - GenerateCatMessageOutput: The output type for the generateCatMessage function, containing the generated message.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const GenerateCatMessageInputSchema = z.object({
  catId: z.string().min(1).describe('Unique identifier of the revealed cat'),
  catName: z.string().min(1).describe('Display name of the revealed cat'),
  catType: z.enum(['Alive', 'Dead', 'Paradox']).describe("Revealed outcome used only to guide the fortune's tone"),
  catDescription: z.string().optional().describe('Optional flavour context used only to vary tone'),
});
export type GenerateCatMessageInput = z.infer<typeof GenerateCatMessageInputSchema>;

const FORBIDDEN_MESSAGE_TERMS = /\b(cat|cats|quantum|physics|science)\b/i;

export const GenerateCatMessageOutputSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, 'Message cannot be empty.')
    .refine(
      text => text.split(/\s+/).filter(Boolean).length <= 15,
      'Message must contain no more than 15 words.',
    )
    .refine(
      text => !FORBIDDEN_MESSAGE_TERMS.test(text),
      'Message must not mention cats, quantum, physics, or science.',
    )
    .describe(
      'One short, modern fortune-cookie-style life message for the human, inspired by the outcome and containing no cat or science references.',
    ),
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

async function buildFallbackMessage(_input: GenerateCatMessageInput): Promise<GenerateCatMessageOutput> {
  const fallbackModule = await import('@/lib/fallback-messages.json');
  const fallbackPayload = fallbackModule.default as { messages: string[] } | string[];
  const messagePool = Array.isArray(fallbackPayload) ? fallbackPayload : fallbackPayload.messages;
  const validMessages = messagePool
    .map(entry =>
      typeof entry === 'string'
        ? entry
        : (entry as { message?: string }).message ?? '',
    )
    .filter(message => GenerateCatMessageOutputSchema.safeParse({ message }).success);

  const selectedMessage =
    validMessages[Math.floor(Math.random() * validMessages.length)] ??
    'Embrace the mystery beyond the box.';

  return GenerateCatMessageOutputSchema.parse({ message: selectedMessage });
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

      const validatedOutput = GenerateCatMessageOutputSchema.safeParse(promptOutput);
      if (!validatedOutput.success) {
        console.warn('AI message failed validation; using fallback', validatedOutput.error.flatten());
        return buildFallbackMessage(input);
      }

      return validatedOutput.data;
    } catch (error) {
      console.error('generateCatMessageFlow prompt failed', error);
      return buildFallbackMessage(input);
    }
  }
);
