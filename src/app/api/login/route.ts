import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api } from "@/util/axios";

export async function POST(req: Request) {
    const body = await req.json();
    const cookieStore = cookies();

    const { data } = await api.post("/auth/login", body);

    if (data.status >= 400) {
        return NextResponse.json(data);
    }

    cookieStore.set("token", data.token, {
        httpOnly: true,
        maxAge: 60 * 60 * 48,
    });

    return NextResponse.json(data);
}
