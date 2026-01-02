import Link from "next/link";
import { HandHeart } from "lucide-react";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" prefetch={false}>
      <HandHeart className="h-6 w-6 text-primary" />
      <span className="font-bold text-lg font-headline">ReliefDAO</span>
    </Link>
  );
}
