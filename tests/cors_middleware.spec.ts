/*
 * @adonisjs/cors
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import supertest from 'supertest'
import { test } from '@japa/runner'
import { createServer } from 'node:http'
import {
  RequestFactory,
  ResponseFactory,
  HttpContextFactory,
} from '@adonisjs/http-server/factories'

import { specFixtures } from './fixtures/cors.js'
import { CorsMiddleware } from '../src/cors_middleware.js'

test.group('Cors', () => {
  test('{title}')
    .with(specFixtures)
    .run(async ({ assert }, fixture) => {
      let nextCalled = false
      const server = createServer(async (req, res) => {
        const cors = new CorsMiddleware(fixture.configureOptions())
        fixture.configureRequest(req)

        const request = new RequestFactory().merge({ req, res }).create()
        const response = new ResponseFactory().merge({ req, res }).create()
        const ctx = new HttpContextFactory().merge({ request, response }).create()

        nextCalled = false
        await cors.handle(ctx, () => {
          nextCalled = true
        })

        if (!ctx.response.hasLazyBody) {
          ctx.response.send(null)
        }
        ctx.response.finish()
      })

      const resOptions = await supertest(server).options('/')
      fixture.assertOptions(assert, resOptions, nextCalled)

      const res = await supertest(server).get('/')
      fixture.assertNormal(assert, res, nextCalled)
    })
})
