'use client';

import { createContext, useContext } from "react";
import type { Member } from "./types";

// 레이아웃(서버)에서 조회한 로그인 회원을 클라이언트 컴포넌트에 전달
// 로그인/로그아웃 후 router.refresh()를 호출하면 레이아웃이 다시 렌더링되면서 값이 갱신됨
const MemberContext = createContext<Member | null>(null);

export function MemberProvider({ member, children }: { member: Member | null; children: React.ReactNode }) {
    return <MemberContext.Provider value={member}>{children}</MemberContext.Provider>;
}

export function useMember() {
    return useContext(MemberContext);
}

export function useIsAdmin() {
    return useMember()?.role === "ADMIN";
}
