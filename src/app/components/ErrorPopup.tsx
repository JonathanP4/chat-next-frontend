"use client";

import { useEffect, useState } from "react";
import styles from "./ErrorPopup.module.css";

type Props = {
    error: string;
    setError: any;
};

export function ErrorPopup({ error, setError }: Props) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true);
    }, [error]);

    function animationEndHandler() {
        setError("");
        setVisible(false);
    }

    return (
        <div
            className={`absolute left-1/2 -translate-x-1/2 bg-secondary border border-destructive rounded-md top-1/4 border-b-2 text-center text-destructive ${
                visible ? "" : "hidden"
            }`}
        >
            <div className="p-4">
                <h1 className="font-bold max-w-xl">
                    An error occured:{" "}
                    <pre className="font-base inline">{error}</pre>
                </h1>
            </div>
            <div
                onAnimationEnd={animationEndHandler}
                className={`h-1 w-full bg-destructive rounded-md ${styles["animate-shrink"]}`}
            ></div>
        </div>
    );
}
