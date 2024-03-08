/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://lh3.googleusercontent.com', // Allow requests from Google address
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, OPTIONS', // Allow only GET and OPTIONS methods
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Requested-With, Content-Type, Authorization', // Specify allowed headers
          },
        ],
      },
    ];
  },
};

export default nextConfig;
