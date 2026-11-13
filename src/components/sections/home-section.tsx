import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, ArrowUpRight, BedDouble, Building2, Users, ShieldCheck, Search, KeyRound, ChevronDown } from "lucide-react";
import type { Listing, RoommateProfile, Page } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/shared/property-card";
import { RoommateCard } from "@/components/shared/roommate-card";
import { SwipeDeck } from "@/components/shared/swipe-deck";
import { Reveal, SplitWords } from "@/components/motion/reveal";
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
  { icon: Building2, title: "Premium Rentals", text: "Verified apartments with real photos, honest pricing and zero surprises.", page: "rentals" as Page, n: "02" },
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

  return (
    <div>
      {/* HERO */}
      <section ref={heroRef} className="relative h-[100svh] min-h-[640px] overflow-hidden bg-ink grain">
        <motion.video style={{ scale: videoScale }} autoPlay loop muted playsInline preload="auto"
          className="absolute inset-0 h-full w-full object-cover" src={heroVideo.url} />
        <div className="absolute inset-0 bg-ink-fade" />
        <motion.div style={{ y: contentY, opacity: contentOpacity }}
          className="container relative z-10 flex h-full flex-col justify-end pb-24 sm:pb-28 text-ink-foreground">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-6 inline-flex w-fit items-center gap-2 glass rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.3em]">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" /> Verified homes · No brokerage
          </motion.p>
          <h1 className="font-display text-[clamp(2.75rem,8vw,7.5rem)] font-light leading-[0.95] tracking-tight max-w-5xl">
            <SplitWords text="Where you live" delay={0.3} />
            <br />
            <span className="italic text-brass"><SplitWords text="should feel like you." delay={0.6} /></span>
          </h1>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.9 }}
            className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <p className="max-w-md text-lg text-ink-foreground/75">
              Roommates, rentals and co-living — handpicked, verified and priced in the open.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="brass" size="xl" onClick={() => onNavigate("rentals")}>Explore homes <ArrowRight className="ml-1 h-5 w-5" /></Button>
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
        <div className="flex w-max animate-marquee gap-12 whitespace-nowrap font-display text-3xl italic text-muted-foreground">
          {[...cities, ...cities].map((c, i) => <span key={i} className="flex items-center gap-12">{c}<span className="text-accent">✦</span></span>)}
        </div>
      </div>

      {/* SERVICES */}
      <section className="container py-28 sm:py-36">
        <Reveal className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 className="font-display text-5xl sm:text-6xl font-light leading-tight max-w-2xl">Three ways to <em className="text-brass">find home.</em></h2>
          <p className="max-w-sm text-muted-foreground">Whatever stage of life you're in, there's a space on SetMyStay that fits it.</p>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.12}>
              <button onClick={() => onNavigate(s.page)}
                className="group relative flex h-full w-full flex-col overflow-hidden rounded-[2rem] border border-border bg-card p-8 text-left transition-all duration-500 hover:-translate-y-2 hover:bg-ink hover:text-ink-foreground hover:shadow-luxe">
                <div className="flex items-center justify-between">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-secondary text-foreground transition-colors duration-500 group-hover:bg-brass group-hover:text-accent-foreground"><s.icon className="h-6 w-6" /></span>
                  <span className="font-code text-sm text-muted-foreground group-hover:text-ink-foreground/60">{s.n}</span>
                </div>
                <h3 className="mt-16 font-display text-3xl">{s.title}</h3>
                <p className="mt-3 text-muted-foreground group-hover:text-ink-foreground/70">{s.text}</p>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold">Explore <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" /></span>
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SWIPE */}
      <section className="relative overflow-hidden bg-ink py-28 sm:py-36 text-ink-foreground grain">
        <div className="pointer-events-none absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-brass opacity-20 blur-[120px]" />
        <div className="container grid items-center gap-16 lg:grid-cols-2">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-accent">Swipe to discover</p>
            <h2 className="mt-4 font-display text-5xl sm:text-6xl font-light leading-tight">Love it? <em className="text-brass">Swipe right.</em><br />Not for you? Swipe left.</h2>
            <p className="mt-6 max-w-md text-ink-foreground/70">Finding a home shouldn't feel like paperwork. Flick through properties and roommates — everything you like is saved to your shortlist.</p>
            <div className="mt-10 inline-flex rounded-full glass p-1.5">
              {(["homes", "roommates"] as const).map((k) => (
                <button key={k} onClick={() => setDeck(k)}
                  className={cn("relative rounded-full px-6 py-2.5 text-sm font-semibold capitalize transition-colors", deck === k ? "text-accent-foreground" : "text-ink-foreground/70")}>
                  {deck === k && <motion.span layoutId="deck-pill" className="absolute inset-0 rounded-full bg-brass" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                  <span className="relative">{k}</span>
                </button>
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
      <section className="container py-28 sm:py-36">
        <Reveal><h2 className="font-display text-5xl sm:text-6xl font-light text-center">From search to <em className="text-brass">keys</em> in days.</h2></Reveal>
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
          <div className="relative overflow-hidden rounded-[2.5rem] bg-ink px-8 py-20 text-center text-ink-foreground sm:px-16 grain">
            <video autoPlay loop muted playsInline src={heroVideo.url} className="absolute inset-0 h-full w-full object-cover opacity-25" />
            <div className="relative">
              <h2 className="font-display text-4xl sm:text-6xl font-light">Own a property? <em className="text-brass">Fill it faster.</em></h2>
              <p className="mx-auto mt-5 max-w-lg text-ink-foreground/70">List in minutes and reach verified tenants and roommates across India.</p>
              <Button variant="brass" size="xl" className="mt-10" onClick={() => onNavigate("list")}>List your property <ArrowRight className="ml-1 h-5 w-5" /></Button>
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
        <Reveal><h2 className="font-display text-4xl sm:text-5xl font-light">{title}</h2></Reveal>
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
