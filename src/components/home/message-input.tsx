"use client";

import useComponentVisible from "@/hooks/useComponentVisible";
import { useConversationStore } from "@/store/chat-store";
import { useMutation, useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { Laugh, Mic, Send } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "../../../convex/_generated/api";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import MediaDropdown from "./media-dropdown";

const MessageInput = () => {
  const [msgText, setMsgText] = useState("");
  const sendTextMsg = useMutation(api.messages.sendTextMessages);
  const currentUser = useQuery(api.users.getMe);
  const { selectedConversation } = useConversationStore();

  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);

  const handleSendTextMsg = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendTextMsg({
        content: msgText,
        conversation: selectedConversation!._id,
        sender: currentUser!._id,
      });
      setMsgText("");
    } catch (error) {
      toast.error(
        error instanceof ConvexError ? error.data : "Unexpected error occurred"
      );
    }
  };

  return (
    <div className="bg-gray-primary p-2 flex gap-4 items-center">
      <div className="relative flex gap-2 ml-2">
        <div
          ref={ref}
          onClick={() => {
            setIsComponentVisible(true);
          }}
        >
          {isComponentVisible && (
            <EmojiPicker
              onEmojiClick={(emojiObject) => {
                setMsgText((prev) => prev + emojiObject.emoji);
              }}
              theme={Theme.AUTO}
              style={{
                position: "absolute",
                bottom: "1.5rem",
                left: "1rem",
                zIndex: 50,
              }}
            />
          )}
          <Laugh className="text-gray-600 dark:text-gray-400 cursor-pointer" />
        </div>
        <MediaDropdown />
      </div>
      <form onSubmit={handleSendTextMsg} className="w-full flex gap-3">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Type a message"
            className="py-2 text-sm w-full rounded-lg shadow-sm bg-gray-tertiary focus-visible:ring-transparent"
            value={msgText}
            onChange={(e) => setMsgText(e.target.value)}
          />
        </div>
        <div className="mr-4 flex items-center gap-3">
          {msgText.length > 0 ? (
            <Button
              type="submit"
              size={"sm"}
              className="bg-transparent text-foreground hover:bg-transparent"
            >
              <Send />
            </Button>
          ) : (
            <Button
              type="submit"
              size={"sm"}
              className="bg-transparent text-foreground hover:bg-transparent"
            >
              <Mic />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};
export default MessageInput;