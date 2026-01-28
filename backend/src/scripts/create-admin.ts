import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export default async function createAdmin({ container }: { container: any }) {
  const userService = container.resolve("user");
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);

  const email = "dassamaara@gmail.com";
  const password = "admin123";

  try {
    // Check if user already exists
    const existingUsers = await userService.listUsers({ email });

    if (existingUsers && existingUsers.length > 0) {
      logger.info(`Admin user ${email} already exists`);
      return { message: "Admin user already exists" };
    }

    // Create the admin user
    await userService.createUsers({
      email,
      first_name: "Admin",
      last_name: "User",
    });

    // Set password via auth
    const authService = container.resolve("auth");
    await authService.register("user", "emailpass", {
      email,
      password,
    });

    logger.info(`Created admin user: ${email}`);
    console.log(`
==================================================
Admin user created successfully!
==================================================
Email: ${email}
Password: ${password}
==================================================
`);

    return { message: "Admin user created", email };
  } catch (error: any) {
    logger.error("Failed to create admin user:", error);
    console.error("Error:", error.message);
    throw error;
  }
}
