/**
 * Final customer auth fix.
 * Uses authModule.register() directly (works, confirmed by debug-auth.ts).
 * Registers/updates all 25 demo customers with password Demo1234!
 * Then links auth identity -> customer via app_metadata.customer_id.
 *
 * Run with: npx medusa exec ./src/scripts/fix-auth-final.ts
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

export default async function fixAuthFinal({ container }: { container: any }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const authModule = container.resolve(Modules.AUTH)
  const customerModule = container.resolve(Modules.CUSTOMER)

  logger.info("=== fix-auth-final: Starting ===")

  let fixed = 0
  let errors = 0

  for (const email of CUSTOMER_EMAILS) {
    try {
      // 1. Find customer record
      const customers = await customerModule.listCustomers({ email })
      if (!customers?.length) {
        logger.warn(`  [SKIP] No customer found for ${email}`)
        continue
      }
      const customer = customers[0]

      // 2. Register/update auth identity via the module directly
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

      // 3. Link auth identity to customer if not already linked
      if (!authIdentity.app_metadata?.customer_id) {
        await authModule.updateAuthIdentities({
          id: authIdentity.id,
          app_metadata: { customer_id: customer.id },
        })
        logger.info(`  [OK]   ${email} → auth:${authIdentity.id} → customer:${customer.id}`)
      } else {
        logger.info(`  [OK]   ${email} → already linked to customer:${authIdentity.app_metadata.customer_id}`)
      }

      fixed++
    } catch (err) {
      logger.error(`  [ERR]  ${email}: ${err instanceof Error ? err.message : err}`)
      errors++
    }
  }

  logger.info(`=== fix-auth-final: Done — fixed ${fixed}, errors ${errors} ===`)
  return { fixed, errors }
}
