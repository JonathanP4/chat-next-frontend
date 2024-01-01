"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormEvent, useContext, useEffect, useRef, useState } from "react";

import data from "@emoji-mart/data";
import EmojiPicker from "@emoji-mart/react";
import { MessageContext, SelectedUserContext } from "../screen/ChatScreen";
import { socket } from "@/util/socket";
import TextInputLabel from "./TextInputLabel";

export default function ChatInputs() {
    const [showEmojis, setShowEmojis] = useState(false);
    const [textInput, setTextInput] = useState("");

    const selectedUser = useContext(SelectedUserContext);
    const {
        editingMessage,
        setEditingMessage,
        replyingToMessage,
        setReplyingToMessage,
    } = useContext(MessageContext);

    const textInputRef = useRef<HTMLInputElement>(null);

    function sendMessage(e: FormEvent) {
        e.preventDefault();

        if (textInput.trim() === "") return;

        if (replyingToMessage) {
            socket.emit("message_reply", {
                repliedMessage: replyingToMessage,
                content: textInput,
            });
            setReplyingToMessage(undefined);
        } else if (editingMessage) {
            socket.emit("message_edit", {
                messageId: editingMessage,
                content: textInput,
            });
            setEditingMessage(undefined);
        } else {
            socket.emit("private_message", {
                message: textInput,
                to: selectedUser,
            });
        }

        setTextInput("");
    }

    function cancelOp() {
        if (editingMessage) {
            setEditingMessage(undefined);
        } else {
            setReplyingToMessage(undefined);
        }

        setTextInput("");
    }

    // Change text input value on editing
    useEffect(() => {
        if (textInputRef.current) {
            textInputRef.current.focus();
        }

        if (editingMessage) {
            setTextInput(editingMessage.content);
        }
    }, [editingMessage, replyingToMessage]);

    return (
        <section>
            <div className="relative">
                {showEmojis && (
                    <div className="absolute -top-[28.5rem] z-10">
                        <EmojiPicker
                            data={data}
                            onClickOutside={() => setShowEmojis(false)}
                            onEmojiSelect={(emoji: any) =>
                                setTextInput((state) => state + emoji.native)
                            }
                        />
                    </div>
                )}
            </div>
            <div className="flex gap-4 items-center p-4 relative z-10">
                <span
                    onClick={() => setShowEmojis((state) => !state)}
                    className="emoji-picker cursor-pointer bg-primary p-2 material-symbols-outlined rounded-md px-4"
                >
                    mood
                </span>
                <form
                    noValidate
                    className="flex items-center w-full gap-4 relative"
                    onSubmit={sendMessage}
                >
                    {(editingMessage || replyingToMessage) && (
                        <TextInputLabel
                            htmlFor="message_input"
                            onClick={cancelOp}
                        />
                    )}
                    <Input
                        id="message_input"
                        onClick={() => setShowEmojis(false)}
                        className="text-base"
                        ref={textInputRef}
                        type="text"
                        onChange={(e) => setTextInput(e.target.value)}
                        value={textInput}
                    />
                    <Button
                        type="submit"
                        className="cursor-pointer bg-primary p-2 material-symbols-outlined rounded-md px-4"
                    >
                        send
                    </Button>
                </form>
            </div>
        </section>
    );
}
