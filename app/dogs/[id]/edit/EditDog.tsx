'use client';

import { useEffect, useState } from "react";
import DogForm from "../../DogForm";
import type { Dog } from "../../types";

export default function EditDog({ id }: { id: string }) {
    const [dog, setDog] = useState<Dog | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch(`/dogs/api/${id}`)
            .then(async (res) => {
                const data = await res.json();
                if (!res.ok) throw new Error(data.message ?? "개 정보를 불러오지 못했습니다");
                setDog(data);
            })
            .catch((e: Error) => setError(e.message));
    }, [id]);

    return (
        <>
            {error && <p className="text-red-600">{error}</p>}
            {!dog && !error && <p>불러오는 중...</p>}
            {dog && <DogForm action={`/dogs/api/${id}`} method="PUT" submitLabel="수정" dog={dog} />}
        </>
    );
}
