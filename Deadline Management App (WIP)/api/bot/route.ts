import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { projects } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
    try {
        // Query only active projects from the database
        const activeProjects = await db.query.projects.findMany({
            where: eq(projects.status, 'active'),
            with: {
                type: {
                    with: {
                        requiredTag: true,
                        discordChannel: true
                    }
                },
                employee: true
            }
        })

        return NextResponse.json({
            success: true,
            data: activeProjects
        });
    } catch (error) {
        console.error("Error fetching active projects:", error);
        return NextResponse.json(
            { 
                success: false, 
                error: "Failed to fetch active projects" 
            },
            { status: 500 }
        );
    }
}
