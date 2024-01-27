/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['storage.googleapis.com'],
  },
  env: {
    // NEXT_PUBLIC_API_BASE_URL: 'https://job-lk-backend.onrender.com',
    NEXT_PUBLIC_API_BASE_URL: 'http://localhost:3000',
    NEXT_PUBLIC_API_AUTH_TOKEN: 'eb802c2cd0c34668941b549939e618574db1e58daaaaafe03a36f63d8f5c8a857f990c91f8bfbfc08a958f5fc9538617ffe018ef4d1e9eb236086c148f9a969a',
    NEXT_PUBLIC_API_AUTH_LOGIN: '/auth/login',
    NEXT_PUBLIC_API_AUTH_REGISTER: '/auth/register',
    NEXT_PUBLIC_API_AUTH_LOGOUT: '/auth/logout',
    NEXT_PUBLIC_API_USER: '/user',
  },
}

module.exports = nextConfig
