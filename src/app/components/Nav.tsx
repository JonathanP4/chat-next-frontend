"use client";

import { useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { local } from "@/util/axios";
import { ErrorPopup } from "./ErrorPopup";

export type JWTDecoded = {
    email: string;
    iat: number;
    userId: string;
};

export default function Nav() {
    const [isAuth, setIsAuth] = useState(false);
    const [error, setError] = useState("");
    const [user, setUser] = useState<UserData>();

    const pathName = usePathname();
    const router = useRouter();

    useEffect(() => {
        async function getProfile() {
            const userId = sessionStorage.getItem("userId");

            if (!userId) return;

            const { data } = await local.get(`/${userId}`);

            setUser(data.user);
        }
        getProfile();
    }, [isAuth]);

    async function logoutHandler() {
        const { data } = await local.post("/logout");

        if (data.status >= 400) {
            return setError(data.message);
        }

        setError("");
        router.push("/");
    }

    useEffect(() => {
        (async function () {
            const { data } = await local.get("/token");

            sessionStorage.setItem("userId", data.userId);

            setIsAuth(data.isAuth);
        })();
    }, [pathName]);

    return (
        <>
            {error && <ErrorPopup error={error} setError={setError} />}
            <nav className="flex items-center justify-between py-4 px-8 bg-primary">
                <a
                    href="/"
                    className="text-2xl tracking-wide font-semibold cursor-pointer"
                >
                    ChatNext
                </a>
                <ul className="flex items-center gap-4">
                    {isAuth && <Link href="/chat">Chat</Link>}
                    {!isAuth && (
                        <>
                            <Link
                                className={buttonVariants({
                                    variant: "outline",
                                })}
                                href="/login"
                            >
                                Login
                            </Link>
                        </>
                    )}
                    {isAuth && (
                        <>
                            <li
                                className="cursor-pointer transition-colors hover:text-accent"
                                onClick={logoutHandler}
                            >
                                Logout
                            </li>
                            <Link href="/profile">
                                <img
                                    className="rounded-full"
                                    src={
                                        user?.image ||
                                        "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg"
                                    }
                                    alt="profile picture"
                                    width={50}
                                    height={50}
                                />
                            </Link>
                        </>
                    )}
                </ul>
            </nav>
        </>
    );
}
