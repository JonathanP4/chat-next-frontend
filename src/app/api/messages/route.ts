import { api } from "@/util/axios";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    const body = await req.json();
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    const { data } = await api.post("/chat/messages", body, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return NextResponse.json(data);
}
