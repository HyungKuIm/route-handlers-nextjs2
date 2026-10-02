import { NextRequest } from "next/server";
import { cartFetch } from "./spring";

// GET /cart
export async function GET(request: NextRequest) {
    return cartFetch(request, '/cart');
}

// DELETE /cart (전체 비우기)
export async function DELETE(request: NextRequest) {
    return cartFetch(request, '/cart', { method: 'DELETE' });
}
