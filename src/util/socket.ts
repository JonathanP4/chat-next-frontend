import { io } from "socket.io-client";

//"https://chat-next-api.onrender.com"
//"http://localhost:8080"
export const socket = io(process.env.NEXT_PUBLIC_HOST!.replace("/api", ""), {
    autoConnect: false,
});
