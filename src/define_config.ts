/*
 * @adonisjs/cors
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { CorsConfig } from './types.js'

/**
 * Define config for the cors middleware
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
