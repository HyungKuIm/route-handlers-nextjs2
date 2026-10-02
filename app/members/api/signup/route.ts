import { NextRequest } from "next/server";
import { sessionFetch } from "../../../dogs/api/spring";

// POST /members/signup  { username, password }
export async function POST(request: NextRequest) {
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return Response.json({ message: 'JSON 형식이어야 합니다' },
            { status: 400 }
        );
    }

    return sessionFetch(request, '/members/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
}
