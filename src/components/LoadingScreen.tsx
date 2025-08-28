import { useEffect, useState } from "react";

export const LoadingScreen = () => {
  const [loadingText, setLoadingText] = useState("INITIALIZING");
  const [dots, setDots] = useState("");

  useEffect(() => {
    const textCycle = ["INITIALIZING", "CONNECTING", "LOADING CSI SYSTEMS"];
    let currentIndex = 0;

    const textInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % textCycle.length;
      setLoadingText(textCycle[currentIndex]);
    }, 1000);

    return () => clearInterval(textInterval);
  }, []);

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? "" : prev + ".");
    }, 500);

    return () => clearInterval(dotsInterval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-20">
        <div className="h-full w-full bg-gradient-to-br from-primary/20 to-secondary/20" />
        <div className="absolute inset-0 cyber-scanline" />
      </div>

      {/* Main content */}
      <div className="text-center z-10">
        {/* CSI Logo */}
        <div className="mb-8">
          <h1 className="text-8xl font-bold cyber-glow cyber-flicker mb-4">
            <span className="text-primary">C</span>
            <span className="text-secondary">S</span>
            <span className="text-accent">I</span>
          </h1>
          <div className="text-xl text-muted-foreground font-mono tracking-widest">
            COMPUTER SOCIETY OF INDIA
          </div>
        </div>

        {/* Loading animation */}
        <div className="space-y-4">
          <div className="text-2xl font-mono cyber-glow">
            {loadingText}{dots}
          </div>
          
          {/* Progress bar */}
          <div className="w-80 h-2 border border-primary/50 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-gradient-to-r from-primary to-secondary cyber-glow animate-pulse w-full" />
          </div>
        </div>

      </div>

      {/* Holographic effects */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-primary/30 rounded-full animate-ping" />
      <div className="absolute bottom-1/4 right-1/4 w-24 h-24 border border-secondary/30 rounded-full animate-ping delay-1000" />
    </div>
  );
};