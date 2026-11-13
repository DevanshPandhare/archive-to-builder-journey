import type { Listing } from "@/lib/types";
import { MapPin, Home, BedDouble, Heart, ArrowUpRight, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PropertyCardProps {
  listing: Listing;
  onViewDetails: (listing: Listing) => void;
  isLiked: boolean;
  onToggleLike: () => void;
  isUnlocked: boolean;
}

export function PropertyCard({ listing, onViewDetails, isLiked, onToggleLike, isUnlocked }: PropertyCardProps) {
  const img = listing.images?.[0];
  return (
    <div onClick={() => onViewDetails(listing)}
      className="property-theme group flex h-full cursor-pointer flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden">
        {img ? <img src={img} alt={listing.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110" />
          : <div className="grid h-full place-items-center bg-muted"><Home className="h-10 w-10 text-muted-foreground" /></div>}
        <div className="absolute inset-0 bg-ink-fade opacity-0 transition-opacity duration-500 group-hover:opacity-60" />
        <span className="absolute left-4 top-4 glass inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-ink-foreground">
          {listing.propertyType === "PG" ? <BedDouble className="h-3 w-3" /> : <Home className="h-3 w-3" />}{listing.propertyType}
        </span>
        <Button variant="ghost" size="icon" aria-label="Like property" aria-pressed={isLiked}
          onClick={(e) => { e.stopPropagation(); onToggleLike(); }}
          className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full glass-light">
          <Heart className={cn("h-5 w-5 transition-all", isLiked ? "fill-destructive text-destructive scale-110" : "text-foreground")} />
        </Button>
        <span className="absolute bottom-4 right-4 grid h-11 w-11 translate-y-4 place-items-center rounded-full bg-accent text-accent-foreground opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="h-5 w-5" />
        </span>
      </div>
      <div className="flex flex-grow flex-col gap-3 p-5">
        <h3 className="truncate font-display text-lg font-semibold text-primary">{listing.title}</h3>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin className="h-4 w-4 shrink-0" /><span className="truncate">{listing.partialAddress}</span></p>
        <div className="flex flex-wrap gap-1.5">
          {[listing.size, listing.furnishedStatus, ...(Array.isArray(listing.amenities) ? listing.amenities.slice(0, 1) : [])].filter(Boolean).map((t) => (
            <span key={t} className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">{t}</span>
          ))}
        </div>
        <div className="mt-auto flex items-end justify-between border-t border-border pt-4">
          <p className="font-display text-2xl font-semibold text-primary">₹{listing.rent.toLocaleString("en-IN")}<span className="font-sans text-xs text-muted-foreground"> /mo</span></p>
          {isUnlocked && <span className="inline-flex items-center gap-1 text-xs font-semibold text-success"><CheckCircle className="h-4 w-4" />Unlocked</span>}
        </div>
      </div>
    </div>
  );
}
