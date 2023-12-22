"use client";

import { MouseEvent, useEffect, useState } from "react";
import { getTime } from "@/util/get-time";
import { createPortal } from "react-dom";
import { LinkWarning } from "./LinkWarning";
import { local } from "@/util/axios";

type Props = {
    message: Message;
    selectedUser: UserData;
};

export default function Message({ message, selectedUser }: Props) {
    const [isCurrentUser, setIsCurrentUser] = useState<boolean>();
    const [showWarning, setShowWarning] = useState(false);

    const linkRegex = new RegExp(/https?:\/\/\w+/);
    const isLink = linkRegex.test(message.content);

    const clickHandler = async (e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();

        const { data } = await local.post(
            "/check-link",
            JSON.stringify(message.content)
        );

        if (!data.isTrusted) {
            return setShowWarning(true);
        }

        window.open(message.content, "_blank");
    };

    useEffect(() => {
        setIsCurrentUser(selectedUser._id !== message.from);
    }, [selectedUser]);

    return (
        <>
            {showWarning && (
                <>
                    {createPortal(
                        <LinkWarning
                            state={{ setShowWarning, showWarning }}
                            link={message.content}
                        />,
                        document.querySelector("#modals")!
                    )}
                </>
            )}
            {typeof isCurrentUser === "boolean" && (
                <div
                    className={`${
                        isCurrentUser
                            ? "justify-self-end bg-primary"
                            : "bg-secondary"
                    } grid gap-1 p-2 rounded-sm min-w-[5rem] w-fit`}
                >
                    {!isLink && (
                        <h1 className="text-base leading-none max-w-[25rem] break-words">
                            {message.content}
                        </h1>
                    )}
                    {isLink && (
                        <a
                            target="_blank"
                            onClick={clickHandler}
                            className="underline transition-colors text-blue-400 hover:text-blue-500"
                            href={message.content}
                        >
                            {message.content}
                        </a>
                    )}
                    <span className="justify-self-end text-xs text-white/60 leading-none">
                        {getTime(message.createdAt)}
                    </span>
                </div>
            )}
        </>
    );
}
