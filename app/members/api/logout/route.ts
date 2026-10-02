import { NextRequest } from "next/server";
import { sessionFetch } from "../../../dogs/api/spring";

// POST /members/logout (세션을 끊고 204)
export async function POST(request: NextRequest) {
    return sessionFetch(request, '/members/logout', { method: 'POST' });
}
