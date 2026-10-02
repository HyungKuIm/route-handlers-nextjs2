import { NextRequest } from "next/server";
import { sessionFetch } from "../../../dogs/api/spring";

// POST /members/login  { username, password }
// 성공하면 스프링이 내려준 세션 쿠키(Set-Cookie)를 브라우저로 전달
export async function POST(request: NextRequest) {
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return Response.json({ message: 'JSON 형식이어야 합니다' },
            { status: 400 }
        );
    }

    return sessionFetch(request, '/members/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
}
