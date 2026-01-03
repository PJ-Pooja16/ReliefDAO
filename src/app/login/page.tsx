
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";
import Link from 'next/link';
import { User, Landmark, ShieldCheck, UserCog } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useAuth, useFirebase, useUser } from '@/firebase';
import { signInAnonymously } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase';

const roles = [
    {
        name: 'Donor',
        description: 'Donate, vote on proposals, and track your impact.',
        icon: User,
    },
    {
        name: 'Responder',
        description: 'Submit funding requests and execute relief work.',
        icon: Landmark,
    },
    {
        name: 'Validator',
        description: 'Verify proofs, flag issues, and earn rewards.',
        icon: ShieldCheck,
    },
    {
        name: 'Admin',
        description: 'Manage the system, handle emergencies, and control the treasury.',
        icon: UserCog,
    }
]

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole>('Responder');
  const { user, isUserLoading } = useUser();
  const { auth, firestore } = useFirebase();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const userCredential = await signInAnonymously(auth);
      const user = userCredential.user;

      const userDocRef = doc(firestore, "users", user.uid);
      
      const names: Record<UserRole, string> = {
        'Donor': 'Sarah',
        'Responder': 'Rajesh',
        'Validator': 'Dr. Mehta',
        'Admin': 'Vijay'
      }

      const newUser = {
        id: user.uid,
        name: names[selectedRole],
        role: selectedRole,
        reputation: 85, // starting reputation
        email: user.email || '',
        activity: "Joined the DAO",
      };

      setDocumentNonBlocking(userDocRef, newUser, { merge: true });

    } catch (error) {
      console.error("Anonymous sign-in failed", error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (isUserLoading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-lg">
        <Card>
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto">
              <Logo />
            </div>
            <CardTitle className="text-2xl font-headline">Welcome to ReliefDAO</CardTitle>
            <CardDescription>
              Choose your role to join the decentralized disaster relief effort.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-6">
            <RadioGroup 
                defaultValue={selectedRole}
                onValueChange={(value: UserRole) => setSelectedRole(value)}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full"
            >
                {roles.map((role) => (
                    <Label
                        key={role.name}
                        htmlFor={role.name}
                        className={cn(
                            "flex flex-col items-start p-4 rounded-lg border-2 cursor-pointer transition-all",
                            selectedRole === role.name ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                        )}
                    >
                         <RadioGroupItem value={role.name} id={role.name} className="sr-only" />
                         <div className="flex items-center gap-3 mb-2">
                            <role.icon className={cn("h-6 w-6", selectedRole === role.name ? "text-primary" : "text-muted-foreground")} />
                            <span className="font-bold text-lg">{role.name}</span>
                         </div>
                         <p className="text-sm text-muted-foreground">{role.description}</p>
                    </Label>
                ))}
            </RadioGroup>
            
            <div className="flex flex-col items-center gap-4 w-full pt-4 border-t">
                <p className="text-sm font-medium">Connect anonymously to proceed as a {selectedRole}.</p>
                <Button onClick={handleLogin} disabled={isLoggingIn}>
                  {isLoggingIn ? "Logging in..." : "Enter as " + selectedRole}
                </Button>
                 <div className="text-center text-sm text-muted-foreground">
                    By connecting, you agree to our <br />
                    <Link href="#" className="underline">Terms of Service</Link> and <Link href="#" className="underline">Privacy Policy</Link>.
                </div>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
