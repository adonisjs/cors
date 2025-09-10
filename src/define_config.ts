/*
 * @adonisjs/cors
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { type CorsConfig } from './types.ts'

/**
 * Define config for the cors middleware with default values
 *
 * @param config - Partial CORS configuration to merge with defaults
 *
 * @example
 * ```ts
 * const corsConfig = defineConfig({
 *   origin: ['http://localhost:3000', 'https://example.com'],
 *   methods: ['GET', 'POST'],
 *   credentials: false
 * })
 * ```
 */
export function defineConfig(config: Partial<CorsConfig>): CorsConfig {
  return {
    enabled: true,
    origin: true,
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE'],
    headers: true,
    exposeHeaders: [],
    credentials: true,
    maxAge: 90,
    ...config,
  }
}
