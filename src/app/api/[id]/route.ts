import { api } from "@/util/axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
    _req: Request,
    { params }: { params: { id: string } }
) {
    const userId = params.id;
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    const { data } = await api.get(`/user/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return NextResponse.json(data);
}
