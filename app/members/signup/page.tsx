'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        if (form.get("password") !== form.get("passwordConfirm")) {
            setError("비밀번호가 일치하지 않습니다");
            return;
        }

        setSubmitting(true);
        setError(null);
        try {
            const res = await fetch("/members/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: form.get("username"), password: form.get("password") }),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(res.status === 409
                    ? "이미 사용 중인 아이디입니다"
                    : data.message || data.detail || "회원가입에 실패했습니다");
            }
            alert("회원가입이 완료되었습니다. 로그인해 주세요.");
            router.push("/members/login");
        } catch (e) {
            setError((e as Error).message);
            setSubmitting(false);
        }
    };

    return (
        <main className="mx-auto w-full max-w-sm p-6">
            <h1 className="mb-6 text-2xl font-bold">회원가입</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block">
                    <span className="mb-1 block text-sm font-medium">아이디</span>
                    <input name="username" required autoComplete="username" className="w-full rounded border p-2" />
                </label>
                <label className="block">
                    <span className="mb-1 block text-sm font-medium">비밀번호</span>
                    <input name="password" type="password" required autoComplete="new-password" className="w-full rounded border p-2" />
                </label>
                <label className="block">
                    <span className="mb-1 block text-sm font-medium">비밀번호 확인</span>
                    <input name="passwordConfirm" type="password" required autoComplete="new-password" className="w-full rounded border p-2" />
                </label>

                {error && <p className="text-red-600">{error}</p>}

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded bg-black p-2 text-white disabled:opacity-50"
                >
                    {submitting ? "가입 중..." : "회원가입"}
                </button>
                <p className="text-center text-sm text-gray-500">
                    이미 계정이 있으신가요? <Link href="/members/login" className="underline">로그인</Link>
                </p>
            </form>
        </main>
    );
}
