import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dir = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@nimiq/identicons'],
  outputFileTracingRoot: dir,
  devIndicators: false,
}
export default nextConfig
