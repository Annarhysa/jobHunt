import React from "react";
import { ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Avatar } from "./ui/avatar";
import { AvatarFallback, AvatarImage } from "./ui/avatar";
import { motion } from "framer-motion";

export interface Description {
  id: string;
  text: string;
  contributor: string;
  rank: number;
}

interface DescriptionListProps {
  descriptions: Description[];
  onUpvote: (id: string) => void;
  onDownvote: (id: string) => void;
  onDelete: (id: string) => void;
}

const DescriptionList = ({
  descriptions = [
    {
      id: "1",
      text: "Helps people solve problems with their computers and software.",
      contributor: "Alex",
      rank: 1,
    },
    {
      id: "2",
      text: "Answers phone calls and emails about technical issues.",
      contributor: "Jamie",
      rank: 2,
    },
    {
      id: "3",
      text: "Installs software and troubleshoots hardware problems.",
      contributor: "Taylor",
      rank: 3,
    },
  ],
  onUpvote = () => {},
  onDownvote = () => {},
  onDelete = () => {},
}: DescriptionListProps) => {
  // Sort descriptions by rank
  const sortedDescriptions = [...descriptions].sort((a, b) => a.rank - b.rank);

  return (
    <div className="w-full space-y-4 bg-white p-4 rounded-lg">
      <h3 className="text-lg font-medium mb-4">Descriptions</h3>

      {sortedDescriptions.map((description) => (
        <motion.div
          key={description.id}
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-4 relative hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full p-0 h-8 w-8"
                  onClick={() => onUpvote(description.id)}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium">{description.rank}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full p-0 h-8 w-8"
                  onClick={() => onDownvote(description.id)}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1">
                <p className="text-base mb-2">{description.text}</p>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${description.contributor}`}
                      alt={description.contributor}
                    />
                    <AvatarFallback>
                      {description.contributor.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">
                    {description.contributor}
                  </span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full p-0 h-8 w-8"
                onClick={() => onDelete(description.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </motion.div>
      ))}

      {descriptions.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No descriptions yet. Be the first to add one!</p>
        </div>
      )}
    </div>
  );
};

export default DescriptionList;
