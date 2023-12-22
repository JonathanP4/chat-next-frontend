import { api } from "@/util/axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const cookieStore = cookies();
    const token = cookieStore.get("token");

    const { data } = await api.get("/chat/users", {
        headers: {
            Authorization: `Bearer ${token?.value}`,
        },
    });

    return NextResponse.json(data);
}
