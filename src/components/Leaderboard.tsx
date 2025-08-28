import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, Medal, Award, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface LeaderboardEntry {
  id: string;
  first_name: string;
  last_name: string;
  branch: string;
  score: number;
  total_questions: number;
  completed_at: string;
}

interface LeaderboardProps {
  onAdminAccess: () => void;
}

export const Leaderboard = ({ onAdminAccess }: LeaderboardProps) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('quiz_submissions')
        .select(`
          *,
          profiles!inner(
            first_name,
            last_name,
            branch
          )
        `)
        .order('score', { ascending: false })
        .order('completed_at', { ascending: true });

      if (error) throw error;

      const formattedEntries = data?.map(entry => ({
        id: entry.id,
        first_name: entry.profiles.first_name,
        last_name: entry.profiles.last_name,
        branch: entry.profiles.branch,
        score: entry.score,
        total_questions: entry.total_questions,
        completed_at: entry.completed_at
      })) || [];

      setEntries(formattedEntries);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">{rank}</div>;
    }
  };

  const getRankClassName = (rank: number) => {
    switch (rank) {
      case 1:
        return "border-yellow-400 bg-yellow-400/10 cyber-glow";
      case 2:
        return "border-gray-300 bg-gray-300/10";
      case 3:
        return "border-amber-600 bg-amber-600/10";
      default:
        return "border-primary/30 bg-card/50";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-mono cyber-glow">Loading leaderboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 cyber-flicker">
            NEON LEADERBOARD
          </h1>
          <div className="text-lg text-muted-foreground font-mono">
            Top Performers - CSI Quiz Challenge
          </div>
        </div>

        {/* Admin Access Button */}
        <div className="text-center mb-8">
          <Button
            onClick={onAdminAccess}
            variant="outline"
            className="border-destructive/50 text-destructive hover:bg-destructive/10"
          >
            <Shield className="w-4 h-4 mr-2" />
            Admin Dashboard
          </Button>
        </div>

        {/* Leaderboard */}
        <Card className="p-6 cyber-glow border-2 border-primary/50 bg-card/90 backdrop-blur-sm">
          {entries.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No submissions yet. Be the first to complete the quiz!
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map((entry, index) => {
                const rank = index + 1;
                return (
                  <div
                    key={entry.id}
                    className={`p-4 rounded-lg border-2 transition-all ${getRankClassName(rank)}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {getRankIcon(rank)}
                        <div>
                          <div className="font-bold text-foreground">
                            {entry.first_name} {entry.last_name}
                          </div>
                          <div className="text-sm text-muted-foreground font-mono">
                            {entry.branch}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-xl font-bold text-primary">
                          {entry.score}/{entry.total_questions}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {Math.round((entry.score / entry.total_questions) * 100)}%
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Decorative elements */}
        <div className="cyber-scanline absolute inset-0 pointer-events-none" />
      </div>
    </div>
  );
};