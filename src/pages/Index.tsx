import { useState, useEffect } from "react";
import { LoadingScreen } from "@/components/LoadingScreen";
import { LandingPage } from "@/components/LandingPage";
import { InstagramFollow } from "@/components/InstagramFollow";
import { RegistrationForm } from "@/components/RegistrationForm";
import { QuizScreen } from "@/components/QuizScreen";
import { Leaderboard } from "@/components/Leaderboard";
import { AdminDashboard } from "@/components/AdminDashboard";
import { supabase } from "@/integrations/supabase/client";

export type PageType = 
  | "loading" 
  | "landing" 
  | "instagram-follow" 
  | "register" 
  | "quiz"
  | "leaderboard"
  | "admin-dashboard";

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  branch: string;
}

const quizQuestions = [
  {
    id: 1,
    question: "What does CPU stand for?",
    options: ["Central Processing Unit", "Computer Personal Unit", "Control Process Utility", "Central Performance Unit"],
    correctAnswer: "Central Processing Unit"
  },
  {
    id: 2,
    question: "Which of the following is not an operating system?",
    options: ["Windows", "Linux", "Oracle", "MacOS"],
    correctAnswer: "Oracle"
  },
  {
    id: 3,
    question: "HTML is used for?",
    options: ["Structuring web pages", "Designing circuits", "Data storage", "Operating systems"],
    correctAnswer: "Structuring web pages"
  },
  {
    id: 4,
    question: "What is the full form of SQL?",
    options: ["Structured Query Language", "Simple Query Logic", "Systematic Query List", "Sequential Query Language"],
    correctAnswer: "Structured Query Language"
  },
  {
    id: 5,
    question: "Which data structure uses FIFO?",
    options: ["Stack", "Queue", "Tree", "Graph"],
    correctAnswer: "Queue"
  },
  {
    id: 6,
    question: "Which company developed Java?",
    options: ["Sun Microsystems", "Oracle", "Microsoft", "IBM"],
    correctAnswer: "Sun Microsystems"
  },
  {
    id: 7,
    question: "Which of the following is a NoSQL database?",
    options: ["MySQL", "MongoDB", "PostgreSQL", "OracleDB"],
    correctAnswer: "MongoDB"
  },
  {
    id: 8,
    question: "Which algorithm is used for shortest path in a graph?",
    options: ["Dijkstra's", "Kruskal's", "Prim's", "Merge Sort"],
    correctAnswer: "Dijkstra's"
  },
  {
    id: 9,
    question: "Which protocol is used to send email?",
    options: ["SMTP", "HTTP", "FTP", "IMAP"],
    correctAnswer: "SMTP"
  },
  {
    id: 10,
    question: "What does OOP stand for?",
    options: ["Object-Oriented Programming", "Overloaded Operating Process", "Open Operation Protocol", "Optional Object Processing"],
    correctAnswer: "Object-Oriented Programming"
  }
];

const Index = () => {
  const [currentPage, setCurrentPage] = useState<PageType>("loading");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [quizStartTime, setQuizStartTime] = useState<number>(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage("landing");
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handlePageChange = (page: PageType) => {
    setCurrentPage(page);
  };

  const handleRegistration = (data: UserData) => {
    setUserData(data);
    setCurrentPage("quiz");
    setQuizStartTime(Date.now());
  };

  const handleQuizAnswer = (questionId: number, answer: string) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleQuizComplete();
    }
  };

  const handleQuizComplete = async () => {
    if (!userData) return;

    const score = quizQuestions.reduce((acc, question) => {
      return acc + (userAnswers[question.id] === question.correctAnswer ? 1 : 0);
    }, 0);

    const timeTaken = Math.floor((Date.now() - quizStartTime) / 1000);

    try {
      // Insert profile first
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          first_name: userData.firstName,
          last_name: userData.lastName,
          email: userData.email,
          branch: userData.branch
        })
        .select()
        .single();

      if (profileError) throw profileError;

      // Insert quiz submission
      const { error: submissionError } = await supabase
        .from('quiz_submissions')
        .insert({
          profile_id: profile.id,
          score,
          total_questions: quizQuestions.length,
          answers: userAnswers,
          time_taken: timeTaken
        });

      if (submissionError) throw submissionError;

      setCurrentPage("leaderboard");
    } catch (error) {
      console.error('Error submitting quiz:', error);
      // Still show leaderboard even if submission fails
      setCurrentPage("leaderboard");
    }
  };

  const getCurrentQuestion = () => {
    return quizQuestions[currentQuestionIndex];
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "loading":
        return <LoadingScreen />;
      case "landing":
        return <LandingPage onGetStarted={() => handlePageChange("instagram-follow")} />;
      case "instagram-follow":
        return <InstagramFollow onConfirm={() => handlePageChange("register")} />;
      case "register":
        return <RegistrationForm onSubmit={handleRegistration} />;
      case "quiz":
        return (
          <QuizScreen
            question={getCurrentQuestion()}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={quizQuestions.length}
            onAnswer={handleQuizAnswer}
            onNext={handleNextQuestion}
            userAnswer={userAnswers[getCurrentQuestion()?.id]}
          />
        );
      case "leaderboard":
        return <Leaderboard onAdminAccess={() => handlePageChange("admin-dashboard")} />;
      case "admin-dashboard":
        return <AdminDashboard onBack={() => handlePageChange("leaderboard")} />;
      default:
        return <LoadingScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderCurrentPage()}
    </div>
  );
};

export default Index;