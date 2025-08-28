import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Instagram } from "lucide-react";

interface InstagramFollowProps {
  onConfirm: () => void;
}

export const InstagramFollow = ({ onConfirm }: InstagramFollowProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <Card className="max-w-lg w-full p-8 text-center cyber-glow border-2 border-primary/50 bg-card/90 backdrop-blur-sm">
        {/* Header */}
        <div className="mb-8">
          <Instagram className="w-16 h-16 text-primary mx-auto mb-4 cyber-glow" />
          <h2 className="text-3xl font-bold text-foreground mb-4 cyber-flicker">
            Follow Us on Instagram
          </h2>
        </div>

        {/* Instructions */}
        <div className="mb-8 space-y-4">
          <p className="text-foreground text-lg">
            Please follow our official Instagram handle to continue with the quiz.
          </p>
          
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-primary font-mono">
              @csi_official
            </div>
          </div>

          <p className="text-muted-foreground text-sm">
            This is based on the honor system. Click confirm once you have followed our account.
          </p>
        </div>

        {/* Action buttons */}
        <div className="space-y-4">
          <Button 
            asChild
            variant="outline"
            className="w-full py-4 text-lg border-primary/50 hover:bg-primary/10"
          >
            <a 
              href="https://instagram.com/csi_official" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Instagram className="w-5 h-5" />
              Open Instagram
            </a>
          </Button>

          <Button 
            onClick={onConfirm}
            className="w-full py-4 text-lg font-bold cyber-glow hover:scale-105 transition-transform"
          >
            <span className="cyber-flicker">I HAVE FOLLOWED</span>
          </Button>
        </div>

        {/* Decorative scanlines */}
        <div className="cyber-scanline absolute inset-0 pointer-events-none rounded-lg" />
      </Card>
    </div>
  );
};