"use client";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { getTime } from "@/util/get-time";
import { local } from "@/util/axios";
import { socket } from "@/util/socket";

type Props = {
    className?: string;
    contact: UserData;
    setUser: Dispatch<SetStateAction<UserData | undefined>>;
};

export default function Contact({ className, contact, setUser }: Props) {
    const [latestMsg, setLatestMsg] = useState("");
    const userIdRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const [latest] = contact.messages
            .filter((m) => {
                if (
                    m.from === contact._id &&
                    m.to === sessionStorage.getItem("userId")
                )
                    return m;
            })
            .slice(-1);
        if (latest) {
            setLatestMsg(latest.content);
        }
    }, []);

    useEffect(() => {
        socket.on("private_message", (message) => {
            socket.emit("latest_message", message);
        });

        socket.on("latest_message", (message) => {
            if (message.from === contact._id) setLatestMsg(message.content);
        });
    }, []);

    async function clickHanlder() {
        if (!userIdRef.current) return;

        const { data } = await local.get(`/${userIdRef.current.textContent}`);
        setUser(data.user);
    }

    return (
        <li>
            <header
                className="p-4 bg-secondary flex items-start justify-between border border-b-ring/40 cursor-pointer"
                onClick={clickHanlder}
            >
                <div className="flex gap-4 items-center">
                    <img
                        className="rounded-full"
                        src={contact.image}
                        alt="next_logo"
                        width={50}
                        height={50}
                    />
                    <div ref={userIdRef} className="hidden" id="userId">
                        {contact._id}
                    </div>
                    <div>
                        <h1
                            className="text-lg font-semibold max-w-[140px] text-ellipsis overflow-hidden"
                            title={
                                contact.name.trim().length > 14
                                    ? contact.name
                                    : ""
                            }
                        >
                            {contact.name}
                        </h1>
                        <p className="text-sm text-white/60 max-w-[200px] whitespace-nowrap overflow-hidden text-ellipsis">
                            {latestMsg || "Hey there!"}
                        </p>
                    </div>
                </div>
                <span>{getTime(contact.messages[0]?.createdAt)}</span>
            </header>
        </li>
    );
}
