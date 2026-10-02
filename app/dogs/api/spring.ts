import { NextRequest } from "next/server";

// 운영(standalone)에서는 start-all 스크립트가 SPRING_API_URL을 넘겨주며, 없으면 로컬 스프링 기본 포트 사용
export const API_BASE = process.env.SPRING_API_URL ?? "http://localhost:8080";

// 스프링 응답 본문을 JSON으로 파싱하고, JSON이 아니면 { message } 형태로 감쌈
export async function readBody(res: Response) {
    const text = await res.text();
    try {
        return JSON.parse(text);
    } catch {
        return { message: text };
    }
}

// 폼 데이터를 스프링의 DogRequest(JSON) 형태로 변환
export function toDogRequest(formData: FormData) {
    return {
        kind: formData.get('kind'),
        country: formData.get('country'),
        content: formData.get('content'),
        height: Number(formData.get('height')),
        weight: Number(formData.get('weight')),
        price: Number(formData.get('price')),
        image: formData.get('image') || null,
    };
}

// 스프링의 장바구니/로그인 정보는 세션(JSESSIONID)에 저장되므로
// 브라우저 쿠키를 스프링으로 넘기고, 스프링의 Set-Cookie를 브라우저로 돌려줘야 함
export async function sessionFetch(request: NextRequest, path: string, init: RequestInit & { headers?: Record<string, string> } = {}) {
    try {
        const res = await fetch(`${API_BASE}${path}`, {
            ...init,
            headers: {
                ...init.headers,
                cookie: request.headers.get('cookie') ?? '',
            },
        });

        const headers = new Headers();
        for (const cookie of res.headers.getSetCookie()) {
            headers.append('Set-Cookie', cookie);
        }

        if (res.status === 204) {
            return new Response(null, { status: 204, headers });
        }
        return Response.json(await readBody(res), { status: res.status, headers });
    } catch {
        return Response.json({ message: '스프링 서버에 연결할 수 없습니다' },
            { status: 502 }
        );
    }
}

// 첨부된 이미지가 있으면 POST /dogs/{id}/image 로 업로드, 없으면 null
// 스프링이 세션으로 권한을 확인할 수 있도록 브라우저 쿠키를 함께 넘김
export async function uploadImage(id: number | string, file: FormDataEntryValue | null, cookie = '') {
    if (!(file instanceof File) || file.size === 0) return null;

    const imageForm = new FormData();
    imageForm.append('file', file);
    // Content-Type(boundary 포함)은 fetch가 FormData로부터 자동 설정하므로 직접 지정하지 않음
    return fetch(`${API_BASE}/dogs/${id}/image`, {
        method: 'POST',
        headers: { cookie },
        body: imageForm,
    });
}
