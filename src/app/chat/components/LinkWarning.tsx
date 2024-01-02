"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { local } from "@/util/axios";
import { CheckedState } from "@radix-ui/react-checkbox";
import React, { SetStateAction, useState } from "react";

type Props = {
    state: {
        showWarning: boolean;
        setShowWarning: React.Dispatch<SetStateAction<boolean>>;
    };
    link: string;
};

export function LinkWarning({ state, link }: Props) {
    const { showWarning, setShowWarning } = state;
    const [isChecked, setIsChecked] = useState(false);

    async function clickHandler() {
        setShowWarning(false);

        if (!isChecked) return;

        await local.post("/trust-link", JSON.stringify(link));
    }

    function checkboxChangeHandler(e: CheckedState) {
        console.log(link);
        setIsChecked(e.valueOf() as boolean);
    }

    return (
        <>
            <div className="fixed h-screen w-screen bottom-0 left-0 bg-black/50 z-20"></div>
            <dialog
                open={showWarning}
                className="bg-secondary top-1/2 -translate-y-1/2 max-w-lg text-white p-4 rounded-md z-30"
            >
                Do you trust this link?
                <p className="text-slate-400 text-xs pt-1">
                    Scammers could be trying to steal information from you,
                    before proceeding make sure that this link is secure.
                </p>
                <div className="pt-5 flex gap-4">
                    <a
                        onClick={clickHandler}
                        target="_blank"
                        href={link}
                        className={buttonVariants()}
                    >
                        Yes, redirect me
                    </a>
                    <Button
                        onClick={clickHandler}
                        className="bg-destructive hover:bg-destructive/80"
                    >
                        Cancel
                    </Button>
                </div>
                <div className="flex items-center gap-2 mt-4">
                    <Checkbox
                        onCheckedChange={checkboxChangeHandler}
                        id="trust-link"
                    />
                    <label
                        className="text-xs text-slate-400"
                        htmlFor="trust-link"
                    >
                        Don't show this warning again for this site
                    </label>
                </div>
            </dialog>
        </>
    );
}
