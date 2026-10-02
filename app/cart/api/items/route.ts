import { NextRequest } from "next/server";
import { cartFetch } from "../spring";

// POST /cart/items  { dogId, quantity }
export async function POST(request: NextRequest) {
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return Response.json({ message: 'JSON 형식이어야 합니다' },
            { status: 400 }
        );
    }

    return cartFetch(request, '/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
}
