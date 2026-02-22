/**
 * Fix customer password auth identities.
 * Deletes existing emailpass auth identities for seeded customers
 * and re-creates them using Medusa's internal registration flow.
 *
 * Run with: npx medusa exec ./src/scripts/fix-customer-passwords.ts
 */

import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

const CUSTOMER_EMAILS = [
  "m.alrashidi@gmail.com",
  "fatima.alsabah@hotmail.com",
  "ahmed.almuftah@gmail.com",
  "nour.alharbi@gmail.com",
  "k.alenezi@hotmail.com",
  "maryam.aljassem@gmail.com",
  "a.almutairi@gmail.com",
  "sara.alkandari@hotmail.com",
  "omar.alajmi@gmail.com",
  "hessa.alfahad@gmail.com",
  "zainab.alkhatib@gmail.com",
  "faisal.almarzouk@hotmail.com",
  "dana.alsultani@gmail.com",
  "yousef.albahar@gmail.com",
  "reem.alghanem@hotmail.com",
  "raj.patel.kw@gmail.com",
  "priya.sharma.kw@gmail.com",
  "j.mitchell.kuwait@gmail.com",
  "sarah.johnson.kw@gmail.com",
  "carlos.rodriguez.kw@gmail.com",
  "maria.santos.kw@gmail.com",
  "david.kim.kuwait@gmail.com",
  "emily.watson.kw@gmail.com",
  "tom.anderson.kw@gmail.com",
  "li.chen.kuwait@gmail.com",
]

export default async function fixCustomerPasswords({
  container,
}: {
  container: any
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const authModule = container.resolve(Modules.AUTH)

  logger.info("=== fix-customer-passwords: Starting ===")

  let fixed = 0
  let errors = 0

  for (const email of CUSTOMER_EMAILS) {
    try {
      // Find existing auth identities
      const identities = await authModule.listAuthIdentities({
        provider_identities: { entity_id: email, provider: "emailpass" },
      })

      for (const identity of identities || []) {
        try {
          await authModule.deleteAuthIdentities([identity.id])
          logger.info(`  [DEL] Deleted auth identity for ${email} (${identity.id})`)
        } catch (delErr) {
          logger.warn(`  [WARN] Could not delete identity ${identity.id}: ${delErr instanceof Error ? delErr.message : delErr}`)
        }
      }

      // Re-create using Medusa's auth provider (which handles hashing correctly)
      const result = await authModule.authenticate("emailpass", {
        email,
        password: "Demo1234!",
        authScope: "store",
      } as any)

      // If authenticate fails (expected since no identity), use create flow
      logger.info(`  [INFO] Auth attempt for ${email}: ${JSON.stringify(result).slice(0, 100)}`)
    } catch (err) {
      logger.warn(`  [${email}]: ${err instanceof Error ? err.message : err}`)
    }
  }

  // Alternative: use the provider directly to create identities with correct hash
  logger.info("")
  logger.info("=== Trying direct provider registration ===")

  for (const email of CUSTOMER_EMAILS) {
    try {
      const result = await (authModule as any).register("emailpass", {
        email,
        password: "Demo1234!",
      })
      logger.info(`  [OK] Registered ${email}: ${JSON.stringify(result).slice(0, 80)}`)
      fixed++
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      if (msg.includes("exists") || msg.includes("duplicate") || msg.includes("unique")) {
        logger.info(`  [EXISTS] ${email} — already has valid credentials`)
      } else {
        logger.warn(`  [ERR] ${email}: ${msg}`)
        errors++
      }
    }
  }

  logger.info(`=== fix-customer-passwords: Done — fixed ${fixed}, errors ${errors} ===`)
  return { fixed, errors }
}
