"use client";

import { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Logo } from "@/components/logo";
import Link from 'next/link';

export default function LoginPage() {
  const { connected } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (connected) {
      router.push('/dashboard');
    }
  }, [connected, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto">
              <Logo />
            </div>
            <CardTitle className="text-2xl font-headline">Connect Your Wallet</CardTitle>
            <CardDescription>
              Connect your Solana wallet to join the DAO and participate.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-4">
            <WalletMultiButton />
            <div className="text-center text-sm text-muted-foreground">
              By connecting your wallet, you agree to our <br />
              <Link href="#" className="underline">Terms of Service</Link> and <Link href="#" className="underline">Privacy Policy</Link>.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
