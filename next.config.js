/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true, // ← これが今回のヒーロー✨
  },
  images: {
    domains: ['supabase.supabase.co'], // Supabaseのストレージからの画像を許可
  },
};

module.exports = nextConfig;
