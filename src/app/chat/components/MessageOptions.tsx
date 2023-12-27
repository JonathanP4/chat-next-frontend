"use client";

import { socket } from "@/util/socket";
import { RefObject } from "react";

type Props = {
    ulRef: RefObject<HTMLUListElement>;
    id: string;
};

export function MessageOptions({ ulRef, id }: Props) {
    const deleteHandler = async () => {
        socket.emit("delete-message", id);
    };

    const editHandler = () => {};

    return (
        <ul
            data-id={id}
            ref={ulRef}
            className={`hidden msg-options absolute bottom-0 -left-28 rounded-md p-2 min-w-[5rem] space-y-2 text-sm shadow-sm shadow-primary`}
        >
            <li className="flex items-center gap-2 cursor-pointer">
                <span className="material-symbols-outlined">edit</span>
                Edit
            </li>
            <li
                onClick={deleteHandler}
                className="flex items-center gap-2 cursor-pointer"
            >
                <span className="material-symbols-outlined">delete</span>
                Delete
            </li>
        </ul>
    );
}
