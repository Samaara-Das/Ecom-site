// @ts-nocheck
/**
 * Test auth login via module directly (bypasses HTTP)
 * Run with: npx medusa exec ./src/scripts/test-auth-login.ts
 */

import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function testAuthLogin({ container }: { container: any }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const authModule = container.resolve(Modules.AUTH)

  logger.info("=== test-auth-login: Starting ===")

  // Test authenticate for m.alrashidi
  try {
    const result = await authModule.authenticate("emailpass", {
      body: { email: "m.alrashidi@gmail.com", password: "Demo1234!" },
      authScope: "store",
    } as any)
    logger.info(`Auth result: ${JSON.stringify(result)}`)
  } catch (err) {
    logger.error(`Auth error: ${err instanceof Error ? `${err.message}\n${(err as any).stack}` : err}`)
  }

  // Check provider_metadata for the identity
  try {
    const ids = await authModule.listAuthIdentities({
      provider_identities: { entity_id: "m.alrashidi@gmail.com", provider: "emailpass" },
    })
    for (const id of ids || []) {
      logger.info(`Identity: ${id.id}, app_metadata: ${JSON.stringify(id.app_metadata)}`)
      for (const pi of (id as any).provider_identities || []) {
        logger.info(`  provider_identity: entity_id=${pi.entity_id}, provider_metadata keys=${JSON.stringify(Object.keys(pi.provider_metadata ?? {}))}`)
        if (pi.provider_metadata?.password) {
          logger.info(`  password hash (first 30 chars): ${pi.provider_metadata.password.slice(0, 30)}...`)
        }
      }
    }
  } catch (err) {
    logger.error(`List error: ${err instanceof Error ? err.message : err}`)
  }

  logger.info("=== test-auth-login: Done ===")
}
