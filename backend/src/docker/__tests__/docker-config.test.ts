import { describe, it, expect, beforeAll } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { parse as parseYaml } from 'yaml'

// Use __dirname directly (available in CommonJS mode which TypeScript compiles to)
const currentDir = __dirname

const projectRoot = join(currentDir, '..', '..', '..', '..')
const backendRoot = join(currentDir, '..', '..', '..')

describe('Docker Configuration', () => {
  describe('Dockerfile', () => {
    let dockerfileContent: string

    beforeAll(() => {
      const dockerfilePath = join(backendRoot, 'Dockerfile')
      expect(existsSync(dockerfilePath)).toBe(true)
      dockerfileContent = readFileSync(dockerfilePath, 'utf-8')
    })

    it('should use Node.js 20 as base image', () => {
      expect(dockerfileContent).toMatch(/FROM node:20-alpine/)
    })

    it('should have multi-stage build with development and production targets', () => {
      expect(dockerfileContent).toContain('AS development')
      expect(dockerfileContent).toContain('AS production')
      expect(dockerfileContent).toContain('AS builder')
    })

    it('should expose port 9000', () => {
      expect(dockerfileContent).toMatch(/EXPOSE 9000/)
    })

    it('should create non-root user for production', () => {
      expect(dockerfileContent).toContain('adduser')
      expect(dockerfileContent).toContain('medusa')
    })

    it('should have health check configured', () => {
      expect(dockerfileContent).toContain('HEALTHCHECK')
      expect(dockerfileContent).toContain('/health')
    })

    it('should copy built application in production stage', () => {
      expect(dockerfileContent).toContain('.medusa')
      expect(dockerfileContent).toContain('medusa-config.ts')
    })

    it('should use npm run dev for development', () => {
      expect(dockerfileContent).toMatch(/CMD \["npm", "run", "dev"\]/)
    })

    it('should use node .medusa/server/index.js for production', () => {
      expect(dockerfileContent).toMatch(/CMD \["node", ".medusa\/server\/index.js"\]/)
    })
  })

  describe('docker-compose.yml', () => {
    let composeConfig: any

    beforeAll(() => {
      const composePath = join(projectRoot, 'docker-compose.yml')
      expect(existsSync(composePath)).toBe(true)
      const composeContent = readFileSync(composePath, 'utf-8')
      composeConfig = parseYaml(composeContent)
    })

    it('should define medusa service', () => {
      expect(composeConfig.services).toHaveProperty('medusa')
    })

    it('should define db (PostgreSQL) service', () => {
      expect(composeConfig.services).toHaveProperty('db')
      expect(composeConfig.services.db.image).toContain('postgres')
    })

    it('should define redis service', () => {
      expect(composeConfig.services).toHaveProperty('redis')
      expect(composeConfig.services.redis.image).toContain('redis')
    })

    it('should configure medusa to depend on db and redis', () => {
      const medusaDeps = composeConfig.services.medusa.depends_on
      expect(medusaDeps).toHaveProperty('db')
      expect(medusaDeps).toHaveProperty('redis')
    })

    it('should expose port 9000 for medusa', () => {
      expect(composeConfig.services.medusa.ports).toContain('9000:9000')
    })

    it('should expose port 5432 for PostgreSQL', () => {
      expect(composeConfig.services.db.ports).toContain('5432:5432')
    })

    it('should expose port 6379 for Redis', () => {
      expect(composeConfig.services.redis.ports).toContain('6379:6379')
    })

    it('should have health checks configured for all services', () => {
      expect(composeConfig.services.medusa.healthcheck).toBeDefined()
      expect(composeConfig.services.db.healthcheck).toBeDefined()
      expect(composeConfig.services.redis.healthcheck).toBeDefined()
    })

    it('should define persistent volumes', () => {
      expect(composeConfig.volumes).toHaveProperty('postgres-data')
      expect(composeConfig.volumes).toHaveProperty('redis-data')
    })

    it('should define network', () => {
      expect(composeConfig.networks).toHaveProperty('medusa-network')
    })

    it('should configure DATABASE_URL environment variable', () => {
      const envVars = composeConfig.services.medusa.environment
      const dbUrlVar = envVars.find((e: string) => e.startsWith('DATABASE_URL'))
      expect(dbUrlVar).toBeDefined()
      expect(dbUrlVar).toContain('postgresql://')
    })

    it('should configure REDIS_URL environment variable', () => {
      const envVars = composeConfig.services.medusa.environment
      const redisUrlVar = envVars.find((e: string) => e.startsWith('REDIS_URL'))
      expect(redisUrlVar).toBeDefined()
      expect(redisUrlVar).toContain('redis://')
    })
  })

  describe('docker-compose.dev.yml', () => {
    let devComposeConfig: any

    beforeAll(() => {
      const devComposePath = join(projectRoot, 'docker-compose.dev.yml')
      expect(existsSync(devComposePath)).toBe(true)
      const devComposeContent = readFileSync(devComposePath, 'utf-8')
      devComposeConfig = parseYaml(devComposeContent)
    })

    it('should override medusa build target to development', () => {
      expect(devComposeConfig.services.medusa.build.target).toBe('development')
    })

    it('should set NODE_ENV to development', () => {
      const envVars = devComposeConfig.services.medusa.environment
      const nodeEnvVar = envVars.find((e: string) => e.startsWith('NODE_ENV'))
      expect(nodeEnvVar).toBe('NODE_ENV=development')
    })

    it('should mount source code for hot reload', () => {
      const volumes = devComposeConfig.services.medusa.volumes
      const srcVolume = volumes.find((v: string) => v.includes('/app/src'))
      expect(srcVolume).toBeDefined()
    })

    it('should include pgAdmin for database management', () => {
      expect(devComposeConfig.services).toHaveProperty('pgadmin')
    })

    it('should include Redis Commander for Redis management', () => {
      expect(devComposeConfig.services).toHaveProperty('redis-commander')
    })
  })

  describe('.dockerignore', () => {
    let dockerignoreContent: string

    beforeAll(() => {
      const dockerignorePath = join(backendRoot, '.dockerignore')
      expect(existsSync(dockerignorePath)).toBe(true)
      dockerignoreContent = readFileSync(dockerignorePath, 'utf-8')
    })

    it('should ignore node_modules', () => {
      expect(dockerignoreContent).toContain('node_modules')
    })

    it('should ignore .env files', () => {
      expect(dockerignoreContent).toContain('.env')
    })

    it('should ignore test files', () => {
      expect(dockerignoreContent).toContain('__tests__')
      expect(dockerignoreContent).toContain('*.test.ts')
    })

    it('should ignore .git directory', () => {
      expect(dockerignoreContent).toContain('.git')
    })

    it('should ignore IDE files', () => {
      expect(dockerignoreContent).toContain('.idea')
      expect(dockerignoreContent).toContain('.vscode')
    })
  })

  describe('.env.docker template', () => {
    let envDockerContent: string

    beforeAll(() => {
      const envDockerPath = join(projectRoot, '.env.docker')
      expect(existsSync(envDockerPath)).toBe(true)
      envDockerContent = readFileSync(envDockerPath, 'utf-8')
    })

    it('should include JWT_SECRET', () => {
      expect(envDockerContent).toContain('JWT_SECRET=')
    })

    it('should include COOKIE_SECRET', () => {
      expect(envDockerContent).toContain('COOKIE_SECRET=')
    })

    it('should include CORS configuration', () => {
      expect(envDockerContent).toContain('STORE_CORS=')
      expect(envDockerContent).toContain('ADMIN_CORS=')
      expect(envDockerContent).toContain('AUTH_CORS=')
    })

    it('should include WORKER_MODE', () => {
      expect(envDockerContent).toContain('WORKER_MODE=')
    })

    it('should include Twilio configuration placeholders', () => {
      expect(envDockerContent).toContain('TWILIO_ACCOUNT_SID=')
      expect(envDockerContent).toContain('TWILIO_AUTH_TOKEN=')
      expect(envDockerContent).toContain('TWILIO_FROM_NUMBER=')
    })
  })

  describe('PostgreSQL init scripts', () => {
    it('should have initialization SQL script', () => {
      const initScriptPath = join(projectRoot, 'docker', 'postgres', 'init', '01-init.sql')
      expect(existsSync(initScriptPath)).toBe(true)

      const initScript = readFileSync(initScriptPath, 'utf-8')
      expect(initScript).toContain('uuid-ossp')
      expect(initScript).toContain('GRANT ALL PRIVILEGES')
    })
  })
})
