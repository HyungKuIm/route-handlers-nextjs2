'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm({ redirectTo }: { redirectTo: string }) {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        setSubmitting(true);
        setError(null);
        try {
            const res = await fetch("/members/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: form.get("username"), password: form.get("password") }),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(res.status === 401
                    ? "아이디 또는 비밀번호가 올바르지 않습니다"
                    : data.message || data.detail || "로그인에 실패했습니다");
            }
            router.push(redirectTo);
            // 레이아웃의 로그인 정보를 갱신
            router.refresh();
        } catch (e) {
            setError((e as Error).message);
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
                <span className="mb-1 block text-sm font-medium">아이디</span>
                <input name="username" required autoComplete="username" className="w-full rounded border p-2" />
            </label>
            <label className="block">
                <span className="mb-1 block text-sm font-medium">비밀번호</span>
                <input name="password" type="password" required autoComplete="current-password" className="w-full rounded border p-2" />
            </label>

            {error && <p className="text-red-600">{error}</p>}

            <button
                type="submit"
                disabled={submitting}
                className="w-full rounded bg-black p-2 text-white disabled:opacity-50"
            >
                {submitting ? "로그인 중..." : "로그인"}
            </button>
            <p className="text-center text-sm text-gray-500">
                계정이 없으신가요? <Link href="/members/signup" className="underline">회원가입</Link>
            </p>
        </form>
    );
}
