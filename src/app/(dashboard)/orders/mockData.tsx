// services/mockData.ts
import { Order, ProductOrderStatistics, ProductOrderRequest } from '@/types/order';

export const mockOrderStatistics: ProductOrderStatistics = {
  allOrdersCount: 150,
  processingOrdersCount: 25,
  cancelledOrdersCount: 10,
  failedOrdersCount: 5,
  completedOrdersCount: 85,
  inTransitOrdersCount: 15,
  paymentCompletedCount: 110
};

export const mockOrders: Order[] = [
  {
    orderId: "ORD-001",
    dateCreated: "2024-01-15",
    currency: "₦",
    amount: 25000,
    status: "PAYMENT_COMPLETED",
    productName: "Wireless Headphones"
  },
  {
    orderId: "ORD-002",
    dateCreated: "2024-01-16",
    currency: "₦",
    amount: 15000,
    status: "IN_TRANSIT",
    productName: "Smart Watch"
  },
  {
    orderId: "ORD-003",
    dateCreated: "2024-01-17",
    currency: "₦",
    amount: 45000,
    status: "PAYMENT_COMPLETED",
    productName: "Laptop Bag"
  },
  {
    orderId: "ORD-004",
    dateCreated: "2024-01-18",
    currency: "₦",
    amount: 12000,
    status: "PROCESSING",
    productName: "Phone Case"
  },
  {
    orderId: "ORD-005",
    dateCreated: "2024-01-19",
    currency: "₦",
    amount: 8000,
    status: "FAILED",
    productName: "USB Cable"
  },
  {
    orderId: "ORD-006",
    dateCreated: "2024-01-20",
    currency: "₦",
    amount: 32000,
    status: "REJECTED",
    productName: "Tablet Stand"
  }
];

// Mock API calls
export const mockOrderService = {
  getOrderStats: (): Promise<{ data: { getProductOrderStatsByCustomer: ProductOrderStatistics } }> => {
    return Promise.resolve({
      data: {
        getProductOrderStatsByCustomer: mockOrderStatistics
      }
    });
  },

  getCustomerOrders: (request: ProductOrderRequest): Promise<{ 
    data: { 
      fetchCustomerOrdersBy: { 
        data: Order[]; 
        total: number; 
      } 
    } 
  }> => {
    // Filter orders based on request
    let filteredOrders = [...mockOrders];
    
    if (request.status) {
      filteredOrders = filteredOrders.filter(order => order.status === request.status);
    }
    
    if (request.orderId) {
      filteredOrders = filteredOrders.filter(order => 
        order.orderId.toLowerCase().includes(request.orderId!.toLowerCase())
      );
    }

    const startIndex = request.page * request.size;
    const paginatedOrders = filteredOrders.slice(startIndex, startIndex + request.size);

    return Promise.resolve({
      data: {
        fetchCustomerOrdersBy: {
          data: paginatedOrders,
          total: filteredOrders.length
        }
      }
    });
  }
};