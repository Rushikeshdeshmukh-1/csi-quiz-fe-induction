import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

interface QuizScreenProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (questionId: number, answer: string) => void;
  onNext: () => void;
  userAnswer?: string;
}

export const QuizScreen = ({ 
  question, 
  questionNumber, 
  totalQuestions, 
  onAnswer, 
  onNext,
  userAnswer 
}: QuizScreenProps) => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  // Reset state when question changes
  useEffect(() => {
    setSelectedOption(userAnswer || "");
    setShowCorrectAnswer(false);
    setTimeLeft(30);
  }, [question.id, userAnswer]);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !showCorrectAnswer) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleSubmit();
    }
  }, [timeLeft, showCorrectAnswer]);

  const handleOptionSelect = (option: string) => {
    if (!showCorrectAnswer) {
      setSelectedOption(option);
    }
  };

  const handleSubmit = () => {
    if (!selectedOption) return;
    
    onAnswer(question.id, selectedOption);
    setShowCorrectAnswer(true);
    
    // Auto advance after showing correct answer
    setTimeout(() => {
      onNext();
    }, 2000);
  };

  const getOptionClassName = (option: string) => {
    let baseClass = "w-full p-4 text-left border-2 rounded-lg transition-all duration-300 hover:scale-105";
    
    if (!showCorrectAnswer) {
      // Before submission - normal state
      if (selectedOption === option) {
        return `${baseClass} border-primary bg-primary/20 cyber-glow`;
      }
      return `${baseClass} border-primary/30 bg-card hover:border-primary/50 hover:bg-primary/10`;
    } else {
      // After submission - show correct/incorrect
      if (option === question.correctAnswer) {
        return `${baseClass} border-accent bg-accent/20 text-accent cyber-glow`;
      } else if (selectedOption === option && option !== question.correctAnswer) {
        return `${baseClass} border-destructive bg-destructive/20 text-destructive`;
      }
      return `${baseClass} border-muted/30 bg-muted/10 text-muted-foreground`;
    }
  };

  const progress = ((questionNumber - 1) / totalQuestions) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <Card className="max-w-4xl w-full p-8 cyber-glow border-2 border-primary/50 bg-card/90 backdrop-blur-sm">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="text-lg font-mono text-muted-foreground">
              Question {questionNumber} of {totalQuestions}
            </div>
            <div className="text-lg font-mono text-primary cyber-glow">
              {timeLeft}s
            </div>
          </div>
          
          <Progress value={progress} className="mb-6 h-2" />
          
          <h2 className="text-2xl font-bold text-foreground mb-4">
            {question.question}
          </h2>
        </div>

        {/* Options */}
        <div className="grid gap-4 mb-8">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(option)}
              className={getOptionClassName(option)}
              disabled={showCorrectAnswer}
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center font-mono font-bold">
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="text-lg">{option}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Submit Button */}
        {!showCorrectAnswer && (
          <Button 
            onClick={handleSubmit}
            disabled={!selectedOption}
            className="w-full py-6 text-lg font-bold cyber-glow hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            size="lg"
          >
            <span className="cyber-flicker">SUBMIT ANSWER</span>
          </Button>
        )}

        {/* Feedback */}
        {showCorrectAnswer && (
          <div className="text-center">
            <div className={`text-xl font-bold mb-2 ${
              selectedOption === question.correctAnswer ? 'text-accent' : 'text-destructive'
            }`}>
              {selectedOption === question.correctAnswer ? 'CORRECT!' : 'INCORRECT!'}
            </div>
            {selectedOption !== question.correctAnswer && (
              <div className="text-muted-foreground">
                Correct answer: {question.correctAnswer}
              </div>
            )}
            <div className="text-sm text-muted-foreground mt-4">
              Next question in 2 seconds...
            </div>
          </div>
        )}

        {/* Decorative scanlines */}
        <div className="cyber-scanline absolute inset-0 pointer-events-none rounded-lg" />
      </Card>
    </div>
  );
};