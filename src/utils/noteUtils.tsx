import React from "react";

// Utility function to format report notes for display
export const formatReportNote = (note: string): string => {
  if (!note) return "";
  // Replace \r\n, \r, or \n with proper line breaks for display
  return note
    .replace(/\\r\\n/g, "\n") // Replace escaped \r\n
    .replace(/\\n/g, "\n") // Replace escaped \n
    .replace(/\\r/g, "\n") // Replace escaped \r
    .replace(/\r\n/g, "\n") // Replace actual \r\n
    .replace(/\r/g, "\n"); // Replace actual \r
};

// Component to display formatted report notes
interface FormattedReportNoteProps {
  note: string;
}

export const FormattedReportNote: React.FC<FormattedReportNoteProps> = ({
  note,
}) => {
  const formattedNote = formatReportNote(note);
  const lines = formattedNote.split("\n");

  return (
    <div className="space-y-2">
      {lines.map((line: string, index: number) => {
        // Check if line contains a colon (key-value pair)

        // Check if it's the header
        if (line.includes("PATIENT VITALS:")) {
          return (
            <div
              key={index}
              className="font-semibold text-primary text-lg mb-4 pb-2 border-b-2 border-primary/20"
            >
              {line}
            </div>
          );
        }

        if (line.includes(":")) {
          const [key, ...valueParts] = line.split(":");
          const value = valueParts.join(":").trim();

          return (
            <div key={index} className="flex gap-2">
              <span className="text-[#667085]">{key.trim()}:</span>
              <span className="text-[#3E3E3E] font-medium">{value}</span>
            </div>
          );
        }

        // Regular line without colon
        return (
          <div key={index} className="text-black">
            {line}
          </div>
        );
      })}
    </div>
  );
};

// Enhanced structured display with better spacing and color scheme
interface StructuredReportDisplayProps {
  note: string;
}

export const StructuredReportDisplay: React.FC<
  StructuredReportDisplayProps
> = ({ note }) => {
  const formattedNote = formatReportNote(note);
  const lines = formattedNote
    .split("\n")
    .filter((line: string) => line.trim() !== "");

  return (
    <div className="space-y-3">
      {lines.map((line: string, index: number) => {
        // Check if it's the header
        if (line.includes("PATIENT VITALS:")) {
          return (
            <div
              key={index}
              className="font-semibold text-primary text-lg mb-4 pb-2 border-b-2 border-primary/20"
            >
              {line}
            </div>
          );
        }

        // Check if it's a vital measurement (contains colon)
        if (line.includes(":") && !line.includes("PATIENT VITALS")) {
          const [label, value] = line
            .split(":")
            .map((part: string) => part.trim());
          return (
            <div
              key={index}
              className="flex justify-between items-center py-2 px-3 bg-gray-50/50 rounded-md"
            >
              <span className="font-medium text-gray-500">{label}:</span>
              <span className="text-black font-medium">{value}</span>
            </div>
          );
        }

        // Regular text
        return (
          <div key={index} className="text-gray-800 py-1">
            {line}
          </div>
        );
      })}
    </div>
  );
};
