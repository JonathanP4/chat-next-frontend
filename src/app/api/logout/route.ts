import { api } from "@/util/axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const cookieStore = cookies();

    const token = cookieStore.get("token");

    if (!token) {
        return NextResponse.json({ status: 401, message: "Not Authorized" });
    }

    const { data } = await api.post(
        "/auth/logout",
        {},
        {
            headers: {
                Authorization: `Bearer ${token.value}`,
            },
        }
    );

    if (data.status >= 400) {
        return NextResponse.json(data);
    }

    cookieStore.delete("token");

    return NextResponse.json(data);
}
