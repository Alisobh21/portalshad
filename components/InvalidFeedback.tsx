"use client";

import { Badge } from "@/components/ui/badge";

interface InvalidFeedbackProps {
  error: string;
  className?: string;
}

export default function InvalidFeedback({
  error,
  className,
}: InvalidFeedbackProps) {
  return (
    <Badge
      variant="danger"
      className={`max-w-full w-full whitespace-normal break-words px-2 ${
        className || ""
      }`}
    >
      {error}
    </Badge>
  );
}
