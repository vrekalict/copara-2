"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

const TYPING_SEND_DEBOUNCE_MS = 400;
const TYPING_IDLE_MS = 2500;
const TYPING_RECEIVED_TTL_MS = 3000;

type TypingPayload = { userId: string };

export function useThreadTyping({
  threadId,
  currentUserId,
  draft,
  onMessageInsert,
}: {
  threadId: string;
  currentUserId: string;
  draft: string;
  onMessageInsert: (message: unknown) => void;
}) {
  const [typingUserIds, setTypingUserIds] = useState<string[]>([]);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const isTypingRef = useRef(false);
  const sendDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const receivedTimeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  const sendTypingStop = useCallback(() => {
    if (!isTypingRef.current || !channelRef.current) return;
    void channelRef.current.send({
      type: "broadcast",
      event: "typing_stop",
      payload: { userId: currentUserId } satisfies TypingPayload,
    });
    isTypingRef.current = false;
  }, [currentUserId]);

  const sendTypingStart = useCallback(() => {
    if (!channelRef.current) return;
    void channelRef.current.send({
      type: "broadcast",
      event: "typing",
      payload: { userId: currentUserId } satisfies TypingPayload,
    });
    isTypingRef.current = true;
  }, [currentUserId]);

  const markPeerTyping = useCallback((userId: string) => {
    if (userId === currentUserId) return;

    setTypingUserIds((prev) =>
      prev.includes(userId) ? prev : [...prev, userId],
    );

    const existing = receivedTimeoutsRef.current.get(userId);
    if (existing) clearTimeout(existing);

    receivedTimeoutsRef.current.set(
      userId,
      setTimeout(() => {
        setTypingUserIds((prev) => prev.filter((id) => id !== userId));
        receivedTimeoutsRef.current.delete(userId);
      }, TYPING_RECEIVED_TTL_MS),
    );
  }, [currentUserId]);

  const clearPeerTyping = useCallback((userId: string) => {
    const existing = receivedTimeoutsRef.current.get(userId);
    if (existing) {
      clearTimeout(existing);
      receivedTimeoutsRef.current.delete(userId);
    }
    setTypingUserIds((prev) => prev.filter((id) => id !== userId));
  }, []);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase.channel(`thread-${threadId}`, {
      config: { private: true, broadcast: { self: false } },
    });

    channel
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `thread_id=eq.${threadId}`,
        },
        (payload) => onMessageInsert(payload.new),
      )
      .on("broadcast", { event: "typing" }, ({ payload }) => {
        const userId = (payload as TypingPayload).userId;
        if (userId) markPeerTyping(userId);
      })
      .on("broadcast", { event: "typing_stop" }, ({ payload }) => {
        const userId = (payload as TypingPayload).userId;
        if (userId) clearPeerTyping(userId);
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (isTypingRef.current) {
        void channel.send({
          type: "broadcast",
          event: "typing_stop",
          payload: { userId: currentUserId },
        });
      }
      for (const timer of receivedTimeoutsRef.current.values()) {
        clearTimeout(timer);
      }
      receivedTimeoutsRef.current.clear();
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [
    threadId,
    currentUserId,
    onMessageInsert,
    markPeerTyping,
    clearPeerTyping,
  ]);

  useEffect(() => {
    if (sendDebounceRef.current) clearTimeout(sendDebounceRef.current);
    if (idleRef.current) clearTimeout(idleRef.current);

    if (!draft.trim()) {
      sendTypingStop();
      return;
    }

    sendDebounceRef.current = setTimeout(sendTypingStart, TYPING_SEND_DEBOUNCE_MS);
    idleRef.current = setTimeout(sendTypingStop, TYPING_IDLE_MS);

    return () => {
      if (sendDebounceRef.current) clearTimeout(sendDebounceRef.current);
      if (idleRef.current) clearTimeout(idleRef.current);
    };
  }, [draft, sendTypingStart, sendTypingStop]);

  return { typingUserIds, sendTypingStop };
}
