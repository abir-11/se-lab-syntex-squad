import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 🟢 ১. External Image domain allow করা
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // যেকোনো https ইমেজ ইউআরএল এলাউ করার জন্য
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },

  // 🟢 ২. (ঐচ্ছিক) CORS এরর পুরোপুরি বাইপাস করতে API Proxy
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_API_URL || "https://campus-guide-backend.vercel.app"}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;