
export interface Order {
  orderId: string;
  dateCreated: string;
  currency: string;
  amount: number;
  status: OrderStatus;
  productName?: string;
}

export interface ProductOrderStatistics {
  allOrdersCount: number;
  processingOrdersCount: number;
  cancelledOrdersCount: number;
  failedOrdersCount: number;
  completedOrdersCount: number;
  inTransitOrdersCount: number;
  paymentCompletedCount: number;
}

export interface ProductOrderRequest {
  productId: string | null;
  customerId: string | null;
  status: OrderStatus | null;
  orderId: string | null;
  productCategory: string | null;
  vendorId: string | null;
  page: number ;
  size: number;
}

export type OrderStatus = 
  | 'PROCESSING'
  | 'ACTIVE'
  | 'FAILED'
  | 'IN_TRANSIT'
  | 'COMPLETED'
  | 'PAYMENT_COMPLETED'
  | 'VENDOR_PROCESSING_START'
  | 'VENDOR_PROCESSING_COMPLETED'
  | 'REJECTED'
  | "";

export const Status = {
  failed: "FAILED",
  processing: "PROCESSING",
  rejected: "REJECTED",
  inTransit: "IN_TRANSIT",
  paid: "PAYMENT_COMPLETED",
  started: "VENDOR_PROCESSING_START",
  completed: "VENDOR_PROCESSING_COMPLETED",
  all: null
} as const;