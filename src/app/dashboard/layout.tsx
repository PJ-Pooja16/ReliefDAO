
'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Siren,
  Globe,
  Landmark,
  User,
  FileText,
  Settings,
  LogOut,
  Bell,
  ShieldCheck,
  UserCog,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth, useDoc, useFirebase, useMemoFirebase, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useEffect, useMemo } from 'react';
import type { User as AppUser } from '@/lib/types';
import { doc } from 'firebase/firestore';
import { ThemeToggle } from '@/components/theme-toggle';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const { firestore } = useFirebase();
  const router = useRouter();

  const userDocRef = useMemoFirebase(() => user ? doc(firestore, "users", user.uid) : null, [firestore, user]);
  const { data: currentUser, isLoading: isCurrentUserLoading } = useDoc<AppUser>(userDocRef);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const handleLogout = async () => {
    if (auth) {
        await signOut(auth);
    }
    router.push('/login');
  };

  const navItems = useMemo(() => {
    const allItems = [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['Admin', 'Donor', 'Responder', 'Validator'] },
      { href: '/dashboard/emergency-feed', label: 'Emergency Feed', icon: Siren, roles: ['Admin', 'Donor', 'Responder', 'Validator'] },
      { href: '/dashboard/active-disasters', label: 'Active Disasters', icon: Globe, roles: ['Admin', 'Donor', 'Responder', 'Validator'] },
      { href: '/dashboard/treasury', label: 'Treasury', icon: Landmark, amount: '$4.2M', roles: ['Admin', 'Donor'] },
      { href: '/dashboard/my-impact', label: 'My Impact', icon: User, roles: ['Donor'] },
      { href: '/dashboard/my-proposals', label: 'My Proposals', icon: FileText, roles: ['Responder'] },
      { href: '/dashboard/validator', label: 'Validator Panel', icon: ShieldCheck, roles: ['Validator'] },
      { href: '/admin', label: 'Admin', icon: UserCog, roles: ['Admin'] },
    ];
    if (!currentUser) return [];
    return allItems.filter(item => item.roles.includes(currentUser.role));
  }, [currentUser]);

  if (isUserLoading || isCurrentUserLoading || !user || !currentUser) {
    return <div className="flex-1 flex items-center justify-center">Loading...</div>;
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label, className: 'w-max' }}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                    {item.amount && (
                      <Badge variant="secondary" className="ml-auto font-code">{item.amount}</Badge>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
             <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/dashboard/settings'}
                  tooltip={{ children: 'Settings', className: 'w-max' }}
                >
                  <Link href="/dashboard/settings">
                    <Settings />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  tooltip={{ children: 'Logout', className: 'w-max' }}
                >
                    <LogOut />
                    <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm">
            <div className="container flex h-14 items-center gap-4">
                <SidebarTrigger className="md:hidden"/>
                <div className="flex-1">
                    {/* Optional: Add search bar here */}
                </div>
                <ThemeToggle />
                <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5"/>
                </Button>
            </div>
        </header>
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
