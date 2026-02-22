/**
 * Fix customer auth identities by directly storing scrypt-kdf password hashes via raw SQL.
 *
 * Root cause: authModule.register() called from medusa exec scripts does NOT
 * store password hashes in provider_metadata (stays empty {}).
 *
 * Solution: Use scrypt-kdf to hash the password and directly update the
 * auth_provider_identity table in PostgreSQL.
 *
 * Run with: npx medusa exec ./src/scripts/fix-auth-scrypt.ts
 */

import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
// @ts-ignore
import scrypt from "scrypt-kdf"
import { Client } from "pg"

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

export default async function fixAuthScrypt({ container }: { container: any }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const authModule = container.resolve(Modules.AUTH)
  const customerModule = container.resolve(Modules.CUSTOMER)

  logger.info("=== fix-auth-scrypt: Starting ===")

  // 1. Hash password with scrypt-kdf (Medusa's internal format)
  logger.info(`  Generating scrypt-kdf hash for '${DEMO_PASSWORD}'...`)
  const passwordHash: string = (
    await scrypt.kdf(DEMO_PASSWORD, { logN: 15, r: 8, p: 1 })
  ).toString("base64")
  logger.info(`  Hash: ${passwordHash.slice(0, 30)}...`)

  // 2. Connect to PostgreSQL directly
  const dbUrl = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/medusa"
  logger.info(`  Connecting to DB...`)
  const client = new Client({ connectionString: dbUrl })
  await client.connect()
  logger.info(`  DB connected.`)

  let fixed = 0
  let errors = 0

  for (const email of CUSTOMER_EMAILS) {
    try {
      // Ensure customer exists
      const customers = await customerModule.listCustomers({ email })
      if (!customers?.length) {
        logger.warn(`  [SKIP] No customer for ${email}`)
        continue
      }
      const customer = customers[0]

      // Ensure auth identity exists
      const identities = await authModule.listAuthIdentities({
        provider_identities: { entity_id: email, provider: "emailpass" },
      })

      let authIdentityId: string

      if (!identities?.length) {
        // Create auth identity via register
        const result = await authModule.register("emailpass", {
          body: { email, password: DEMO_PASSWORD },
          authScope: "store",
        } as any)
        if (!result.success || !result.authIdentity) {
          logger.warn(`  [FAIL] Could not create identity for ${email}`)
          errors++
          continue
        }
        authIdentityId = result.authIdentity.id
        logger.info(`  [NEW] Created auth identity for ${email}`)
      } else {
        authIdentityId = identities[0].id
      }

      // Ensure app_metadata links to customer
      await authModule.updateAuthIdentities({
        id: authIdentityId,
        app_metadata: { customer_id: customer.id },
      })

      // 3. Directly update provider_metadata with password hash via raw SQL
      const updateResult = await client.query(
        `UPDATE auth_provider_identity
         SET provider_metadata = $1::jsonb, updated_at = NOW()
         WHERE entity_id = $2 AND provider = 'emailpass'`,
        [JSON.stringify({ password: passwordHash }), email]
      )

      if (updateResult.rowCount && updateResult.rowCount > 0) {
        logger.info(`  [✓] ${email} — password hash stored (${updateResult.rowCount} row updated)`)
        fixed++
      } else {
        logger.warn(`  [WARN] ${email} — no rows updated in auth_provider_identity`)
        errors++
      }
    } catch (err) {
      logger.error(
        `  [ERROR] ${email}: ${err instanceof Error ? err.message : err}`
      )
      errors++
    }
  }

  await client.end()

  logger.info(`\n=== fix-auth-scrypt: Summary ===`)
  logger.info(`  Fixed: ${fixed} / ${CUSTOMER_EMAILS.length}`)
  logger.info(`  Errors: ${errors}`)

  // 4. Verify by testing auth for first customer
  logger.info(`\n--- Verifying login for m.alrashidi@gmail.com ---`)
  try {
    const verifyResult = await authModule.authenticate("emailpass", {
      body: { email: "m.alrashidi@gmail.com", password: DEMO_PASSWORD },
      authScope: "store",
    } as any)
    logger.info(
      `  Authenticate result: success=${verifyResult.success}, token=${verifyResult.token ? "present" : "missing"}`
    )
  } catch (err) {
    logger.warn(`  Verify failed: ${err instanceof Error ? err.message : err}`)
  }

  logger.info("=== fix-auth-scrypt: Done ===")
}
