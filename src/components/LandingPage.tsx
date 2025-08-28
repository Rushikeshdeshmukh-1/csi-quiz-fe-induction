import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage = ({ onGetStarted }: LandingPageProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <Card className="max-w-md w-full p-8 text-center cyber-glow border-2 border-primary/50 bg-card/90 backdrop-blur-sm">
        {/* CSI Logo */}
        <div className="mb-8">
          <h1 className="text-6xl font-bold mb-4 cyber-flicker">
            <span className="text-primary">C</span>
            <span className="text-secondary">S</span>
            <span className="text-accent">I</span>
          </h1>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Computer Society of India
          </h2>
          <div className="text-lg text-muted-foreground font-mono tracking-wide">
            Quiz Challenge
          </div>
        </div>

        {/* Welcome message */}
        <div className="mb-8 space-y-4">
          <p className="text-foreground">
            Welcome to the CSI Quiz Challenge! Test your computer science knowledge 
            in this cyberpunk-themed quiz arena.
          </p>
          <div className="text-sm text-muted-foreground font-mono border-l-2 border-primary/50 pl-4">
            &gt; 10 challenging questions<br/>
            &gt; Real-time leaderboard<br/>
            &gt; Prove your CS mastery
          </div>
        </div>

        {/* Get Started Button */}
        <Button 
          onClick={onGetStarted}
          className="w-full py-6 text-lg font-bold cyber-glow hover:scale-105 transition-transform"
          size="lg"
        >
          <span className="cyber-flicker">ENTER THE MATRIX</span>
        </Button>

        {/* Decorative elements */}
        <div className="absolute -z-10 top-4 right-4 w-16 h-16 border border-secondary/30 rotate-45" />
        <div className="absolute -z-10 bottom-4 left-4 w-12 h-12 border border-accent/30 rotate-12" />
      </Card>
    </div>
  );
};