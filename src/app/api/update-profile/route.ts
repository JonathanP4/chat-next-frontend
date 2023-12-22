import { api } from "@/util/axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
    const body = await req.json();

    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    const { data } = await api.patch("/user/update", body, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return NextResponse.json(data);
}
