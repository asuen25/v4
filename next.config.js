const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: '/content/:path*',
        destination: '/api/static/content/:path*',
      },
      {
        source: '/images/:path*',
        destination: '/api/static/images/:path*',
      },
      {
        source: '/fonts/:path*',
        destination: '/api/static/fonts/:path*',
      },
      {
        source: '/resume.pdf',
        destination: '/api/static/resume.pdf',
      },
      {
        source: '/resume.txt',
        destination: '/api/static/resume.txt',
      },
    ];
  },
  webpack: config => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@components': path.resolve(__dirname, 'src/components'),
      '@config': path.resolve(__dirname, 'src/config'),
      '@fonts': path.resolve(__dirname, 'src/fonts'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@images': path.resolve(__dirname, 'src/images'),
      '@lib': path.resolve(__dirname, 'src/lib'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@utils': path.resolve(__dirname, 'src/utils'),
    };
    return config;
  },
};

module.exports = nextConfig;
