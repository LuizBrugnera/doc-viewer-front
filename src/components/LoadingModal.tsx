import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingModalProps {
  isLoading: boolean;
  text?: string;
  className?: string;
}

export default function LoadingModal({
  isLoading,
  text,
  className,
}: LoadingModalProps) {
  if (!isLoading) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        "bg-background/80 backdrop-blur-sm",
        "transition-opacity duration-300",
        className
      )}
    >
      <div className="flex flex-col items-center space-y-4 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        {text && (
          <p className="text-sm font-medium text-muted-foreground">{text}</p>
        )}
      </div>
    </div>
  );
}
