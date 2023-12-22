"use client";

import { CSSProperties, FormEvent, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import Message from "./Message";

import "material-symbols";
import { Button } from "@/components/ui/button";

import { PuffLoader } from "react-spinners";
import { socket } from "@/util/socket";
import { local } from "@/util/axios";

type Props = {
    className?: string;
    selectedUser: UserData;
};

const override: CSSProperties = {
    top: "50%",
    left: "63%",
    position: "fixed",
};

export default function ChatScreen({ className, selectedUser }: Props) {
    const [showEmojis, setShowEmojis] = useState(false);
    const [textInput, setTextInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    const endRef = useRef<HTMLDivElement>(null);

    // Get messages
    useEffect(() => {
        setLoading(true);

        (async function getMessages() {
            const { data } = await local.post("/messages", selectedUser);

            setMessages(data.messages);
            setLoading(false);
        })();
    }, [selectedUser]);

    useEffect(() => {
        setTimeout(
            () => endRef.current?.scrollIntoView({ behavior: "smooth" }),
            100
        );
    }, [loading, messages, selectedUser]);

    const sendMessage = async (e: FormEvent) => {
        e.preventDefault();

        if (textInput.trim() === "") return;

        socket.emit("private_message", {
            message: textInput,
            to: selectedUser,
        });

        setTextInput("");
    };

    useEffect(() => {
        socket.on("private_message", (message) => {
            setMessages((state) => [...state, message]);
        });

        return () => {
            socket.off("private_message");
        };
    }, []);

    return (
        <div
            className={`max-h-[var(--screen)] grid grid-rows-[5rem,1fr,4.5rem] ${
                className ? className : ""
            }`}
        >
            <header className="bg-secondary p-4 flex gap-4 items-center">
                <img
                    className="rounded-full"
                    src={selectedUser?.image}
                    alt={selectedUser?.image}
                    width={50}
                    height={50}
                />
                <div>
                    <h1 className="text-lg font-semibold">
                        {selectedUser?.name}
                    </h1>
                </div>
            </header>

            <section className="relative w-full grid auto-rows-[min-content] space-y-2 p-4 max-h-[535px] overflow-y-auto">
                <PuffLoader
                    cssOverride={override}
                    color="#6D28D9"
                    size={60}
                    loading={loading}
                />
                {!loading &&
                    messages.map((m) => (
                        <Message
                            selectedUser={selectedUser}
                            key={m._id}
                            message={m}
                        />
                    ))}
                <div ref={endRef}></div>
            </section>

            <section>
                <div className="relative">
                    {showEmojis && (
                        <>
                            <div className="absolute -top-[28.5rem] z-10">
                                <Picker
                                    data={data}
                                    onClickOutside={() => setShowEmojis(false)}
                                    onEmojiSelect={(emoji: any) =>
                                        setTextInput(
                                            (state) => state + emoji.native
                                        )
                                    }
                                />
                            </div>
                        </>
                    )}
                </div>
                <div className="flex gap-4 items-center p-4 relative z-10">
                    <span
                        onClick={() => setShowEmojis((state) => !state)}
                        className="emoji-picker cursor-pointer bg-primary p-2 material-symbols-outlined rounded-md px-4"
                    >
                        mood
                    </span>
                    <span className="cursor-pointer material-symbols-outlined">
                        add_circle
                    </span>
                    <form
                        noValidate
                        className="flex items-center w-full gap-4"
                        onSubmit={sendMessage}
                    >
                        <Input
                            onClick={() => setShowEmojis(false)}
                            className="text-base"
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
        </div>
    );
}
