"use client";

import { MouseEvent, useEffect, useRef, useState } from "react";
import { getTime } from "@/util/get-time";
import { createPortal } from "react-dom";
import { LinkWarning } from "./LinkWarning";
import { local } from "@/util/axios";
import { v4 as uuid } from "uuid";
import { ImgModal } from "./ImgModal";

import "material-symbols";
import { MessageOptions } from "./MessageOptions";

type Props = {
    message: Message;
    selectedUser: UserData;
};

const linkRegex = new RegExp(
    /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/
);
const imgLinkRegex = new RegExp(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/);

export default function Message({ message, selectedUser }: Props) {
    const [isCurrentUser, setIsCurrentUser] = useState<boolean>();
    const [showWarning, setShowWarning] = useState(false);
    const [showImg, setShowImg] = useState(false);

    const ulRef = useRef<HTMLUListElement>(null);

    const hasLink = message.content.match(imgLinkRegex);
    const hasImgLink = message.content.match(imgLinkRegex);

    const linkClickHandler = async (e: MouseEvent<HTMLAnchorElement>) => {
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

    const imgClickHanlder = async () => {
        setShowImg(true);
    };

    const optionClickHanlder = () => {
        if (!ulRef.current) return;

        document.querySelectorAll(".msg-options").forEach((el) => {
            if (el.getAttribute("data-id") !== ulRef.current?.dataset.id) {
                el.classList.add("hidden");
            }
        });

        ulRef.current.classList.toggle("hidden");
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
                            link={""}
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
                    className={`${
                        isCurrentUser
                            ? "justify-self-end bg-primary"
                            : "bg-secondary"
                    } grid gap-1 p-2 rounded-sm min-w-[5rem] w-fit`}
                >
                    {hasImgLink && (
                        <div>
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
                    {!hasLink && (
                        <p className="text-base leading-none max-w-[25rem] break-words">
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

                    <div className="flex justify-between items-center mt-1 relative">
                        <span
                            onClick={optionClickHanlder}
                            style={{
                                lineHeight: 0,
                                opacity: 0.6,
                                fontSize: "20px",
                            }}
                            className="material-symbols-outlined cursor-pointer"
                        >
                            more_horiz
                        </span>
                        <span className="text-xs text-white/60 leading-none">
                            {getTime(message.createdAt)}
                        </span>
                        <MessageOptions id={message._id} ulRef={ulRef} />
                    </div>
                </div>
            )}
        </>
    );
}
