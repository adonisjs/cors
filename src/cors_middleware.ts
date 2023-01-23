/*
 * @adonisjs/cors
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { HttpContext } from '@adonisjs/http-server'
import { NextFn } from '@adonisjs/http-server/types'
import type { CorsConfig } from './types.js'

/**
 * List of default exposed headers.
 */
const SIMPLE_EXPOSE_HEADERS = [
  'cache-control',
  'content-language',
  'content-type',
  'expires',
  'last-modified',
  'pragma',
]

/**
 * The Cors middleware class to handle preflight request as per the CORS
 * RFC https://www.w3.org/TR/cors/.
 *
 * This is a functional middleware and shared among all requests. So make
 * sure not to set request specific instance properties.
 */
export default class CorsMiddleware {
  #config: CorsConfig
  #isEnabled: (ctx: HttpContext) => boolean

  constructor(config: CorsConfig) {
    this.#config = this.#normalizeConfig(config)
    this.#isEnabled = this.#computeIsEnabled()
  }

  /**
   * Normlizes config object
   */
  #normalizeConfig(config: CorsConfig) {
    config.exposeHeaders = config.exposeHeaders.map((header) => header.toLowerCase())

    /**
     * If expose headers doesn't have extra headers, then empty the list
     */
    const hasExtraHeaders = config.exposeHeaders.find((header) => {
      return SIMPLE_EXPOSE_HEADERS.indexOf(header) === -1
    })
    if (!hasExtraHeaders) {
      config.exposeHeaders = []
    }

    return config
  }

  /**
   * Computes the isEnabled callback
   */
  #computeIsEnabled() {
    return typeof this.#config.enabled === 'function'
      ? this.#config.enabled
      : () => this.#config.enabled as boolean
  }

  /**
   * Computes the origin for the current request based upon the
   * user config.
   *
   * Origin match is always case sensitive
   */
  #computeResponseOrigin(origin: string, ctx: HttpContext): string | null {
    let allowedOrigins = this.#config.origin

    /**
     * If the `origin` value inside user config is a function, we
     * call that function and use the return value as the
     * new config value.
     */
    if (typeof allowedOrigins === 'function') {
      allowedOrigins = allowedOrigins(origin, ctx)
    }

    /**
     * If true, then allow the current origin
     */
    if (allowedOrigins === true) {
      return origin
    }

    /**
     * False, disallows all origins
     */
    if (allowedOrigins === false) {
      return null
    }

    /**
     * Wildcard allows the current origin. However, it also indicates
     * the browser that all origins are allowed.
     *
     * Fundamentaly `*` and `true` are not same, even though they both allows
     * the same origin.
     */
    if (allowedOrigins === '*') {
      /**
       * Setting `Access-Control-Allow-Origin=*` along with `Access-Control-Allow-Credentials=true`
       * isn't allowed. So in that case, we return the value of the current origin and not the
       * wildcard identifier.
       */
      return this.#config.credentials === true ? origin : '*'
    }

    /**
     * Find the matching origin, if value is an array
     */
    if (Array.isArray(allowedOrigins)) {
      if (allowedOrigins.find((allowedOrigin) => allowedOrigin === origin)) {
        return origin
      }
      return null
    }

    /**
     * Find the matching origin, if value is a comma seperated string
     */
    if (allowedOrigins.split(',').find((allowedOrigin) => allowedOrigin === origin)) {
      return origin
    }

    /**
     * Nothing is allowed
     */
    return null
  }

  /**
   * Returns an array of headers allowed based upon user config
   * and request headers.
   *
   * The array items are casted to lowercase for case insensitive
   * match.
   */
  #computedAllowedHeaders(headers: string[], ctx: HttpContext): string[] {
    let allowedHeaders = this.#config.headers

    /**
     * Compute allowed headers by calling the config function.
     */
    if (typeof allowedHeaders === 'function') {
      allowedHeaders = allowedHeaders(headers, ctx)
    }

    /**
     * Allow current set of headers, when `allowedHeaders = true`
     */
    if (allowedHeaders === true) {
      return headers.map((header) => header.toLowerCase())
    }

    /**
     * Disallow all headers
     */
    if (allowedHeaders === false) {
      return []
    }

    /**
     * Allow explicitly define headers as an array of comma seperated
     * string literal.
     */
    if (Array.isArray(allowedHeaders)) {
      return allowedHeaders.map((header) => header.toLowerCase())
    }

    return allowedHeaders.split(',').map((header) => header.toLowerCase())
  }

  /**
   * Sets the `Access-Control-Allow-Origin` header
   */
  #setOrigin(response: HttpContext['response'], allowedOrigin: string) {
    response.header('Access-Control-Allow-Origin', allowedOrigin)
  }

  /**
   * Setting `Access-Control-Expose-Headers` headers, when custom headers
   * are defined. If no custom headers are defined, then simple response
   * headers are used instead.
   */
  #setExposedHeaders(response: HttpContext['response']) {
    if (this.#config.exposeHeaders.length) {
      response.header('Access-Control-Expose-Headers', this.#config.exposeHeaders.join(','))
    }
  }

  /**
   * Allows `Access-Control-Allow-Credentials` when enabled inside the user
   * config.
   */
  #setCredentials(response: HttpContext['response']) {
    if (this.#config.credentials === true) {
      response.header('Access-Control-Allow-Credentials', 'true')
    }
  }

  /**
   * Set `Access-Control-Allow-Methods` header.
   */
  #setAllowMethods(response: HttpContext['response']) {
    response.header('Access-Control-Allow-Methods', this.#config.methods.join(','))
  }

  /**
   * Set `Access-Control-Allow-Headers` header.
   */
  #setAllowHeaders(response: HttpContext['response'], allowedHeaders: string[]) {
    response.header('Access-Control-Allow-Headers', allowedHeaders.join(','))
  }

  /**
   * Set `Access-Control-Max-Age` header.
   */
  #setMaxAge(response: HttpContext['response']) {
    if (this.#config.maxAge) {
      response.header('Access-Control-Max-Age', this.#config.maxAge)
    }
  }

  /**
   * Ends the preflight request with 204 status code
   */
  #endPreFlight(response: HttpContext['response']) {
    response.status(204).send(null)
  }

  /**
   * Handle HTTP request for CORS. This method is binded as a before hook
   * to the HTTP server.
   */
  async handle(ctx: HttpContext, next: NextFn) {
    /**
     * Return early when CORS is not enabled for the current request
     */
    if (!this.#isEnabled(ctx)) {
      return next()
    }

    const origin = ctx.request.header('origin')

    /**
     * If there is no origin header present, then let the user-agent handle
     * this situation, since the request is outside the scope of CORS.
     */
    if (!origin) {
      return next()
    }

    const allowedOrigin = this.#computeResponseOrigin(origin, ctx)

    if (ctx.request.method() === 'OPTIONS') {
      /**
       * If origin is not allowed, then we don't set any of the cors headers
       */
      if (!allowedOrigin) {
        this.#endPreFlight(ctx.response)
        return
      }

      /**
       * End the request, when `Access-Control-Request-Method` is missing or isn't
       * part of allowed methods.
       * https://www.w3.org/TR/cors/#http-access-control-request-method
       */
      const requestMethod = ctx.request.header('Access-Control-Request-Method')
      if (!requestMethod || this.#config.methods.indexOf(requestMethod) === -1) {
        this.#endPreFlight(ctx.response)
        return
      }

      /**
       * When `Access-Control-Request-Headers` header is missing or is empty, then
       * we subsitute that with an empty list.
       * https://www.w3.org/TR/cors/#http-access-control-request-headers
       */
      let requestHeaders: unknown = ctx.request.header('Access-Control-Request-Headers')
      if (requestHeaders && requestHeaders !== '') {
        requestHeaders = (requestHeaders as string).split(',')
      } else {
        requestHeaders = []
      }

      /**
       * Computing allowed headers array from the user config
       */
      const allowedHeaders = this.#computedAllowedHeaders(requestHeaders as string[], ctx)

      /**
       * Finding if all request `Access-Control-Request-Headers` falls under the
       * list of allowed headers inside user config
       */
      const headersMatches = (requestHeaders as string[]).every((header) => {
        if (header === 'origin') {
          return true
        }

        /**
         * Doing case insenstive match
         */
        return allowedHeaders.indexOf(header.toLowerCase()) > -1
      })

      /**
       * If headers test fails, then we need to end the request without setting
       * any headers (part of spec).
       * https://www.w3.org/TR/cors/#http-access-control-request-headers
       */
      if (headersMatches === false) {
        this.#endPreFlight(ctx.response)
        return
      }

      this.#setOrigin(ctx.response, allowedOrigin)
      this.#setCredentials(ctx.response)
      this.#setExposedHeaders(ctx.response)
      this.#setAllowMethods(ctx.response)
      this.#setAllowHeaders(ctx.response, allowedHeaders)
      this.#setMaxAge(ctx.response)
      this.#endPreFlight(ctx.response)
    } else {
      if (allowedOrigin) {
        this.#setOrigin(ctx.response, allowedOrigin)
        this.#setCredentials(ctx.response)
        this.#setExposedHeaders(ctx.response)
      }
      return next()
    }
  }
}
