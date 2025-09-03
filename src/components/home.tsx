import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import GameBoard from "./GameBoard";
import GameControls from "./GameControls";
import ResultsBoard from "./ResultsBoard";

interface JobData {
  id: number;
  title: string;
  descriptions: {
    id: string;
    text: string;
    contributor: string;
    votes: number;
  }[];
}

const Home = () => {
  // Mock data for job titles and descriptions
  const [jobs, setJobs] = useState<JobData[]>([
    {
      id: 1,
      title: "Software Engineer",
      descriptions: [
        {
          id: "1-1",
          text: "Writes code and fixes bugs",
          contributor: "Alex",
          votes: 5,
        },
        {
          id: "1-2",
          text: "Turns coffee into code",
          contributor: "Jamie",
          votes: 10,
        },
        {
          id: "1-3",
          text: "Builds digital solutions to real-world problems",
          contributor: "Taylor",
          votes: 7,
        },
      ],
    },
    {
      id: 2,
      title: "Graphic Designer",
      descriptions: [
        {
          id: "2-1",
          text: "Creates visual concepts using computer software",
          contributor: "Jordan",
          votes: 8,
        },
        {
          id: "2-2",
          text: "Makes things look pretty",
          contributor: "Casey",
          votes: 4,
        },
        {
          id: "2-3",
          text: "Communicates ideas through images and layouts",
          contributor: "Riley",
          votes: 6,
        },
      ],
    },
    // Add more mock jobs as needed
  ]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60);

  // Handle navigation between questions
  const handleNextQuestion = () => {
    if (currentQuestionIndex < jobs.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsGameComplete(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Timer controls
  const startTimer = () => setTimerRunning(true);
  const pauseTimer = () => setTimerRunning(false);
  const resetTimer = () => setTimeRemaining(60);

  // Handle description ranking
  const handleVote = (
    jobId: number,
    descriptionId: string,
    direction: "up" | "down",
  ) => {
    setJobs(
      jobs.map((job) => {
        if (job.id === jobId) {
          return {
            ...job,
            descriptions: job.descriptions.map((desc) => {
              if (desc.id === descriptionId) {
                return {
                  ...desc,
                  votes: desc.votes + (direction === "up" ? 1 : -1),
                };
              }
              return desc;
            }),
          };
        }
        return job;
      }),
    );
  };

  // Handle description deletion
  const handleDeleteDescription = (jobId: number, descriptionId: string) => {
    setJobs(
      jobs.map((job) => {
        if (job.id === jobId) {
          return {
            ...job,
            descriptions: job.descriptions.filter(
              (desc) => desc.id !== descriptionId,
            ),
          };
        }
        return job;
      }),
    );
  };

  // Handle adding a new description
  const handleAddDescription = (
    jobId: number,
    text: string,
    contributor: string,
  ) => {
    setJobs(
      jobs.map((job) => {
        if (job.id === jobId) {
          return {
            ...job,
            descriptions: [
              ...job.descriptions,
              {
                id: `${jobId}-${Date.now()}`,
                text,
                contributor,
                votes: 0,
              },
            ],
          };
        }
        return job;
      }),
    );
  };

  // Handle restarting the game
  const handleRestartGame = () => {
    setCurrentQuestionIndex(0);
    setIsGameComplete(false);
    setTimerRunning(false);
    setTimeRemaining(60);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#495057] mb-2">
            Job Guessing Game
          </h1>
          <p className="text-[#6c757d]">Guess the job based on descriptions!</p>
        </header>

        {!isGameComplete ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <GameBoard
                job={jobs[currentQuestionIndex]}
                onVote={handleVote}
                onDelete={handleDeleteDescription}
              />
              <GameControls
                currentQuestion={currentQuestionIndex + 1}
                totalQuestions={jobs.length}
                onPrevious={handlePreviousQuestion}
                onNext={handleNextQuestion}
                timeRemaining={timeRemaining}
                isTimerRunning={timerRunning}
                onStartTimer={startTimer}
                onPauseTimer={pauseTimer}
                onResetTimer={resetTimer}
              />
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-[#495057]">
                  Add Description
                </h2>
                <AddDescriptionForm
                  onSubmit={(text, contributor) =>
                    handleAddDescription(
                      jobs[currentQuestionIndex].id,
                      text,
                      contributor,
                    )
                  }
                />
              </div>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full mt-4">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Contribute on Mobile
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <h2 className="text-xl font-semibold mb-4 text-[#495057]">
                    Add Description
                  </h2>
                  <AddDescriptionForm
                    onSubmit={(text, contributor) =>
                      handleAddDescription(
                        jobs[currentQuestionIndex].id,
                        text,
                        contributor,
                      )
                    }
                  />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        ) : (
          <ResultsBoard jobs={jobs} onPlayAgain={handleRestartGame} />
        )}
      </motion.div>
    </div>
  );
};

interface AddDescriptionFormProps {
  onSubmit: (text: string, contributor: string) => void;
}

const AddDescriptionForm = ({ onSubmit }: AddDescriptionFormProps) => {
  const [text, setText] = useState("");
  const [contributor, setContributor] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && contributor.trim()) {
      onSubmit(text, contributor);
      setText("");
      setContributor("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-[#495057] mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full rounded-md border border-[#ced4da] p-2 text-sm"
          rows={4}
          placeholder="Enter a description for this job..."
          required
        />
      </div>

      <div>
        <label
          htmlFor="contributor"
          className="block text-sm font-medium text-[#495057] mb-1"
        >
          Your Name
        </label>
        <input
          id="contributor"
          type="text"
          value={contributor}
          onChange={(e) => setContributor(e.target.value)}
          className="w-full rounded-md border border-[#ced4da] p-2 text-sm"
          placeholder="Enter your name"
          required
        />
      </div>

      <Button type="submit" className="w-full bg-[#6c5ce7] hover:bg-[#5a49d8]">
        Add Description
      </Button>
    </form>
  );
};

export default Home;
