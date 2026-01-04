
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import type { UserRole } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth, useFirebase, useUser } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { initiateEmailSignIn, initiateEmailSignUp } from '@/firebase/non-blocking-login';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

const signUpSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  role: z.enum(['Donor', 'Responder', 'Validator', 'Admin']),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const { auth, firestore } = useFirebase();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const signUpForm = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      role: 'Donor',
    },
  });

  const onLoginSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    try {
        await initiateEmailSignIn(auth, data.email, data.password);
        // The onAuthStateChanged listener in the provider will handle the redirect
        toast({
            title: "Logging In...",
            description: "You will be redirected shortly."
        });
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Login Failed",
            description: "The email or password you entered is incorrect.",
        })
    } finally {
        setIsSubmitting(false);
    }
  };

  const onSignUpSubmit = async (data: SignUpFormValues) => {
    setIsSubmitting(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;

      const userDocRef = doc(firestore, 'users', user.uid);
      const newUser = {
        id: user.uid,
        name: data.fullName,
        role: data.role,
        email: data.email,
        reputation: 75, // Starting reputation
        activity: 'Joined the DAO',
      };

      await setDoc(userDocRef, newUser, { merge: true });
      toast({
        title: "Account Created!",
        description: "Welcome to ReliefDAO. You are now being logged in."
      })
      // The onAuthStateChanged listener will handle the redirect
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description:
          error.code === 'auth/email-already-in-use'
            ? 'This email is already registered. Please log in.'
            : error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isUserLoading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto">
              <Logo />
            </div>
            <CardTitle className="text-2xl font-headline">
              Welcome to ReliefDAO
            </CardTitle>
            <CardDescription>
              Join the decentralized disaster relief effort.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Create Account</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <Form {...loginForm}>
                  <form
                    onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                    className="space-y-4 pt-4"
                  >
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="your@email.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••••"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Login
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              <TabsContent value="signup">
                <Form {...signUpForm}>
                  <form
                    onSubmit={signUpForm.handleSubmit(onSignUpSubmit)}
                    className="space-y-4 pt-4"
                  >
                    <FormField
                      control={signUpForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signUpForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="your@email.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signUpForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="6+ characters"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signUpForm.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>I am a...</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Donor">Donor</SelectItem>
                              <SelectItem value="Responder">Responder</SelectItem>
                              <SelectItem value="Validator">Validator</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                       {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Create Account
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
             <div className="mt-6 text-center text-sm text-muted-foreground">
                By continuing, you agree to our <br />
                <Link href="#" className="underline">Terms of Service</Link> and <Link href="#" className="underline">Privacy Policy</Link>.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
