/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  experimental: {
      // Caching all page.jsx files on the client for 5 minutes.
      // Resulting in immediate navigation and no loading time.
      staleTimes: {
          dynamic: 300,
          static: 300
      }
  },
  images: {
      remotePatterns: [
          { protocol: 'https', hostname: '**.githubusercontent.com' },
          { protocol: 'https', hostname: '**.github.com' },
          { protocol: 'https', hostname: 'turbo.build' }
      ],
  },
  env: {},
};

async function getConfig() {
  const response = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `token ${process.env.GH_TOKEN}`,
    },
    next: {
      // No revalidation needed. It is fine to get it on build time and use it forever.
      tags: ['github', 'github-username'],
    }
  });
  const data = await response.json();
  nextConfig.env = {
    GITHUB_USERNAME: data.login,
  };
  return nextConfig;
}

export default getConfig();