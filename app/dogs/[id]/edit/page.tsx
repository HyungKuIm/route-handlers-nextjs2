import { requireAdminPage } from "../../../members/auth";
import EditDog from "./EditDog";

export default async function EditDogPage({ params }: PageProps<"/dogs/[id]/edit">) {
    const { id } = await params;
    await requireAdminPage(`/dogs/${id}/edit`);

    return (
        <main className="mx-auto max-w-xl p-6">
            <h1 className="mb-6 text-2xl font-bold">개 수정</h1>
            <EditDog id={id} />
        </main>
    );
}
