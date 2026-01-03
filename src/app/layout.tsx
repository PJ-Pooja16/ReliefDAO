import type {Metadata} from 'next';
import './globals.css';
import '@solana/wallet-adapter-react-ui/styles.css';
import { Toaster } from "@/components/ui/toaster"
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { WalletProvider } from '@/components/wallet-provider';

export const metadata: Metadata = {
  title: 'ReliefDAO',
  description: 'Rapid. Transparent. Decentralized Disaster Relief.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Roboto+Mono:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          <WalletProvider>
            <div className="relative flex min-h-screen flex-col">
              {children}
            </div>
            <Toaster />
          </WalletProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
