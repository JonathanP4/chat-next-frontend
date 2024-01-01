"use client";

import { Suspense, useEffect, useState } from "react";
import ChatScreen from "./screen/ChatScreen";
import Contact from "./components/Contact";
import { socket } from "@/util/socket";
import { useRouter } from "next/navigation";
import { local } from "@/util/axios";
import Loading from "./loading";

export default function page() {
    const [selectedUser, setSelectedUser] = useState<any>();
    const [contacts, setContacts] = useState<UserData[]>();
    const [error, setError] = useState("");

    const router = useRouter();

    useEffect(() => {
        (async function getToken() {
            const { data } = await local.get("/token");

            if (!data.isAuth) {
                router.push("/login");
            }

            socket.auth = { token: data.token.value };
            socket.connect();
        })();
    }, []);

    useEffect(() => {
        (async function getUsers() {
            const { data } = await local.get("/users");

            setContacts(data.users);
        })();
    }, []);

    useEffect(() => {
        socket.on("user_connected", async () => {
            const { data } = await local.get("/users");
            setContacts(data.users);
        });
        socket.on("not_auth", () => {
            router.push("/login");
        });

        socket.on("user_undefined", (err) => {
            setError(err);
        });
    }, []);

    return (
        <Suspense fallback={<Loading />}>
            <main className="grid grid-cols-[minmax(290px,30%),1fr]">
                {error && (
                    <pre className="text-lg text-destructive m-8">{error}</pre>
                )}
                <ul className="h-[var(--screen)] overflow-y-auto grid content-start">
                    {contacts &&
                        !error &&
                        contacts.map((contact) => (
                            <Contact
                                key={contact._id}
                                contact={contact}
                                setUser={setSelectedUser}
                            />
                        ))}
                </ul>
                {!error && selectedUser && (
                    <ChatScreen selectedUser={selectedUser} />
                )}
            </main>
        </Suspense>
    );
}
