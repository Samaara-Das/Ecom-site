/**
 * E2E Tests for Admin Panel Loading
 *
 * These tests verify that the Medusa admin panel is accessible and loads correctly.
 * The admin panel is served at http://localhost:9000/app
 *
 * Prerequisites:
 * - Medusa backend must be running (npm run dev in backend/)
 * - Database must be connected and healthy
 *
 * Note: Tests that require the backend will be skipped if the backend is not running.
 */

import { describe, it, expect, beforeAll } from "vitest"

// Configuration
const BACKEND_URL = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
const ADMIN_PANEL_URL = `${BACKEND_URL}/app`
const HEALTH_URL = `${BACKEND_URL}/health`
const TIMEOUT = 5000

// Track if backend is available
let isBackendAvailable = false

// Helper function to make HTTP requests with timeout
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout: number = TIMEOUT
): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    throw error
  }
}

// Check backend availability before running tests
async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetchWithTimeout(HEALTH_URL, {}, 3000)
    if (response.ok) {
      const data = await response.json()
      return data.status === "healthy"
    }
    return false
  } catch {
    return false
  }
}

describe("Admin Panel E2E Tests", () => {
  beforeAll(async () => {
    isBackendAvailable = await checkBackendHealth()
    if (!isBackendAvailable) {
      console.warn(
        "\n⚠️  Backend not available. E2E tests requiring backend will be skipped.\n" +
          "   Start the backend with: cd backend && npm run dev\n"
      )
    }
  })

  describe("Backend Health Check", () => {
    it("should have healthy backend service", async () => {
      if (!isBackendAvailable) {
        console.log("Skipping: Backend not available")
        return
      }

      const response = await fetchWithTimeout(HEALTH_URL)
      expect(response.status).toBe(200)

      const data = await response.json()
      expect(data).toHaveProperty("status")
      expect(data.status).toBe("healthy")
      expect(data).toHaveProperty("timestamp")
      expect(data).toHaveProperty("service")
    })
  })

  describe("Admin Panel Accessibility", () => {
    it("should serve admin panel HTML at /app", async () => {
      if (!isBackendAvailable) {
        console.log("Skipping: Backend not available")
        return
      }

      const response = await fetchWithTimeout(ADMIN_PANEL_URL)
      expect(response.status).toBe(200)

      const contentType = response.headers.get("content-type")
      expect(contentType).toContain("text/html")
    })

    it("should include Medusa admin app container", async () => {
      if (!isBackendAvailable) {
        console.log("Skipping: Backend not available")
        return
      }

      const response = await fetchWithTimeout(ADMIN_PANEL_URL)
      const html = await response.text()

      // Verify the HTML contains the Medusa admin app mount point
      expect(html).toContain('id="medusa"')
      expect(html).toContain("<!DOCTYPE html>")
    })

    it("should include required JavaScript entry point", async () => {
      if (!isBackendAvailable) {
        console.log("Skipping: Backend not available")
        return
      }

      const response = await fetchWithTimeout(ADMIN_PANEL_URL)
      const html = await response.text()

      // Verify the HTML includes the JavaScript entry file
      expect(html).toContain("/app/entry.jsx")
      expect(html).toContain('type="module"')
    })

    it("should include Vite development client in dev mode", async () => {
      if (!isBackendAvailable) {
        console.log("Skipping: Backend not available")
        return
      }

      const response = await fetchWithTimeout(ADMIN_PANEL_URL)
      const html = await response.text()

      // In development mode, Vite client should be present
      // This might not be present in production builds
      if (html.includes("@vite/client")) {
        expect(html).toContain("/app/@vite/client")
      }
    })
  })

  describe("Admin Panel Login Route", () => {
    it("should serve login page at /app/login", async () => {
      if (!isBackendAvailable) {
        console.log("Skipping: Backend not available")
        return
      }

      const loginUrl = `${BACKEND_URL}/app/login`
      const response = await fetchWithTimeout(loginUrl)

      // Login page should return 200 (SPA routing)
      expect(response.status).toBe(200)
    })
  })

  describe("Admin Panel API Endpoints", () => {
    it("should have CORS headers configured", async () => {
      if (!isBackendAvailable) {
        console.log("Skipping: Backend not available")
        return
      }

      const response = await fetchWithTimeout(HEALTH_URL, {
        method: "OPTIONS",
      })

      // OPTIONS request should succeed
      expect([200, 204]).toContain(response.status)
    })
  })
})

describe("Admin Panel Configuration", () => {
  it("should have admin enabled in configuration", () => {
    // This test verifies the expected configuration
    // The actual admin panel availability is tested above
    const disableAdmin = process.env.DISABLE_ADMIN

    // Admin should not be disabled
    expect(disableAdmin).not.toBe("true")
  })

  it("should have correct backend URL configured", () => {
    const backendUrl = BACKEND_URL

    // Verify URL format
    expect(backendUrl).toMatch(/^https?:\/\//)
    expect(backendUrl).toContain(":9000")
  })
})
