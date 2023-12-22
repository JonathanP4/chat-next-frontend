import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET() {
    const cookieStore = cookies();
    const token = cookieStore.get("token");

    if (!token) {
        return NextResponse.json({
            isAuth: false,
        });
    }

    const { userId } = jwt.decode(token.value) as any;

    return NextResponse.json({ token, userId, isAuth: true });
}
