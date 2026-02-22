/**
 * Debug auth module state and test direct registration
 * Run with: npx medusa exec ./src/scripts/debug-auth.ts
 */

import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function debugAuth({ container }: { container: any }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const authModule = container.resolve(Modules.AUTH)

  logger.info("=== debug-auth: Starting ===")

  // 1. List all existing auth identities (limited)
  try {
    const identities = await authModule.listAuthIdentities({}, { take: 5 })
    logger.info(`Total identities (sample): ${identities?.length ?? 0}`)
    for (const id of identities || []) {
      logger.info(`  - ${id.id}: provider_identities=${JSON.stringify(id.provider_identities?.map((p: any) => ({ entity_id: p.entity_id, provider: p.provider })))}`)
    }
  } catch (err) {
    logger.error(`listAuthIdentities failed: ${err instanceof Error ? err.message : err}`)
  }

  // 2. Try direct register via the module (same as HTTP endpoint)
  logger.info("\n--- Testing direct module register ---")
  try {
    const result = await authModule.register("emailpass", {
      body: { email: "debug.test.xyz@example.com", password: "Demo1234!" },
      authScope: "store",
    } as any)
    logger.info(`Register result: ${JSON.stringify(result)}`)
  } catch (err) {
    logger.error(`Register error: ${err instanceof Error ? `${err.message}\n${(err as any).stack}` : err}`)
  }

  // 3. Check DB for emailpass identities for our customers
  logger.info("\n--- Checking emailpass identities for seeded customers ---")
  const sampleEmails = ["m.alrashidi@gmail.com", "fatima.alsabah@hotmail.com", "brand.new.test@example.com"]
  for (const email of sampleEmails) {
    try {
      const ids = await authModule.listAuthIdentities({
        provider_identities: { entity_id: email, provider: "emailpass" },
      })
      logger.info(`  ${email}: ${ids?.length ?? 0} identities`)
      if (ids?.length) {
        logger.info(`    app_metadata: ${JSON.stringify(ids[0].app_metadata)}`)
        logger.info(`    provider_metadata keys: ${JSON.stringify(Object.keys(ids[0].provider_identities?.[0]?.provider_metadata ?? {}))}`)
      }
    } catch (err) {
      logger.warn(`  ${email}: ${err instanceof Error ? err.message : err}`)
    }
  }

  logger.info("=== debug-auth: Done ===")
}
