import { AbstractPaymentProvider, MedusaError } from "@medusajs/framework/utils"
import type {
  Logger,
  InitiatePaymentInput,
  InitiatePaymentOutput,
  AuthorizePaymentInput,
  AuthorizePaymentOutput,
  CapturePaymentInput,
  CapturePaymentOutput,
  RefundPaymentInput,
  RefundPaymentOutput,
  CancelPaymentInput,
  CancelPaymentOutput,
  RetrievePaymentInput,
  RetrievePaymentOutput,
  UpdatePaymentInput,
  UpdatePaymentOutput,
  DeletePaymentInput,
  DeletePaymentOutput,
  GetPaymentStatusInput,
  GetPaymentStatusOutput,
  PaymentSessionStatus,
  WebhookActionInput,
  WebhookActionOutput,
} from "@medusajs/framework/types"
import {
  Client,
  Environment,
  OrdersController,
  PaymentsController,
  CheckoutPaymentIntent,
  OrderApplicationContextLandingPage,
  OrderApplicationContextUserAction,
  type OrderRequest,
} from "@paypal/paypal-server-sdk"

export type PayPalOptions = {
  client_id: string
  client_secret: string
  environment?: "sandbox" | "production"
  autoCapture?: boolean
  webhook_id?: string
}

type InjectedDependencies = {
  logger: Logger
}

class PayPalPaymentProviderService extends AbstractPaymentProvider<PayPalOptions> {
  static identifier = "paypal"

  protected logger_: Logger
  protected options_: PayPalOptions
  protected client_: Client
  protected ordersController_: OrdersController
  protected paymentsController_: PaymentsController

  constructor(container: InjectedDependencies, options: PayPalOptions) {
    super(container, options)

    this.logger_ = container.logger
    this.options_ = {
      environment: "sandbox",
      autoCapture: false,
      ...options,
    }

    // Initialize PayPal client
    this.client_ = new Client({
      environment:
        this.options_.environment === "production"
          ? Environment.Production
          : Environment.Sandbox,
      clientCredentialsAuthCredentials: {
        oAuthClientId: this.options_.client_id,
        oAuthClientSecret: this.options_.client_secret,
      },
    })

    this.ordersController_ = new OrdersController(this.client_)
    this.paymentsController_ = new PaymentsController(this.client_)
  }

  static validateOptions(options: Record<string, unknown>): void | never {
    if (!options.client_id) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "PayPal Client ID is required"
      )
    }
    if (!options.client_secret) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "PayPal Client Secret is required"
      )
    }
  }

  async initiatePayment(
    input: InitiatePaymentInput
  ): Promise<InitiatePaymentOutput> {
    try {
      const { amount, currency_code } = input

      // Determine intent based on autoCapture option
      const intent = this.options_.autoCapture
        ? CheckoutPaymentIntent.Capture
        : CheckoutPaymentIntent.Authorize

      // Create PayPal order request
      const orderRequest: OrderRequest = {
        intent: intent,
        purchaseUnits: [
          {
            amount: {
              currencyCode: currency_code.toUpperCase(),
              value: amount.toString(),
            },
            description: "Order payment",
            customId: input.data?.session_id as string | undefined,
          },
        ],
        applicationContext: {
          brandName: "Kuwait Marketplace",
          landingPage: OrderApplicationContextLandingPage.NoPreference,
          userAction: OrderApplicationContextUserAction.PayNow,
        },
      }

      const response = await this.ordersController_.createOrder({
        body: orderRequest,
        prefer: "return=representation",
      })

      const order = response.result

      if (!order?.id) {
        throw new MedusaError(
          MedusaError.Types.UNEXPECTED_STATE,
          "Failed to create PayPal order"
        )
      }

      // Extract approval URL from links
      const approvalUrl = order.links?.find(
        (link) => link.rel === "approve"
      )?.href

      return {
        id: order.id,
        data: {
          order_id: order.id,
          intent: intent,
          status: order.status,
          approval_url: approvalUrl,
          session_id: input.data?.session_id,
          currency_code,
        },
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      this.logger_.error(`PayPal initiatePayment error: ${errorMessage}`)
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to initiate PayPal payment: ${errorMessage}`
      )
    }
  }

  async authorizePayment(
    input: AuthorizePaymentInput
  ): Promise<AuthorizePaymentOutput> {
    try {
      const orderId = input.data?.order_id as string | undefined

      if (!orderId || typeof orderId !== "string") {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "PayPal order ID is required"
        )
      }

      // If autoCapture is enabled, authorize and capture in one step
      if (this.options_.autoCapture) {
        const response = await this.ordersController_.captureOrder({
          id: orderId,
          prefer: "return=representation",
        })

        const capture = response.result

        if (!capture?.id) {
          throw new MedusaError(
            MedusaError.Types.UNEXPECTED_STATE,
            "Failed to capture PayPal payment"
          )
        }

        // Extract capture ID from purchase units
        const captureId =
          capture.purchaseUnits?.[0]?.payments?.captures?.[0]?.id

        return {
          data: {
            ...input.data,
            capture_id: captureId,
            intent: "CAPTURE",
          },
          status: "captured" as PaymentSessionStatus,
        }
      }

      // Otherwise, just authorize
      const response = await this.ordersController_.authorizeOrder({
        id: orderId,
        prefer: "return=representation",
      })

      const authorization = response.result

      if (!authorization?.id) {
        throw new MedusaError(
          MedusaError.Types.UNEXPECTED_STATE,
          "Failed to authorize PayPal payment"
        )
      }

      // Extract authorization ID from purchase units
      const authId =
        authorization.purchaseUnits?.[0]?.payments?.authorizations?.[0]?.id

      return {
        data: {
          order_id: orderId,
          authorization_id: authId,
          intent: "AUTHORIZE",
          currency_code: input.data?.currency_code,
        },
        status: "authorized" as PaymentSessionStatus,
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      this.logger_.error(`PayPal authorizePayment error: ${errorMessage}`)
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to authorize PayPal payment: ${errorMessage}`
      )
    }
  }

  async capturePayment(
    input: CapturePaymentInput
  ): Promise<CapturePaymentOutput> {
    try {
      const authorizationId = input.data?.authorization_id as string | undefined

      if (!authorizationId || typeof authorizationId !== "string") {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "PayPal authorization ID is required for capture"
        )
      }

      const response = await this.paymentsController_.captureAuthorizedPayment({
        authorizationId: authorizationId,
        prefer: "return=representation",
      })

      const capture = response.result

      if (!capture?.id) {
        throw new MedusaError(
          MedusaError.Types.UNEXPECTED_STATE,
          "Failed to capture PayPal payment"
        )
      }

      return {
        data: {
          ...input.data,
          capture_id: capture.id,
        },
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      this.logger_.error(`PayPal capturePayment error: ${errorMessage}`)
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to capture PayPal payment: ${errorMessage}`
      )
    }
  }

  async refundPayment(input: RefundPaymentInput): Promise<RefundPaymentOutput> {
    try {
      const captureId = input.data?.capture_id as string | undefined

      if (!captureId || typeof captureId !== "string") {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "PayPal capture ID is required for refund"
        )
      }

      const response = await this.paymentsController_.refundCapturedPayment({
        captureId: captureId,
        prefer: "return=representation",
        body: input.amount
          ? {
              amount: {
                currencyCode: (input.data?.currency_code as string)?.toUpperCase() || "USD",
                value: input.amount.toString(),
              },
            }
          : undefined,
      })

      const refund = response.result

      if (!refund?.id) {
        throw new MedusaError(
          MedusaError.Types.UNEXPECTED_STATE,
          "Failed to refund PayPal payment"
        )
      }

      return {
        data: {
          ...input.data,
          refund_id: refund.id,
        },
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      this.logger_.error(`PayPal refundPayment error: ${errorMessage}`)
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to refund PayPal payment: ${errorMessage}`
      )
    }
  }

  async cancelPayment(input: CancelPaymentInput): Promise<CancelPaymentOutput> {
    try {
      const authorizationId = input.data?.authorization_id as string | undefined

      // If there's an authorization, void it
      if (authorizationId && typeof authorizationId === "string") {
        await this.paymentsController_.voidAuthorizedPayment({
          authorizationId: authorizationId,
          prefer: "return=representation",
        })
      }

      // For PayPal, cancellation is handled differently
      // If no authorization exists, the order can just be abandoned
      return {
        data: {
          ...input.data,
          cancelled: true,
        },
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      this.logger_.error(`PayPal cancelPayment error: ${errorMessage}`)
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to cancel PayPal payment: ${errorMessage}`
      )
    }
  }

  async retrievePayment(
    input: RetrievePaymentInput
  ): Promise<RetrievePaymentOutput> {
    try {
      const orderId = input.data?.order_id as string | undefined

      if (!orderId || typeof orderId !== "string") {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "PayPal order ID is required"
        )
      }

      const response = await this.ordersController_.getOrder({
        id: orderId,
      })

      const order = response.result

      return {
        data: {
          order_id: order?.id,
          status: order?.status,
          payer: order?.payer,
          purchase_units: order?.purchaseUnits,
        },
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      this.logger_.error(`PayPal retrievePayment error: ${errorMessage}`)
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to retrieve PayPal payment: ${errorMessage}`
      )
    }
  }

  async updatePayment(input: UpdatePaymentInput): Promise<UpdatePaymentOutput> {
    // PayPal orders are generally not updated after creation
    // Return existing data
    return {
      data: input.data || {},
    }
  }

  async deletePayment(input: DeletePaymentInput): Promise<DeletePaymentOutput> {
    // PayPal doesn't support deleting orders
    // Just return empty data to indicate success
    return {
      data: {},
    }
  }

  async getPaymentStatus(
    input: GetPaymentStatusInput
  ): Promise<GetPaymentStatusOutput> {
    try {
      const orderId = input.data?.order_id as string | undefined

      if (!orderId || typeof orderId !== "string") {
        return { status: "pending" as PaymentSessionStatus }
      }

      const response = await this.ordersController_.getOrder({
        id: orderId,
      })

      const order = response.result

      // Map PayPal order status to Medusa payment status
      const statusMap: Record<string, PaymentSessionStatus> = {
        CREATED: "pending" as PaymentSessionStatus,
        SAVED: "pending" as PaymentSessionStatus,
        APPROVED: "authorized" as PaymentSessionStatus,
        VOIDED: "canceled" as PaymentSessionStatus,
        COMPLETED: "captured" as PaymentSessionStatus,
        PAYER_ACTION_REQUIRED: "requires_more" as PaymentSessionStatus,
      }

      return {
        status: statusMap[order?.status || "CREATED"] || ("pending" as PaymentSessionStatus),
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      this.logger_.error(`PayPal getPaymentStatus error: ${errorMessage}`)
      return { status: "error" as PaymentSessionStatus }
    }
  }

  async getWebhookActionAndData(
    input: WebhookActionInput
  ): Promise<WebhookActionOutput> {
    const { payload } = input

    // Parse webhook payload
    const event = typeof payload === "string" ? JSON.parse(payload) : payload

    // Map PayPal webhook events to Medusa actions
    const eventType = event?.event_type

    switch (eventType) {
      case "PAYMENT.CAPTURE.COMPLETED":
        return {
          action: "captured",
          data: {
            session_id: event?.resource?.custom_id,
            capture_id: event?.resource?.id,
          },
        }
      case "PAYMENT.AUTHORIZATION.CREATED":
        return {
          action: "authorized",
          data: {
            session_id: event?.resource?.custom_id,
            authorization_id: event?.resource?.id,
          },
        }
      case "PAYMENT.CAPTURE.REFUNDED":
        return {
          action: "refunded",
          data: {
            session_id: event?.resource?.custom_id,
            refund_id: event?.resource?.id,
          },
        }
      case "PAYMENT.AUTHORIZATION.VOIDED":
        return {
          action: "canceled",
          data: {
            session_id: event?.resource?.custom_id,
          },
        }
      default:
        return {
          action: "not_supported",
          data: {},
        }
    }
  }
}

export default PayPalPaymentProviderService
