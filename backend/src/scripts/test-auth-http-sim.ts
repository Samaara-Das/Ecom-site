// @ts-nocheck
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function testAuthHttpSim({ container }: { container: any }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const authModule = container.resolve(Modules.AUTH)
  
  logger.info("=== test-auth-http-sim ===")
  
  // Simulate what the HTTP handler does
  const authData = {
    url: "/auth/customer/emailpass",
    headers: { "content-type": "application/json" },
    query: {},
    body: { email: "m.alrashidi@gmail.com", password: "Demo1234!" },
    protocol: "http",
  }
  
  try {
    const result = await authModule.authenticate("emailpass", authData as any)
    logger.info(`Auth result: success=${result.success}, error=${result.error}`)
    logger.info(`Auth identity: ${JSON.stringify(result.authIdentity?.id)}`)
    logger.info(`App metadata: ${JSON.stringify(result.authIdentity?.app_metadata)}`)
  } catch(err) {
    logger.error(`Error: ${err instanceof Error ? err.stack?.slice(0,500) : err}`)
  }
}
