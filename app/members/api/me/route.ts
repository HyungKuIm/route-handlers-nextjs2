import { NextRequest } from "next/server";
import { sessionFetch } from "../../../dogs/api/spring";

// GET /members/me (로그인 전이면 401)
export async function GET(request: NextRequest) {
    return sessionFetch(request, '/members/me');
}
