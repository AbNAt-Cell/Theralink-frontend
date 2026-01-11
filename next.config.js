const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'lgihyanqdrfxwirqgmyi.supabase.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // env: {
  //   API_URL: process.env.API_URL,
  // },
};

module.exports = nextConfig;