
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Vote,
  HelpingHand,
  Siren,
} from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import StatsCounter from "@/components/stats-counter";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { DisasterCard } from "@/components/disaster-card";
import { getDisasters } from "@/lib/data";

export default function Home() {
  const disasters = getDisasters();
  const howItWorksSteps = [
    {
      icon: <Siren className="h-10 w-10 text-primary" />,
      title: "Disaster Detected",
      description: "Real-time alerts from global feeds and community reports trigger an emergency response protocol.",
    },
    {
      icon: <Vote className="h-10 w-10 text-primary" />,
      title: "Community Votes",
      description: "DAO members vote on funding proposals, ensuring rapid, transparent, and democratic decision-making.",
    },
    {
      icon: <HelpingHand className="h-10 w-10 text-primary" />,
      title: "Aid Delivered",
      description: "Funds are instantly released to on-ground responders. Every delivery is tracked and verified on-chain.",
    },
  ];

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-32 lg:py-40 overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent dark:from-background/80 dark:via-background/20"></div>
          <Image
            src="https://images.unsplash.com/photo-1569002598204-a131a9862b66?q=80&w=2070&auto=format&fit=crop"
            alt="Hands of a diverse group of people coming together, symbolizing community and support"
            fill
            priority
            quality={80}
            className="object-cover -z-10"
            data-ai-hint="community support"
          />
          <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-headline tracking-tight text-white text-shadow-lg">
              Rapid. Transparent. Decentralized.
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-shadow text-white/90">
              A new paradigm for disaster relief, powered by community and technology.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-accent to-orange-400 text-white hover:opacity-90 transition-opacity">
                <Link href="/donate">Donate Now</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/login">Join DAO</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Counter Section */}
        <section className="bg-background py-16 sm:py-24">
            <div className="container mx-auto px-4">
                <StatsCounter />
            </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-card py-16 sm:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center font-headline">A Better Way to Help</h2>
            <p className="mt-2 text-center text-muted-foreground max-w-2xl mx-auto">
              Our decentralized model ensures your contributions make a direct and verifiable impact.
            </p>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {howItWorksSteps.map((step, index) => (
                <div key={index} className="flex flex-col items-center text-center p-6 rounded-lg transition-all duration-300 hover:bg-muted">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold font-headline">{step.title}</h3>
                  <p className="mt-2 text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Live Disasters Section */}
        <section className="py-16 sm:py-24 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center font-headline">Active Responses</h2>
            <p className="mt-2 text-center text-muted-foreground">These are communities we are actively supporting right now.</p>
            <div className="mt-12">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {disasters.filter(d => d.status === 'Active' || d.status === 'Response Ongoing').map((disaster) => (
                    <CarouselItem key={disaster.id} className="md:basis-1/2 lg:basis-1/3">
                      <div className="p-1">
                        <DisasterCard disaster={disaster} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="ml-12" />
                <CarouselNext className="mr-12" />
              </Carousel>
            </div>
            <div className="text-center mt-8">
              <Button asChild variant="outline">
                <Link href="/dashboard/active-disasters">
                  View All Disasters <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
