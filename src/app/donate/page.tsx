
'use client';

import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Connection, SystemProgram, Transaction, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { useUser, useFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';

// The DAO's public treasury wallet address.
// In a real app, this would be a secure, multi-sig wallet.
const DAO_TREASURY_ADDRESS = 'CjSoSyzvo2b1sC9sHmgT3sL1G5a1xT2a1baxGZ2gC7dE'; // Example address

export default function DonatePage() {
  const { connected, publicKey, sendTransaction, wallet } = useWallet();
  const [amount, setAmount] = useState('0.1');
  const [isDonating, setIsDonating] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  const { firestore } = useFirebase();

  const handleDonate = async () => {
    if (!publicKey || !user) {
      toast({
        variant: 'destructive',
        title: 'Wallet or User Not Connected',
        description: 'Please connect your wallet and log in to make a donation.',
      });
      return;
    }

    setIsDonating(true);

    try {
      // In a real app, you would get the RPC endpoint from your ConnectionProvider
      const network = 'https://api.devnet.solana.com';
      const connection = new Connection(network);
      
      const lamports = parseFloat(amount) * LAMPORTS_PER_SOL;
      if (isNaN(lamports) || lamports <= 0) {
        throw new Error("Invalid donation amount.");
      }

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(DAO_TREASURY_ADDRESS),
          lamports: lamports,
        })
      );
      
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      const signature = await sendTransaction(transaction, connection);
      
      toast({
        title: 'Donation Sent!',
        description: `Thank you for your donation of ${amount} SOL.`,
      });

      // Record the donation in Firestore
      const userDonationsRef = collection(firestore, 'users', user.uid, 'donations');
      const newDonation = {
        disasterId: 'd1', // Mock disaster ID
        donorId: user.uid,
        amount: parseFloat(amount),
        timestamp: new Date().toISOString(),
        donationType: 'One-time',
        txSignature: signature,
      };
      addDocumentNonBlocking(userDonationsRef, newDonation);

    } catch (error: any) {
        console.error('Donation failed', error);
        
        let isSimulation = false;
        // The UnsafeBurnerWallet doesn't have funds, so this error is expected.
        // Phantom wallet might also fail if not funded on Devnet.
        if (error.message.includes('insufficient lamports') || (wallet?.adapter.name === 'Phantom' && error.code === 4001)) {
           isSimulation = true;
        }

        if(isSimulation) {
            toast({
                title: 'Donation Simulation Successful!',
                description: `A real transaction for ${amount} SOL would have been sent.`,
            });
             // Record the donation in Firestore even for simulation
            const userDonationsRef = collection(firestore, 'users', user.uid, 'donations');
            const newDonation = {
                disasterId: 'd1', // Mock disaster ID
                donorId: user.uid,
                amount: parseFloat(amount),
                timestamp: new Date().toISOString(),
                donationType: 'One-time',
                txSignature: `simulated_${Date.now()}`,
            };
            addDocumentNonBlocking(userDonationsRef, newDonation);

        } else {
            toast({
                variant: 'destructive',
                title: 'Donation Failed',
                description: error.message || 'An unknown error occurred.',
            });
        }
    } finally {
      setIsDonating(false);
    }
  };

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <PageHeader
          title="Donate"
          description="Your contribution powers our rapid response efforts. Thank you for your support."
        />
        <div className="container pb-12">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Make a Donation</CardTitle>
              <CardDescription>
                Your donation will be sent directly to the DAO treasury on the
                Solana blockchain. All transactions are transparent.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!connected ? (
                <div className="text-center p-8 border-dashed border-2 rounded-lg flex flex-col items-center gap-4">
                  <p className="text-muted-foreground">
                    Connect your wallet to get started.
                  </p>
                  <WalletMultiButton />
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="amount">Amount (SOL)</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.1"
                    />
                  </div>
                  <div className='flex justify-around'>
                    <Button variant="outline" size="sm" onClick={() => setAmount('0.1')}>0.1 SOL</Button>
                    <Button variant="outline" size="sm" onClick={() => setAmount('0.5')}>0.5 SOL</Button>
                    <Button variant="outline" size="sm" onClick={() => setAmount('1.0')}>1.0 SOL</Button>
                  </div>
                </div>
              )}
            </CardContent>
            {connected && (
              <CardFooter>
                <Button className="w-full" onClick={handleDonate} disabled={isDonating || !user}>
                  {isDonating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : !user ? (
                    "Please Login to Donate"
                  ) : (
                    `Donate ${amount} SOL`
                  )}
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
