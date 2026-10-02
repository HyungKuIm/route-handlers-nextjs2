import { NextRequest } from "next/server";
import { checkAdmin } from "../../members/auth";
import { API_BASE, readBody, toDogRequest, uploadImage } from "./spring";

export async function GET() {
    try {
        const res = await fetch(`${API_BASE}/dogs`);

        if (!res.ok) {
            const text = await res.text();
            return Response.json({ message: text }, { status: res.status });
        }
        const data = await res.json();
        return Response.json(data);
    } catch {
        return Response.json({ message: '스프링 서버에 연결할 수 없습니다' },
            { status: 502 }
        );
    }
}

// 브라우저에서는 multipart 하나로 받고, 스프링에는 두 번에 나눠 보냄
// 1) POST /dogs (JSON) 로 개 생성  2) POST /dogs/{id}/image (multipart 'file') 로 이미지 업로드
// ADMIN만 등록 가능
export async function POST(request: NextRequest) {
    const denied = await checkAdmin(request);
    if (denied) return denied;
    const cookie = request.headers.get('cookie') ?? '';

    let formData: FormData;
    try {
        formData = await request.formData();
    } catch {
        return Response.json({ message: 'multipart/form-data 형식이어야 합니다' },
            { status: 400 }
        );
    }

    try {
        const createRes = await fetch(`${API_BASE}/dogs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', cookie },
            body: JSON.stringify(toDogRequest(formData)),
        });
        const created = await readBody(createRes);
        if (!createRes.ok) {
            return Response.json(created, { status: createRes.status });
        }

        const imageRes = await uploadImage(created.id, formData.get('file'), cookie);
        if (!imageRes) {
            return Response.json(created, { status: 201 });
        }
        const uploaded = await readBody(imageRes);
        if (!imageRes.ok) {
            return Response.json(
                { message: `개는 등록되었지만(id=${created.id}) 이미지 업로드에 실패했습니다: ${uploaded.message ?? ''}` },
                { status: imageRes.status }
            );
        }

        return Response.json(uploaded, { status: 201 });
    } catch {
        return Response.json({ message: '스프링 서버에 연결할 수 없습니다' },
            { status: 502 }
        );
    }
}
