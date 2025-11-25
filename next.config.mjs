import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@lobehub/ui', 'antd-style'],
  
  // 启用 standalone 输出模式以优化 Docker 部署
  output: 'standalone',
  
  // 配置 Webpack 支持 WebAssembly
  webpack: (config, { isServer }) => {
    // 启用 WebAssembly 支持
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };

    // 配置 WASM 文件处理
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/async',
    });

    // 仅在客户端配置 WASM 输出
    if (!isServer) {
      config.output.webassemblyModuleFilename = 'static/wasm/[modulehash].wasm';
    }

    // 确保 WASM 文件被正确处理
    config.resolve.extensions.push('.wasm');

    return config;
  },
};

export default withNextIntl(nextConfig);

