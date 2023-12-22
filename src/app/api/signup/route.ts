import { api } from "@/util/axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();

    const { data } = await api.post("/auth/signup", body);

    return NextResponse.json(data);
}
