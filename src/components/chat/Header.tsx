import { GraduationCap, Sparkles, Eraser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

type Props = { onClear: () => void; hasMessages: boolean };

export function Header({ onClear, hasMessages }: Props) {
  return (
    <header className="sticky top-0 z-20 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div
            className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-elevated"
            aria-hidden="true"
          >
            <GraduationCap className="h-5 w-5" />
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background bg-success animate-pulse-soft" />
          </div>
          <div className="leading-tight">
            <h1 className="text-base font-semibold tracking-tight sm:text-lg">
              Darrang College Assistant
            </h1>
            <div className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium text-accent-foreground">
              <Sparkles className="h-2.5 w-2.5" />
              <span>Powered by AI</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            disabled={!hasMessages}
            aria-label="Clear chat"
            className="text-muted-foreground hover:text-foreground"
          >
            <Eraser className="h-4 w-4 sm:mr-1.5" />
            <span className="hidden sm:inline">Clear</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
