import Constants from 'expo-constants';

export type PaymentChannel = 'CARD' | 'UPI' | 'NET_BANKING' | 'WALLET';

export type ToucanPaymentInput = {
  transactionAmount: number;
  paymentMethod: PaymentChannel;
  walletName?: string;
  name?: string;
  email?: string;
  phone?: string;
  cardNumber?: string;
  cvv?: string;
  expiryDate?: string;
  bankName?: string;
  bankCode?: string;
};

export type ToucanPaymentPayload = {
  name: string;
  token: string;
  email: string;
  phone: string;
  cardNumber: string;
  cvv: string;
  expiryDate: string;
  terminalNumber: string;
  transactionType: string;
  merchantNumber: string;
  transactionAmount: number;
  paymentMethod: string;
  orchestrationEnabled: boolean;
  originalRRN: string;
  isPartialPreauthCancellation: boolean;
  currencyCode: string;
  userFieldOne: string;
  userFieldTwo: string;
  userFieldThree: string;
  userFieldFour: string;
  userFieldFive: string;
  bankName: string;
  bankCode: string;
};

export type ToucanSdkRawResult = {
  success: boolean;
  response?: Record<string, unknown>;
  error?: string;
  data?: unknown;
};

export type PaymentSdkCheckoutResult =
  | { status: 'success'; transactionId: string; raw: ToucanSdkRawResult }
  | { status: 'cancelled'; reason?: string; raw: ToucanSdkRawResult }
  | { status: 'failed'; code?: string; message: string; raw: ToucanSdkRawResult };

type ToucanConfig = {
  enabled: boolean;
  sdkScriptUrl: string;
  token: string;
  terminalNumber: string;
  merchantNumber: string;
  currencyCode: string;
  orchestrationEnabled: boolean;
};

export const toucanHostHtml = (sdkScriptUrl: string) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Toucan SDK Host</title>
  <script
    src="${sdkScriptUrl}"
    onload='ToucanBridge.postMessage(JSON.stringify({ event: "sdk_loaded" }))'
    onerror='ToucanBridge.postMessage(JSON.stringify({ event: "sdk_load_failed" }))'>
  </script>
</head>
<body>
  <script>
    window.makeToucanPayment = function (paymentData) {
      if (!window.toucanGateway || typeof window.toucanGateway.makepayment !== "function") {
        ToucanBridge.postMessage(JSON.stringify({ success: false, error: "Toucan SDK not loaded" }));
        return;
      }
      ToucanBridge.postMessage(JSON.stringify({ event: "calling_sdk" }));
      window.toucanGateway
        .makepayment(paymentData)
        .then((response) => {
          ToucanBridge.postMessage(JSON.stringify({ success: true, response: response }));
        })
        .catch((error) => {
          ToucanBridge.postMessage(
            JSON.stringify({
              success: false,
              error: String(error && error.message ? error.message : error),
              data: error && error.data ? error.data : null
            })
          );
        });
    };
  </script>
</body>
</html>`;

const getConfig = (): ToucanConfig => {
  const extra = (Constants.expoConfig?.extra as { paymentSdk?: Record<string, unknown> } | undefined)?.paymentSdk ?? {};
  return {
    enabled: String(process.env.EXPO_PUBLIC_PAYMENT_SDK_ENABLED ?? extra.enabled ?? 'false') === 'true',
    sdkScriptUrl:
      String(
        process.env.EXPO_PUBLIC_PAYMENT_SDK_SCRIPT_URL ??
          extra.sdkScriptUrl ??
          'https://pmt-sdk.testtoucanpay.in/toucanGatewaySdk.js'
      ),
    token: String(process.env.EXPO_PUBLIC_PAYMENT_SDK_TOKEN ?? extra.token ?? ''),
    terminalNumber: String(process.env.EXPO_PUBLIC_PAYMENT_SDK_TERMINAL_NUMBER ?? extra.terminalNumber ?? '280301'),
    merchantNumber: String(process.env.EXPO_PUBLIC_PAYMENT_SDK_MERCHANT_NUMBER ?? extra.merchantNumber ?? '543687998177280'),
    currencyCode: String(process.env.EXPO_PUBLIC_PAYMENT_SDK_CURRENCY_CODE ?? extra.currencyCode ?? '356'),
    orchestrationEnabled:
      String(process.env.EXPO_PUBLIC_PAYMENT_SDK_ORCHESTRATION_ENABLED ?? extra.orchestrationEnabled ?? 'true') ===
      'true',
  };
};

export function getToucanSdkConfig() {
  return getConfig();
}

export function buildToucanPaymentPayload(input: ToucanPaymentInput): ToucanPaymentPayload {
  const config = getConfig();
  return {
    name: input.name ?? 'Test User',
    token: config.token,
    email: input.email ?? 'test@example.com',
    phone: input.phone ?? '9967570122',
    cardNumber: input.cardNumber ?? '4761340000000035',
    cvv: input.cvv ?? '123',
    expiryDate: input.expiryDate ?? '1226',
    terminalNumber: config.terminalNumber,
    transactionType: 'AUTH',
    merchantNumber: config.merchantNumber,
    transactionAmount: Number(input.transactionAmount),
    paymentMethod: input.paymentMethod,
    orchestrationEnabled: config.orchestrationEnabled,
    originalRRN: '',
    isPartialPreauthCancellation: false,
    currencyCode: config.currencyCode,
    userFieldOne: input.walletName ?? '',
    userFieldTwo: '',
    userFieldThree: '',
    userFieldFour: '',
    userFieldFive: '',
    bankName: input.bankName ?? '',
    bankCode: input.bankCode ?? '',
  };
}

export function parseToucanResult(result: ToucanSdkRawResult): PaymentSdkCheckoutResult {
  if (result.success) {
    const response = result.response ?? {};
    const transactionId =
      String(
        response.transactionId ??
          response.txnId ??
          response.rrn ??
          response.referenceId ??
          'unknown'
      );
    return { status: 'success', transactionId, raw: result };
  }

  const message = result.error ?? 'Payment failed.';
  if (message.toLowerCase().includes('cancel')) {
    return { status: 'cancelled', reason: message, raw: result };
  }

  return { status: 'failed', code: 'TOUCAN_SDK_ERROR', message, raw: result };
}
