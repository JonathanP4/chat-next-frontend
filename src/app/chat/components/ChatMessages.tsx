"use client";

import { CSSProperties, useContext, useEffect, useRef, useState } from "react";
import { PuffLoader } from "react-spinners";
import Message from "./Message";
import { socket } from "@/util/socket";
import { local } from "@/util/axios";
import { SelectedUserContext } from "../screen/ChatScreen";

type Props = {
    selectedUser: UserData;
};

const override: CSSProperties = {
    top: "50%",
    left: "63%",
    position: "fixed",
};

export default function ChatMessages() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    const selectedUser = useContext(SelectedUserContext);

    const endRef = useRef<HTMLDivElement>(null);

    async function getMessages() {
        const { data } = await local.post("/messages", selectedUser);

        setMessages(data.messages);
        setLoading(false);
    }

    // Get messages
    useEffect(() => {
        setLoading(true);
        getMessages();
    }, [selectedUser]);

    // Listen to send, edit and delete events
    useEffect(() => {
        socket.on("message-deleted", () => getMessages());
        socket.on("message_edit", () => getMessages());
        socket.on("private_message", (message) => {
            setMessages((state) => [...state, message]);
        });
        socket.on("message-reply", (message) => {
            setMessages((state) => [...state, message]);
        });

        return () => {
            socket.off("message-deleted");
            socket.off("message_edit");
            socket.off("private_message");
            socket.off("message-reply");
        };
    }, []);

    // Auto scroll to bottom
    useEffect(() => {
        setTimeout(
            () => endRef.current?.scrollIntoView({ behavior: "smooth" }),
            100
        );
    }, [loading, messages, selectedUser]);

    return (
        <section className="relative w-full grid auto-rows-[min-content] space-y-2 p-4 max-h-[535px] overflow-y-auto">
            <PuffLoader
                cssOverride={override}
                color="#6D28D9"
                size={60}
                loading={loading}
            />
            {!loading &&
                messages.map((m) => <Message key={m._id} message={m} />)}
            <div ref={endRef}></div>
        </section>
    );
}
