import { requireAdminPage } from "../../members/auth";
import DogForm from "../DogForm";

export default async function NewDogPage() {
    await requireAdminPage("/dogs/new");

    return (
        <main className="mx-auto max-w-xl p-6">
            <h1 className="mb-6 text-2xl font-bold">개 등록</h1>
            <DogForm action="/dogs/api" method="POST" submitLabel="등록" />
        </main>
    );
}
