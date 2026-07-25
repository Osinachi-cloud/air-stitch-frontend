'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

import { Order, ProductOrderStatistics, ProductOrderRequest, Status, OrderStatus } from '@/types/order';
import { baseUrL } from '@/env/URLs';
import { useFetch } from '@/hooks/useFetch';
import { useLocalStorage } from '@/hooks/useLocalStorage';
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
  const router = useRouter();
  const { getUserDetails } = useLocalStorage("customerDetails", null);
  const stored = getUserDetails();
  const customerId = stored?.customerId || (stored?.emailAddress as string) || "";

  const [orderTotal, setOrderTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  
  // Use ref to track previous request to prevent unnecessary re-renders
  const prevRequestRef = useRef<string>('');


  const [productOrderRequest, setProductOrderRequest] = useState<ProductOrderRequest>({
    productId: null,
    customerId: customerId || null,
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
      PROCESSING: { bg: 'bg-surface-100', text: 'text-surface-700', label: 'PROCESSING' },
      ACTIVE: { bg: 'bg-primary-100', text: 'text-primary-700', label: 'ACTIVE' },
      FAILED: { bg: 'bg-red-100', text: 'text-red-700', label: 'FAILED' },
      IN_TRANSIT: { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'IN TRANSIT' },
      COMPLETED: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'COMPLETED' },
      PAYMENT_COMPLETED: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'PAID' },
      VENDOR_PROCESSING_START: { bg: 'bg-teal-100', text: 'text-teal-700', label: 'STARTED' },
      VENDOR_PROCESSING_COMPLETED: { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'COMPLETED' },
      REJECTED: { bg: 'bg-red-100', text: 'text-red-700', label: 'REJECTED' },
      ""   :  {bg: 'bg-surface-100', text: 'text-surface-700', label: ''}
    };

    const config = statusConfig[status] || statusConfig.PROCESSING;

    return (
      <div className={`${config.bg} px-2 py-0.5 text-[11px] font-semibold rounded-full inline-flex items-center`}>
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
    <div className="py-6 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-20 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-surface-300 text-surface-600 hover:border-primary-600 hover:text-primary-700 hover:bg-primary-50 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <h2 className="text-lg font-display font-bold text-surface-800">Orders Summary</h2>
          </div>

        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white px-3 py-2 rounded-xl border border-surface-200 hover:bg-surface-50 transition-colors disabled:opacity-50 text-xs font-semibold"
          >
            <RefreshCw className={`w-4 h-4 text-surface-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="text-surface-600">Refresh</span>
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white px-3 py-2 rounded-xl border border-surface-200 hover:bg-surface-50 transition-colors text-xs font-semibold">
            <Download className="w-4 h-4 text-surface-600" />
            <span className="text-surface-600">Export</span>
          </button>
        </div>
      </div>

      {/* Stats Cards - Responsive grid */}
      <div className="grid sm:grid-cols-4 grid-cols-2 gap-2 md:gap-3 mb-4 md:mb-6">
        {statCards.map((card) => (
          <div
            key={card.title}
            onClick={() => filterByStatus(card.status)}
            className={`cursor-pointer rounded-2xl overflow-hidden transition-all duration-200 shadow-card ${
              productOrderRequest.status === card.status || (card.status === Status.all && productOrderRequest.status === null)
                ? 'ring-2 ring-primary-500 shadow-card-hover'
                : 'hover:shadow-md'
            }`}
          >
            <div className={`${card.bgColor} p-3 md:p-4`}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-surface-500 text-[11px] font-semibold mb-0.5 md:mb-1">{card.title}</p>
                  <p className="text-lg md:text-xl font-display font-bold text-surface-800">{card.value}</p>
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
        <div className="bg-white rounded-2xl shadow-card border border-surface-100 p-3 mb-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-4 h-4" />
              <input
                value={productOrderRequest.orderId || ''}
                onChange={handleSearchChange}
                type="text"
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-surface-200 rounded-xl focus:ring-2 focus:ring-primary-300 focus:border-primary-400"
                placeholder="Search by order ID..."
              />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border border-surface-200 rounded-xl hover:bg-surface-50 transition-colors">
              <Filter className="w-3.5 h-3.5 text-surface-500" />
              <span className="text-surface-600">Filter</span>
            </button>
          </div>
        </div>

        {/* Orders List - Mobile Cards */}
        <div className="space-y-3">
          {ordersLoading || isRefreshing ? (
            <div className="bg-white rounded-lg p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-3"></div>
              <p className="text-surface-500 text-sm">Loading orders...</p>
            </div>
          ) : customersOrder?.data?.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center">
              <Package className="w-10 h-10 text-surface-300 mx-auto mb-3" />
              <p className="text-sm text-surface-500">No orders found</p>
            </div>
          ) : (
            customersOrder?.data?.map((order: any) => (
              <div key={order.orderId} className="bg-white rounded-2xl shadow-card border border-surface-100 overflow-hidden">
                {/* Card Header */}
                <div className="p-4 border-b border-surface-100">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-surface-100 rounded-xl flex items-center justify-center">
                          <Package className="w-4 h-4 text-surface-500" />
                        </div>
                        <span className="text-sm font-medium text-surface-800">{order.productName || "Product Name"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-surface-500">{order.orderId}</span>
                        {getStatusBadge(order.status)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                      <p className="text-xs text-surface-500 mb-1">Amount</p>
                      <p className="text-sm font-semibold text-surface-800">{formatNaira(order.amount)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-surface-500 mb-1">Date</p>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-surface-400" />
                        <span className="text-xs text-surface-600">{order.dateCreated}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Card Actions */}
                <div className="px-4 py-2 bg-surface-50 flex justify-between items-center">
                  <button
                    onClick={(e) => handleViewOrder(order, e)}
                    className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                  <button
                    onClick={() => toggleExpandOrder(order.orderId)}
                    className="flex items-center gap-1 text-sm text-surface-600"
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
                  <div className="p-4 border-t border-surface-100 bg-surface-50">
                    <div className="space-y-3">
                      <div>
                        <p className="text-[11px] text-surface-500 uppercase font-medium mb-1">Customer ID</p>
                        <p className="text-sm text-surface-700">{order.customerId}</p>
                      </div>
                      {order.productVariationDto && (
                        <div>
                          <p className="text-[11px] text-surface-500 uppercase font-medium mb-1">Variations</p>
                          <div className="flex gap-2">
                            <span className="text-xs bg-white px-2 py-1 rounded-lg border border-surface-200">
                              Color: {order.productVariationDto.color}
                            </span>
                            <span className="text-xs bg-white px-2 py-1 rounded-lg border border-surface-200">
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
            <div className="bg-white rounded-2xl shadow-card border border-surface-100 p-3">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-surface-600">
                    Showing {customersOrder?.data?.length} of {customersOrder?.total} orders
                  </span>
                  <select
                    value={productOrderRequest.size}
                    onChange={(e) => handleSizeChange(Number(e.target.value))}
                    className="px-2 py-1 text-xs border border-surface-200 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-400"
                  >
                    <option value={10}>10/page</option>
                    <option value={20}>20/page</option>
                    <option value={30}>30/page</option>
                    <option value={50}>50/page</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-surface-600">
                    Page {productOrderRequest.page} of {totalNumberOfPages}
                  </span>
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 rounded-lg border border-surface-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors text-xs font-semibold"
                      onClick={() => handlePageChange(productOrderRequest.page - 1)}
                      disabled={productOrderRequest.page === 1}
                    >
                      Previous
                    </button>
                    <button
                      className="px-3 py-1 rounded-lg border border-surface-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors text-xs font-semibold"
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
      <div className="hidden md:block bg-white rounded-2xl shadow-card border border-surface-100 overflow-hidden">
        {/* Table Header */}
        <div className="p-4 border-b border-surface-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-sm font-display font-bold text-surface-800">Customer Orders</h2>
              <p className="text-xs text-surface-500 mt-0.5">
                Showing {customersOrder?.data?.length || 0} of {customersOrder?.total || 0} orders
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-4 h-4" />
                <input
                  value={productOrderRequest.orderId || ''}
                  onChange={handleSearchChange}
                  type="text"
                  className="w-full pl-9 pr-3 py-1.5 text-sm bg-white border border-surface-200 rounded-xl focus:ring-2 focus:ring-primary-300 focus:border-primary-400"
                  placeholder="Search by order ID..."
                />
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-surface-200 rounded-xl hover:bg-surface-50 transition-colors">
                <Filter className="w-3.5 h-3.5 text-surface-500" />
                <span className="text-surface-600">Filter</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {ordersLoading || isRefreshing ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-3"></div>
                <p className="text-surface-500 text-sm">Loading orders...</p>
              </div>
            </div>
          ) : customersOrder?.data?.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-10 h-10 text-surface-300 mx-auto mb-3" />
              <p className="text-sm text-surface-500">No orders found</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-surface-100">
              <thead className="bg-surface-50">
                <tr>
                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-surface-500 uppercase tracking-wider">Product</th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-surface-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-surface-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-surface-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-surface-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-surface-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-surface-100">
                {customersOrder?.data?.map((order: any) => (
                  <tr key={order.orderId} className="hover:bg-primary-50/50 transition-colors">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-surface-100 rounded-xl flex items-center justify-center">
                          <Package className="w-4 h-4 text-surface-500" />
                        </div>
                        <span className="text-sm text-surface-800">{order.productName || "Product Name"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-surface-400" />
                        <span className="text-sm text-surface-600">{order.dateCreated}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm font-semibold text-surface-800">
                        {formatNaira(order.amount)}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-sm font-mono text-surface-600">{order.orderId}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-4 py-2.5">
                      <button
                        onClick={(e) => handleViewOrder(order, e)}
                        className="text-surface-500 hover:text-primary-600 transition-colors"
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
        <div className="px-4 py-2.5 border-t border-surface-100 bg-surface-50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-surface-600">Rows per page:</span>
              <select
                value={productOrderRequest.size}
                onChange={(e) => handleSizeChange(Number(e.target.value))}
                className="px-2 py-1 text-xs border border-surface-200 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-400"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-surface-600">
                Page {productOrderRequest.page} of {totalNumberOfPages}
              </span>
              <div className="flex gap-1">
                <button
                  className="p-1.5 rounded-lg border border-surface-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors"
                  onClick={() => handlePageChange(productOrderRequest.page - 1)}
                  disabled={productOrderRequest.page === 1}
                >
                  <ChevronLeft className="w-4 h-4 text-surface-600" />
                </button>
                <button
                  className="p-1.5 rounded-lg border border-surface-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors"
                  onClick={() => handlePageChange(productOrderRequest.page + 1)}
                  disabled={productOrderRequest.page >= totalNumberOfPages}
                >
                  <ChevronRight className="w-4 h-4 text-surface-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Details Modal - Compact Mobile First Design */}
      {showModal && selectedOrder && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-t-2xl md:rounded-2xl shadow-elegant w-full md:max-w-md max-h-[90vh] overflow-y-auto animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-surface-100 px-4 py-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-surface-600" />
                <h3 className="text-sm font-display font-bold text-surface-800">Order Details</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-surface-400 hover:text-surface-600 transition-colors p-1"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Content - Compact Layout */}
            <div className="p-4 space-y-4">
              {/* Order ID and Status Row */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[11px] text-surface-500 uppercase font-medium mb-1">Order ID</p>
                  <p className="text-sm font-mono text-surface-800 bg-surface-50 px-2 py-1 rounded-lg">{selectedOrder.orderId}</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-surface-500 uppercase font-medium mb-1">Status</p>
                  {getStatusBadge(selectedOrder.status)}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-surface-100"></div>

              {/* Product Info */}
              <div>
                <p className="text-[11px] text-surface-500 uppercase font-medium mb-2">Product Information</p>
                <div className="bg-surface-50 rounded-xl p-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-surface-600">Product Name</span>
                    <span className="text-sm font-semibold text-surface-800">{selectedOrder.productName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-surface-600">Amount</span>
                    <span className="text-sm font-bold text-surface-800">{formatNaira(selectedOrder.amount)}</span>
                  </div>
                  {selectedOrder.productVariationDto && (
                    <div className="flex justify-between">
                      <span className="text-sm text-surface-600">Variations</span>
                      <div className="text-right">
                        <span className="text-xs text-surface-700 block">Color: {selectedOrder.productVariationDto.color}</span>
                        <span className="text-xs text-surface-700">Sleeve: {selectedOrder.productVariationDto.sleeveType}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Info */}
              <div>
                <p className="text-[11px] text-surface-500 uppercase font-medium mb-2">Order Information</p>
                <div className="bg-surface-50 rounded-xl p-3 space-y-2">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-surface-400" />
                      <span className="text-sm text-surface-600">Order Date</span>
                    </div>
                    <span className="text-sm text-surface-900">{selectedOrder.dateCreated}</span>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-surface-400" />
                      <span className="text-sm text-surface-600">Customer ID</span>
                    </div>
                    <span className="text-sm font-mono text-surface-900">{selectedOrder.customerId}</span>
                  </div>
                </div>
              </div>

              {/* Additional Info if available */}
              {selectedOrder.trackingNumber && (
                <div>
                  <p className="text-xs text-surface-500 uppercase font-medium mb-2">Tracking</p>
                  <div className="bg-surface-50 rounded-lg p-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-surface-600">Tracking Number</span>
                      <span className="text-sm font-mono text-surface-900">{selectedOrder.trackingNumber}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-surface-100 px-4 py-3">
              <button
                onClick={() => setShowModal(false)}
                className="w-full px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors text-xs font-semibold"
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

