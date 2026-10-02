'use client';

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useIsAdmin } from "../../members/MemberContext";
import type { Dog } from "../types";

export default function DogDetailPage() {
    const { id } = useParams<{ id: string }>();
    const isAdmin = useIsAdmin();
    const router = useRouter();
    const [dog, setDog] = useState<Dog | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        fetch(`/dogs/api/${id}`)
            .then(async (res) => {
                const data = await res.json();
                if (!res.ok) throw new Error(data.message ?? "개 정보를 불러오지 못했습니다");
                setDog(data);
            })
            .catch((e: Error) => setError(e.message));
    }, [id]);

    const handleAddToCart = async () => {
        if (!dog) return;
        setAdding(true);
        try {
            const res = await fetch("/cart/api/items", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ dogId: dog.id, quantity }),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                // 스프링 검증 오류는 ProblemDetail 형식({ detail })으로 옴
                throw new Error(data.message ?? data.detail ?? "장바구니에 담지 못했습니다");
            }
            if (confirm("장바구니에 담았습니다. 장바구니로 이동하시겠습니까?")) {
                router.push("/cart");
            }
        } catch (e) {
            alert((e as Error).message);
        } finally {
            setAdding(false);
        }
    };

    if (error) return <main className="mx-auto max-w-3xl p-6 text-red-600">{error}</main>;
    if (!dog) return <main className="mx-auto max-w-3xl p-6">불러오는 중...</main>;

    return (
        <main className="mx-auto max-w-3xl p-6">
            <div className="mb-6 flex items-center justify-between">
                <Link href="/dogs" className="text-sm text-gray-500 hover:underline">← 목록으로</Link>
                <Link href="/cart" className="text-sm text-gray-500 hover:underline">장바구니 보기</Link>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={dog.image} alt={dog.kind} className="w-full rounded-lg bg-gray-100 object-cover" />

                <div className="space-y-3">
                    <h1 className="text-2xl font-bold">{dog.kind}</h1>
                    <p className="text-sm text-gray-500">원산지: {dog.country}</p>
                    <p className="text-sm text-gray-500">
                        키 {dog.height}cm · 몸무게 {dog.weight}kg · 조회수 {dog.readcount}
                    </p>
                    <p className="whitespace-pre-line">{dog.content}</p>
                    <p className="text-xl font-bold">{dog.price.toLocaleString()}원</p>

                    <div className="flex items-center gap-2">
                        <label htmlFor="quantity" className="text-sm font-medium">수량</label>
                        <input
                            id="quantity"
                            type="number"
                            min={1}
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                            className="w-20 rounded border p-2"
                        />
                        <span className="text-sm text-gray-500">
                            합계 {(dog.price * quantity).toLocaleString()}원
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={adding}
                        className="w-full rounded bg-black p-2 text-white disabled:opacity-50"
                    >
                        {adding ? "담는 중..." : "장바구니에 담기"}
                    </button>
                    {isAdmin && (
                        <Link href={`/dogs/${dog.id}/edit`} className="block w-full rounded border p-2 text-center">
                            수정
                        </Link>
                    )}
                </div>
            </div>
        </main>
    );
}
