/*
 * @adonisjs/cors
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { stubsRoot } from './stubs/main.js'
import type Configure from '@adonisjs/core/commands/configure'

/**
 * Configures the package
 */
export async function configure(command: Configure) {
  const codemods = await command.createCodemods()
  await codemods.makeUsingStub(stubsRoot, 'config/cors.stub', {})

  /**
   * Register middleware
   */
  await codemods.registerMiddleware('server', [
    {
      path: '@adonisjs/cors/cors_middleware',
    },
  ])

  /**
   * Register service provider
   */
  await codemods.updateRcFile((rcFile) => {
    rcFile.addProvider('@adonisjs/cors/cors_provider')
  })
}
