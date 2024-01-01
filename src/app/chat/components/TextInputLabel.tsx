"use client";

import { Button } from "@/components/ui/button";
import { MessageContext } from "../screen/ChatScreen";
import { useContext } from "react";

type Props = {
    onClick: () => void;
    htmlFor: string;
};

export default function TextInputLabel({ onClick, htmlFor }: Props) {
    const { editingMessage, replyingToMessage } = useContext(MessageContext);
    return (
        <label
            htmlFor={htmlFor}
            className="absolute -top-10 rounded-md bg-secondary pl-2 text-xs space-x-2"
        >
            <div className="flex items-center gap-2">
                <p className="overflow-hidden max-w-[250px] whitespace-nowrap text-ellipsis">
                    {editingMessage
                        ? "Editing message"
                        : `Replying to: ${replyingToMessage?.content}`}
                </p>
                <Button
                    type="button"
                    onClick={onClick}
                    className="h-fit py-1 px-2 text-xs"
                    variant={"destructive"}
                >
                    Cancel
                </Button>
            </div>
        </label>
    );
}
