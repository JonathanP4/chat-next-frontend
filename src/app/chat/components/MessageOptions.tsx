"use client";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { socket } from "@/util/socket";
import { useContext } from "react";

import "material-symbols";
import { MessageContext } from "../screen/ChatScreen";

type Props = {
    message: Message;
    isCurrentUser: boolean;
};

export function MessageOptions({ message, isCurrentUser }: Props) {
    const { editingMessage, setEditingMessage, setReplyingToMessage } =
        useContext(MessageContext);

    function deleteHandler() {
        socket.emit("delete-message", message._id);
    }

    function editHandler() {
        setEditingMessage(message);
    }

    function optionClickHandler() {
        if (editingMessage) {
            setEditingMessage(message);
        } else {
            setReplyingToMessage(message);
        }
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <span
                    style={{
                        lineHeight: 0,
                        opacity: 0.6,
                        fontSize: "20px",
                    }}
                    className="material-symbols-outlined cursor-pointer"
                >
                    more_horiz
                </span>
            </PopoverTrigger>
            <PopoverContent className="w-fit p-2 border-white/20 bg-secondary">
                <ul className="space-y-2">
                    {isCurrentUser && (
                        <>
                            <li
                                onClick={editHandler}
                                className="flex items-center gap-2 cursor-pointer"
                            >
                                <span className="material-symbols-outlined">
                                    edit
                                </span>
                                Edit
                            </li>
                            <li
                                onClick={deleteHandler}
                                className="flex items-center gap-2 cursor-pointer"
                            >
                                <span className="material-symbols-outlined">
                                    delete
                                </span>
                                Delete
                            </li>
                        </>
                    )}
                    {!isCurrentUser && (
                        <li
                            onClick={optionClickHandler}
                            className="flex items-center gap-2 cursor-pointer"
                        >
                            <span className="material-symbols-outlined">
                                reply
                            </span>
                            Reply
                        </li>
                    )}
                </ul>
            </PopoverContent>
        </Popover>
    );
}
