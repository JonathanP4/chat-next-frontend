"use client";

import { MouseEvent, useContext, useEffect, useState } from "react";
import { getTime } from "@/util/get-time";
import { createPortal } from "react-dom";
import { LinkWarning } from "./LinkWarning";
import { local } from "@/util/axios";
import { v4 as uuid } from "uuid";
import { ImgModal } from "./ImgModal";

import { MessageOptions } from "./MessageOptions";
import { SelectedUserContext } from "../screen/ChatScreen";

type Props = {
    message: Message;
};

const linkRegex = new RegExp(
    /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/
);
const imgLinkRegex = new RegExp(
    /(http(s?):)([\/|.|\w|\s|-])*\.(?:jpg|gif|png)/
);

export default function Message({ message }: Props) {
    const [isCurrentUser, setIsCurrentUser] = useState<boolean>();
    const [showWarning, setShowWarning] = useState(false);
    const [showImg, setShowImg] = useState(false);

    const selectedUser = useContext(SelectedUserContext);

    const hasLink = message.content.match(linkRegex);
    const hasImgLink = message.content.match(imgLinkRegex);

    async function linkClickHandler(e: MouseEvent<HTMLAnchorElement>) {
        e.preventDefault();

        const { data } = await local.post(
            "/check-link",
            JSON.stringify(message.content)
        );

        if (!data.isTrusted) {
            return setShowWarning(true);
        }

        window.open(message.content, "_blank");
    }

    async function imgClickHanlder() {
        setShowImg(true);
    }

    function scrollToRepliedMessage() {
        if (message.replyTo) {
            const msg = document.getElementById(message.replyTo?.messageId);

            if (msg) {
                msg.scrollIntoView({ behavior: "smooth" });
            }
        }
    }

    useEffect(() => {
        if (selectedUser) setIsCurrentUser(selectedUser._id !== message.from);
    }, [selectedUser]);

    return (
        <>
            {hasLink && showWarning && (
                <>
                    {createPortal(
                        <LinkWarning
                            state={{ setShowWarning, showWarning }}
                            link={hasLink[0]}
                        />,
                        document.querySelector("#modals")!
                    )}
                </>
            )}
            {showImg && (
                <>
                    {createPortal(
                        <ImgModal
                            state={{ showImg, setShowImg }}
                            imgSrc={hasImgLink?.[0] || ""}
                            alt={uuid()}
                        />,
                        document.querySelector("#modals")!
                    )}
                </>
            )}
            {typeof isCurrentUser === "boolean" && (
                <div
                    id={message._id}
                    className={`${
                        isCurrentUser ? "justify-self-end text-right" : ""
                    } ${
                        message.replyTo && "mt-6"
                    } grid gap-1 p-2 rounded-sm min-w-[5rem] w-fit relative`}
                >
                    {hasImgLink && (
                        <div className="bg-primary rounded-md p-2">
                            <img
                                className="cursor-pointer"
                                onClick={imgClickHanlder}
                                key={uuid()}
                                src={hasImgLink?.[0]}
                                alt={"img-" + uuid()}
                                width={250}
                            />
                            <span>
                                {message.content
                                    .split(hasImgLink?.[0])
                                    .join("")}
                            </span>
                        </div>
                    )}
                    {message.replyTo && (
                        <p
                            onClick={scrollToRepliedMessage}
                            className={`${
                                isCurrentUser && "ml-auto"
                            } text-xs border border-primary py-1 px-2 rounded-md cursor-pointer w-fit max-w-[20ch] overflow-hidden text-ellipsis whitespace-nowrap text-white/70`}
                        >
                            {message.replyTo.content}
                        </p>
                    )}
                    <div
                        className={`p-2 rounded-md max-w-fit ${
                            isCurrentUser
                                ? "bg-primary justify-self-end"
                                : "bg-secondary"
                        }`}
                    >
                        {hasLink && !hasImgLink && (
                            <p
                                className={`text-base leading-none max-w-[25rem] ${
                                    isCurrentUser && "text-left"
                                } break-words `}
                            >
                                {message.content.split(" ").map((str) => {
                                    if (str.match(linkRegex))
                                        return (
                                            <a
                                                key={uuid()}
                                                target="_blank"
                                                onClick={linkClickHandler}
                                                className="underline transition-colors text-blue-400 hover:text-blue-500"
                                                href={str}
                                            >
                                                {str}
                                            </a>
                                        );
                                    else return ` ${str} `;
                                })}
                            </p>
                        )}

                        {!hasImgLink && !hasLink && (
                            <p
                                className={`text-base leading-none max-w-[25rem] ${
                                    isCurrentUser && "text-left"
                                } break-words `}
                            >
                                {message.content}
                            </p>
                        )}

                        <div className="flex justify-between items-center mt-2 relative gap-4">
                            <MessageOptions
                                message={message}
                                isCurrentUser={isCurrentUser}
                            />

                            <span className="text-xs text-white/60 leading-none">
                                {getTime(message.createdAt)}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
