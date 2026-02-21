// /** @type {import('next').NextConfig} */
// const nextConfig = {};


// export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    compiler: {
      // warnings: {
      //   extraAttributes: 'off',
      // },
    },
      images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  };
  
  export default nextConfig;

  