import { config } from 'dotenv';
config();
config({ path: '.env.local', override: true });

import '@/ai/flows/generate-cat-message.ts';