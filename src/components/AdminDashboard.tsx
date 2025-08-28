import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Trash2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AdminEntry {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  branch: string;
  score: number;
  total_questions: number;
  completed_at: string;
  time_taken: number;
}

interface AdminDashboardProps {
  onBack: () => void;
}

export const AdminDashboard = ({ onBack }: AdminDashboardProps) => {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [entries, setEntries] = useState<AdminEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const ADMIN_PASSWORD = "CSI2025";

  useEffect(() => {
    if (authenticated) {
      fetchAllSubmissions();
    }
  }, [authenticated]);

  const handlePasswordSubmit = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      toast({
        title: "Access Granted",
        description: "Welcome to the admin control center",
      });
    } else {
      toast({
        title: "Access Denied",
        description: "Incorrect password",
        variant: "destructive"
      });
    }
  };

  const fetchAllSubmissions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('quiz_submissions')
        .select(`
          *,
          profiles!inner(
            first_name,
            last_name,
            email,
            branch
          )
        `)
        .order('completed_at', { ascending: false });

      if (error) throw error;

      const formattedEntries = data?.map(entry => ({
        id: entry.id,
        first_name: entry.profiles.first_name,
        last_name: entry.profiles.last_name,
        email: entry.profiles.email,
        branch: entry.profiles.branch,
        score: entry.score,
        total_questions: entry.total_questions,
        completed_at: entry.completed_at,
        time_taken: entry.time_taken || 0
      })) || [];

      setEntries(formattedEntries);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch submissions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNuclearReset = async () => {
    const confirmed = window.confirm(
      "⚠️ NUCLEAR RESET WARNING ⚠️\n\nThis will permanently delete ALL quiz submissions and profiles!\n\nType 'DELETE ALL' to confirm:"
    );

    if (!confirmed) return;

    const confirmText = window.prompt("Type 'DELETE ALL' to confirm:");
    if (confirmText !== 'DELETE ALL') {
      toast({
        title: "Reset Cancelled",
        description: "Nuclear reset was cancelled",
      });
      return;
    }

    setLoading(true);
    try {
      // Delete all quiz submissions (will cascade to profiles due to FK)
      const { error: submissionsError } = await supabase
        .from('quiz_submissions')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (submissionsError) throw submissionsError;

      // Delete all profiles
      const { error: profilesError } = await supabase
        .from('profiles')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (profilesError) throw profilesError;

      setEntries([]);
      toast({
        title: "Nuclear Reset Complete",
        description: "All data has been permanently deleted",
        variant: "destructive"
      });
    } catch (error) {
      console.error('Error during nuclear reset:', error);
      toast({
        title: "Reset Failed",
        description: "Failed to complete nuclear reset",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <Card className="max-w-md w-full p-8 text-center cyber-glow border-2 border-destructive/50 bg-card/90 backdrop-blur-sm">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-destructive mb-4 cyber-flicker">
              ADMIN ACCESS
            </h2>
            <div className="text-muted-foreground font-mono">
              Restricted Area - Authorization Required
            </div>
          </div>

          <div className="space-y-4">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="cyber-glow border-destructive/30 bg-input/80 focus:border-destructive"
              onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
            />
            
            <Button 
              onClick={handlePasswordSubmit}
              className="w-full py-4 bg-destructive hover:bg-destructive/80"
            >
              ACCESS CONTROL CENTER
            </Button>

            <Button 
              onClick={onBack}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Leaderboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-destructive mb-2 cyber-flicker">
              ADMIN CONTROL CENTER
            </h1>
            <div className="text-muted-foreground font-mono">
              CSI Quiz Management System
            </div>
          </div>
          
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Leaderboard
          </Button>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mb-8">
          <Button 
            onClick={fetchAllSubmissions}
            disabled={loading}
            className="bg-primary hover:bg-primary/80"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
          
          <Button 
            onClick={handleNuclearReset}
            disabled={loading}
            variant="destructive"
            className="bg-destructive hover:bg-destructive/80"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Nuclear Reset
          </Button>
        </div>

        {/* All Submissions */}
        <Card className="p-6 cyber-glow border-2 border-destructive/50 bg-card/90 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            All Quiz Submissions ({entries.length})
          </h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="text-lg font-mono cyber-glow">Loading submissions...</div>
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No submissions found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-primary/30">
                    <th className="text-left p-2 font-mono text-primary">Name</th>
                    <th className="text-left p-2 font-mono text-primary">Email</th>
                    <th className="text-left p-2 font-mono text-primary">Branch</th>
                    <th className="text-center p-2 font-mono text-primary">Score</th>
                    <th className="text-center p-2 font-mono text-primary">Time</th>
                    <th className="text-center p-2 font-mono text-primary">Completed</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr key={entry.id} className="border-b border-border/30 hover:bg-primary/5">
                      <td className="p-2 text-foreground">
                        {entry.first_name} {entry.last_name}
                      </td>
                      <td className="p-2 text-muted-foreground font-mono text-xs">
                        {entry.email}
                      </td>
                      <td className="p-2 text-muted-foreground">
                        {entry.branch}
                      </td>
                      <td className="p-2 text-center">
                        <span className="text-primary font-bold">
                          {entry.score}/{entry.total_questions}
                        </span>
                        <span className="text-muted-foreground ml-2">
                          ({Math.round((entry.score / entry.total_questions) * 100)}%)
                        </span>
                      </td>
                      <td className="p-2 text-center text-muted-foreground font-mono">
                        {Math.floor(entry.time_taken / 60)}:{(entry.time_taken % 60).toString().padStart(2, '0')}
                      </td>
                      <td className="p-2 text-center text-muted-foreground font-mono text-xs">
                        {new Date(entry.completed_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Decorative scanlines */}
        <div className="cyber-scanline absolute inset-0 pointer-events-none" />
      </div>
    </div>
  );
};