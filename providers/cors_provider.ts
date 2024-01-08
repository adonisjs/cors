/*
 * @adonisjs/cors
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ApplicationService } from '@adonisjs/core/types'
import CorsMiddleware from '../src/cors_middleware.js'
import { defineConfig } from '../src/define_config.js'

/**
 * Cors provider configures the cors middleware using the config
 * file stored inside the "config/cors.ts" file.
 */
export default class CorsProvider {
  constructor(protected app: ApplicationService) {}

  register() {
    this.app.container.bind(CorsMiddleware, () => {
      const config = this.app.config.get<any>('cors', defineConfig({}))
      return new CorsMiddleware(config)
    })
  }
}
