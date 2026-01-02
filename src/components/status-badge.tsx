import { cn } from "@/lib/utils";
import type { DisasterStatus, ProposalStatus } from "@/lib/types";

type Status = DisasterStatus | ProposalStatus;

const statusStyles: Record<Status, string> = {
  // Disaster Statuses
  "Active": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/70 dark:text-yellow-300 border-yellow-300/50",
  "Response Ongoing": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/70 dark:text-yellow-300 border-yellow-300/50",
  "Funds Deploying": "bg-blue-100 text-blue-800 dark:bg-blue-900/70 dark:text-blue-300 border-blue-300/50",
  "Completed": "bg-green-100 text-green-800 dark:bg-green-900/70 dark:text-green-300 border-green-300/50",
  "Archived": "bg-gray-100 text-gray-800 dark:bg-gray-700/70 dark:text-gray-300 border-gray-300/50",
  
  // Proposal Statuses
  "Pending": "bg-orange-100 text-orange-800 dark:bg-orange-900/70 dark:text-orange-300 border-orange-300/50",
  "Approved": "bg-green-100 text-green-800 dark:bg-green-900/70 dark:text-green-300 border-green-300/50",
  "Rejected": "bg-red-100 text-red-800 dark:bg-red-900/70 dark:text-red-300 border-red-300/50",
};

const statusDots: Record<Status, string> = {
  "Active": "bg-yellow-500",
  "Response Ongoing": "bg-yellow-500 animate-pulse",
  "Funds Deploying": "bg-blue-500 animate-pulse",
  "Completed": "bg-green-500",
  "Archived": "bg-gray-500",
  
  "Pending": "bg-orange-500 animate-pulse",
  "Approved": "bg-green-500",
  "Rejected": "bg-red-500",
};

export function StatusBadge({ status, className }: { status: Status, className?: string }) {
  const style = statusStyles[status] || statusStyles['Archived'];
  const dotStyle = statusDots[status] || statusDots['Archived'];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium border",
        style,
        className
      )}
    >
      <div className={cn("h-1.5 w-1.5 rounded-full", dotStyle)}></div>
      {status}
    </div>
  );
}
