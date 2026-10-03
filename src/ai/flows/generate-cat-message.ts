'use server';

/**
 * @fileOverview Genkit flow that writes the Quantum Message shown after a Quantum Box reveal.
 *
 * - generateCatMessage: server action called by the client after a reveal.
 * - GenerateCatMessageInput / GenerateCatMessageOutput: its input and output types.
 *
 * Every response says where the message came from (`source`), and every fallback is logged
 * with a reason, so a missing key or a retired model can never fail silently again.
 */

import {ai, QUANTUM_MESSAGE_MODEL} from '@/ai/genkit';
import {z} from 'genkit';
import fallbackMessages from '@/lib/fallback-messages.json';

const GenerateCatMessageInputSchema = z.object({
  catId: z.string().describe('Unique identifier of the revealed cat'),
  catName: z.string().describe('Display name of the revealed cat'),
  catType: z.string().describe('Outcome type of the cat (Alive, Dead, Paradox, etc.)'),
  catDescription: z.string().optional().describe('Brief description of the cat to inspire message variety'),
});
export type GenerateCatMessageInput = z.infer<typeof GenerateCatMessageInputSchema>;

const GenerateCatMessageOutputSchema = z.object({
  message: z.string().describe('A short, modern fortune-style message for the person opening the box.'),
  source: z.enum(['ai', 'fallback']).describe('Whether the message was generated or taken from the fallback pool.'),
  reason: z.string().optional().describe('Why a fallback was used, when it was.'),
});
export type GenerateCatMessageOutput = z.infer<typeof GenerateCatMessageOutputSchema>;

export async function generateCatMessage(input: GenerateCatMessageInput): Promise<GenerateCatMessageOutput> {
  try {
    return await generateCatMessageFlow(input);
  } catch (error) {
    // Schema validation or an unexpected flow error must never reach the player.
    console.error('[Genkit Server Action Error]:', error);
    return fallback('flow_error', input);
  }
}

// Must stay below the client's 10s fallback timer so the server's answer always arrives first.
const GENERATION_TIMEOUT_MS = 7000;
const MAX_WORDS = 20;

const TONE_BY_OUTCOME: Record<string, string> = {
  alive: 'fresh starts, energy, momentum, saying yes',
  dead: 'letting go, endings that make room, rest, closure',
  paradox: 'uncertainty, holding two truths, playful possibility',
};

const STYLE_EXAMPLES = [
  'Stop scrolling and start doing. The time is now.',
  "That thing you're avoiding? Tackle it first today.",
  "It's okay to say no. Protect your peace.",
  "Big risks bring big rewards. Don't play it safe.",
  'Delete the old version of you. Update installed.',
  'Confusion is just part of the process. Trust it.',
  'Rest is not quitting. Recharge, then go again.',
  'Send the message. The worst answer is still an answer.',
  'You already know the next step. Take it.',
  'Let it end. Something better needs the space.',
  'Two things can be true. Choose the kinder one.',
  'Small steps still move you. Keep walking.',
];

const pickExamples = (count: number) =>
  [...STYLE_EXAMPLES].sort(() => Math.random() - 0.5).slice(0, count);

const buildPrompt = (input: GenerateCatMessageInput) => {
  const outcome = input.catType.toLowerCase();
  const tone = TONE_BY_OUTCOME[outcome] ?? TONE_BY_OUTCOME.paradox;
  const examples = pickExamples(4).map(example => `- "${example}"`).join('\n');

  return `You are a modern-day oracle. You give life advice that feels mystical but uses simple, everyday language. No "thee" or "thou". Just straight talk from the universe.

Someone just opened a box. Your message is for the *human* who opened it.

Theme for today's message (set the mood, do NOT name it): ${tone}.
${input.catDescription ? `Flavour (for inspiration only, do NOT mention it): ${input.catDescription}\n` : ''}
Rules:
1. Maximum 15 words.
2. Speak like a cool, wise friend, not an old wizard.
3. Never mention cats, boxes, "quantum", physics, science, or make puns.
4. One clear thought. No lists, no emoji, no hashtags, no quotation marks.
5. Reply with the message only.

Style examples (do not copy them):
${examples}`;
};

/** Trims wrapping quotes and whitespace; returns null when the text breaks the rules above. */
const cleanMessage = (raw: string | undefined): string | null => {
  if (!raw) return null;
  const text = raw
    .trim()
    .replace(/^["'“”‘’\s]+|["'“”‘’\s]+$/g, '')
    .replace(/\s+/g, ' ');
  if (!text) return null;
  if (text.split(' ').length > MAX_WORDS) return null;
  return text;
};

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

const pickRandom = (pool: string[]) => pool[Math.floor(Math.random() * pool.length)];

/** Prefers a message matching the outcome's mood, then the general pool. */
const pickFallbackMessage = (input: GenerateCatMessageInput): string => {
  const outcome = input.catType.toLowerCase() as keyof typeof STATE_FALLBACK_MESSAGES;
  const statePool = STATE_FALLBACK_MESSAGES[outcome];
  const generalPool = (fallbackMessages as {messages?: string[]}).messages ?? [];
  const pool = statePool ? [...statePool, ...generalPool] : generalPool;
  return pickRandom(pool) ?? 'Embrace the mystery beyond the box.';
};

const fallback = (reason: string, input: GenerateCatMessageInput): GenerateCatMessageOutput => {
  // A JSON line becomes a structured, filterable entry in Cloud Logging.
  console.warn(JSON.stringify({
    event: 'quantum_message_fallback',
    reason,
    model: QUANTUM_MESSAGE_MODEL,
    catId: input.catId,
  }));
  return {message: pickFallbackMessage(input), source: 'fallback', reason};
};

const withTimeout = <T,>(promise: Promise<T>, ms: number) =>
  Promise.race([
    promise,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), ms)),
  ]);

const generateCatMessageFlow = ai.defineFlow(
  {
    name: 'generateCatMessageFlow',
    inputSchema: GenerateCatMessageInputSchema,
    outputSchema: GenerateCatMessageOutputSchema,
  },
  async (input): Promise<GenerateCatMessageOutput> => {
    const apiKey = (
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.GOOGLE_GENAI_API_KEY
    )?.trim();

    if (!apiKey) {
      return fallback('missing_api_key', input);
    }

    const startedAt = Date.now();
    try {
      const response = await withTimeout(
        ai.generate({
          prompt: buildPrompt(input),
          config: {
            temperature: 1.1,
            maxOutputTokens: 60,
            // A 15-word message needs no reasoning; thinking only adds latency.
            thinkingConfig: {thinkingLevel: 'MINIMAL'},
          },
        }),
        GENERATION_TIMEOUT_MS,
      );

      const message = cleanMessage(response.text);
      if (!message) {
        return fallback('invalid_output', input);
      }

      console.info(JSON.stringify({
        event: 'quantum_message_generated',
        model: QUANTUM_MESSAGE_MODEL,
        latencyMs: Date.now() - startedAt,
      }));
      return {message, source: 'ai' as const};
    } catch (error) {
      const reason = error instanceof Error && error.message === 'timeout' ? 'timeout' : 'model_error';
      console.error('generateCatMessageFlow prompt failed', error);
      return fallback(reason, input);
    }
  }
);
