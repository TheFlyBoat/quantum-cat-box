import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background px-6 py-12 font-body text-foreground">
      <div className="mx-auto max-w-2xl">
        <Link href="/home" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to App
        </Link>
        
        <h1 className="mb-2 font-headline text-4xl font-bold text-primary">Privacy Policy</h1>
        <p className="mb-8 text-sm text-muted-foreground">Last Updated: December 5, 2025</p>

        <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="mb-3 font-headline text-xl font-bold text-foreground">1. Introduction</h2>
            <p>
              Welcome to <strong>The Quantum Cat</strong> ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This policy explains how we handle your information when you play our game.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-headline text-xl font-bold text-foreground">2. Data We Collect</h2>
            <p>We collect only the minimum data necessary to provide the game experience:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Account Information:</strong> If you choose to sign in, we collect your email address and basic profile info via Google Firebase Authentication to create your account.</li>
              <li><strong>Game Progress:</strong> We store your unlocked cats, badges, fish points, and saved diary messages in our database.</li>
              <li><strong>Technical Data:</strong> Basic logs and device information required for the app to function (handled by our hosting provider).</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 font-headline text-xl font-bold text-foreground">3. How We Use Your Data</h2>
            <p>We use your data solely for:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Syncing your game progress across devices.</li>
              <li>Generating AI-powered messages (your game context is sent to the AI model, but not your personal identity).</li>
              <li>Improving app performance and fixing bugs.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 font-headline text-xl font-bold text-foreground">4. Third-Party Services</h2>
            <p>We utilize trusted third-party services to run our app:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Google Firebase:</strong> For authentication, database, and hosting.</li>
              <li><strong>Google Gemini (via Genkit):</strong> For generating the creative "Quantum Messages".</li>
            </ul>
            <p className="mt-2">These providers process data on our behalf and are subject to strict confidentiality agreements.</p>
          </section>

          <section>
            <h2 className="mb-3 font-headline text-xl font-bold text-foreground">5. Your Rights</h2>
            <p>
              You can request the deletion of your account and all associated data at any time. Currently, you can do this by contacting us directly or using the "Delete Account" feature in settings (if available).
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-headline text-xl font-bold text-foreground">6. Contact Us</h2>
            <p>
              If you have questions about this policy, please contact us at: <br />
              <a href="mailto:adam@flyboat.online" className="font-bold text-primary hover:underline">adam@flyboat.online</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
