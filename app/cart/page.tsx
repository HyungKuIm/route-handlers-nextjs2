'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Cart } from "./types";

const EMPTY_CART: Cart = { items: [], totalQuantity: 0, totalPrice: 0 };

export default function CartPage() {
    const [cart, setCart] = useState<Cart | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch("/cart/api")
            .then(async (res) => {
                const data = await res.json();
                if (!res.ok) throw new Error(data.message ?? "장바구니를 불러오지 못했습니다");
                setCart(data);
            })
            .catch((e: Error) => setError(e.message));
    }, []);

    const handleRemove = async (dogId: number) => {
        try {
            const res = await fetch(`/cart/api/items/${dogId}`, { method: "DELETE" });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.message ?? "삭제에 실패했습니다");
            setCart(data);
        } catch (e) {
            alert((e as Error).message);
        }
    };

    const handleClear = async () => {
        if (!confirm("장바구니를 비우시겠습니까?")) return;
        try {
            const res = await fetch("/cart/api", { method: "DELETE" });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message ?? "장바구니를 비우지 못했습니다");
            }
            setCart(EMPTY_CART);
        } catch (e) {
            alert((e as Error).message);
        }
    };

    return (
        <main className="mx-auto max-w-3xl p-6">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">장바구니</h1>
                <Link href="/dogs" className="text-sm text-gray-500 hover:underline">쇼핑 계속하기</Link>
            </div>

            {error && <p className="text-red-600">{error}</p>}
            {!cart && !error && <p>불러오는 중...</p>}
            {cart && cart.items.length === 0 && <p>장바구니가 비어 있습니다.</p>}

            {cart && cart.items.length > 0 && (
                <>
                    <ul className="divide-y rounded-lg border">
                        {cart.items.map((item) => (
                            <li key={item.dogId} className="flex items-center gap-4 p-4">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={item.image} alt={item.kind} className="h-16 w-16 rounded bg-gray-100 object-cover" />
                                <div className="flex-1">
                                    <Link href={`/dogs/${item.dogId}`} className="font-semibold hover:underline">
                                        {item.kind}
                                    </Link>
                                    <p className="text-sm text-gray-500">
                                        {item.price.toLocaleString()}원 × {item.quantity}
                                    </p>
                                </div>
                                <p className="font-bold">{item.amount.toLocaleString()}원</p>
                                <button
                                    type="button"
                                    onClick={() => handleRemove(item.dogId)}
                                    className="rounded border border-red-600 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                                >
                                    삭제
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-6 flex items-center justify-between">
                        <button type="button" onClick={handleClear} className="text-sm text-gray-500 hover:underline">
                            전체 비우기
                        </button>
                        <p className="text-lg">
                            총 {cart.totalQuantity}마리 · <span className="font-bold">{cart.totalPrice.toLocaleString()}원</span>
                        </p>
                    </div>
                </>
            )}
        </main>
    );
}
