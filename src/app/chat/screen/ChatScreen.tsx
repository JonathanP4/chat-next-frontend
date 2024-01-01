"use client";

import { Dispatch, SetStateAction, createContext, useState } from "react";

import "material-symbols";

import ChatInputs from "../components/ChatInputs";
import ChatHeader from "../components/ChatHeader";
import ChatMessages from "../components/ChatMessages";

type Props = {
    className?: string;
    selectedUser: UserData;
};

type MessageContextType = {
    editingMessage: Message | undefined;
    setEditingMessage: Dispatch<SetStateAction<Message | undefined>>;
    replyingToMessage: Message | undefined;
    setReplyingToMessage: Dispatch<SetStateAction<Message | undefined>>;
};

type SelectedUserContextType = UserData | undefined;

export const MessageContext = createContext<MessageContextType>({
    editingMessage: undefined,
    setEditingMessage: () => {},
    replyingToMessage: undefined,
    setReplyingToMessage: () => {},
});

export const SelectedUserContext =
    createContext<SelectedUserContextType>(undefined);

export default function ChatScreen({ className, selectedUser }: Props) {
    const [editingMessage, setEditingMessage] = useState<Message | undefined>();
    const [replyingToMessage, setReplyingToMessage] = useState<
        Message | undefined
    >();

    return (
        <MessageContext.Provider
            value={{
                editingMessage,
                setEditingMessage,
                replyingToMessage,
                setReplyingToMessage,
            }}
        >
            <SelectedUserContext.Provider value={selectedUser}>
                <article
                    className={`max-h-[var(--screen)] grid grid-rows-[5rem,1fr,4.5rem] ${
                        className ? className : ""
                    }`}
                >
                    <ChatHeader />
                    <ChatMessages />
                    <ChatInputs />
                </article>
            </SelectedUserContext.Provider>
        </MessageContext.Provider>
    );
}
