import { useCallback, useMemo, useState } from "react";
import { useChat as useAiChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

export type Message = {
  id: string;
  role: "user" | "bot";
  text: string;
  timestamp: Date;
  feedback?: "up" | "down" | null;
  isError?: boolean;
};

// Use the new v6 transport system
const transport = new DefaultChatTransport({ api: "/api/chat" });

export function useChat() {
  const [feedbacks, setFeedbacks] = useState<Record<string, "up" | "down">>({});

  const {
    messages: aiMessages,
    sendMessage,
    status,
    error,
    setMessages,
    stop
  } = useAiChat({
    transport,
    onError: (err) => {
      console.error("Chat API Error:", err);
    },
  });

  const messages: Message[] = useMemo(() => {
    const mapped: Message[] = aiMessages.map((m) => {
      // Extract text content from parts
      const text = m.parts 
        ? m.parts.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('')
        : '';

      return {
        id: m.id,
        role: m.role === "user" ? "user" : "bot",
        text,
        timestamp: new Date(), // createdAt was removed in v6
        feedback: feedbacks[m.id] || null,
        isError: false,
      };
    });

    if (error) {
      const isOffline = error.message?.toLowerCase().includes("offline") || 
        (typeof navigator !== "undefined" && navigator.onLine === false);
      
      mapped.push({
        id: `error-${Date.now()}`,
        role: "bot",
        text: isOffline 
          ? "You appear to be offline." 
          : "Sorry, I couldn't get a response. Please try again or contact the Darrang College admissions office.",
        timestamp: new Date(),
        isError: true,
      });
    }

    return mapped;
  }, [aiMessages, feedbacks, error]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || status === "submitted" || status === "streaming") return;
      
      try {
        await sendMessage({ role: "user", parts: [{ type: "text", text: trimmed }] } as any);
      } catch (err) {
        console.error("Failed to send message:", err);
      }
    },
    [sendMessage, status],
  );

  const giveFeedback = useCallback((id: string, value: "up" | "down") => {
    setFeedbacks((prev) => ({ ...prev, [id]: value }));
  }, []);

  const reset = useCallback(() => {
    stop();
    setMessages([]);
    setFeedbacks({});
  }, [setMessages, stop]);

  const isLoading = status === "submitted" || status === "streaming";

  return { messages, isLoading, error: error?.message || null, send, giveFeedback, reset };
}

