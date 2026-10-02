'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { useIsAdmin } from "../members/MemberContext";
import type { Dog } from "./types";

export default function DogsPage() {
    const isAdmin = useIsAdmin();
    const [dogs, setDogs] = useState<Dog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch("/dogs/api")
            .then(async (res) => {
                const data = await res.json();
                if (!res.ok) throw new Error(data.message ?? "목록을 불러오지 못했습니다");
                setDogs(data);
            })
            .catch((e: Error) => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = async (dog: Dog) => {
        if (!confirm(`'${dog.kind}'을(를) 삭제하시겠습니까?`)) return;
        try {
            const res = await fetch(`/dogs/api/${dog.id}`, { method: "DELETE" });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message ?? "삭제에 실패했습니다");
            }
            setDogs((prev) => prev.filter((d) => d.id !== dog.id));
        } catch (e) {
            alert((e as Error).message);
        }
    };

    return (
        <main className="mx-auto max-w-5xl p-6">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">개 상품 쇼핑몰입니다3333</h1>
                <div className="flex gap-2">
                    <Link href="/cart" className="rounded border px-4 py-2">
                        장바구니
                    </Link>
                    {isAdmin && (
                        <Link href="/dogs/new" className="rounded bg-black px-4 py-2 text-white">
                            개 등록
                        </Link>
                    )}
                </div>
            </div>

            {loading && <p>불러오는 중...</p>}
            {error && <p className="text-red-600">{error}</p>}
            {!loading && !error && dogs.length === 0 && <p>등록된 개가 없습니다.</p>}

            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {dogs.map((dog) => (
                    <li key={dog.id} className="overflow-hidden rounded-lg border shadow-sm transition hover:shadow-md">
                        <Link href={`/dogs/${dog.id}`} className="block">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={dog.image}
                                alt={dog.kind}
                                className="h-48 w-full bg-gray-100 object-cover"
                            />
                            <div className="space-y-1 p-4">
                                <h2 className="text-lg font-semibold">{dog.kind}</h2>
                                <p className="text-sm text-gray-500">원산지: {dog.country}</p>
                                <p>{dog.content}</p>
                                <p className="text-sm text-gray-500">
                                    키 {dog.height}cm · 몸무게 {dog.weight}kg · 조회수 {dog.readcount}
                                </p>
                                <p className="font-bold">{dog.price.toLocaleString()}원</p>
                            </div>
                        </Link>
                        {/* 링크 안에 버튼을 넣으면 클릭 시 상세 페이지로 이동하므로 링크 밖에 배치 */}
                        {isAdmin && (
                            <div className="px-4 pb-4">
                                <button
                                    type="button"
                                    onClick={() => handleDelete(dog)}
                                    className="w-full rounded border border-red-600 p-2 text-red-600 hover:bg-red-50"
                                >
                                    삭제
                                </button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </main>
    );
}
