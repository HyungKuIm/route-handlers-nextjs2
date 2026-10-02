import type { NextConfig } from "next";

const SPRING_API_URL = process.env.SPRING_API_URL ?? "http://localhost:8080";

const nextConfig: NextConfig = {
  // node server.js 하나로 실행할 수 있는 .next/standalone 폴더를 생성 (demo-dog/frontend로 배포)
  output: "standalone",
  async rewrites() {
    return [
      // 개 이미지는 스프링이 저장/서빙하므로 그대로 스프링으로 넘김
      { source: "/images/:path*", destination: `${SPRING_API_URL}/images/:path*` },
    ];
  },
};

export default nextConfig;
