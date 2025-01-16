"use client";

import { IMessage, useConversationStore } from "@/store/chat-store";
import { useMutation } from "convex/react";
import { Ban, LogOut } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";
import { api } from "../../../convex/_generated/api";
import { ConvexError } from "convex/values";

type ChatAvatarActionsProps = {
  message: IMessage;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  me: any;
};

const ChatAvatarActions = ({ me, message }: ChatAvatarActionsProps) => {
  const { selectedConversation, setSelectedConversation } =
    useConversationStore();

  const isMember = selectedConversation?.participants.includes(
    message.sender._id
  );
  const kickUser = useMutation(api.conversations.kickUser);
  const isGroup = selectedConversation?.isGroup;

  const handleKickUser = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedConversation) return;
    try {
      await kickUser({
        conversationId: selectedConversation._id,
        userId: message.sender._id,
      });

      setSelectedConversation({
        ...selectedConversation,
        participants: selectedConversation.participants.filter(
          (id) => id !== message.sender._id
        ),
      });
    } catch (error) {
      toast.error(
        error instanceof ConvexError ? error.data : "Unexpected error occurred"
      );
    }
  };

  return (
    <div
      className="text-[11px] flex gap-4 justify-between font-bold group"
    >
      {isGroup && message.sender.name}

      {!isMember && isGroup && <Ban size={16} className="text-red-500" />}
      {isGroup && isMember && selectedConversation?.admin === me._id && (
        <LogOut
          size={16}
          className="text-red-500 opacity-0 group-hover:opacity-100 cursor-pointer"
          onClick={handleKickUser}
        />
      )}
    </div>
  );
};
export default ChatAvatarActions;
