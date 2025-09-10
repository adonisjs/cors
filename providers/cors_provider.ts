/*
 * @adonisjs/cors
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { type ApplicationService } from '@adonisjs/core/types'
import CorsMiddleware from '../src/cors_middleware.ts'
import { defineConfig } from '../src/define_config.ts'

/**
 * Cors provider configures the cors middleware using the config
 * file stored inside the "config/cors.ts" file.
 *
 * @example
 * ```ts
 * // In your provider registration
 * const corsProvider = new CorsProvider(app)
 * corsProvider.register()
 * ```
 */
export default class CorsProvider {
  /**
   * Create a new instance of CorsProvider
   *
   * @param app - The application service instance
   */
  constructor(protected app: ApplicationService) {}

  /**
   * Register the CORS middleware with the application container.
   * Binds the CorsMiddleware class with configuration from config/cors.ts
   *
   * @example
   * ```ts
   * // Called automatically by AdonisJS framework
   * corsProvider.register()
   * ```
   */
  register() {
    this.app.container.bind(CorsMiddleware, () => {
      const config = this.app.config.get<any>('cors', defineConfig({}))
      return new CorsMiddleware(config)
    })
  }
}
