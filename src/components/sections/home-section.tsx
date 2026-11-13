import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useLiteMode } from "@/lib/perf";
import { ArrowRight, ArrowUpRight, BedDouble, Building2, Users, ShieldCheck, Search, KeyRound, ChevronDown } from "lucide-react";
import type { Listing, RoommateProfile, Page } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/shared/property-card";
import { RoommateCard } from "@/components/shared/roommate-card";
import { SwipeDeck } from "@/components/shared/swipe-deck";
import { Reveal } from "@/components/motion/reveal";
import heroVideo from "@/assets/hero-building.mp4.asset.json";
import { cn } from "@/lib/utils";

interface HomeSectionProps {
  featuredProperties: Listing[];
  featuredRoommates: RoommateProfile[];
  onViewDetails: (item: Listing | RoommateProfile, type: "listing" | "roommate") => void;
  onNavigate: (page: Page) => void;
  likedItemIds: Set<string>;
  onToggleLike: (itemId: string) => void;
  unlockedIds: Set<string>;
}

const services = [
  { icon: BedDouble, title: "Co-living & PG", text: "Fully managed rooms with meals, Wi-Fi and housekeeping — move in with one bag.", page: "pg" as Page, n: "01" },
  { icon: Building2, title: "Rentals", text: "Apartments for your next move. Compare rent, space and location in one place.", page: "rentals" as Page, n: "02" },
  { icon: Users, title: "Roommates", text: "Match with people who share your budget, rhythm and neighbourhood.", page: "roommates" as Page, n: "03" },
];
const steps = [
  { icon: Search, title: "Discover", text: "Browse or swipe through verified homes and roommates." },
  { icon: ShieldCheck, title: "Unlock", text: "Get owner contact details instantly with a simple plan." },
  { icon: KeyRound, title: "Move in", text: "Visit, connect directly, and get your keys — no brokers." },
];
const cities = ["Navi Mumbai", "Mumbai", "Pune", "Bengaluru", "Hyderabad", "Delhi NCR", "Thane", "Chennai"];

export function HomeSection({ featuredProperties, featuredRoommates, onViewDetails, onNavigate, likedItemIds, onToggleLike, unlockedIds }: HomeSectionProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const [deck, setDeck] = useState<"homes" | "roommates">("homes");
  const lite = useLiteMode();

  return (
    <div>
      {/* HERO */}
      <section ref={heroRef} className="relative h-[90svh] min-h-[620px] overflow-hidden bg-ink">
        <motion.video style={lite ? undefined : { scale: videoScale }} autoPlay loop muted playsInline preload="auto"
          className="absolute inset-0 h-full w-full object-cover" src={heroVideo.url} />
        <div className="absolute inset-0 bg-ink-fade" />
        <motion.div style={lite ? undefined : { y: contentY, opacity: contentOpacity }}
          className="container relative z-10 flex h-full flex-col justify-end pb-20 sm:pb-24 text-ink-foreground">
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.08] max-w-4xl">
            Find your place.<br />Make it home.
          </h1>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-8 sm:mt-10 flex flex-col gap-6 sm:gap-8 lg:flex-row lg:items-end lg:justify-between">
            <p className="max-w-md text-base sm:text-lg text-ink-foreground/75">
              A room near work. A flat with more space. A roommate you get along with. Find your next stay on SetMyStay.
            </p>
            <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap [&>*:first-child]:col-span-2 sm:[&>*:first-child]:col-span-1">
              <Button size="xl" className="rounded-lg" onClick={() => onNavigate("rentals")}>Explore homes <ArrowRight className="ml-1 h-5 w-5" /></Button>
              <Button variant="glass" size="xl" onClick={() => onNavigate("roommates")}>Find roommates</Button>
              <Button variant="glass" size="xl" onClick={() => onNavigate("pg")}>Co-living / PG</Button>
            </div>
          </motion.div>
        </motion.div>
        <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-ink-foreground/70 flex flex-col items-center gap-1 text-[10px] uppercase tracking-[0.3em]">
          Scroll <ChevronDown className="h-4 w-4 animate-scroll-cue" />
        </div>
      </section>

      {/* MARQUEE */}
      <div className="overflow-hidden border-y border-border bg-background py-6">
        <div className="container flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
          {cities.map((c) => <span key={c}>{c}</span>)}
        </div>
      </div>

      {/* SERVICES */}
      <section className="container py-16 sm:py-24">
        <Reveal className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold leading-tight max-w-2xl">A stay that suits you</h2>
          <p className="max-w-sm text-muted-foreground">Whatever stage of life you're in, there's a space on SetMyStay that fits it.</p>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.12}>
              <Button variant="ghost" onClick={() => onNavigate(s.page)}
                className="group relative flex h-full w-full items-start flex-col whitespace-normal rounded-lg border border-border bg-card p-6 text-left transition-colors hover:bg-secondary hover:text-foreground">
                <div className="flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-lg bg-secondary text-primary"><s.icon className="h-6 w-6" /></span>
                </div>
                <h3 className="mt-8 font-display text-2xl font-semibold">{s.title}</h3>
                <p className="mt-3 text-base font-normal text-muted-foreground">{s.text}</p>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold">Explore <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" /></span>
              </Button>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SWIPE */}
      <section className="relative overflow-hidden bg-ink py-16 sm:py-24 text-ink-foreground">
        <div className="container grid items-center gap-16 lg:grid-cols-2">
          <Reveal>
            <p className="text-sm text-accent">Your next shortlist</p>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl font-semibold leading-tight">A place worth saving.</h2>
            <p className="mt-6 max-w-md text-ink-foreground/70">A sunny room, a shorter commute, or someone who shares your routine. See what feels right.</p>
            <div className="mt-10 inline-flex rounded-full glass p-1.5">
              {(["homes", "roommates"] as const).map((k) => (
                <Button variant="ghost" key={k} onClick={() => setDeck(k)}
                  className={cn("relative rounded-full px-6 py-2.5 text-sm font-semibold capitalize transition-colors", deck === k ? "text-accent-foreground" : "text-ink-foreground/70")}>
                  {deck === k && <motion.span layoutId="deck-pill" className="absolute inset-0 rounded-full bg-brass" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                  <span className="relative">{k}</span>
                </Button>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.15} className="text-foreground">
            {(deck === "homes" ? featuredProperties : featuredRoommates).length > 0 ? (
              <SwipeDeck key={deck} items={deck === "homes" ? featuredProperties : featuredRoommates}
                likedItemIds={likedItemIds} onToggleLike={onToggleLike} onViewDetails={onViewDetails} className="[&_p.mt-4]:text-ink-foreground/60" />
            ) : (
              <div className="mx-auto grid h-[520px] max-w-[380px] place-items-center rounded-[2rem] glass text-ink-foreground/70 text-center p-8">New listings are on their way.</div>
            )}
          </Reveal>
        </div>
      </section>

      {/* FEATURED */}
      {featuredProperties.length > 0 && (
        <FeaturedRail title="Featured homes" items={featuredProperties} render={(l) => (
          <PropertyCard listing={l} onViewDetails={(i) => onViewDetails(i, "listing")} isLiked={likedItemIds.has(l.id)} onToggleLike={() => onToggleLike(l.id)} isUnlocked={unlockedIds.has(l.id)} />
        )} onAll={() => onNavigate("rentals")} />
      )}
      {featuredRoommates.length > 0 && (
        <FeaturedRail title="Roommates near you" items={featuredRoommates} render={(r) => (
          <RoommateCard profile={r} onViewDetails={(i) => onViewDetails(i, "roommate")} isLiked={likedItemIds.has(r.id)} onToggleLike={() => onToggleLike(r.id)} isUnlocked={unlockedIds.has(r.id)} />
        )} onAll={() => onNavigate("roommates")} />
      )}

      {/* STEPS */}
      <section className="container py-16 sm:py-24">
        <Reveal><h2 className="font-display text-3xl sm:text-4xl font-semibold text-center">Your next move starts here</h2></Reveal>
        <div className="relative mt-20 grid gap-12 md:grid-cols-3">
          <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 right-0 top-8 hidden h-px origin-left bg-brass md:block" />
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={0.2 + i * 0.2} className="relative text-center">
              <span className="relative mx-auto grid h-16 w-16 place-items-center rounded-full bg-ink text-accent shadow-luxe"><s.icon className="h-6 w-6" /></span>
              <h3 className="mt-6 font-display text-2xl">{s.title}</h3>
              <p className="mx-auto mt-2 max-w-xs text-muted-foreground">{s.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-28">
        <Reveal>
          <div className="relative border-y border-border px-4 py-16 text-center sm:px-16">
            <div className="relative">
              <h2 className="font-display text-3xl sm:text-4xl font-semibold">Have a place to rent?</h2>
              <p className="mx-auto mt-5 max-w-lg text-muted-foreground">Let people see your space and get in touch.</p>
              <Button size="xl" className="mt-8 rounded-lg" onClick={() => onNavigate("list")}>List your property <ArrowRight className="ml-1 h-5 w-5" /></Button>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

function FeaturedRail<T extends { id: string }>({ title, items, render, onAll }: { title: string; items: T[]; render: (i: T) => React.ReactNode; onAll: () => void }) {
  return (
    <section className="py-20">
      <div className="container mb-10 flex items-end justify-between">
        <Reveal><h2 className="font-display text-3xl sm:text-4xl font-semibold">{title}</h2></Reveal>
        <Button variant="link" onClick={onAll} className="text-base">View all <ArrowRight className="ml-1 h-4 w-4" /></Button>
      </div>
      <div className="container flex snap-x snap-mandatory gap-6 overflow-x-auto pb-6 [scrollbar-width:none]">
        {items.map((it, i) => (
          <motion.div key={it.id} initial={{ opacity: 0, x: 60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            transition={{ delay: Math.min(i, 5) * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="w-[300px] shrink-0 snap-start sm:w-[340px]">
            {render(it)}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
