import { useState } from "react";
import { GraduationCap, ThumbsUp, ThumbsDown, AlertCircle, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Message } from "@/hooks/useChat";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function formatTime(d: Date) {
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

type Props = {
  message: Message;
  onFeedback: (id: string, value: "up" | "down") => void;
};

export function MessageBubble({ message, onFeedback }: Props) {
  const isUser = message.role === "user";
  const hasFeedback = !!message.feedback;
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <div
      className={cn(
        "group/msg flex w-full animate-bubble-in gap-2.5",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      {!isUser && (
        <div
          className={cn(
            "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-primary-foreground ring-2",
            message.isError
              ? "bg-destructive ring-destructive/20"
              : "bg-gradient-primary ring-primary/15",
          )}
          aria-hidden="true"
        >
          {message.isError ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <GraduationCap className="h-4 w-4" />
          )}
        </div>
      )}

      <div className={cn("flex max-w-[85%] flex-col sm:max-w-[75%]", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "break-words px-4 py-2.5 text-[14px] leading-relaxed shadow-bubble",
            isUser ? "whitespace-pre-wrap" : "prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:p-0 prose-pre:bg-transparent prose-pre:m-0",
            isUser
              ? "rounded-2xl rounded-br-md bg-gradient-user text-user-bubble-foreground"
              : "rounded-2xl rounded-bl-md border border-border bg-card text-card-foreground",
            message.isError && "border-destructive/30 bg-destructive/5 text-foreground",
          )}
        >
          {isUser ? (
            message.text
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.text}
            </ReactMarkdown>
          )}
        </div>

        <div
          className={cn(
            "mt-1 flex items-center gap-1.5 px-1 text-[11px] text-muted-foreground transition-opacity",
            isUser ? "flex-row-reverse" : "flex-row",
            !isUser && "sm:opacity-0 sm:group-hover/msg:opacity-100 sm:focus-within:opacity-100",
          )}
        >
          <span>{formatTime(message.timestamp)}</span>
          {!isUser && !message.isError && (
            <div className="flex items-center gap-0.5">
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={onCopy}
                aria-label="Copy message"
                className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
              <button
                type="button"
                onClick={() => onFeedback(message.id, "up")}
                disabled={hasFeedback}
                aria-label="Mark as helpful"
                className={cn(
                  "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 transition-colors",
                  "hover:bg-accent hover:text-accent-foreground disabled:cursor-default disabled:hover:bg-transparent",
                  message.feedback === "up" && "text-primary",
                )}
              >
                <ThumbsUp
                  className={cn("h-3 w-3", message.feedback === "up" && "fill-current")}
                />
              </button>
              <button
                type="button"
                onClick={() => onFeedback(message.id, "down")}
                disabled={hasFeedback}
                aria-label="Mark as not helpful"
                className={cn(
                  "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 transition-colors",
                  "hover:bg-accent hover:text-accent-foreground disabled:cursor-default disabled:hover:bg-transparent",
                  message.feedback === "down" && "text-destructive",
                )}
              >
                <ThumbsDown
                  className={cn("h-3 w-3", message.feedback === "down" && "fill-current")}
                />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
