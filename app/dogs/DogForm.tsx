'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Dog } from "./types";

type Props = {
    action: string;
    method: "POST" | "PUT";
    submitLabel: string;
    dog?: Dog; // 수정 시 기존 값
};

export default function DogForm({ action, method, submitLabel, dog }: Props) {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            // input의 name 속성이 그대로 multipart 키가 됨 (이미지는 'file')
            const res = await fetch(action, {
                method,
                body: new FormData(e.currentTarget),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message ?? `${submitLabel}에 실패했습니다`);
            }
            router.push("/dogs");
        } catch (e) {
            setError((e as Error).message);
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* PUT은 DogRequest 전체를 덮어쓰므로 기존 이미지 경로를 함께 보내 유지 */}
            {dog && <input type="hidden" name="image" value={dog.image ?? ""} />}
            <label className="block">
                <span className="mb-1 block text-sm font-medium">품종</span>
                <input name="kind" defaultValue={dog?.kind} required className="w-full rounded border p-2" />
            </label>
            <label className="block">
                <span className="mb-1 block text-sm font-medium">원산지</span>
                <input name="country" defaultValue={dog?.country} required className="w-full rounded border p-2" />
            </label>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <label className="block">
                    <span className="mb-1 block text-sm font-medium">키(cm)</span>
                    <input name="height" type="number" min="0" step="any" defaultValue={dog?.height} required className="w-full rounded border p-2" />
                </label>
                <label className="block">
                    <span className="mb-1 block text-sm font-medium">몸무게(kg)</span>
                    <input name="weight" type="number" min="0" step="any" defaultValue={dog?.weight} required className="w-full rounded border p-2" />
                </label>
                <label className="block">
                    <span className="mb-1 block text-sm font-medium">가격(원)</span>
                    <input name="price" type="number" min="0" step="1" defaultValue={dog?.price} required className="w-full rounded border p-2" />
                </label>
            </div>
            <label className="block">
                <span className="mb-1 block text-sm font-medium">설명</span>
                <textarea name="content" rows={5} maxLength={4000} defaultValue={dog?.content} required className="w-full rounded border p-2" />
            </label>
            <label className="block">
                <span className="mb-1 block text-sm font-medium">
                    이미지{dog && " (변경할 때만 선택)"}
                </span>
                {dog?.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={dog.image} alt={dog.kind} className="mb-2 h-32 rounded object-cover" />
                )}
                <input name="file" type="file" accept="image/*" required={!dog} className="w-full rounded border p-2" />
            </label>

            {error && <p className="text-red-600">{error}</p>}

            <div className="flex gap-2">
                <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 rounded bg-black p-2 text-white disabled:opacity-50"
                >
                    {submitting ? `${submitLabel} 중...` : submitLabel}
                </button>
                <Link href="/dogs" className="flex-1 rounded border p-2 text-center">
                    취소
                </Link>
            </div>
        </form>
    );
}
