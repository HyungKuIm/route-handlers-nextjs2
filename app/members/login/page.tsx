import LoginForm from "./LoginForm";

export default async function LoginPage({ searchParams }: PageProps<"/members/login">) {
    const { next } = await searchParams;
    // 외부 주소로 보내지 않도록 같은 사이트 경로만 허용
    const redirectTo = typeof next === "string" && next.startsWith("/") && !next.startsWith("//") ? next : "/dogs";

    return (
        <main className="mx-auto w-full max-w-sm p-6">
            <h1 className="mb-6 text-2xl font-bold">로그인</h1>
            <LoginForm redirectTo={redirectTo} />
        </main>
    );
}
