import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { UserData } from "@/pages/Index";

interface RegistrationFormProps {
  onSubmit: (data: UserData) => void;
}

const branches = [
  "Computer Engineering",
  "Information Technology",
  "Electronics",
  "Mechanical",
  "Civil",
  "Electrical",
  "Other"
];

export const RegistrationForm = ({ onSubmit }: RegistrationFormProps) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    branch: ""
  });
  const { toast } = useToast();

  const handleInputChange = (field: keyof UserData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.branch) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    if (!formData.email.includes('@')) {
      toast({
        title: "Error", 
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <Card className="max-w-lg w-full p-8 cyber-glow border-2 border-primary/50 bg-card/90 backdrop-blur-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4 cyber-flicker">
            Register for Quiz
          </h2>
          <div className="text-muted-foreground font-mono">
            Enter the arena. Prove your worth.
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-foreground font-mono">
                First Name
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="cyber-glow border-primary/30 bg-input/80 focus:border-primary"
                placeholder="Enter first name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-foreground font-mono">
                Last Name
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="cyber-glow border-primary/30 bg-input/80 focus:border-primary"
                placeholder="Enter last name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground font-mono">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="cyber-glow border-primary/30 bg-input/80 focus:border-primary"
              placeholder="your.email@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="branch" className="text-foreground font-mono">
              Branch
            </Label>
            <Select value={formData.branch} onValueChange={(value) => handleInputChange('branch', value)}>
              <SelectTrigger className="cyber-glow border-primary/30 bg-input/80 focus:border-primary">
                <SelectValue placeholder="Select your branch" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-primary/30">
                {branches.map((branch) => (
                  <SelectItem key={branch} value={branch}>
                    {branch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            type="submit"
            className="w-full py-6 text-lg font-bold cyber-glow hover:scale-105 transition-transform"
            size="lg"
          >
            <span className="cyber-flicker">ENTER QUIZ ARENA</span>
          </Button>
        </form>

        {/* Decorative elements */}
        <div className="cyber-scanline absolute inset-0 pointer-events-none rounded-lg" />
      </Card>
    </div>
  );
};