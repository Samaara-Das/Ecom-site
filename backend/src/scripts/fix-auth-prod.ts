// @ts-nocheck
/**
 * Production auth fix: updates existing customer auth identities
 * to use scrypt-kdf password hashing (Medusa's format).
 *
 * The seed-customers-v2.ts script uses Node's crypto.scrypt which is
 * incompatible with Medusa's emailpass provider (uses scrypt-kdf).
 * This script deletes the wrong-format identity and re-registers using
 * authModule.register() which uses the correct scrypt-kdf format.
 *
 * Run with: npx medusa exec ./src/scripts/fix-auth-prod.ts
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

const DEMO_PASSWORD = "Demo1234!"

export default async function fixAuthProd({ container }: { container: any }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const authModule = container.resolve(Modules.AUTH)
  const customerModule = container.resolve(Modules.CUSTOMER)

  logger.info("=== fix-auth-prod: Starting ===")

  let fixed = 0
  let errors = 0

  for (const email of CUSTOMER_EMAILS) {
    try {
      // Find the customer record
      const customers = await customerModule.listCustomers({ email })
      if (!customers?.length) {
        logger.warn(`  [SKIP] No customer found for ${email}`)
        continue
      }
      const customer = customers[0]

      // Find existing auth identity
      const existingIdentities = await authModule.listAuthIdentities({
        provider_identities: { entity_id: email, provider: "emailpass" },
      })

      if (existingIdentities?.length > 0) {
        const existingIdentity = existingIdentities[0]

        // Delete the existing identity (has wrong hash format)
        await authModule.deleteAuthIdentities([existingIdentity.id])
        logger.info(`  [DEL]  Deleted old identity for ${email}`)
      }

      // Re-register using authModule.register() which uses correct scrypt-kdf hashing
      const result = await authModule.register("emailpass", {
        body: { email, password: DEMO_PASSWORD },
        authScope: "store",
      } as any)

      if (!result.success || !result.authIdentity) {
        logger.warn(`  [FAIL] ${email}: ${result.error ?? "register returned no identity"}`)
        errors++
        continue
      }

      const authIdentity = result.authIdentity

      // Link auth identity to customer
      await authModule.updateAuthIdentities({
        id: authIdentity.id,
        app_metadata: { customer_id: customer.id },
      })

      logger.info(`  [OK]   ${email} → auth:${authIdentity.id} → customer:${customer.id}`)
      fixed++
    } catch (err) {
      logger.error(`  [ERR]  ${email}: ${err instanceof Error ? err.message : err}`)
      errors++
    }
  }

  logger.info(`=== fix-auth-prod: Done — fixed ${fixed}, errors ${errors} ===`)
  return { fixed, errors }
}
