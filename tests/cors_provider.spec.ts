/*
 * @adonisjs/cors
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { IgnitorFactory } from '@adonisjs/core/factories'
import CorsMiddleware from '../src/cors_middleware.js'

const BASE_URL = new URL('./tmp/', import.meta.url)

test.group('Cors provider', () => {
  test('construct middleware using container', async ({ assert }) => {
    const ignitor = new IgnitorFactory()
      .withCoreProviders()
      .withCoreConfig()
      .merge({
        config: {
          cors: {
            enabled: true,
            methods: ['GET', 'PUT', 'POST'],
            exposeHeaders: [],
          },
        },
        rcFileContents: {
          providers: [() => import('../providers/cors_provider.js')],
        },
      })
      .create(BASE_URL, {
        importer: (filePath) => {
          if (filePath.startsWith('./') || filePath.startsWith('../')) {
            return import(new URL(filePath, BASE_URL).href)
          }

          return import(filePath)
        },
      })

    const app = ignitor.createApp('web')
    await app.init()
    await app.boot()

    await assert.doesNotRejects(() => app.container.make(CorsMiddleware))
    assert.instanceOf(await app.container.make(CorsMiddleware), CorsMiddleware)
  })
})
