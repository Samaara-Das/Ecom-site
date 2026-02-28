// @ts-nocheck
/**
 * Seed script: 25 Kuwait Marketplace customers (v2)
 * Idempotent — checks by email before creating.
 * Password for ALL customers: Demo1234!
 *
 * Run with: npx medusa exec ./src/scripts/seed-customers-v2.ts
 */

import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { promisify } from "util"
import { scrypt, randomBytes } from "crypto"

const scryptAsync = promisify(scrypt)

/** Hash password the same way Medusa's emailpass provider does */
async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex")
  const buf = (await scryptAsync(password, salt, 64)) as Buffer
  return `${buf.toString("hex")}.${salt}`
}

const CUSTOMERS = [
  // ── Kuwaiti Nationals ──────────────────────────────────────────────────
  {
    first_name: "Mohammed",
    last_name: "Al-Rashidi",
    email: "m.alrashidi@gmail.com",
    phone: "+96550100101",
    address: {
      address_1: "Block 5, Street 12, Villa 47",
      city: "Salmiya",
      country_code: "kw",
      postal_code: "22001",
    },
  },
  {
    first_name: "Fatima",
    last_name: "Al-Sabah",
    email: "fatima.alsabah@hotmail.com",
    phone: "+96550100102",
    address: {
      address_1: "Block 3, Street 7, Villa 22",
      city: "Kuwait City",
      country_code: "kw",
      postal_code: "13001",
    },
  },
  {
    first_name: "Ahmed",
    last_name: "Al-Muftah",
    email: "ahmed.almuftah@gmail.com",
    phone: "+96550100103",
    address: {
      address_1: "Block 8, Street 14, House 61",
      city: "Hawalli",
      country_code: "kw",
      postal_code: "32001",
    },
  },
  {
    first_name: "Nour",
    last_name: "Al-Harbi",
    email: "nour.alharbi@gmail.com",
    phone: "+96550100104",
    address: {
      address_1: "Block 11, Street 3, Villa 9",
      city: "Rumaithiya",
      country_code: "kw",
      postal_code: "45001",
    },
  },
  {
    first_name: "Khalid",
    last_name: "Al-Enezi",
    email: "k.alenezi@hotmail.com",
    phone: "+96550100105",
    address: {
      address_1: "Block 6, Street 18, House 33",
      city: "Farwaniya",
      country_code: "kw",
      postal_code: "42001",
    },
  },
  {
    first_name: "Maryam",
    last_name: "Al-Jassem",
    email: "maryam.aljassem@gmail.com",
    phone: "+96550100106",
    address: {
      address_1: "Block 4, Street 9, Villa 15",
      city: "Mishref",
      country_code: "kw",
      postal_code: "52001",
    },
  },
  {
    first_name: "Abdullah",
    last_name: "Al-Mutairi",
    email: "a.almutairi@gmail.com",
    phone: "+96550100107",
    address: {
      address_1: "Block 7, Street 5, House 88",
      city: "Sabah Al-Salem",
      country_code: "kw",
      postal_code: "63001",
    },
  },
  {
    first_name: "Sara",
    last_name: "Al-Kandari",
    email: "sara.alkandari@hotmail.com",
    phone: "+96550100108",
    address: {
      address_1: "Block 9, Street 1, Apartment 204",
      city: "Salmiya",
      country_code: "kw",
      postal_code: "22002",
    },
  },
  {
    first_name: "Omar",
    last_name: "Al-Ajmi",
    email: "omar.alajmi@gmail.com",
    phone: "+96550100109",
    address: {
      address_1: "Block 12, Street 20, House 5",
      city: "Fahaheel",
      country_code: "kw",
      postal_code: "71001",
    },
  },
  {
    first_name: "Hessa",
    last_name: "Al-Fahad",
    email: "hessa.alfahad@gmail.com",
    phone: "+96550100110",
    address: {
      address_1: "Block 2, Street 6, Villa 41",
      city: "Salwa",
      country_code: "kw",
      postal_code: "64001",
    },
  },
  {
    first_name: "Zainab",
    last_name: "Al-Khatib",
    email: "zainab.alkhatib@gmail.com",
    phone: "+96550100111",
    address: {
      address_1: "Block 10, Street 11, Villa 77",
      city: "Hawalli",
      country_code: "kw",
      postal_code: "32002",
    },
  },
  {
    first_name: "Faisal",
    last_name: "Al-Marzouk",
    email: "faisal.almarzouk@hotmail.com",
    phone: "+96550100112",
    address: {
      address_1: "Block 3, Street 15, House 19",
      city: "Kuwait City",
      country_code: "kw",
      postal_code: "13002",
    },
  },
  {
    first_name: "Dana",
    last_name: "Al-Sultani",
    email: "dana.alsultani@gmail.com",
    phone: "+96550100113",
    address: {
      address_1: "Block 7, Street 8, Apartment 103",
      city: "Rumaithiya",
      country_code: "kw",
      postal_code: "45002",
    },
  },
  {
    first_name: "Yousef",
    last_name: "Al-Bahar",
    email: "yousef.albahar@gmail.com",
    phone: "+96550100114",
    address: {
      address_1: "Block 5, Street 2, House 56",
      city: "Mishref",
      country_code: "kw",
      postal_code: "52002",
    },
  },
  {
    first_name: "Reem",
    last_name: "Al-Ghanem",
    email: "reem.alghanem@hotmail.com",
    phone: "+96550100115",
    address: {
      address_1: "Block 8, Street 17, Villa 30",
      city: "Salmiya",
      country_code: "kw",
      postal_code: "22003",
    },
  },
  // ── Expat Residents ────────────────────────────────────────────────────
  {
    first_name: "Raj",
    last_name: "Patel",
    email: "raj.patel.kw@gmail.com",
    phone: "+919876500101",
    address: {
      address_1: "Block 4, Street 10, Apartment 215",
      city: "Farwaniya",
      country_code: "kw",
      postal_code: "42002",
    },
  },
  {
    first_name: "Priya",
    last_name: "Sharma",
    email: "priya.sharma.kw@gmail.com",
    phone: "+919876500102",
    address: {
      address_1: "Block 6, Street 3, Apartment 401",
      city: "Salmiya",
      country_code: "kw",
      postal_code: "22004",
    },
  },
  {
    first_name: "James",
    last_name: "Mitchell",
    email: "j.mitchell.kuwait@gmail.com",
    phone: "+447700900101",
    address: {
      address_1: "Block 9, Street 13, Villa 12",
      city: "Kuwait City",
      country_code: "kw",
      postal_code: "13003",
    },
  },
  {
    first_name: "Sarah",
    last_name: "Johnson",
    email: "sarah.johnson.kw@gmail.com",
    phone: "+12025550101",
    address: {
      address_1: "Block 3, Street 4, Apartment 308",
      city: "Hawalli",
      country_code: "kw",
      postal_code: "32003",
    },
  },
  {
    first_name: "Carlos",
    last_name: "Rodriguez",
    email: "carlos.rodriguez.kw@gmail.com",
    phone: "+34612345101",
    address: {
      address_1: "Block 11, Street 7, Apartment 502",
      city: "Salmiya",
      country_code: "kw",
      postal_code: "22005",
    },
  },
  {
    first_name: "Maria",
    last_name: "Santos",
    email: "maria.santos.kw@gmail.com",
    phone: "+639171234101",
    address: {
      address_1: "Block 6, Street 16, Apartment 119",
      city: "Farwaniya",
      country_code: "kw",
      postal_code: "42003",
    },
  },
  {
    first_name: "David",
    last_name: "Kim",
    email: "david.kim.kuwait@gmail.com",
    phone: "+821012345101",
    address: {
      address_1: "Block 2, Street 19, Apartment 607",
      city: "Kuwait City",
      country_code: "kw",
      postal_code: "13004",
    },
  },
  {
    first_name: "Emily",
    last_name: "Watson",
    email: "emily.watson.kw@gmail.com",
    phone: "+61412345101",
    address: {
      address_1: "Block 8, Street 5, Villa 23",
      city: "Salmiya",
      country_code: "kw",
      postal_code: "22006",
    },
  },
  {
    first_name: "Tom",
    last_name: "Anderson",
    email: "tom.anderson.kw@gmail.com",
    phone: "+16135550101",
    address: {
      address_1: "Block 5, Street 11, Apartment 305",
      city: "Rumaithiya",
      country_code: "kw",
      postal_code: "45003",
    },
  },
  {
    first_name: "Li",
    last_name: "Chen",
    email: "li.chen.kuwait@gmail.com",
    phone: "+8613912345101",
    address: {
      address_1: "Block 7, Street 8, Apartment 210",
      city: "Hawalli",
      country_code: "kw",
      postal_code: "32004",
    },
  },
]

const DEMO_PASSWORD = "Demo1234!"

export default async function seedCustomersV2({
  container,
}: {
  container: any
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const customerModule = container.resolve(Modules.CUSTOMER)
  const authModule = container.resolve(Modules.AUTH)

  logger.info("=== seed-customers-v2: Starting ===")

  const hashedPassword = await hashPassword(DEMO_PASSWORD)

  let created = 0
  let skipped = 0

  for (const c of CUSTOMERS) {
    try {
      // Idempotency check
      const existing = await customerModule.listCustomers({ email: c.email })
      let customer: any

      if (existing?.length > 0) {
        customer = existing[0]
        skipped++
      } else {
        // 1. Create customer record
        customer = await customerModule.createCustomers({
          email: c.email,
          first_name: c.first_name,
          last_name: c.last_name,
          phone: c.phone,
        })
        created++
      }

      // 2. Ensure shipping address exists
      try {
        const addresses = await customerModule.listCustomerAddresses({ customer_id: customer.id })
        if (!addresses?.length) {
          await customerModule.createCustomerAddresses({
            customer_id: customer.id,
            address_1: c.address.address_1,
            city: c.address.city,
            country_code: c.address.country_code,
            postal_code: c.address.postal_code,
            first_name: c.first_name,
            last_name: c.last_name,
            phone: c.phone,
            is_default_shipping: true,
            is_default_billing: true,
          })
        }
      } catch (addrErr) {
        logger.warn(`  Address creation failed for ${c.email}: ${addrErr instanceof Error ? addrErr.message : addrErr}`)
      }

      // 3. Ensure auth identity exists for password login
      try {
        const existingIdentities = await authModule.listAuthIdentities({ provider_identities: { entity_id: c.email, provider: "emailpass" } })
        if (!existingIdentities?.length) {
          const authIdentity = await authModule.createAuthIdentities({
            provider_identities: [
              {
                entity_id: c.email,
                provider: "emailpass",
                provider_metadata: {
                  password: hashedPassword,
                },
              },
            ],
          })

          // Link auth identity to customer
          await authModule.updateAuthIdentities({
            id: authIdentity.id,
            app_metadata: {
              customer_id: customer.id,
            },
          })
          logger.info(`  [AUTH] Created auth identity for ${c.email}`)
        }
      } catch (authErr) {
        logger.warn(`  Auth identity creation failed for ${c.email}: ${authErr instanceof Error ? authErr.message : authErr}`)
      }

      logger.info(`  [OK]   ${c.first_name} ${c.last_name} <${c.email}> (${customer.id})`)
    } catch (err) {
      logger.error(
        `  [ERR]  ${c.email}: ${err instanceof Error ? err.message : err}`
      )
    }
  }

  logger.info(`=== seed-customers-v2: Done — created ${created}, skipped ${skipped} ===`)
  logger.info(`Demo password for all accounts: ${DEMO_PASSWORD}`)
  return { created, skipped }
}
