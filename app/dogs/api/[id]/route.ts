import { NextRequest } from "next/server";
import { checkAdmin } from "../../../members/auth";
import { API_BASE, readBody, toDogRequest, uploadImage } from "../spring";

// /dogs/api/1
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const res = await fetch(`${API_BASE}/dogs/${id}`);
        return Response.json(await readBody(res), { status: res.status });
    } catch {
        return Response.json({ message: '스프링 서버에 연결할 수 없습니다' },
            { status: 502 }
        );
    }
}

// ADMIN만 수정 가능
// 1) PUT /dogs/{id} (JSON) 로 정보 수정  2) 새 이미지가 첨부된 경우에만 POST /dogs/{id}/image 로 업로드
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const denied = await checkAdmin(request);
    if (denied) return denied;
    const cookie = request.headers.get('cookie') ?? '';
    const { id } = await params;

    let formData: FormData;
    try {
        formData = await request.formData();
    } catch {
        return Response.json({ message: 'multipart/form-data 형식이어야 합니다' },
            { status: 400 }
        );
    }

    try {
        const updateRes = await fetch(`${API_BASE}/dogs/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', cookie },
            body: JSON.stringify(toDogRequest(formData)),
        });
        const updated = await readBody(updateRes);
        if (!updateRes.ok) {
            return Response.json(updated, { status: updateRes.status });
        }

        const imageRes = await uploadImage(id, formData.get('file'), cookie);
        if (!imageRes) {
            return Response.json(updated);
        }
        const uploaded = await readBody(imageRes);
        if (!imageRes.ok) {
            return Response.json(
                { message: `정보는 수정되었지만 이미지 업로드에 실패했습니다: ${uploaded.message ?? ''}` },
                { status: imageRes.status }
            );
        }

        return Response.json(uploaded);
    } catch {
        return Response.json({ message: '스프링 서버에 연결할 수 없습니다' },
            { status: 502 }
        );
    }
}

// DELETE /dogs/{id} (ADMIN만 삭제 가능)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const denied = await checkAdmin(request);
    if (denied) return denied;
    const cookie = request.headers.get('cookie') ?? '';
    const { id } = await params;
    try {
        const res = await fetch(`${API_BASE}/dogs/${id}`, { method: 'DELETE', headers: { cookie } });
        if (!res.ok) {
            return Response.json(await readBody(res), { status: res.status });
        }
        return new Response(null, { status: 204 });
    } catch {
        return Response.json({ message: '스프링 서버에 연결할 수 없습니다' },
            { status: 502 }
        );
    }
}
