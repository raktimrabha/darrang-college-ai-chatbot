import { useEffect, useRef } from "react";
import { GraduationCap } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { SuggestionChips } from "./SuggestionChips";
import type { Message } from "@/hooks/useChat";

type Props = {
  messages: Message[];
  isLoading: boolean;
  onFeedback: (id: string, value: "up" | "down") => void;
  onPickSuggestion: (text: string) => void;
};

export function ChatWindow({ messages, isLoading, onFeedback, onPickSuggestion }: Props) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading]);

  const isEmpty = messages.length === 0;

  return (
    <div
      role="log"
      aria-live="polite"
      aria-label="Chat conversation"
      className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-4 py-6 sm:px-6"
    >
      {isEmpty ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 py-8 text-center">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-primary text-primary-foreground ring-glow"
            aria-hidden="true"
          >
            <GraduationCap className="h-9 w-9" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Hi! <span className="inline-block animate-pulse-soft">👋</span> I'm the Darrang College assistant
            </h2>
            <p className="mx-auto max-w-md text-sm text-muted-foreground sm:text-base">
              Ask me anything about Darrang College admissions, courses, fees, or exams — I'm here to help.
            </p>
          </div>
          <div className="w-full pt-2">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Try asking
            </p>
            <SuggestionChips onPick={onPickSuggestion} disabled={isLoading} />
          </div>
        </div>
      ) : (
        <>
          {messages.map((m, i) => {
            const prev = messages[i - 1];
            const tight = prev && prev.role === m.role;
            return (
              <div key={m.id} className={tight ? "-mt-2.5" : ""}>
                <MessageBubble message={m} onFeedback={onFeedback} />
              </div>
            );
          })}
          {isLoading && <TypingIndicator />}
          <div ref={endRef} />
        </>
      )}
    </div>
  );
}
