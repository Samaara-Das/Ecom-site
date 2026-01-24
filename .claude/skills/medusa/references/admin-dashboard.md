# Medusa Admin Dashboard Customization

Extend and customize the Medusa Admin dashboard with UI routes, widgets, and settings pages.

## Contents

- Overview
- UI Routes
- Widgets
- Settings Pages
- Admin SDK
- UI Components
- Data Fetching
- Layouts

## Overview

The Medusa Admin dashboard is built with React and uses:

- **React Router** for routing
- **@medusajs/ui** for UI components
- **@medusajs/admin-sdk** for configuration
- **@tanstack/react-query** for data fetching

### File Locations

```
src/admin/
├── routes/           # Custom pages
│   └── custom/
│       └── page.tsx
├── widgets/          # Widgets for existing pages
│   └── product-widget.tsx
└── settings/         # Settings pages
    └── custom/
        └── page.tsx
```

## UI Routes

Add custom pages to the admin dashboard.

### Basic UI Route

```tsx
// src/admin/routes/custom/page.tsx
import { Container, Heading } from "@medusajs/ui"

const CustomPage = () => {
  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Custom Page</Heading>
      </div>
    </Container>
  )
}

export default CustomPage
```

### Route with Sidebar Configuration

```tsx
// src/admin/routes/custom/page.tsx
import { Container, Heading } from "@medusajs/ui"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { ChatBubbleLeftRight } from "@medusajs/icons"

const CustomPage = () => {
  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Custom Page</Heading>
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Custom",
  icon: ChatBubbleLeftRight,
})

export default CustomPage
```

### Nested Routes

```
src/admin/routes/
├── customers/
│   ├── page.tsx           # /customers
│   └── [id]/
│       └── page.tsx       # /customers/:id
```

### Dynamic Route Parameters

```tsx
// src/admin/routes/custom/[id]/page.tsx
import { useParams } from "react-router-dom"

const CustomDetailPage = () => {
  const { id } = useParams()

  return (
    <Container>
      <Heading>Detail for {id}</Heading>
    </Container>
  )
}

export default CustomDetailPage
```

### Route with Data Fetching

```tsx
// src/admin/routes/meilisearch/page.tsx
import { Container, Heading, Button, toast } from "@medusajs/ui"
import { useMutation } from "@tanstack/react-query"
import { sdk } from "../../../lib/sdk"
import { defineRouteConfig } from "@medusajs/admin-sdk"

const MeilisearchPage = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      sdk.client.fetch("/admin/meilisearch/sync", {
        method: "POST",
      }),
    onSuccess: () => {
      toast.success("Successfully triggered data sync")
    },
    onError: (err) => {
      console.error(err)
      toast.error("Failed to sync data")
    },
  })

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Meilisearch Sync</Heading>
      </div>
      <div className="px-6 py-8">
        <Button
          variant="primary"
          onClick={() => mutate()}
          isLoading={isPending}
        >
          Sync Data
        </Button>
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Meilisearch",
})

export default MeilisearchPage
```

## Widgets

Inject components into existing admin pages.

### Basic Widget

```tsx
// src/admin/widgets/product-widget.tsx
import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text } from "@medusajs/ui"

const ProductWidget = () => {
  return (
    <Container className="divide-y p-0">
      <div className="px-6 py-4">
        <Heading level="h2">Custom Widget</Heading>
        <Text>This widget appears on product pages.</Text>
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default ProductWidget
```

### Widget Zones

| Zone | Location |
|------|----------|
| `product.details.before` | Before product details |
| `product.details.after` | After product details |
| `order.details.before` | Before order details |
| `order.details.after` | After order details |
| `customer.details.before` | Before customer details |
| `customer.details.after` | After customer details |

### Widget with Props

```tsx
// src/admin/widgets/order-analytics.tsx
import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"

type OrderWidgetProps = {
  data: HttpTypes.AdminOrder
}

const OrderAnalyticsWidget = ({ data }: OrderWidgetProps) => {
  return (
    <Container>
      <Heading level="h2">Order Analytics</Heading>
      <Text>Order Total: {data.total}</Text>
      <Text>Items: {data.items.length}</Text>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "order.details.after",
})

export default OrderAnalyticsWidget
```

## Settings Pages

Add pages to the admin settings section.

### Basic Settings Page

```tsx
// src/admin/settings/custom/page.tsx
import { Container, Heading, Text, Button } from "@medusajs/ui"
import { defineRouteConfig } from "@medusajs/admin-sdk"

const CustomSettingsPage = () => {
  return (
    <Container className="divide-y p-0">
      <div className="px-6 py-4">
        <Heading level="h1">Custom Settings</Heading>
        <Text>Configure your custom integration.</Text>
      </div>
      <div className="px-6 py-4">
        {/* Settings form */}
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Custom Settings",
})

export default CustomSettingsPage
```

### Settings with Form

```tsx
// src/admin/settings/api-keys/page.tsx
import { useState } from "react"
import { Container, Heading, Input, Button, toast } from "@medusajs/ui"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { useMutation } from "@tanstack/react-query"
import { sdk } from "../../../lib/sdk"

const ApiKeySettingsPage = () => {
  const [apiKey, setApiKey] = useState("")

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      sdk.client.fetch("/admin/settings/api-key", {
        method: "POST",
        body: { api_key: apiKey },
      }),
    onSuccess: () => {
      toast.success("API key saved")
    },
    onError: () => {
      toast.error("Failed to save API key")
    },
  })

  return (
    <Container className="divide-y p-0">
      <div className="px-6 py-4">
        <Heading level="h1">API Key Settings</Heading>
      </div>
      <div className="px-6 py-4">
        <Input
          type="password"
          placeholder="Enter API key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <Button
          onClick={() => mutate()}
          isLoading={isPending}
          className="mt-4"
        >
          Save
        </Button>
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "API Keys",
})

export default ApiKeySettingsPage
```

## Admin SDK

### defineRouteConfig

Configure route metadata for sidebar display:

```tsx
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { CurrencyDollar } from "@medusajs/icons"

export const config = defineRouteConfig({
  label: "Sales Reports",      // Sidebar label
  icon: CurrencyDollar,        // Sidebar icon (from @medusajs/icons)
})
```

### defineWidgetConfig

Configure widget placement:

```tsx
import { defineWidgetConfig } from "@medusajs/admin-sdk"

export const config = defineWidgetConfig({
  zone: "product.details.after",  // Where widget appears
})
```

## UI Components

Common components from `@medusajs/ui`:

### Container

```tsx
import { Container } from "@medusajs/ui"

<Container className="divide-y p-0">
  {/* Content */}
</Container>
```

### Heading

```tsx
import { Heading } from "@medusajs/ui"

<Heading level="h1">Page Title</Heading>
<Heading level="h2">Section Title</Heading>
```

### Button

```tsx
import { Button } from "@medusajs/ui"

<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="danger">Danger</Button>
<Button isLoading={true}>Loading...</Button>
```

### Input

```tsx
import { Input } from "@medusajs/ui"

<Input
  type="text"
  placeholder="Enter value"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

### Toast Notifications

```tsx
import { toast } from "@medusajs/ui"

toast.success("Operation successful")
toast.error("Operation failed")
toast.info("Information message")
toast.warning("Warning message")
```

### Table

```tsx
import { Table } from "@medusajs/ui"

<Table>
  <Table.Header>
    <Table.Row>
      <Table.HeaderCell>Name</Table.HeaderCell>
      <Table.HeaderCell>Status</Table.HeaderCell>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {items.map((item) => (
      <Table.Row key={item.id}>
        <Table.Cell>{item.name}</Table.Cell>
        <Table.Cell>{item.status}</Table.Cell>
      </Table.Row>
    ))}
  </Table.Body>
</Table>
```

## Data Fetching

Use `@tanstack/react-query` for data operations.

### Fetching Data

```tsx
import { useQuery } from "@tanstack/react-query"
import { sdk } from "../../../lib/sdk"

const MyComponent = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["custom-data"],
    queryFn: () => sdk.client.fetch("/admin/custom"),
  })

  if (isLoading) return <span>Loading...</span>
  if (error) return <span>Error loading data</span>

  return <div>{JSON.stringify(data)}</div>
}
```

### Mutations

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../../../lib/sdk"

const MyComponent = () => {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: (data) =>
      sdk.client.fetch("/admin/custom", {
        method: "POST",
        body: data,
      }),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["custom-data"] })
      toast.success("Saved successfully")
    },
  })

  return (
    <Button onClick={() => mutate({ name: "Test" })} isLoading={isPending}>
      Save
    </Button>
  )
}
```

## Layouts

### Single Column Layout

```tsx
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container } from "@medusajs/ui"
import { SingleColumnLayout } from "../../layouts/single-column"
import { Header } from "../../components/header"

const CustomPage = () => {
  return (
    <SingleColumnLayout>
      <Container>
        <Header title="Custom Page" />
        {/* Content */}
      </Container>
    </SingleColumnLayout>
  )
}

export const config = defineRouteConfig({
  label: "Custom",
})

export default CustomPage
```

### Using React Router

```tsx
import { Link, useNavigate } from "react-router-dom"

const MyComponent = () => {
  const navigate = useNavigate()

  return (
    <>
      <Link to="/products">Go to Products</Link>
      <Button onClick={() => navigate("/orders")}>
        Go to Orders
      </Button>
    </>
  )
}
```
