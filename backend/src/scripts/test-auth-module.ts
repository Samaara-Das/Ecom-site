import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function testAuthModule({ container }: { container: any }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const authModule = container.resolve(Modules.AUTH)
  
  logger.info("=== test-auth-module: Starting ===")
  
  try {
    const result = await authModule.authenticate("emailpass", {
      body: { email: "m.alrashidi@gmail.com", password: "Demo1234!" },
      authScope: "store",
    } as any)
    logger.info(`Result: ${JSON.stringify(result)}`)
  } catch(err) {
    logger.error(`Error: ${err instanceof Error ? err.stack?.slice(0,500) : err}`)
  }
  
  logger.info("=== test-auth-module: Done ===")
}
