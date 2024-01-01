"use client";

import React, { SetStateAction, useState } from "react";

type Props = {
    state: {
        showImg: boolean;
        setShowImg: React.Dispatch<SetStateAction<boolean>>;
    };
    imgSrc: string;
    alt: string;
};

export function ImgModal({ state, imgSrc, alt }: Props) {
    const { showImg, setShowImg } = state;

    function clickHandler() {
        setShowImg(false);
    }

    return (
        <>
            <div
                onClick={clickHandler}
                className="fixed h-screen w-screen bottom-0 left-0 bg-black/60 z-20"
            ></div>
            <dialog
                open={showImg}
                className="top-1/2 -translate-y-1/2 max-w-lg rounded-md z-30"
            >
                <img
                    className="max-h-[calc(var(--screen)-100px)]"
                    src={imgSrc}
                    alt={alt}
                />
            </dialog>
        </>
    );
}
