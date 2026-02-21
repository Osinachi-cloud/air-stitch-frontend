export interface Order {
  orderId: string;
  dateCreated: string;
  amount: number;
  currency: string;
  status: string | OrderStatus;
  productName?: string;
  customerName?: string;
  quantity?: number;
  bodyMeasurementDto?: BodyMeasurementDto;

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
  productId?: string | null;
  customerId?: string | null;
  status?: OrderStatus | null | string;
  orderId?: string | null;
  productCategory?: string | null;
  vendorId?: string | null;
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












// Updated to match your API response structure


export interface ProductOrderStatistics {
  allOrdersCount: number;
  processingOrdersCount: number;
  cancelledOrdersCount: number;
  failedOrdersCount: number;
  completedOrdersCount: number;
  inTransitOrdersCount: number;
  paymentCompletedCount: number;
}


export interface BodyMeasurementDto {
  neck: string | number;
  shoulder: string | number;
  tummy: string | number;
  shortSleeveAtBiceps: string | number;
  hipWidth: string | number;
  midSleeveAtElbow: string | number;
  chest: string | number;
  neckToHipLength: string | number;
  longSleeveAtWrist: string | number;
  waist: string | number;
  knee: string | number;
  ankle: string | number;
  thigh: string | number; 
  trouserLength: string | number;
}

export interface OrderDetail {
  orderId: string;
  amount: number;
  quantity: number;
  dateCreated: string;
  status: string;
  bodyMeasurementDto?: BodyMeasurementDto;
  currency?: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  success?: boolean;
}

// Response interfaces matching your API structure
export interface OrdersResponse {
  data: {
    fetchVendorOrdersBy?: {
      data: Order[];
      total: number;
      page?: number;
    };
  };
}

export interface OrderStatsResponse {
  data: {
    getProductOrderStatsByVendor: ProductOrderStatistics;
  };
}

export interface SingleOrderResponse {
  data: {
    getOrderByOrderId: OrderDetail;
  };
}

export interface VendorOrdersProps {
  vendorId?: string;
  baseUrl?: string;
}