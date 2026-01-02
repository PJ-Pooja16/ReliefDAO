import Link from "next/link";
import { Twitter, Linkedin, Github } from "lucide-react";
import { Logo } from "./logo";

export function SiteFooter() {
  return (
    <footer className="w-full border-t bg-card">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <Logo />
            <p className="text-sm text-muted-foreground">
              Rapid, transparent, and decentralized disaster relief powered by the community.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:col-span-2">
            <div>
              <h4 className="font-semibold mb-3">Navigate</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="text-muted-foreground hover:text-foreground">Home</Link></li>
                <li><Link href="/dashboard/active-disasters" className="text-muted-foreground hover:text-foreground">Disasters</Link></li>
                <li><Link href="/donate" className="text-muted-foreground hover:text-foreground">Donate</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">About</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">How it Works</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Partners</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ReliefDAO. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="#" aria-label="Twitter"><Twitter className="h-5 w-5 hover:text-foreground" /></Link>
            <Link href="#" aria-label="LinkedIn"><Linkedin className="h-5 w-5 hover:text-foreground" /></Link>
            <Link href="#" aria-label="GitHub"><Github className="h-5 w-5 hover:text-foreground" /></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
