/*
 * @adonisjs/cors
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Application } from '@adonisjs/application'
import CorsMiddleware from '../src/cors_middleware.js'

export default class CorsProvider {
  constructor(protected app: Application<any>) {}

  register() {
    this.app.container.bind(CorsMiddleware, () => {
      const config = this.app.config.get<any>('cors', {})
      return new CorsMiddleware(config)
    })
  }
}
