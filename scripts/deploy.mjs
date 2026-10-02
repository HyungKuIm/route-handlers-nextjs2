// next build 결과(.next/standalone)를 ../demo-dog/frontend 로 복사
// standalone은 public, .next/static을 포함하지 않으므로 직접 함께 복사해야 server.js가 서빙함
import { cpSync, existsSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const standalone = join(root, ".next", "standalone");
const target = resolve(root, "..", "demo-dog", "frontend");

if (!existsSync(join(standalone, "server.js"))) {
    console.error("standalone 빌드가 없습니다. 먼저 next build를 실행하세요.");
    process.exit(1);
}

rmSync(target, { recursive: true, force: true });
cpSync(standalone, target, { recursive: true });
cpSync(join(root, ".next", "static"), join(target, ".next", "static"), { recursive: true });
cpSync(join(root, "public"), join(target, "public"), { recursive: true });

console.log(`배포 완료: ${target}`);
