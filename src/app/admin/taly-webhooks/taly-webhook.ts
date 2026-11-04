// One Taly webhook received by the test merchant endpoint.
export interface TalyWebhook {
  id: number;
  webhookId: string | null;
  deliveryAttempt: string | null;
  signature: string | null;
  expectedSignature: string;
  signatureValid: boolean;
  payload: string;
  receivedAt: string;
}
