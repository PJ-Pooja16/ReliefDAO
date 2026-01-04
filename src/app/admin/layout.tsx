
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDoc, useFirebase, useMemoFirebase, useUser } from '@/firebase';
import type { User as AppUser } from '@/lib/types';
import { doc } from 'firebase/firestore';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const { firestore } = useFirebase();
  const router = useRouter();

  const userDocRef = useMemoFirebase(() => user ? doc(firestore, "users", user.uid) : null, [firestore, user]);
  const { data: currentUser, isLoading: isCurrentUserLoading } = useDoc<AppUser>(userDocRef);

  useEffect(() => {
    // If user data has loaded...
    if (!isUserLoading && !isCurrentUserLoading) {
      // and there's no user, or the user is not an Admin...
      if (!user || currentUser?.role !== 'Admin') {
        // redirect to the main dashboard.
        router.replace('/dashboard');
      }
    }
  }, [user, currentUser, isUserLoading, isCurrentUserLoading, router]);

  // While checking authentication and role, show a loading state.
  if (isUserLoading || isCurrentUserLoading || !currentUser) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // If the user is an admin, render the admin layout.
  if (currentUser.role === 'Admin') {
    return (
        <>
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
        </>
    );
  }

  // Fallback, though the useEffect should have already redirected.
  return null;
}
