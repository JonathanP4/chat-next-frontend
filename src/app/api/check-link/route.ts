import { api } from "@/util/axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const link = await req.json();
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    const { data } = await api.post(
        "/chat/check-link",
        { url: link },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return NextResponse.json(data);
}
