import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json() as { channelId: string, message: string };
        const { channelId, message } = body;

        // Forward the message to the Discord bot
        const response = await fetch(`${process.env.DISCORD_BOT_URL}/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ channelId, message }),
        });

        if (!response.ok) {
            throw new Error('Failed to send Discord message');
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error sending Discord message:", error);
        return NextResponse.json(
            { 
                success: false, 
                error: "Failed to send Discord message" 
            },
            { status: 500 }
        );
    }
} 