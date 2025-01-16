"use client";

import { useConversationStore } from "@/store/chat-store";
import { useQuery } from "convex/react";
import { useEffect, useRef } from "react";
import { api } from "../../../convex/_generated/api";
import ChatBubble from "./chat-bubble";

const MessageContainer = () => {
  const { selectedConversation } = useConversationStore();

  const messages = useQuery(api.messages.getMessages, {
    conversation: selectedConversation!._id,
  });
  const currentUser = useQuery(api.users.getMe);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  return (
    <div className="relative p-3 flex-1 overflow-auto h-full bg-chat-tile-light dark:bg-chat-tile-dark">
      <div className="mx-12 flex flex-col gap-3 h-full">
        {messages?.map((message, idx) => (
          <div key={message._id} ref={lastMessageRef}>
            <ChatBubble
              message={message}
              currentUser={currentUser}
              previousMessage={idx > 0 ? messages[idx - 1] : undefined}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
export default MessageContainer;
