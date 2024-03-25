/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  staticPageGenerationTimeout: 240,
  experimental: {
    esmExternals: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
  sassOptions: {
    additionalData: "@use '@styles/variables' as *;",
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    const rules = config.module.rules
      .find((rule) => typeof rule.oneOf === 'object')
      .oneOf.filter((rule) => Array.isArray(rule.use));

    rules.forEach((rule) => {
      rule.use.forEach((moduleLoader) => {
        if (
          moduleLoader.loader.includes('css-loader', 'dist') &&
          typeof moduleLoader.options.modules === 'object'
        ) {
          moduleLoader.options = {
            ...moduleLoader.options,
            modules: {
              ...moduleLoader.options.modules,
              exportLocalsConvention: 'camelCase',
            },
          };
        }
      });
    });

    return config;
  },
};

module.exports = nextConfig;
