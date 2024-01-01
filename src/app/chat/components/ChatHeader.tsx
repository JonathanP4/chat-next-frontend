"use client";

import { useContext, useState } from "react";
import ChatUserProfile from "./ChatUserProfile";
import { SelectedUserContext } from "../screen/ChatScreen";
import { createPortal } from "react-dom";

export default function ChatHeader() {
    const [showUserProfile, setShowUserProfile] = useState(false);
    const selectedUser = useContext(SelectedUserContext);

    function showDialogHanlder() {
        setShowUserProfile(true);
    }

    function hideDialog() {
        setShowUserProfile(false);
    }

    return (
        <>
            {createPortal(
                <ChatUserProfile
                    showDialog={showUserProfile}
                    hideDialogFn={hideDialog}
                />,
                document.getElementById("modals")!
            )}
            <header className="bg-secondary p-4 flex gap-4 items-center">
                <img
                    onClick={showDialogHanlder}
                    className="rounded-full cursor-pointer"
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
        </>
    );
}
