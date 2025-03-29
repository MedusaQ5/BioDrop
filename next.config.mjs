import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import createMDX from "@next/mdx";
import withPWA from "next-pwa";
import runtimeCaching from "next-pwa/cache.js";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  images: {
    minimumCacheTTL: 60 * 60 * 24,
    remotePatterns: [
      { protocol: "http", hostname: "github.com" },
      { protocol: "https", hostname: "github.com" },
      { protocol: "https", hostname: "**.githubusercontent.com" },
      { protocol: "https", hostname: "cdn.nhcarrigan.com" },
      { protocol: "https", hostname: "avatars.dicebear.com" }
    ],
    formats: ["image/webp"],
  },
  compress: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [[rehypePrettyCode, { theme: "dracula", defaultLang: "plaintext" }]],
    providerImportSource: "@mdx-js/react",
  },
});

const nextDataIndex = runtimeCaching.findIndex(
  (entry) => entry.options.cacheName === "next-data"
);

if (nextDataIndex !== -1) {
  runtimeCaching[nextDataIndex].handler = "NetworkFirst";
} else {
  throw new Error("Failed to find next-data object in runtime caching");
}

const pwaConfig = {
  disable: false,
  dest: "public",
  runtimeCaching,
  register: true,
  skipWaiting: true,
};

export default withMDX(withPWA(pwaConfig)(nextConfig));
