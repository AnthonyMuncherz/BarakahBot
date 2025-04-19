import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  className?: string;
  size?: number;
}

export function Loading({ className, size = 24 }: LoadingProps) {
  return (
    <Loader2
      className={cn("animate-spin", className)}
      size={size}
    />
  );
}

export function LoadingPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loading size={32} />
    </div>
  );
}

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Loading size={32} className="text-white" />
    </div>
  );
} 