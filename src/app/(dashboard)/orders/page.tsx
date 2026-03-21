// 'use client';

// import { useState, useEffect, useMemo } from 'react';
// import { Order, ProductOrderStatistics, ProductOrderRequest, Status, OrderStatus } from '@/types/order';
// import { mockOrderService } from './mockData';
// import { baseUrL } from '@/env/URLs';
// import { useFetch } from '@/hooks/useFetch';

// const Orders = () => {
//   const [orderTotal, setOrderTotal] = useState<number>(0);
//   const [isLoading, setIsLoading] = useState<boolean>(true);

//   const [productOrderRequest, setProductOrderRequest] = useState<ProductOrderRequest>({
//     productId: null,
//     customerId: "user123",
//     status: null,
//     orderId: null,
//     productCategory: null,
//     vendorId: null,
//     page: 1,
//     size: 10
//   });

//   const buildUrl = (productOrderRequest: ProductOrderRequest): string => {
//     let url = "";

//     if (productOrderRequest.orderId != null && productOrderRequest.orderId !== '') {
//       url += "&orderId=" + productOrderRequest.orderId;
//     }

//     if (productOrderRequest.productCategory != null && productOrderRequest.productCategory !== '') {
//       url += "&productCategory=" + productOrderRequest.productCategory;
//     }

//     if (productOrderRequest.productId != null && productOrderRequest.productId !== '') {
//       url += "&productId=" + productOrderRequest.productId;
//     }

//     if (productOrderRequest.status != null && productOrderRequest.status !== '') {
//       url += "&status=" + productOrderRequest.status;
//     }

//     if (productOrderRequest.vendorId != null && productOrderRequest.vendorId !== '') {
//       url += "&vendorId=" + productOrderRequest.vendorId;
//     }

//     if (url.length > 0) {
//       return url.substring(1);
//     }
//     return url;
//   };

//   const dynamicParams = buildUrl(productOrderRequest);
//   const separator = dynamicParams ? '&' : '';

//   const fetchOrdersUrl = `${baseUrL}/fetch-customer-orders?page=${productOrderRequest?.page - 1}&size=${productOrderRequest.size}${separator}${dynamicParams}`;

//   const {
//     data: customersOrder,
//     isLoading: ordersLoading,
//     error: ordersError,
//     callApi: refetchOrders
//   } = useFetch("GET", null, fetchOrdersUrl);

//   const fetchStatsUrl = `${baseUrL}/order-stats-for-customer`;

//   const {
//     data: productOrderStatistics,
//     isLoading: orderStatLoading,
//     error: orderStatError,
//     callApi: refetchOrderStat
//   } = useFetch("GET", null, fetchStatsUrl);

//   // Fixed useMemo for totalNumberOfPages
//   const totalNumberOfPages = useMemo(() => {
//     if (!customersOrder?.total || !productOrderRequest?.size) {
//       return 1; // Default to 1 page if data is not available
//     }

//     const total = customersOrder.total;
//     const size = productOrderRequest.size;

//     if (total % size === 0) {
//       return total / size;
//     } else {
//       return 1 + Math.floor(total / size);
//     }
//   }, [customersOrder?.total, productOrderRequest?.size]);

//   const filterByStatus = (status: OrderStatus | null) => {
//     setProductOrderRequest(prev => ({
//       ...prev,
//       status,
//       orderId: null,
//       page: 1
//     }));
//   };

//   const nextPage = (): void => {
//     if (productOrderRequest.page < totalNumberOfPages) {
//       const newPage = productOrderRequest.page + 1;
//       setProductOrderRequest(prev => ({ ...prev, page: newPage }));
//     }
//   };

//   const previousPage = (): void => {
//     if (productOrderRequest.page > 1) {
//       const newPage = productOrderRequest.page - 1;
//       setProductOrderRequest(prev => ({ ...prev, page: newPage }));
//     }
//   };

//   const getSize = (size: number): void => {
//     setProductOrderRequest(prev => ({ ...prev, size, page: 1 }));
//   };

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setProductOrderRequest(prev => ({ ...prev, orderId: value }));
//   };

//   const getStatusBadge = (status: OrderStatus) => {
//     const statusConfig: Record<OrderStatus, { bg: string; text: string; label: string }> = {
//       PROCESSING: { bg: 'bg-[lightgrey]', text: 'text-[#fff]', label: 'PROCESSING' },
//       ACTIVE: { bg: 'bg-[#e9dffc]', text: 'text-[#7b57fc]', label: 'ACTIVE' },
//       FAILED: { bg: 'bg-[#fdeae9]', text: 'text-[#F57E77]', label: 'FAILED' },
//       IN_TRANSIT: { bg: 'bg-[#E4E7FD]', text: 'text-[#5570F1]', label: 'IN TRANSIT' },
//       COMPLETED: { bg: 'bg-[#DEEEE7]', text: 'text-[#32936F]', label: 'COMPLETED' },
//       PAYMENT_COMPLETED: { bg: 'bg-[#fef2dc]', text: 'text-[orange]', label: 'PAID' },
//       VENDOR_PROCESSING_START: { bg: 'bg-[#d9fcd1]', text: 'text-[#30a532]', label: 'STARTED' },
//       VENDOR_PROCESSING_COMPLETED: { bg: 'bg-[#d4e1f9]', text: 'text-[#387dfd]', label: 'COMPLETED' },
//       REJECTED: { bg: 'bg-[#fdeae9]', text: 'text-[#F57E77]', label: 'REJECTED' },
//       ""   :  {bg: 'bg-[#f9f9f9]' ,  text: 'text-[#f9f9f9]',label: ''}
//     };

//     const config = statusConfig[status] || statusConfig.PROCESSING;

//     return (
//       <div className={`${config.bg} p-2 py-1 text-[12px] flex items-center justify-center w-[120px] gap-4 rounded`}>
//         <span className={config.text}>{config.label}</span>
//       </div>
//     );
//   };

//   return (
//     <div className="bg-[#F5F4F7] min-h-screen p-2 md:p-4 lg:p-6">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-20 gap-4">
//         <div>
//           <h2 className="text-[#15192C] font-semibold text-xl md:text-2xl leading-8">Orders Summary</h2>
//         </div>
//         <div className="flex justify-center gap-2 items-center bg-white p-3 md:p-4 rounded-xl cursor-pointer w-full md:w-auto">
//           <div className="flex justify-center h-5">
//             <span className="text-[#7B57FC] text-lg">↓</span>
//           </div>
//           <span className="text-[#7B57FC] text-sm md:text-base">Export</span>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
//         <div
//           onClick={() => filterByStatus(Status.all)}
//           className="cursor-pointer flex justify-between bg-white rounded-xl p-4 md:p-6 gap-4 hover:bg-[#dddfdf] transition-colors"
//         >
//           <div>
//             <div className="text-gray-500 text-sm md:text-base leading-6">All Orders</div>
//             <div className="flex items-center gap-1">
//               <span className="text-lg md:text-xl font-medium leading-8">{productOrderStatistics?.allOrdersCount}</span>
//             </div>
//           </div>
//           <div>
//             <div className="bg-black w-8 h-8 md:w-10 md:h-10 flex justify-center items-center rounded-full">
//               <span className="text-white text-sm md:text-base">🛒</span>
//             </div>
//           </div>
//         </div>

//         <div
//           onClick={() => filterByStatus(Status.inTransit)}
//           className="cursor-pointer flex justify-between bg-white rounded-xl p-4 md:p-6 gap-4 hover:bg-[#dddfdf] transition-colors"
//         >
//           <div>
//             <div className="text-gray-500 text-sm md:text-base leading-6">In Transit</div>
//             <div className="flex items-center gap-1">
//               <span className="text-lg md:text-xl font-medium leading-8">{productOrderStatistics?.inTransitOrdersCount}</span>
//             </div>
//           </div>
//           <div>
//             <div className="bg-gray-500 w-8 h-8 md:w-10 md:h-10 flex justify-center items-center rounded-full">
//               <span className="text-white text-sm md:text-base">⏰</span>
//             </div>
//           </div>
//         </div>

//         <div
//           onClick={() => filterByStatus(Status.paid)}
//           className="cursor-pointer flex justify-between bg-white rounded-xl p-4 md:p-6 gap-4 hover:bg-[#dddfdf] transition-colors"
//         >
//           <div>
//             <div className="text-gray-500 text-sm md:text-base leading-6">Paid</div>
//             <div className="flex items-center gap-1">
//               <span className="text-lg md:text-xl font-medium leading-8">{productOrderStatistics?.paymentCompletedCount}</span>
//             </div>
//           </div>
//           <div>
//             {/* <div className="bg-gray-500 w-8 h-8 md:w-10 md:h-10 flex justify-center items-center rounded-full">
//               <span className="text-white text-sm md:text-base">⏰</span>
//             </div> */}
//             <div className="bg-[#519C66] w-8 h-8 md:w-10 md:h-10 flex justify-center items-center rounded-full">
//               <span className="text-white text-sm md:text-base">✓</span>
//             </div>
//           </div>
//         </div>

//         {/* <div
//           onClick={() => filterByStatus(Status.rejected)}
//           className="cursor-pointer flex justify-between bg-white rounded-xl p-4 md:p-6 gap-4 hover:bg-[#dddfdf] transition-colors"
//         >
//           <div>
//             <div className="text-gray-500 text-sm md:text-base leading-6">Cancelled</div>
//             <div className="flex items-center gap-1">
//               <span className="text-lg md:text-xl font-medium leading-8">{productOrderStatistics?.cancelledOrdersCount}</span>
//             </div>
//           </div>
//           <div>
//             <div className="bg-[#CC5F5F] w-8 h-8 md:w-10 md:h-10 flex justify-center items-center rounded-full">
//               <span className="text-white text-sm md:text-base">✕</span>
//             </div>
//           </div>
//         </div> */}

//         <div
//           onClick={() => filterByStatus(Status.failed)}
//           className="cursor-pointer flex justify-between bg-white rounded-xl p-4 md:p-6 gap-4 hover:bg-[#dddfdf] transition-colors"
//         >
//           <div>
//             <div className="text-gray-500 text-sm md:text-base leading-6">Failed</div>
//             <div className="flex items-center gap-1">
//               <span className="text-lg md:text-xl font-medium leading-8">{productOrderStatistics?.failedOrdersCount}</span>
//             </div>
//           </div>
//           <div>
//             {/* <div className="bg-[#2148C0] w-8 h-8 md:w-10 md:h-10 flex justify-center items-center rounded-full">
//               <span className="text-white text-sm md:text-base">🔄</span>
//             </div> */}
//             <div>
//               <div className="bg-[#CC5F5F] w-8 h-8 md:w-10 md:h-10 flex justify-center items-center rounded-full">
//                 <span className="text-white text-sm md:text-base">✕</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* <div
//           onClick={() => filterByStatus(Status.completed)}
//           className="cursor-pointer flex justify-between bg-white rounded-xl p-4 md:p-6 gap-4 hover:bg-[#dddfdf] transition-colors"
//         >
//           <div>
//             <div className="text-gray-500 text-sm md:text-base leading-6">Delivered</div>
//             <div className="flex items-center gap-1">
//               <span className="text-lg md:text-xl font-medium leading-8">{productOrderStatistics?.completedOrdersCount}</span>
//             </div>
//           </div>
//           <div>
//             <div className="bg-[#519C66] w-8 h-8 md:w-10 md:h-10 flex justify-center items-center rounded-full">
//               <span className="text-white text-sm md:text-base">✓</span>
//             </div>
//           </div>
//         </div> */}
//       </div>

//       {/* Orders Table */}
//       <div className="bg-white rounded-xl mt-6 md:mt-8 overflow-hidden">
//         <div className="p-4 md:p-6 pt-6 md:pt-8">
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 py-2">
//             <div className="flex justify-center gap-2 items-center bg-white p-3 rounded-xl">
//               <span className="text-base md:text-lg font-medium">Customer Orders</span>
//             </div>
//             <div className="flex items-center gap-2 w-full sm:w-auto">
//               <div className="bg-[#FBFBFB] border rounded-xl flex p-2 flex-1 sm:flex-none sm:w-64">
//                 <div className="flex justify-center items-center cursor-pointer px-2" onClick={refetchOrders}>
//                   <span className="text-gray-400 text-sm">🔍</span>
//                 </div>
//                 <input
//                   value={productOrderRequest.orderId || ''}
//                   onChange={handleSearchChange}
//                   onKeyPress={(e) => e.key === 'Enter' && refetchOrders()}
//                   type="text"
//                   className="block p-1 w-full bg-[#FBFBFB] text-gray-900 outline-none rounded-lg text-sm"
//                   placeholder="Search orders..."
//                 />
//               </div>
//               <div className="flex items-center gap-2 cursor-pointer border p-2 rounded-xl whitespace-nowrap flex-shrink-0">
//                 <span className="text-sm">📅</span>
//                 <span className="text-sm hidden sm:inline">Filter</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           {ordersLoading ? (
//             <div className="p-8 text-center">Loading...</div>
//           ) : (
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50 hidden md:table-header-group text-xs md:text-sm italic font-thin text-[#374151] uppercase">
//                 <tr className="border-b">
//                   <th scope="col" className="px-4 md:px-6 lg:px-8 py-3">
//                     <div className="flex items-center">
//                       <input
//                         id="checkbox-all-search"
//                         type="checkbox"
//                         className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
//                       />
//                       <label htmlFor="checkbox-all-search" className="sr-only">Payment ID</label>
//                     </div>
//                   </th>
//                   <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
//                   <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
//                   <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
//                   <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tracking Id</th>
//                   <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {customersOrder && customersOrder?.data?.map((order: any) => (
//                   <tr key={order.orderId} className="block md:table-row hover:bg-teal-50 transition duration-150 border-b">
//                     <td className="hidden md:table-cell px-4 md:px-6 lg:px-8 py-3 whitespace-nowrap text-gray-900">
//                       <div className="flex items-center">
//                         <input
//                           id={`checkbox-${order.orderId}`}
//                           type="checkbox"
//                           className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
//                         />
//                         <label htmlFor={`checkbox-${order.orderId}`} className="sr-only">checkbox</label>
//                       </div>
//                     </td>

//                     <td className="px-4 py-3 md:py-4 md:px-6 flex items-center gap-2 md:table-cell whitespace-normal text-gray-900">
//                       <span className="md:hidden text-xs font-bold text-gray-500 whitespace-nowrap">PRODUCT:</span>
//                       <span>{order.productName || "Product Name"}</span>
//                     </td>

//                     <td className="px-4 py-3 md:py-4 md:px-6 flex items-center gap-2 md:table-cell whitespace-normal text-gray-900">
//                       <span className="md:hidden text-xs font-bold text-gray-500 whitespace-nowrap">DATE:</span>
//                       <span>{order.dateCreated}</span>
//                     </td>

//                     <td className="px-4 py-3 md:py-4 md:px-6 flex items-center gap-2 md:table-cell whitespace-normal text-gray-900">
//                       <span className="md:hidden text-xs font-bold text-gray-500 whitespace-nowrap">AMOUNT:</span>
//                       <span>{order.currency}{order.amount.toLocaleString()}</span>
//                     </td>

//                     <td className="px-4 py-3 md:py-4 md:px-6 flex items-center gap-2 md:table-cell whitespace-normal text-gray-900">
//                       <span className="md:hidden text-xs font-bold text-gray-500 whitespace-nowrap">ORDER ID:</span>
//                       <span className="text-sm">{order.orderId}</span>
//                     </td>

//                     <td className="px-4 py-3 md:py-4 md:px-6 flex items-center gap-2 md:table-cell whitespace-normal text-gray-900">
//                       <span className="md:hidden text-xs font-bold text-gray-500 whitespace-nowrap">STATUS:</span>
//                       {getStatusBadge(order.status)}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>

//         <div className="mt-6 bg-white flex flex-col sm:flex-row items-center justify-between p-4 gap-3 border-t">
//           <div className="flex items-center gap-2 order-2 sm:order-1">
//             <span className="whitespace-nowrap text-sm text-gray-600">Rows:</span>
//             <select
//               value={productOrderRequest.size}
//               onChange={(e) => getSize(Number(e.target.value))}
//               className="outline-none text-[#4B5563] text-sm rounded focus:ring-blue-500 focus:border-blue-500 block p-1 border"
//             >
//               <option value={10}>10</option>
//               <option value={20}>20</option>
//               <option value={30}>30</option>
//             </select>
//           </div>

//           <div className="flex items-center gap-3 order-1 sm:order-2">
//             <div className="text-sm text-gray-600 whitespace-nowrap">
//               {productOrderRequest.page} of {totalNumberOfPages}
//             </div>

//             <div className="flex gap-1">
//               <button
//                 className="p-2 rounded cursor-pointer border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
//                 onClick={previousPage}
//                 disabled={productOrderRequest.page === 1}
//               >
//                 <span className="text-sm">←</span>
//               </button>
//               <button
//                 className="p-2 rounded cursor-pointer border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
//                 onClick={nextPage}
//                 disabled={productOrderRequest.page >= totalNumberOfPages}
//               >
//                 <span className="text-sm">→</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Orders;








'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Order, ProductOrderStatistics, ProductOrderRequest, Status, OrderStatus } from '@/types/order';
import { baseUrL } from '@/env/URLs';
import { useFetch } from '@/hooks/useFetch';
import { 
  ShoppingBag, 
  Truck, 
  CreditCard, 
  XCircle, 
  Search, 
  Filter, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  Package,
  Calendar,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  MapPin,
  User,
  Clock
} from 'lucide-react';

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  
  // Use ref to track previous request to prevent unnecessary re-renders
  const prevRequestRef = useRef<string>('');

  const [productOrderRequest, setProductOrderRequest] = useState<ProductOrderRequest>({
    productId: null,
    customerId: "user123",
    status: null,
    orderId: null,
    productCategory: null,
    vendorId: null,
    page: 1,
    size: 10
  });

  // Build URL with all parameters - memoized properly
  const fetchOrdersUrl = useMemo(() => {
    const params = new URLSearchParams();
    
    params.append('page', (productOrderRequest.page - 1).toString());
    params.append('size', productOrderRequest.size.toString());
    
    if (productOrderRequest.orderId && productOrderRequest.orderId !== '') {
      params.append('orderId', productOrderRequest.orderId);
    }
    if (productOrderRequest.productCategory && productOrderRequest.productCategory !== '') {
      params.append('productCategory', productOrderRequest.productCategory);
    }
    if (productOrderRequest.productId && productOrderRequest.productId !== '') {
      params.append('productId', productOrderRequest.productId);
    }
    if (productOrderRequest.status && productOrderRequest.status !== '') {
      params.append('status', productOrderRequest.status);
    }
    if (productOrderRequest.vendorId && productOrderRequest.vendorId !== '') {
      params.append('vendorId', productOrderRequest.vendorId);
    }
    
    return `${baseUrL}/fetch-customer-orders?${params.toString()}`;
  }, [
    productOrderRequest.page, 
    productOrderRequest.size, 
    productOrderRequest.orderId, 
    productOrderRequest.status, 
    productOrderRequest.productCategory, 
    productOrderRequest.productId, 
    productOrderRequest.vendorId
  ]);

  // Use a separate state to trigger manual fetches
  const [fetchTrigger, setFetchTrigger] = useState(0);

  // Use the existing useFetch hook with a stable URL reference
  const {
    data: customersOrder,
    isLoading: ordersLoading,
    error: ordersError,
    callApi: refetchOrders
  } = useFetch("GET", null, fetchOrdersUrl);

  const fetchStatsUrl = `${baseUrL}/order-stats-for-customer`;

  const {
    data: productOrderStatistics,
    isLoading: orderStatLoading,
    error: orderStatError,
    callApi: refetchOrderStat
  } = useFetch("GET", null, fetchStatsUrl);

  // Only fetch when URL actually changes (not on every render)
  useEffect(() => {
    const currentUrl = fetchOrdersUrl;
    if (prevRequestRef.current !== currentUrl) {
      prevRequestRef.current = currentUrl;
      refetchOrders();
    }
  }, [fetchOrdersUrl, refetchOrders]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refetchOrders(), refetchOrderStat()]);
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [refetchOrders, refetchOrderStat]);

  const totalNumberOfPages = useMemo(() => {
    if (customersOrder?.totalPages) {
      return customersOrder.totalPages;
    }
    if (customersOrder?.total && productOrderRequest?.size) {
      return Math.ceil(customersOrder.total / productOrderRequest.size);
    }
    return 1;
  }, [customersOrder?.totalPages, customersOrder?.total, productOrderRequest?.size]);

  const filterByStatus = useCallback((status: OrderStatus | null) => {
    setProductOrderRequest(prev => ({
      ...prev,
      status: status === Status.all ? null : status,
      orderId: null,
      page: 1
    }));
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= totalNumberOfPages) {
      setProductOrderRequest(prev => ({ ...prev, page: newPage }));
    }
  }, [totalNumberOfPages]);

  const handleSizeChange = useCallback((newSize: number) => {
    setProductOrderRequest(prev => ({ ...prev, size: newSize, page: 1 }));
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setProductOrderRequest(prev => ({ ...prev, orderId: value || null, page: 1 }));
  }, []);

  const handleViewOrder = useCallback((order: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedOrder(order);
    setShowModal(true);
  }, []);

  const toggleExpandOrder = useCallback((orderId: string) => {
    setExpandedOrderId(prev => prev === orderId ? null : orderId);
  }, []);

  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // const formatDate = (dateString: string) => {
  //   const date = new Date(dateString);
  //   return date.toLocaleDateString('en-NG', {
  //     day: 'numeric',
  //     month: 'short',
  //     year: 'numeric'
  //   });
  // };

  const getStatusBadge = (status: OrderStatus) => {
    const statusConfig: Record<OrderStatus, { bg: string; text: string; label: string }> = {
      PROCESSING: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'PROCESSING' },
      ACTIVE: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'ACTIVE' },
      FAILED: { bg: 'bg-red-100', text: 'text-red-700', label: 'FAILED' },
      IN_TRANSIT: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'IN TRANSIT' },
      COMPLETED: { bg: 'bg-green-100', text: 'text-green-700', label: 'COMPLETED' },
      PAYMENT_COMPLETED: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'PAID' },
      VENDOR_PROCESSING_START: { bg: 'bg-teal-100', text: 'text-teal-700', label: 'STARTED' },
      VENDOR_PROCESSING_COMPLETED: { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'COMPLETED' },
      REJECTED: { bg: 'bg-red-100', text: 'text-red-700', label: 'REJECTED' },
      ""   :  {bg: 'bg-gray-100', text: 'text-gray-700', label: ''}
    };

    const config = statusConfig[status] || statusConfig.PROCESSING;

    return (
      <div className={`${config.bg} px-2 py-1 text-xs font-medium rounded-full inline-flex items-center`}>
        <span className={config.text}>{config.label}</span>
      </div>
    );
  };

  const statCards = [
    {
      title: 'All Orders',
      value: productOrderStatistics?.allOrdersCount || 0,
      icon: ShoppingBag,
      color: 'from-gray-600 to-gray-800',
      bgColor: 'bg-gradient-to-br from-gray-50 to-gray-100',
      status: Status.all
    },
    {
      title: 'In Transit',
      value: productOrderStatistics?.inTransitOrdersCount || 0,
      icon: Truck,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
      status: Status.inTransit
    },
    {
      title: 'Paid',
      value: productOrderStatistics?.paymentCompletedCount || 0,
      icon: CreditCard,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
      status: Status.paid
    },
    {
      title: 'Failed',
      value: productOrderStatistics?.failedOrdersCount || 0,
      icon: XCircle,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-gradient-to-br from-red-50 to-red-100',
      status: Status.failed
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen p-3 md:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-3">
        <div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900">
            Orders Dashboard
          </h1>
          <p className="text-gray-500 text-xs md:text-sm mt-1">Track and manage all your orders</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white px-3 md:px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm"
          >
            <RefreshCw className={`w-4 h-4 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="text-gray-600">Refresh</span>
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white px-3 md:px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm">
            <Download className="w-4 h-4 text-gray-600" />
            <span className="text-gray-600">Export</span>
          </button>
        </div>
      </div>

      {/* Stats Cards - Responsive grid */}
      <div className="grid sm:grid-cols-4 grid-cols-2 gap-2 md:gap-3 mb-4 md:mb-6">
        {statCards.map((card) => (
          <div
            key={card.title}
            onClick={() => filterByStatus(card.status)}
            className={`cursor-pointer rounded-lg overflow-hidden transition-all duration-200 ${
              productOrderRequest.status === card.status || (card.status === Status.all && productOrderRequest.status === null)
                ? 'ring-2 ring-blue-500 shadow-md'
                : 'hover:shadow-md'
            }`}
          >
            <div className={`${card.bgColor} p-3 md:p-4`}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-gray-500 text-xs font-medium mb-0.5 md:mb-1">{card.title}</p>
                  <p className="text-lg md:text-xl font-semibold text-gray-800">{card.value}</p>
                </div>
                <div className={`bg-gradient-to-r ${card.color} p-1.5 md:p-2 rounded-lg shadow-sm`}>
                  <card.icon className="w-3 h-3 md:w-4 md:h-4 text-white" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Card View - Visible on mobile, hidden on desktop */}
      <div className="md:hidden">
        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                value={productOrderRequest.orderId || ''}
                onChange={handleSearchChange}
                type="text"
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Search by order ID..."
              />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-gray-600">Filter</span>
            </button>
          </div>
        </div>

        {/* Orders List - Mobile Cards */}
        <div className="space-y-3">
          {ordersLoading || isRefreshing ? (
            <div className="bg-white rounded-lg p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
              <p className="text-gray-500 text-sm">Loading orders...</p>
            </div>
          ) : customersOrder?.data?.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No orders found</p>
            </div>
          ) : (
            customersOrder?.data?.map((order: any) => (
              <div key={order.orderId} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Card Header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package className="w-4 h-4 text-gray-500" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{order.productName || "Product Name"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-gray-500">{order.orderId}</span>
                        {getStatusBadge(order.status)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Amount</p>
                      <p className="text-sm font-semibold text-gray-900">{formatNaira(order.amount)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Date</p>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-600">{order.dateCreated}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Card Actions */}
                <div className="px-4 py-2 bg-gray-50 flex justify-between items-center">
                  <button
                    onClick={(e) => handleViewOrder(order, e)}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                  <button
                    onClick={() => toggleExpandOrder(order.orderId)}
                    className="flex items-center gap-1 text-sm text-gray-600"
                  >
                    <span>{expandedOrderId === order.orderId ? 'Less' : 'More'}</span>
                    {expandedOrderId === order.orderId ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
                
                {/* Expanded Content */}
                {expandedOrderId === order.orderId && (
                  <div className="p-4 border-t border-gray-100 bg-gray-50">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-medium mb-1">Customer ID</p>
                        <p className="text-sm text-gray-700">{order.customerId}</p>
                      </div>
                      {order.productVariationDto && (
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-medium mb-1">Variations</p>
                          <div className="flex gap-2">
                            <span className="text-xs bg-white px-2 py-1 rounded border border-gray-200">
                              Color: {order.productVariationDto.color}
                            </span>
                            <span className="text-xs bg-white px-2 py-1 rounded border border-gray-200">
                              Sleeve: {order.productVariationDto.sleeveType}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
          
          {/* Mobile Pagination */}
          {!ordersLoading && customersOrder?.data?.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">
                    Showing {customersOrder?.data?.length} of {customersOrder?.total} orders
                  </span>
                  <select
                    value={productOrderRequest.size}
                    onChange={(e) => handleSizeChange(Number(e.target.value))}
                    className="px-2 py-1 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value={10}>10/page</option>
                    <option value={20}>20/page</option>
                    <option value={30}>30/page</option>
                    <option value={50}>50/page</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">
                    Page {productOrderRequest.page} of {totalNumberOfPages}
                  </span>
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 rounded border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors text-sm"
                      onClick={() => handlePageChange(productOrderRequest.page - 1)}
                      disabled={productOrderRequest.page === 1}
                    >
                      Previous
                    </button>
                    <button
                      className="px-3 py-1 rounded border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors text-sm"
                      onClick={() => handlePageChange(productOrderRequest.page + 1)}
                      disabled={productOrderRequest.page >= totalNumberOfPages}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Table View - Hidden on mobile */}
      <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Customer Orders</h2>
              <p className="text-xs text-gray-500 mt-1">
                Showing {customersOrder?.data?.length || 0} of {customersOrder?.total || 0} orders
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  value={productOrderRequest.orderId || ''}
                  onChange={handleSearchChange}
                  type="text"
                  className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Search by order ID..."
                />
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-gray-600">Filter</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {ordersLoading || isRefreshing ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                <p className="text-gray-500 text-sm">Loading orders...</p>
              </div>
            </div>
          ) : customersOrder?.data?.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No orders found</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customersOrder?.data?.map((order: any) => (
                  <tr key={order.orderId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package className="w-4 h-4 text-gray-500" />
                        </div>
                        <span className="text-sm text-gray-900">{order.productName || "Product Name"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-sm text-gray-600">{order.dateCreated}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {formatNaira(order.amount)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-mono text-gray-600">{order.orderId}</span>
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => handleViewOrder(order, e)}
                        className="text-gray-500 hover:text-blue-600 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Rows per page:</span>
              <select
                value={productOrderRequest.size}
                onChange={(e) => handleSizeChange(Number(e.target.value))}
                className="px-2 py-1 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                Page {productOrderRequest.page} of {totalNumberOfPages}
              </span>
              <div className="flex gap-1">
                <button
                  className="p-1.5 rounded border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors"
                  onClick={() => handlePageChange(productOrderRequest.page - 1)}
                  disabled={productOrderRequest.page === 1}
                >
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  className="p-1.5 rounded border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors"
                  onClick={() => handlePageChange(productOrderRequest.page + 1)}
                  disabled={productOrderRequest.page >= totalNumberOfPages}
                >
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Details Modal - Compact Mobile First Design */}
      {showModal && selectedOrder && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center justify-center"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-t-xl md:rounded-xl shadow-xl w-full md:max-w-md max-h-[90vh] overflow-y-auto animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Order Details</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Content - Compact Layout */}
            <div className="p-4 space-y-4">
              {/* Order ID and Status Row */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Order ID</p>
                  <p className="text-sm font-mono text-gray-900 bg-gray-50 px-2 py-1 rounded">{selectedOrder.orderId}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Status</p>
                  {getStatusBadge(selectedOrder.status)}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100"></div>

              {/* Product Info */}
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-2">Product Information</p>
                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Product Name</span>
                    <span className="text-sm font-medium text-gray-900">{selectedOrder.productName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Amount</span>
                    <span className="text-sm font-bold text-gray-900">{formatNaira(selectedOrder.amount)}</span>
                  </div>
                  {selectedOrder.productVariationDto && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Variations</span>
                      <div className="text-right">
                        <span className="text-xs text-gray-700 block">Color: {selectedOrder.productVariationDto.color}</span>
                        <span className="text-xs text-gray-700">Sleeve: {selectedOrder.productVariationDto.sleeveType}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Info */}
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-2">Order Information</p>
                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-sm text-gray-600">Order Date</span>
                    </div>
                    <span className="text-sm text-gray-900">{selectedOrder.dateCreated}</span>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-sm text-gray-600">Customer ID</span>
                    </div>
                    <span className="text-sm font-mono text-gray-900">{selectedOrder.customerId}</span>
                  </div>
                </div>
              </div>

              {/* Additional Info if available */}
              {selectedOrder.trackingNumber && (
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-2">Tracking</p>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Tracking Number</span>
                      <span className="text-sm font-mono text-gray-900">{selectedOrder.trackingNumber}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-3">
              <button
                onClick={() => setShowModal(false)}
                className="w-full px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Orders;