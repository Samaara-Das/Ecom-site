import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function testAuthFull({ container }: { container: any }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const authModule = container.resolve(Modules.AUTH)
  
  // Simulate what HTTP handler passes exactly
  const authData = {
    url: "/auth/customer/emailpass",
    headers: { "content-type": "application/json", host: "localhost:9000" },
    query: {},
    body: { email: "m.alrashidi@gmail.com", password: "Demo1234!" },
    protocol: "http",
  }
  
  const result = await authModule.authenticate("emailpass", authData as any)
  logger.info(`success: ${result.success}`)
  logger.info(`provider_identities: ${JSON.stringify(result.authIdentity?.provider_identities?.map((p: any) => ({ entity_id: p.entity_id, provider: p.provider, has_password: !!p.provider_metadata?.password })))}`)
  
  // Now try JWT generation manually
  try {
    // @ts-ignore
    const { generateJwtToken } = await import("@medusajs/framework/utils")
    logger.info(`generateJwtToken type: ${typeof generateJwtToken}`)
  } catch(e: any) {
    logger.error(`Import error: ${e.message}`)
  }
}
