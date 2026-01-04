
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LogIn, LogOut } from "lucide-react";
import { Logo } from "./logo";
import { useUser, useAuth } from "@/firebase";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  const navLinks = [
    { href: "/#how-it-works", label: "How it Works" },
    { href: "/dashboard/active-disasters", label: "Disasters" },
    { href: "/donate", label: "Donate" },
  ];

  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Logo />
        </div>

        <div className="md:hidden">
           <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
                <div className="p-4">
                    <Logo />
                    <nav className="mt-8 flex flex-col gap-4">
                        {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-lg font-medium text-foreground hover:text-primary"
                        >
                            {link.label}
                        </Link>
                        ))}
                    </nav>
                </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground/60 transition-colors hover:text-foreground/80"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {isUserLoading ? (
              <Button disabled size="sm">Loading...</Button>
            ) : user && !isHomePage ? (
              <>
                <Button asChild variant="ghost" size="sm"><Link href="/dashboard">Dashboard</Link></Button>
                <Button variant="outline" size="sm" onClick={handleLogout}><LogOut className="mr-2 h-4 w-4"/> Logout</Button>
              </>
            ) : (
              <Button asChild size="sm"><Link href="/login"><LogIn className="mr-2 h-4 w-4"/>Login</Link></Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
