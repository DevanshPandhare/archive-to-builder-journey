import { useEffect, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from "motion/react";
import { Heart, X, RotateCcw, MapPin, Info, Sparkles } from "lucide-react";
import type { AnyListing, Listing, RoommateProfile } from "@/lib/types";
import { cn } from "@/lib/utils";
import { recordSwipe, swipesLeft } from "@/lib/app-settings";

interface SwipeDeckProps {
  items: AnyListing[];
  likedItemIds: Set<string>;
  onToggleLike: (id: string) => void;
  onViewDetails: (item: AnyListing, type: "listing" | "roommate") => void;
  className?: string;
}

const isRoommate = (i: AnyListing): i is RoommateProfile => i.propertyType === "Roommate";

export function SwipeDeck({ items, likedItemIds, onToggleLike, onViewDetails, className }: SwipeDeckProps) {
  const [index, setIndex] = useState(0);
  const [lastAction, setLastAction] = useState<"like" | "pass" | null>(null);
  const [trigger, setTrigger] = useState<{ dir: 1 | -1; n: number } | null>(null);

  const [left, setLeft] = useState(25);
  useEffect(() => { setLeft(swipesLeft()); }, []);
  useEffect(() => { setIndex(0); }, [items.length]);

  const handleSwiped = (item: AnyListing, dir: 1 | -1) => {
    if (dir === 1 && !likedItemIds.has(item.id)) onToggleLike(item.id);
    setLastAction(dir === 1 ? "like" : "pass");
    setIndex((i) => i + 1);
    setTrigger(null);
    recordSwipe();
    setLeft(swipesLeft());
  };

  const visible = items.slice(index, index + 3);
  const outOfSwipes = left <= 0;
  const done = index >= items.length || outOfSwipes;

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative h-[520px] w-full max-w-[380px] sm:h-[560px]">
        <AnimatePresence>
          {visible.map((item, i) => (
            <SwipeCard
              key={item.id}
              item={item}
              depth={i}
              trigger={i === 0 ? trigger : null}
              onSwiped={(dir) => handleSwiped(item, dir)}
              onInfo={() => onViewDetails(item, isRoommate(item) ? "roommate" : "listing")}
            />
          )).reverse()}
        </AnimatePresence>
        {outOfSwipes && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 rounded-[2rem] border border-border bg-card p-8 text-center">
            <Sparkles className="h-10 w-10 text-primary" />
            <p className="font-display text-2xl">You've used all your swipes</p>
            <p className="text-sm text-muted-foreground">Your liked roommates are saved under Liked Properties.</p>
          </div>
        )}
        {done && !outOfSwipes && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-[2rem] border border-dashed border-border bg-card text-center p-8">
            <Sparkles className="h-10 w-10 text-accent" />
            <p className="font-display text-2xl">You've seen them all</p>
            <p className="text-sm text-muted-foreground">Your likes are saved under Liked Properties.</p>
            <button onClick={() => setIndex(0)} className="mt-2 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-ink-foreground">
              <RotateCcw className="h-4 w-4" /> Start over
            </button>
          </motion.div>
        )}
      </div>

      <div className="mt-8 flex items-center gap-6">
        <SwipeButton label="Pass" disabled={done} onClick={() => setTrigger({ dir: -1, n: Date.now() })} variant="pass"><X className="h-7 w-7" /></SwipeButton>
        <button aria-label="Undo" disabled={index === 0} onClick={() => setIndex((i) => Math.max(0, i - 1))}
          className="grid h-12 w-12 place-items-center rounded-full border border-border bg-card text-muted-foreground transition hover:text-foreground hover:rotate-[-45deg] disabled:opacity-40 duration-300">
          <RotateCcw className="h-5 w-5" />
        </button>
        <SwipeButton label="Like" disabled={done} onClick={() => setTrigger({ dir: 1, n: Date.now() })} variant="like"><Heart className="h-7 w-7 fill-current" /></SwipeButton>
      </div>
      <p className="mt-4 h-5 text-xs uppercase tracking-[0.25em] text-muted-foreground">
        {outOfSwipes ? "No swipes left" : `${left} swipes left`}
      </p>
    </div>
  );
}

function SwipeButton({ children, onClick, variant, label, disabled }: { children: React.ReactNode; onClick: () => void; variant: "like" | "pass"; label: string; disabled?: boolean }) {
  return (
    <motion.button
      aria-label={label} disabled={disabled} onClick={onClick}
      whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.85, rotate: variant === "like" ? 12 : -12 }}
      className={cn(
        "grid h-[72px] w-[72px] place-items-center rounded-full border-2 bg-card shadow-luxe transition-colors disabled:opacity-40",
        variant === "like" ? "border-success/40 text-success hover:bg-success hover:text-success-foreground" : "border-destructive/40 text-destructive hover:bg-destructive hover:text-destructive-foreground",
      )}
    >
      {children}
    </motion.button>
  );
}

function SwipeCard({ item, depth, trigger, onSwiped, onInfo }: { item: AnyListing; depth: number; trigger: { dir: 1 | -1; n: number } | null; onSwiped: (d: 1 | -1) => void; onInfo: () => void }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-18, 18]);
  const likeOpacity = useTransform(x, [30, 140], [0, 1]);
  const nopeOpacity = useTransform(x, [-140, -30], [1, 0]);
  const top = depth === 0;

  const fly = (dir: 1 | -1) => {
    animate(x, dir * 700, { duration: 0.5, ease: [0.4, 0, 0.2, 1] }).then(() => onSwiped(dir));
  };

  useEffect(() => { if (trigger) fly(trigger.dir); }, [trigger?.n]); // eslint-disable-line react-hooks/exhaustive-deps

  const roommate = isRoommate(item);
  const title = roommate ? item.ownerName : (item as Listing).title;
  const img = item.images?.[0];
  const tags = roommate ? item.preferences?.slice(0, 3) ?? [] : [(item as Listing).size, (item as Listing).furnishedStatus].filter(Boolean);

  return (
    <motion.div
      className="absolute inset-0 cursor-grab touch-none active:cursor-grabbing"
      style={{ x, rotate, zIndex: 10 - depth }}
      initial={{ scale: 0.9, y: 30, opacity: 0 }}
      animate={{ scale: 1 - depth * 0.05, y: depth * 18, opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      drag={top ? "x" : false}
      dragSnapToOrigin
      dragElastic={0.9}
      onDragEnd={(_, info) => {
        if (info.offset.x > 120 || info.velocity.x > 600) fly(1);
        else if (info.offset.x < -120 || info.velocity.x < -600) fly(-1);
      }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-ink shadow-luxe">
        {img ? <img src={img} alt={title} draggable={false} className="absolute inset-0 h-full w-full object-cover" /> : <div className="absolute inset-0 bg-brass opacity-60" />}
        <div className="absolute inset-0 bg-ink-fade" />
        <motion.div style={{ opacity: likeOpacity }} className="absolute left-6 top-8 -rotate-12 rounded-xl border-4 border-success px-4 py-1 font-display text-3xl font-bold tracking-widest text-success">LIKE</motion.div>
        <motion.div style={{ opacity: nopeOpacity }} className="absolute right-6 top-8 rotate-12 rounded-xl border-4 border-destructive px-4 py-1 font-display text-3xl font-bold tracking-widest text-destructive">NOPE</motion.div>
        <span className="absolute left-5 top-5 glass rounded-full px-3 py-1 text-[11px] font-semibold text-ink-foreground">
          {roommate && item.hasProperty ? "Looking for roommate" : "Looking for property"}
        </span>
        <div className="absolute inset-x-0 bottom-0 space-y-3 p-6 text-ink-foreground">
          <div className="flex items-end justify-between gap-3">
            <h3 className="font-display text-3xl leading-tight">{title}{roommate && item.age ? <span className="font-sans text-xl opacity-70">, {item.age}</span> : null}</h3>
            <button onPointerDown={(e) => e.stopPropagation()} onClick={onInfo} aria-label="View details" className="glass grid h-10 w-10 shrink-0 place-items-center rounded-full">
              <Info className="h-5 w-5" />
            </button>
          </div>
          <p className="flex items-center gap-1.5 text-sm opacity-80"><MapPin className="h-4 w-4" />{item.partialAddress || `${item.locality}, ${item.city}`}</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => <span key={String(t)} className="glass rounded-full px-3 py-1 text-xs">{t}</span>)}
          </div>
          <p className="font-display text-2xl text-brass">₹{item.rent?.toLocaleString("en-IN")}<span className="font-sans text-sm text-ink-foreground/70"> / month</span></p>
        </div>
      </div>
    </motion.div>
  );
}
