/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['supabase.supabase.co'], // Supabaseのストレージからの画像を許可
  },
};

module.exports = nextConfig; 