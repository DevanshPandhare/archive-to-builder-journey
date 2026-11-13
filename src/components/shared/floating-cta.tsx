
'use client';

import { Button } from '@/components/ui/button';
import { Gift } from 'lucide-react';

interface FloatingCtaProps {
    onGameClick: () => void;
}

export function FloatingCta({ onGameClick }: FloatingCtaProps) {
    return (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
            <Button 
                onClick={onGameClick} 
                size="icon" 
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 w-12 h-12 shadow-lg flex items-center justify-center"
            >
                <Gift className="w-5 h-5" />
                <span className="sr-only">Play to Win</span>
            </Button>
        </div>
    );
}
