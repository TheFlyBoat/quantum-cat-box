
import type { Metadata } from 'next';
import './globals.css';
import { Nunito, Patrick_Hand, Quicksand } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/auth-context';
import { BadgeProgressProvider } from '@/context/badge-progress-context';
import { CatCollectionProvider } from '@/context/cat-collection-context';
import { DiaryProvider } from '@/context/diary-context';
import { PointsProvider } from '@/context/points-context';
import { BadgeProvider } from '@/context/badge-context';
import { BoxSkinProvider } from '@/context/box-skin-context';
import { FeedbackProvider } from '@/context/feedback-context';
import { ThemeProvider } from '@/components/theme-provider';

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

const patrickHand = Patrick_Hand({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-headline',
  display: 'swap',
});

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-fortune',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'The Quantum Cat',
  description: 'Open the box, if you dare.',
  icons: {
    icon: [
      { url: '/favicon.ico?v=2', type: 'image/x-icon' },
      { url: '/favicon.png?v=2', type: 'image/png', sizes: '512x512' },
    ],
    apple: [{ url: '/apple-touch-icon.png?v=2', sizes: '180x180' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico?v=2" />
        <link rel="icon" href="/favicon.png?v=2" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2" />
      </head>
      <body
        className={cn(
          nunito.variable,
          patrickHand.variable,
          quicksand.variable,
          'bg-background font-body antialiased',
        )}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            disableTransitionOnChange
        >
          <AuthProvider>
            <BadgeProvider>
              <CatCollectionProvider>
                <BadgeProgressProvider>
                  <DiaryProvider>
                    <PointsProvider>
                      <BoxSkinProvider>
                        <FeedbackProvider>
                          {children}
                        </FeedbackProvider>
                      </BoxSkinProvider>
                    </PointsProvider>
                  </DiaryProvider>
                </BadgeProgressProvider>
              </CatCollectionProvider>
            </BadgeProvider>
          </AuthProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
