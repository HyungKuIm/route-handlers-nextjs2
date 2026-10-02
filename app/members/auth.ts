import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { cache } from "react";
import { API_BASE } from "../dogs/api/spring";
import type { Member } from "./types";

// 브라우저 쿠키로 스프링 GET /members/me 를 호출해 로그인 회원을 확인 (로그인 전이면 null)
// 스프링에 연결할 수 없으면 fetch가 예외를 던짐
async function fetchMember(cookie: string): Promise<Member | null> {
    if (!cookie) return null;
    const res = await fetch(`${API_BASE}/members/me`, { headers: { cookie } });
    if (!res.ok) return null;
    return res.json();
}

// 서버 컴포넌트용: 한 요청 안에서 레이아웃과 페이지가 같이 호출해도 스프링은 한 번만 조회
export const getCurrentMember = cache(async (): Promise<Member | null> => {
    try {
        return await fetchMember((await headers()).get('cookie') ?? '');
    } catch {
        return null;
    }
});

// 관리자 전용 페이지: 로그인 전이면 로그인 페이지로, ADMIN이 아니면 목록으로 보냄
export async function requireAdminPage(returnTo: string) {
    const member = await getCurrentMember();
    if (!member) redirect(`/members/login?next=${encodeURIComponent(returnTo)}`);
    if (member.role !== 'ADMIN') redirect('/dogs');
    return member;
}

// Route Handler용: ADMIN이면 null, 아니면 그대로 돌려줄 에러 응답
export async function checkAdmin(request: NextRequest): Promise<Response | null> {
    let member: Member | null;
    try {
        member = await fetchMember(request.headers.get('cookie') ?? '');
    } catch {
        return Response.json({ message: '스프링 서버에 연결할 수 없습니다' },
            { status: 502 }
        );
    }
    if (!member) {
        return Response.json({ message: '로그인이 필요합니다' }, { status: 401 });
    }
    if (member.role !== 'ADMIN') {
        return Response.json({ message: '관리자만 수행할 수 있습니다' }, { status: 403 });
    }
    return null;
}
