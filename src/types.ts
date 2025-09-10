/*
 * @adonisjs/cors
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { HttpContext } from '@adonisjs/core/http'

type CorsOriginValues = boolean | string | string[]
type CorsHeaderValues = CorsOriginValues

/**
 * Config for setting the cors middleware
 */
export type CorsConfig = {
  /**
   * Enable or disable CORS middleware. A function can be defined to disable CORS
   * based upon the current request
   */
  enabled: boolean | ((ctx: HttpContext) => boolean)

  /**
   * Origins to allow.
   *
   * - The value can be a boolean to allow/disallow all origins
   * - An explicit list of origins defined as an array of strings
   * - Or a callback function to define origins by inspecting the current request
   */
  origin: CorsOriginValues | ((origin: string, ctx: HttpContext) => CorsOriginValues)

  /**
   * Cors HTTP methods to allow
   */
  methods: string[]

  /**
   * Headers to allow for CORS requests.
   *
   * - The value can be a boolean to allow/disallow all headers
   * - An explicit list of headers defined as an array of strings
   * - Or a callback function to define headers by inspecting the current request
   */
  headers: CorsHeaderValues | ((headers: string[], ctx: HttpContext) => CorsHeaderValues)

  /**
   * Headers to expose to the client
   */
  exposeHeaders: string[]

  /**
   * Whether to allow credentials (cookies, authorization headers, etc.)
   */
  credentials: boolean

  /**
   * Maximum age in seconds for preflight cache
   */
  maxAge: number
}
