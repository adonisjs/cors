/*
 * @adonisjs/cors
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { Assert } from '@japa/assert'
import type { IncomingMessage } from 'node:http'

import type { CorsConfig } from '../../src/types.js'
const corsConfig = {
  enabled: true,
  origin: true,
  methods: ['GET', 'PUT', 'POST'],
  headers: true,
  credentials: true,
  maxAge: 90,
  exposeHeaders: [],
}

const CORS_HEADERS = [
  'access-control-allow-origin',
  'access-control-allow-credentials',
  'access-control-expose-headers',
  'access-control-allow-headers',
  'access-control-allow-methods',
  'access-control-max-age',
]

/**
 * Fixtures that tests the cors functionality as
 * per https://www.w3.org/TR/cors/ RFC.
 */
export const specFixtures = [
  {
    title: 'do not handle request when request origin is not set',

    configureOptions(): CorsConfig {
      return Object.assign({}, corsConfig)
    },

    configureRequest() {},

    assertNormal(assert: Assert, res: any, nextCalled: boolean) {
      assert.notAnyProperties(res.headers, CORS_HEADERS)
      assert.isTrue(nextCalled)
    },

    assertOptions(assert: Assert, res: any, nextCalled: boolean) {
      assert.notAnyProperties(res.headers, CORS_HEADERS)
      assert.isTrue(nextCalled)
    },
  },
  {
    title: 'do not set any headers when request origin is not allowed',

    configureOptions(): CorsConfig {
      return Object.assign({}, corsConfig, {
        origin: 'adonisjs.com',
      })
    },

    configureRequest(req: IncomingMessage) {
      req.headers = {
        origin: 'foo.com',
      }
    },

    assertNormal(assert: Assert, res: any, nextCalled: boolean) {
      assert.notAnyProperties(res.headers, CORS_HEADERS)
      assert.isTrue(nextCalled)
    },

    assertOptions(assert: Assert, res: any, nextCalled: boolean) {
      assert.notAnyProperties(res.headers, CORS_HEADERS)
      assert.isFalse(nextCalled)
    },
  },
  {
    title: 'do not set any headers when all origins inside config are disallowed',

    configureOptions(): CorsConfig {
      return Object.assign({}, corsConfig, {
        origin: false,
      })
    },

    configureRequest(req: IncomingMessage) {
      req.headers = {
        origin: 'foo.com',
      }
    },

    assertNormal(assert: Assert, res: any, nextCalled: boolean) {
      assert.notAnyProperties(res.headers, CORS_HEADERS)
      assert.isTrue(nextCalled)
    },

    assertOptions(assert: Assert, res: any, nextCalled: boolean) {
      assert.notAnyProperties(res.headers, CORS_HEADERS)
      assert.isFalse(nextCalled)
    },
  },
  {
    title: 'do not set headers when origin case sensitive match fails',

    configureOptions(): CorsConfig {
      return Object.assign({}, corsConfig, {
        origin: 'foo.com',
      })
    },

    configureRequest(req: IncomingMessage) {
      req.headers = {
        origin: 'FOO.com',
      }
    },

    assertNormal(assert: Assert, res: any, nextCalled: boolean) {
      assert.notAnyProperties(res.headers, CORS_HEADERS)
      assert.isTrue(nextCalled)
    },

    assertOptions(assert: Assert, res: any, nextCalled: boolean) {
      assert.notAnyProperties(res.headers, CORS_HEADERS)
      assert.isFalse(nextCalled)
    },
  },
  {
    title: "do not set headers when request origin isn't allowed by the origins array in config",

    configureOptions(): CorsConfig {
      return Object.assign({}, corsConfig, {
        origin: ['foo.com'],
      })
    },

    configureRequest(req: IncomingMessage) {
      req.headers = {
        origin: 'bar.com',
      }
    },

    assertNormal(assert: Assert, res: any, nextCalled: boolean) {
      assert.notAnyProperties(res.headers, CORS_HEADERS)
      assert.isTrue(nextCalled)
    },

    assertOptions(assert: Assert, res: any, nextCalled: boolean) {
      assert.notAnyProperties(res.headers, CORS_HEADERS)
      assert.isFalse(nextCalled)
    },
  },
  {
    title: 'allow all origins when config origin is set to true',

    configureOptions(): CorsConfig {
      return Object.assign({}, corsConfig, {
        origin: true,
      })
    },

    configureRequest(req: IncomingMessage) {
      req.headers = {
        origin: 'foo.com',
      }
    },

    assertNormal(assert: Assert, res: any, nextCalled: boolean) {
      assert.notAnyProperties(
        res.headers,
        CORS_HEADERS.filter((key) => {
          return (
            ['access-control-allow-origin', 'access-control-allow-credentials'].indexOf(key) === -1
          )
        })
      )
      assert.isTrue(nextCalled)
    },

    assertOptions(assert: Assert, res: any, nextCalled: boolean) {
      assert.notAnyProperties(res.headers, CORS_HEADERS)
      assert.isFalse(nextCalled)
    },
  },
  {
    title: 'allow origin when request origin is in the allowed config origins array list',

    configureOptions(): CorsConfig {
      return Object.assign({}, corsConfig, {
        origin: ['foo.com', 'bar.com'],
      })
    },

    configureRequest(req: IncomingMessage) {
      req.headers = {
        origin: 'foo.com',
      }
    },

    assertNormal(assert: Assert, res: any, nextCalled: boolean) {
      assert.notAnyProperties(
        res.headers,
        CORS_HEADERS.filter((key) => {
          return (
            ['access-control-allow-origin', 'access-control-allow-credentials'].indexOf(key) === -1
          )
        })
      )
      assert.isTrue(nextCalled)
    },

    assertOptions(assert: Assert, res: any, nextCalled: boolean) {
      assert.notAnyProperties(res.headers, CORS_HEADERS)
      assert.isFalse(nextCalled)
    },
  },
  {
    title: 'allow origin when request origin is in allowed config origins comma seperated list',

    configureOptions(): CorsConfig {
      return Object.assign({}, corsConfig, {
        origin: 'foo.com,bar.com',
      })
    },

    configureRequest(req: IncomingMessage) {
      req.headers = {
        origin: 'foo.com',
      }
    },

    assertNormal(assert: Assert, res: any, nextCalled: boolean) {
      assert.notAnyProperties(
        res.headers,
        CORS_HEADERS.filter((key) => {
          return (
            ['access-control-allow-origin', 'access-control-allow-credentials'].indexOf(key) === -1
          )
        })
      )
      assert.isTrue(nextCalled)
    },

    assertOptions(assert: Assert, res: any, nextCalled: boolean) {
      assert.notAnyProperties(res.headers, CORS_HEADERS)
      assert.isFalse(nextCalled)
    },
  },
  {
    title: 'allow origin when config origin callback returns true',

    configureOptions(): CorsConfig {
      return Object.assign({}, corsConfig, {
        origin: () => true,
      })
    },

    configureRequest(req: IncomingMessage) {
      req.headers = {
        origin: 'foo.com',
      }
    },

    assertNormal(assert: Assert, res: any, nextCalled: boolean) {
      assert.notAnyProperties(
        res.headers,
        CORS_HEADERS.filter((key) => {
          return (
            ['access-control-allow-origin', 'access-control-allow-credentials'].indexOf(key) === -1
          )
        })
      )
      assert.isTrue(nextCalled)
    },

    assertOptions(assert: Assert, res: any, nextCalled: boolean) {
      assert.notAnyProperties(res.headers, CORS_HEADERS)
      assert.isFalse(nextCalled)
    },
  },
  {
    title: 'set current origin when using wildcard identifier with credentails=true',

    configureOptions(): CorsConfig {
      return Object.assign({}, corsConfig, {
        origin: '*',
      })
    },

    configureRequest(req: IncomingMessage) {
      req.headers = {
        origin: 'foo.com',
      }
    },

    assertNormal(assert: Assert, res: any, nextCalled: boolean) {
      assert.notAnyProperties(
        res.headers,
        CORS_HEADERS.filter((key) => {
          return (
            ['access-control-allow-origin', 'access-control-allow-credentials'].indexOf(key) === -1
          )
        })
      )
      assert.equal(res.headers['access-control-allow-origin'], 'foo.com')
      assert.isTrue(nextCalled)
    },

    assertOptions(assert: Assert, res: any, nextCalled: boolean) {
      assert.notAnyProperties(res.headers, CORS_HEADERS)
      assert.isFalse(nextCalled)
    },
  },
  {
    title: 'set wildcard when using wildcard identifier with credentails=false',

    configureOptions(): CorsConfig {
      return Object.assign({}, corsConfig, {
        origin: '*',
        credentials: false,
      })
    },

    configureRequest(req: IncomingMessage) {
      req.headers = {
        origin: 'foo.com',
      }
    },

    assertNormal(assert: Assert, res: any, nextCalled: boolean) {
      assert.notAnyProperties(
        res.headers,
        CORS_HEADERS.filter((key) => {
          return key !== 'access-control-allow-origin'
        })
      )
      assert.equal(res.headers['access-control-allow-origin'], '*')
      assert.isTrue(nextCalled)
    },

    assertOptions(assert: Assert, res: any, nextCalled: boolean) {
      assert.notAnyProperties(res.headers, CORS_HEADERS)
      assert.isFalse(nextCalled)
    },
  },
  {
    title: 'set expose headers when defined',

    configureOptions(): CorsConfig {
      return Object.assign({}, corsConfig, {
        origin: '*',
        exposeHeaders: ['X-Adonis'],
      })
    },

    configureRequest(req: IncomingMessage) {
      req.headers = {
        origin: 'foo.com',
      }
    },

    assertNormal(assert: Assert, res: any, nextCalled: boolean) {
      assert.notAnyProperties(
        res.headers,
        CORS_HEADERS.filter((key) => {
          return (
            [
              'access-control-allow-origin',
              'access-control-allow-credentials',
              'access-control-expose-headers',
            ].indexOf(key) === -1
          )
        })
      )

      assert.equal(res.headers['access-control-allow-origin'], 'foo.com')
      assert.equal(res.headers['access-control-expose-headers'], 'x-adonis')
      assert.isTrue(nextCalled)
    },

    assertOptions(assert: Assert, res: any, nextCalled: boolean) {
      assert.notAnyProperties(res.headers, CORS_HEADERS)
      assert.isFalse(nextCalled)
    },
  },
  {
    title: 'set required preflight headers when "access-control-request-method" exists',

    configureOptions(): CorsConfig {
      return Object.assign({}, corsConfig, {
        origin: true,
      })
    },

    configureRequest(req: IncomingMessage) {
      req.headers = {
        'origin': 'foo.com',
        'access-control-request-method': 'GET',
      }
    },

    assertNormal(assert: Assert, res: any, nextCalled: boolean) {
      assert.notAnyProperties(
        res.headers,
        CORS_HEADERS.filter((key) => {
          return (
            ['access-control-allow-origin', 'access-control-allow-credentials'].indexOf(key) === -1
          )
        })
      )
      assert.isTrue(nextCalled)
    },

    assertOptions(assert: Assert, res: any, nextCalled: boolean) {
      assert.notAnyProperties(
        res.headers,
        CORS_HEADERS.filter((key) => {
          return ['access-control-expose-headers'].indexOf(key) > -1
        })
      )
      assert.isFalse(nextCalled)
    },
  },
  {
    title: "do not set preflight headers when access-control-request-method isn't allowed",

    configureOptions(): CorsConfig {
      return Object.assign({}, corsConfig, {
        origin: true,
      })
    },

    configureRequest(req: IncomingMessage) {
      req.headers = {
        'origin': 'foo.com',
        'access-control-request-method': 'DELETE',
      }
    },

    assertNormal(assert: Assert, res: any, nextCalled: boolean) {
      assert.notAnyProperties(
        res.headers,
        CORS_HEADERS.filter((key) => {
          return (
            ['access-control-allow-origin', 'access-control-allow-credentials'].indexOf(key) === -1
          )
        })
      )
      assert.isTrue(nextCalled)
    },

    assertOptions(assert: Assert, res: any, nextCalled: boolean) {
      assert.notAnyProperties(res.headers, CORS_HEADERS)
      assert.isFalse(nextCalled)
    },
  },
  {
    title:
      'do not set preflight headers config disallows all "access-control-request-method" methods',

    configureOptions(): CorsConfig {
      return Object.assign({}, corsConfig, {
        origin: true,
        headers: false,
      })
    },

    configureRequest(req: IncomingMessage) {
      req.headers = {
        'origin': 'foo.com',
        'access-control-request-method': 'GET',
        'access-control-request-headers': 'X-Adonis',
      }
    },

    assertNormal(assert: Assert, res: any, nextCalled: boolean) {
      assert.notAnyProperties(
        res.headers,
        CORS_HEADERS.filter((key) => {
          return (
            ['access-control-allow-origin', 'access-control-allow-credentials'].indexOf(key) === -1
          )
        })
      )
      assert.isTrue(nextCalled)
    },

    assertOptions(assert: Assert, res: any, nextCalled: boolean) {
      assert.notAnyProperties(res.headers, CORS_HEADERS)
      assert.isFalse(nextCalled)
    },
  },
  {
    title:
      'do not set preflight headers when any of the access-control-request-headers are disallowed',

    configureOptions(): CorsConfig {
      return Object.assign({}, corsConfig, {
        origin: true,
        headers: ['cache-control'],
      })
    },

    configureRequest(req: IncomingMessage) {
      req.headers = {
        'origin': 'foo.com',
        'access-control-request-method': 'GET',
        'access-control-request-headers': 'X-Adonis',
      }
    },

    assertNormal(assert: Assert, res: any, nextCalled: boolean) {
      assert.notAnyProperties(
        res.headers,
        CORS_HEADERS.filter((key) => {
          return (
            ['access-control-allow-origin', 'access-control-allow-credentials'].indexOf(key) === -1
          )
        })
      )
      assert.isTrue(nextCalled)
    },

    assertOptions(assert: Assert, res: any, nextCalled: boolean) {
      assert.notAnyProperties(res.headers, CORS_HEADERS)
      assert.isFalse(nextCalled)
    },
  },
  {
    title: 'set preflight headers when all of the request headers are allowed',

    configureOptions(): CorsConfig {
      return Object.assign({}, corsConfig, {
        origin: true,
        headers: true,
      })
    },

    configureRequest(req: IncomingMessage) {
      req.headers = {
        'origin': 'foo.com',
        'access-control-request-method': 'GET',
        'access-control-request-headers': 'X-Adonis',
      }
    },

    assertNormal(assert: Assert, res: any, nextCalled: boolean) {
      assert.notAnyProperties(
        res.headers,
        CORS_HEADERS.filter((key) => {
          return (
            ['access-control-allow-origin', 'access-control-allow-credentials'].indexOf(key) === -1
          )
        })
      )
      assert.isTrue(nextCalled)
    },

    assertOptions(assert: Assert, res: any, nextCalled: boolean) {
      assert.notAnyProperties(
        res.headers,
        CORS_HEADERS.filter((key) => {
          return ['access-control-expose-headers'].indexOf(key) > -1
        })
      )

      assert.equal(res.headers['access-control-allow-headers'], 'x-adonis')
      assert.isFalse(nextCalled)
    },
  },
  {
    title: 'set preflight headers when request headers is in the list of allowed headers',

    configureOptions(): CorsConfig {
      return Object.assign({}, corsConfig, {
        origin: true,
        headers: ['X-Adonis'],
      })
    },

    configureRequest(req: IncomingMessage) {
      req.headers = {
        'origin': 'foo.com',
        'access-control-request-method': 'GET',
        'access-control-request-headers': 'X-Adonis',
      }
    },

    assertNormal(assert: Assert, res: any, nextCalled: boolean) {
      assert.notAnyProperties(
        res.headers,
        CORS_HEADERS.filter((key) => {
          return (
            ['access-control-allow-origin', 'access-control-allow-credentials'].indexOf(key) === -1
          )
        })
      )
      assert.isTrue(nextCalled)
    },

    assertOptions(assert: Assert, res: any, nextCalled: boolean) {
      assert.notAnyProperties(
        res.headers,
        CORS_HEADERS.filter((key) => {
          return ['access-control-expose-headers'].indexOf(key) > -1
        })
      )

      assert.equal(res.headers['access-control-allow-headers'], 'x-adonis')
      assert.isFalse(nextCalled)
    },
  },
  {
    title: 'set preflight headers when request headers is in the list of comma seperated list',

    configureOptions(): CorsConfig {
      return Object.assign({}, corsConfig, {
        origin: true,
        headers: 'X-Adonis,X-Time',
      })
    },

    configureRequest(req: IncomingMessage) {
      req.headers = {
        'origin': 'foo.com',
        'access-control-request-method': 'GET',
        'access-control-request-headers': 'origin,X-Adonis',
      }
    },

    assertNormal(assert: Assert, res: any, nextCalled: boolean) {
      assert.notAnyProperties(
        res.headers,
        CORS_HEADERS.filter((key) => {
          return (
            ['access-control-allow-origin', 'access-control-allow-credentials'].indexOf(key) === -1
          )
        })
      )
      assert.isTrue(nextCalled)
    },

    assertOptions(assert: Assert, res: any, nextCalled: boolean) {
      assert.notAnyProperties(
        res.headers,
        CORS_HEADERS.filter((key) => {
          return ['access-control-expose-headers'].indexOf(key) > -1
        })
      )

      assert.equal(res.headers['access-control-allow-headers'], 'x-adonis,x-time')
      assert.isFalse(nextCalled)
    },
  },
  {
    title: 'set preflight headers when case insensitive match passes',

    configureOptions(): CorsConfig {
      return Object.assign({}, corsConfig, {
        origin: true,
        headers: ['x-adonis'],
      })
    },

    configureRequest(req: IncomingMessage) {
      req.headers = {
        'origin': 'foo.com',
        'access-control-request-method': 'GET',
        'access-control-request-headers': 'X-Adonis',
      }
    },

    assertNormal(assert: Assert, res: any, nextCalled: boolean) {
      assert.notAnyProperties(
        res.headers,
        CORS_HEADERS.filter((key) => {
          return (
            ['access-control-allow-origin', 'access-control-allow-credentials'].indexOf(key) === -1
          )
        })
      )
      assert.isTrue(nextCalled)
    },

    assertOptions(assert: Assert, res: any, nextCalled: boolean) {
      assert.notAnyProperties(
        res.headers,
        CORS_HEADERS.filter((key) => {
          return ['access-control-expose-headers'].indexOf(key) > -1
        })
      )

      assert.equal(res.headers['access-control-allow-headers'], 'x-adonis')
      assert.isFalse(nextCalled)
    },
  },
  {
    title: 'set allow-headers when header match passes',

    configureOptions(): CorsConfig {
      return Object.assign({}, corsConfig, {
        origin: true,
        headers: ['x-adonis', 'x-foo', 'x-bar'],
      })
    },

    configureRequest(req: IncomingMessage) {
      req.headers = {
        'origin': 'foo.com',
        'access-control-request-method': 'GET',
        'access-control-request-headers': 'X-Adonis',
      }
    },

    assertNormal(assert: Assert, res: any, nextCalled: boolean) {
      assert.notAnyProperties(
        res.headers,
        CORS_HEADERS.filter((key) => {
          return (
            ['access-control-allow-origin', 'access-control-allow-credentials'].indexOf(key) === -1
          )
        })
      )
      assert.isTrue(nextCalled)
    },

    assertOptions(assert: Assert, res: any, nextCalled: boolean) {
      assert.notAnyProperties(
        res.headers,
        CORS_HEADERS.filter((key) => {
          return ['access-control-expose-headers'].indexOf(key) > -1
        })
      )

      assert.equal(res.headers['access-control-allow-headers'], 'x-adonis,x-foo,x-bar')
      assert.isFalse(nextCalled)
    },
  },
  {
    title: 'set allow-headers when headers config function returns true',

    configureOptions(): CorsConfig {
      return Object.assign({}, corsConfig, {
        origin: true,
        headers: () => true,
      })
    },

    configureRequest(req: IncomingMessage) {
      req.headers = {
        'origin': 'foo.com',
        'access-control-request-method': 'GET',
        'access-control-request-headers': 'X-Adonis',
      }
    },

    assertNormal(assert: Assert, res: any, nextCalled: boolean) {
      assert.notAnyProperties(
        res.headers,
        CORS_HEADERS.filter((key) => {
          return (
            ['access-control-allow-origin', 'access-control-allow-credentials'].indexOf(key) === -1
          )
        })
      )
      assert.isTrue(nextCalled)
    },

    assertOptions(assert: Assert, res: any, nextCalled: boolean) {
      assert.notAnyProperties(
        res.headers,
        CORS_HEADERS.filter((key) => {
          return ['access-control-expose-headers'].indexOf(key) > -1
        })
      )

      assert.equal(res.headers['access-control-allow-headers'], 'x-adonis')
      assert.isFalse(nextCalled)
    },
  },
  {
    title: 'set max age when defined',

    configureOptions(): CorsConfig {
      return Object.assign({}, corsConfig, {
        origin: true,
        headers: () => true,
        maxAge: 10,
      })
    },

    configureRequest(req: IncomingMessage) {
      req.headers = {
        'origin': 'foo.com',
        'access-control-request-method': 'GET',
        'access-control-request-headers': 'X-Adonis',
      }
    },

    assertNormal(assert: Assert, res: any, nextCalled: boolean) {
      assert.notAnyProperties(
        res.headers,
        CORS_HEADERS.filter((key) => {
          return (
            ['access-control-allow-origin', 'access-control-allow-credentials'].indexOf(key) === -1
          )
        })
      )
      assert.isTrue(nextCalled)
    },

    assertOptions(assert: Assert, res: any, nextCalled: boolean) {
      assert.notAnyProperties(
        res.headers,
        CORS_HEADERS.filter((key) => {
          return ['access-control-expose-headers'].indexOf(key) > -1
        })
      )

      assert.equal(res.headers['access-control-max-age'], '10')
      assert.isFalse(nextCalled)
    },
  },
  {
    title: 'set expose headers when defined',

    configureOptions(): CorsConfig {
      return Object.assign({}, corsConfig, {
        origin: true,
        headers: () => true,
        exposeHeaders: ['x-response-time'],
        maxAge: 10,
      })
    },

    configureRequest(req: IncomingMessage) {
      req.headers = {
        'origin': 'foo.com',
        'access-control-request-method': 'GET',
        'access-control-request-headers': 'X-Adonis',
      }
    },

    assertNormal(assert: Assert, res: any, nextCalled: boolean) {
      assert.notAnyProperties(
        res.headers,
        CORS_HEADERS.filter((key) => {
          return (
            [
              'access-control-allow-origin',
              'access-control-allow-credentials',
              'access-control-expose-headers',
            ].indexOf(key) === -1
          )
        })
      )
      assert.isTrue(nextCalled)
    },

    assertOptions(assert: Assert, res: any, nextCalled: boolean) {
      assert.properties(res.headers, CORS_HEADERS)
      assert.equal(res.headers['access-control-expose-headers'], 'x-response-time')
      assert.isFalse(nextCalled)
    },
  },
  {
    title: 'do not set any headers when cors is disabled',

    configureOptions(): CorsConfig {
      return Object.assign({}, corsConfig, {
        enabled: false,
      })
    },

    configureRequest(req: IncomingMessage) {
      req.headers = {
        origin: 'foo.com',
      }
    },

    assertNormal(assert: Assert, res: any, nextCalled: boolean) {
      assert.notAnyProperties(res.headers, CORS_HEADERS)
      assert.isTrue(nextCalled)
    },

    assertOptions(assert: Assert, res: any, nextCalled: boolean) {
      assert.notAnyProperties(res.headers, CORS_HEADERS)
      assert.isTrue(nextCalled)
    },
  },
  {
    title: 'do not set any headers when cors is disabled using a runtime function',

    configureOptions(): CorsConfig {
      return Object.assign({}, corsConfig, {
        enabled: () => false,
      })
    },

    configureRequest(req: IncomingMessage) {
      req.headers = {
        origin: 'foo.com',
      }
    },

    assertNormal(assert: Assert, res: any, nextCalled: boolean) {
      assert.notAnyProperties(res.headers, CORS_HEADERS)
      assert.isTrue(nextCalled)
    },

    assertOptions(assert: Assert, res: any, nextCalled: boolean) {
      assert.notAnyProperties(res.headers, CORS_HEADERS)
      assert.isTrue(nextCalled)
    },
  },
]
