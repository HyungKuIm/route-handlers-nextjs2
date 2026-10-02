'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMember } from "./MemberContext";

export default function MemberNav() {
    const member = useMember();
    const router = useRouter();

    const handleLogout = async () => {
        await fetch("/members/api/logout", { method: "POST" }).catch(() => {});
        router.push("/dogs");
        // 레이아웃의 로그인 정보를 갱신
        router.refresh();
    };

    return (
        <header className="border-b">
            <nav className="mx-auto flex max-w-5xl items-center justify-between p-4 text-sm">
                <Link href="/dogs" className="font-bold">개 상품 쇼핑몰</Link>
                {member ? (
                    <div className="flex items-center gap-3">
                        <span>
                            {member.username}
                            {member.role === "ADMIN" && (
                                <span className="ml-1 rounded bg-black px-1.5 py-0.5 text-xs text-white">ADMIN</span>
                            )}
                        </span>
                        <button type="button" onClick={handleLogout} className="text-gray-500 hover:underline">
                            로그아웃
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <Link href="/members/login" className="hover:underline">로그인</Link>
                        <Link href="/members/signup" className="hover:underline">회원가입</Link>
                    </div>
                )}
            </nav>
        </header>
    );
}
