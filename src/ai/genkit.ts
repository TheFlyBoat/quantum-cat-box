import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

/**
 * Quantum Message model. Overridable with GEMINI_MODEL so a future model retirement
 * can be handled with a config change instead of a code change.
 * Check https://ai.google.dev/gemini-api/docs/deprecations before changing it.
 */
export const QUANTUM_MESSAGE_MODEL = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';

export const ai = genkit({
  plugins: [googleAI()],
  model: googleAI.model(QUANTUM_MESSAGE_MODEL),
});
