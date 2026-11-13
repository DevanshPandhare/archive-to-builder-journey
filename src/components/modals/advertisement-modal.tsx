import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Copy, Check } from "lucide-react";

interface AdvertisementModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  imageUrl: string;
}

export function AdvertisementModal({ isOpen, onClose, title, description, imageUrl }: AdvertisementModalProps) {
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;
  const code = description.match(/code:?\s*([A-Z0-9]{4,})/i)?.[1];
  const text = code ? description.replace(/\s*Use code:?\s*[A-Z0-9]+\.?/i, "") : description;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden gap-0 border-0">
        {imageUrl && (
          <div className="relative h-52 w-full">
            <img src={imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
          </div>
        )}
        <div className="px-7 pb-7 pt-2 space-y-4">
          <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Limited offer</p>
          <DialogTitle className="font-display text-3xl font-normal leading-tight">{title}</DialogTitle>
          <DialogDescription className="text-sm leading-relaxed">{text}</DialogDescription>
          {code && (
            <button
              type="button"
              onClick={() => { navigator.clipboard?.writeText(code); setCopied(true); }}
              className="flex w-full items-center justify-between rounded-xl border border-dashed px-4 py-3 font-mono text-sm tracking-widest hover:bg-secondary transition-colors"
            >
              {code}
              <span className="flex items-center gap-1.5 font-sans text-xs tracking-normal text-muted-foreground">
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}{copied ? "Copied" : "Copy"}
              </span>
            </button>
          )}
          <Button onClick={onClose} variant="ghost" className="w-full text-muted-foreground">Maybe later</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
