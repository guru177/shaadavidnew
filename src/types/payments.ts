export type PaymentGatewayDetail = {
  fee?: number;
  tax?: number;
  bank?: string;
  wallet?: string;
  vpa?: string;
  cardNetwork?: string;
  cardLast4?: string;
  errorCode?: string;
  errorDescription?: string;
  international?: boolean;
  amountRefunded?: number;
  captured?: boolean;
};

export type PaymentTransaction = {
  id: string;
  orderId: string;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  amount: number;
  currency: string;
  status: "captured" | "authorized" | "failed" | "refunded" | "partial_refund" | "pending" | "unpaid";
  paymentStatus: string;
  orderStatus: string;
  method: string;
  methodDetail?: string;
  customerName?: string;
  customerMobile?: string;
  customerEmail?: string;
  product?: string;
  createdAt: string;
  date?: string;
  refundId?: string | null;
  refundAmount?: number | null;
  refundedAt?: string | null;
  refundStatus?: string | null;
  refundError?: string | null;
  gateway?: PaymentGatewayDetail | null;
  screenshotUrl?: string | null;
  notes?: string | null;
};

export type PaymentSummary = {
  totalCount: number;
  capturedCount: number;
  refundedCount: number;
  unpaidCount: number;
  capturedAmount: number;
  refundedAmount: number;
};
