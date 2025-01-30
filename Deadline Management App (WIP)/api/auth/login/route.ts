import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { env } from "~/env";
import { createToken } from "~/lib/jwt";

const SITE_PASSWORD = env.SITE_PASSWORD;

export async function POST(request: Request) {
    const body = await request.json() as { password?: string };

    if (body.password === SITE_PASSWORD) {
        const token = await createToken({ userId: "admin" });

        (await cookies()).set("site-auth", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24, // 24 hours
        });

        return NextResponse.json({ success: true });
    }

    return NextResponse.json(
        { success: false, error: "Invalid password" },
        { status: 401 }
    );
} 