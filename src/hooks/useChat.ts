import { useCallback, useReducer, useRef } from "react";
import { sendChatMessage, type ChatHistoryItem } from "@/utils/api";

export type Message = {
  id: string;
  role: "user" | "bot";
  text: string;
  timestamp: Date;
  feedback?: "up" | "down" | null;
  isError?: boolean;
};

type State = {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
};

type Action =
  | { type: "ADD"; message: Message }
  | { type: "SET_LOADING"; value: boolean }
  | { type: "SET_ERROR"; value: string | null }
  | { type: "FEEDBACK"; id: string; value: "up" | "down" }
  | { type: "RESET" };

const initialState: State = {
  messages: [],
  isLoading: false,
  error: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD":
      return { ...state, messages: [...state.messages, action.message] };
    case "SET_LOADING":
      return { ...state, isLoading: action.value };
    case "SET_ERROR":
      return { ...state, error: action.value };
    case "FEEDBACK":
      return {
        ...state,
        messages: state.messages.map((m) =>
          m.id === action.id ? { ...m, feedback: action.value } : m,
        ),
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

const uid = () =>
  (typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`);

export function useChat() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const abortRef = useRef<AbortController | null>(null);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || state.isLoading) return;

      const userMsg: Message = {
        id: uid(),
        role: "user",
        text: trimmed,
        timestamp: new Date(),
      };
      dispatch({ type: "ADD", message: userMsg });
      dispatch({ type: "SET_LOADING", value: true });
      dispatch({ type: "SET_ERROR", value: null });

      const history: ChatHistoryItem[] = state.messages.slice(-6).map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.text,
      }));

      const ctrl = new AbortController();
      abortRef.current = ctrl;
      const timeout = setTimeout(() => ctrl.abort(), 15000);

      try {
        if (typeof navigator !== "undefined" && navigator.onLine === false) {
          throw new Error("You appear to be offline.");
        }
        const reply = await sendChatMessage(trimmed, history, ctrl.signal);
        dispatch({
          type: "ADD",
          message: { id: uid(), role: "bot", text: reply, timestamp: new Date(), feedback: null },
        });
      } catch (err) {
        const isOffline = err instanceof Error && err.message.includes("offline");
        const text = isOffline
          ? "You appear to be offline."
          : "Sorry, I couldn't get a response. Please try again or contact the Darrang College admissions office.";
        dispatch({
          type: "ADD",
          message: {
            id: uid(),
            role: "bot",
            text,
            timestamp: new Date(),
            isError: true,
          },
        });
        dispatch({ type: "SET_ERROR", value: text });
      } finally {
        clearTimeout(timeout);
        dispatch({ type: "SET_LOADING", value: false });
        abortRef.current = null;
      }
    },
    [state.isLoading, state.messages],
  );

  const giveFeedback = useCallback((id: string, value: "up" | "down") => {
    dispatch({ type: "FEEDBACK", id, value });
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    dispatch({ type: "RESET" });
  }, []);

  return { ...state, send, giveFeedback, reset };
}
