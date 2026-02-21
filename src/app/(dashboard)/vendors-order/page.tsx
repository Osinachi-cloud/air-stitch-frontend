'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useCallFetch, useFetch } from '@/hooks/useFetch';
import {
  ProductOrderRequest,
  ProductOrderStatistics,
  Order,
  OrderDetail,
  OrdersResponse,
  OrderStatsResponse,
  SingleOrderResponse,
  OrderStatus,
} from '@/types/order';
import { baseUrL } from '@/env/URLs';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import MobileOrderItem from './MobileOrderItem';

interface VendorOrdersProps {
  vendorId?: string;
  baseUrl?: string;
}

// Define status options properly typed
const statusOptions = {
  all: null,
  processing: 'PROCESSING' as OrderStatus,
  failed: 'FAILED' as OrderStatus,
  rejected: 'REJECTED' as OrderStatus,
  inTransit: 'IN_TRANSIT' as OrderStatus,
  paid: 'PAYMENT_COMPLETED' as OrderStatus,
  started: 'VENDOR_PROCESSING_START' as OrderStatus,
  completed: 'COMPLETED' as OrderStatus,
};

const VendorOrders: React.FC<VendorOrdersProps> = ({
  vendorId
}) => {
  const [productOrderRequest, setProductOrderRequest] = useState<ProductOrderRequest>({
    page: 0,
    size: 10,
    status: null,
    orderId: null,
    vendorId: vendorId || null,
  });

  const [orderTotal, setOrderTotal] = useState<number>(0);
  const [numOfPages, setNumOfPages] = useState<number>(0);
  const [showOrderModal, setShowOrderModal] = useState<boolean>(false);
  const [orderRef, setOrderRef] = useState<string>('');
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
  const [showBodyMeasurementModal, setShowBodyMeasurementModal] = useState<boolean>(false);
  const [isLoadingOrderDetail, setIsLoadingOrderDetail] = useState<boolean>(false);

  const buildUrl = (productOrderRequest: ProductOrderRequest): string => {
    let url = "";

    if (productOrderRequest.orderId != null && productOrderRequest.orderId !== '') {
      url += "&orderId=" + productOrderRequest.orderId;
    }

    if (productOrderRequest.productCategory != null && productOrderRequest.productCategory !== '') {
      url += "&productCategory=" + productOrderRequest.productCategory;
    }

    if (productOrderRequest.productId != null && productOrderRequest.productId !== '') {
      url += "&productId=" + productOrderRequest.productId;
    }

    if (productOrderRequest.status != null && productOrderRequest.status !== '') {
      url += "&status=" + productOrderRequest.status;
    }

    if (productOrderRequest.vendorId != null && productOrderRequest.vendorId !== '') {
      url += "&vendorId=" + productOrderRequest.vendorId;
    }

    if (url.length > 0) {
      return url.substring(1);
    }
    return url;
  };

  const dynamicParams = buildUrl(productOrderRequest);
  const separator = dynamicParams ? '&' : '';

  const fetchOrdersUrl = `${baseUrL}/fetch-vendor-orders?page=${productOrderRequest.page}&size=${productOrderRequest.size}${separator}${dynamicParams}`;
  const getOrderByIdUrl = `${baseUrL}/get-order-by-orderId?orderId=${orderRef}`;
  const orderStatsUrl = `${baseUrL}/order-stats-for-vendor`;

  const {
    data: ordersData,
    isLoading: ordersLoading,
    error: ordersError,
    callApi: refetchOrders
  } = useFetch('GET', null, fetchOrdersUrl);

  const {
    data: SingleOrderData,
    isLoading: singleOrdersLoading,
    error: singleOrderError,
    callApi: refetchSingleOrder,
  } = useCallFetch('GET', null, getOrderByIdUrl, true);

  const {
    data: statsData,
    isLoading: statsLoading,
    error: statsError,
    callApi: refetchStats
  } = useFetch('GET', null, orderStatsUrl);

  const { value, getUserDetails } = useLocalStorage("userDetails", null);
  const token = getUserDetails()?.accessToken;

  const fetchOrderDetail = async (orderId: string) => {
    setIsLoadingOrderDetail(true);
    try {
      const response = await fetch(`${baseUrL}/fetch-vendor-orders?orderId=${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Order detail API response:', data);

      // The API returns the order in data.data[0]
      if (data.data && data.data.length > 0) {
        const order = data.data[0];
        setOrderDetail(order);
        console.log('Order detail set:', order);
      } else {
        console.error('No order data found in response');
        setOrderDetail(null);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      setOrderDetail(null);
    } finally {
      setIsLoadingOrderDetail(false);
    }
  };

  const updateProductOrder = async (orderId: string) => {
    if (!orderDetail) return;

    let orderStatus = '';
    switch (orderDetail.status) {
      case 'PAYMENT_COMPLETED':
        orderStatus = 'VENDOR_PROCESSING_START';
        break;
      case 'VENDOR_PROCESSING_START':
        orderStatus = 'VENDOR_PROCESSING_COMPLETED';
        break;
      case 'VENDOR_PROCESSING_COMPLETED':
        orderStatus = 'IN_TRANSIT';
        break;
      case 'IN_TRANSIT':
        orderStatus = 'COMPLETED';
        break;
      default:
        console.log('Invalid status transition');
        return;
    }

    try {
      const response = await fetch(`${baseUrL}/update-order-status/${orderId}?orderStatus=${orderStatus}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: orderStatus }),
      });

      if (response.ok) {
        refetchOrders();
        refetchStats();
        setShowOrderModal(false);
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const vendorsOrder = useMemo(() => {
    // Check the actual response structure from your API
    const data = ordersData;
    console.log('Orders data structure:', data);

    if (data?.data) {
      // If data.data is an array, return it
      if (Array.isArray(data.data)) {
        return data.data;
      }
      // If data.data is an object with a data property
      if (data.data.data && Array.isArray(data.data.data)) {
        return data.data.data;
      }
      // If data.data is an object with fetchVendorOrdersBy
      if (data.data.fetchVendorOrdersBy?.data) {
        return data.data.fetchVendorOrdersBy.data;
      }
    }

    // Fallback to empty array
    return [];
  }, [ordersData]);

  const productOrderStatistics = useMemo(() => {
    return statsData || {
      allOrdersCount: 0,
      processingOrdersCount: 0,
      cancelledOrdersCount: 0,
      failedOrdersCount: 0,
      completedOrdersCount: 0,
      inTransitOrdersCount: 0,
      paymentCompletedCount: 0,
    };
  }, [statsData]);

  useEffect(() => {
    if (ordersData) {
      console.log('Orders data received:', ordersData);

      let total = 0;

      // Check different possible total locations
      if (ordersData.total !== undefined) {
        total = ordersData.total;
      } else if (ordersData.data?.total !== undefined) {
        total = ordersData.data.total;
      } else if (ordersData.data?.fetchVendorOrdersBy?.total !== undefined) {
        total = ordersData.data.fetchVendorOrdersBy.total;
      }

      if (total > 0) {
        setOrderTotal(total);

        if (total % productOrderRequest.size === 0) {
          setNumOfPages(total / productOrderRequest.size);
        } else {
          setNumOfPages(1 + Math.floor(total / productOrderRequest.size));
        }
      }
    }
  }, [ordersData, productOrderRequest.size]);

  const filterByStatus = (statusValue: OrderStatus | null) => {
    setProductOrderRequest(prev => ({
      ...prev,
      status: statusValue,
      page: 0,
    }));
  };

  const nextPage = () => {
    if (productOrderRequest.page + 1 < numOfPages) {
      setProductOrderRequest(prev => ({
        ...prev,
        page: prev.page + 1,
      }));
    }
  };

  const previousPage = () => {
    if (productOrderRequest.page > 0) {
      setProductOrderRequest(prev => ({
        ...prev,
        page: prev.page - 1,
      }));
    }
  };

  const handlePageSizeChange = (size: number) => {
    setProductOrderRequest(prev => ({
      ...prev,
      size,
      page: 0,
    }));
  };

  const toggleOrderModal = async (orderId: string) => {
    setOrderRef(orderId);
    setShowOrderModal(true);
    await fetchOrderDetail(orderId);
  };

  const toggleBodyMeasurementModal = async (orderId: string) => {
    setOrderRef(orderId);
    setShowBodyMeasurementModal(true);
    await fetchOrderDetail(orderId);
  };

  const handleSearch = () => {
    setProductOrderRequest(prev => ({ ...prev, page: 0 }));
    refetchOrders();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setProductOrderRequest(prev => ({ ...prev, orderId: value || null }));
  };

  // Status display helper
  const getStatusDisplay = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
      PROCESSING: { bg: 'bg-lightgrey', text: 'text-[black]', label: 'PROCESSING' },
      ACTIVE: { bg: 'bg-[#e9dffc]', text: 'text-[#7b57fc]', label: 'ACTIVE' },
      FAILED: { bg: 'bg-[#fdeae9]', text: 'text-[#F57E77]', label: 'FAILED' },
      IN_TRANSIT: { bg: 'bg-[#E4E7FD]', text: 'text-[#5570F1]', label: 'IN TRANSIT' },
      COMPLETED: { bg: 'bg-[#DEEEE7]', text: 'text-[#32936F]', label: 'COMPLETED' },
      PAYMENT_COMPLETED: { bg: 'bg-[#ffecca]', text: 'text-orange-500', label: 'PAID' },
      VENDOR_PROCESSING_START: { bg: 'bg-[#d6fcd3]', text: 'text-[#36d761]', label: 'STARTED' },
      VENDOR_PROCESSING_COMPLETED: { bg: 'bg-[#d4e1f9]', text: 'text-[#387dfd]', label: 'COMPLETED' },
      REJECTED: { bg: 'bg-[#fdeae9]', text: 'text-[#F57E77]', label: 'REJECTED' }
    };

    const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-600', label: status };

    return (
      <div className={`${config.bg} p-2 py-1 text-[12px] flex items-center justify-center w-[120px] gap-4 rounded`}>
        <span className={config.text}>{config.label}</span>
      </div>
    );
  };

  // Loading state
  if (statsLoading && !statsData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#F5F4F7] min-h-screen p-2 md:p-4 lg:p-6 xl:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-20 gap-4">
        <div>
          <h2 className="text-[#15192C] font-semibold text-xl md:text-2xl xl:text-[27px] leading-4">Vendor Orders Summary</h2>
        </div>
        <div className="flex justify-center gap-2 items-center bg-white p-3 md:p-4 rounded-xl cursor-pointer w-full md:w-auto hover:bg-gray-50">
          <div className="flex justify-center h-5">
            <span className="text-[#7B57FC] text-lg">↓</span>
          </div>
          <span className="text-[#7B57FC] text-sm md:text-base">Export</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-4 xl:gap-8">
        {[
          { label: 'All Orders', count: productOrderStatistics.allOrdersCount, icon: '🛒', bgColor: 'bg-black', status: statusOptions.all },
          { label: 'In Transit', count: productOrderStatistics.inTransitOrdersCount, icon: '⏰', bgColor: 'bg-gray-500', status: statusOptions.inTransit },
          { label: 'Processing', count: productOrderStatistics.processingOrdersCount, icon: '⏳', bgColor: 'bg-[#7B57FC]', status: statusOptions.processing },
          { label: 'Paid', count: productOrderStatistics.paymentCompletedCount, icon: '💰', bgColor: 'bg-[#519C66]', status: statusOptions.paid },
          { label: 'Cancelled', count: productOrderStatistics.cancelledOrdersCount, icon: '✕', bgColor: 'bg-[#CC5F5F]', status: statusOptions.rejected },
          // { label: 'Failed', count: productOrderStatistics.failedOrdersCount, icon: '🔄', bgColor: 'bg-[#2148C0]', status: statusOptions.failed },
          { label: 'Delivered', count: productOrderStatistics.completedOrdersCount, icon: '✓', bgColor: 'bg-[#519C66]', status: statusOptions.completed },
        ].map((item, index) => (
          <div
            key={index}
            onClick={() => filterByStatus(item.status)}
            className="cursor-pointer flex justify-between bg-white rounded-xl p-3 md:p-3 xl:p-3 gap-4 hover:bg-[#dddfdf] transition-colors"
          >
            <div>
              <div className="text-gray-500 text-base leading-6">{item.label}</div>
              <div className="flex items-center gap-1">
                <span className="text-xl font-medium leading-8">{item.count}</span>
              </div>
            </div>
            <div>
              <div className={`${item.bgColor} w-10 h-10 md:w-12 md:h-12 flex justify-center items-center rounded-full`}>
                <span className="text-white text-base md:text-lg">{item.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl mt-8 md:mt-12 overflow-hidden">
        <div className="p-4 md:p-6 pt-6 md:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-2">
            <div className="flex justify-center gap-2 items-center bg-white p-3 rounded-xl">
              <span className="text-base md:text-lg font-medium">Vendors Orders</span>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="bg-[#FBFBFB] border rounded-xl flex p-2 flex-1 md:flex-none md:w-96">
                <div className="flex justify-center items-center cursor-pointer px-2" onClick={handleSearch}>
                  <span className="text-gray-400 text-sm">🔍</span>
                </div>
                <input
                  value={productOrderRequest.orderId || ''}
                  onChange={handleSearchChange}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  type="text"
                  className="block p-1 w-full bg-[#FBFBFB] text-gray-900 outline-none rounded-lg text-sm md:text-base"
                  placeholder="Search by amount, payment method..."
                />
              </div>
              <div className="flex items-center gap-4 cursor-pointer border p-3 rounded-xl whitespace-nowrap hover:bg-gray-50">
                <div>
                  <span className="text-sm">📅</span>
                </div>
                <span className="text-sm hidden md:inline">Filter</span>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {ordersLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : ordersError ? (
            <div className="text-center p-8 text-red-500">
              Error loading orders: {ordersError}
            </div>
          ) : vendorsOrder.length === 0 ? (
            <div className="text-center p-8 text-gray-500">
              No orders found
            </div>
          ) : (
            <>
              {/* Mobile View */}
              {/* <div className="md:hidden">
                {vendorsOrder.map((order: any, index: any) => (
                  <div key={index} className="border-b p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center">
                        <input
                          id={`checkbox-mobile-${order.orderId || index}`}
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                      </div>
                      <div className="text-right">
                        {getStatusDisplay(order.status)}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs font-bold text-gray-500">PRODUCT:</span>
                        <span>{order.productName || order.orderId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs font-bold text-gray-500">DATE:</span>
                        <span>{order.dateCreated || new Date().toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs font-bold text-gray-500">ORDER ID:</span>
                        <span className="text-sm">{order.orderId || `ORD-${index}`}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs font-bold text-gray-500">AMOUNT:</span>
                        <span>{order.currency || 'NGN'} {order.amount?.toLocaleString() || '0'}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <div className="relative inline-block text-left w-full">
                        <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded inline-flex items-center justify-between w-full">
                          Actions
                          <svg className="fill-current h-4 w-4 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                          </svg>
                        </button>
                        <div className="absolute z-50 mt-2 w-full bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                          <div className="py-1">
                            <button
                              onClick={() => toggleOrderModal(order.orderId || `ORD-${index}`)}
                              className="block w-full text-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              View Order
                            </button>
                            <button
                              onClick={() => toggleBodyMeasurementModal(order.orderId || `ORD-${index}`)}
                              className="block w-full text-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              View Measurement
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div> */}

              {/* Mobile View */}
              <div className="md:hidden">
                {vendorsOrder.map((order: any, index: any) => (
                  <MobileOrderItem
                    key={index}
                    order={order}
                    index={index}
                    getStatusDisplay={getStatusDisplay}
                    toggleOrderModal={toggleOrderModal}
                    toggleBodyMeasurementModal={toggleBodyMeasurementModal}
                  />
                ))}
              </div>

              {/* Desktop View */}
              <table className="min-w-full divide-y divide-gray-200 hidden md:table">
                <thead className="bg-gray-50 text-sm italic font-thin text-[#374151] uppercase">
                  <tr className="border-b">
                    <th scope="col" className="px-6 lg:px-8 py-3">
                      <div className="flex items-center">
                        <input
                          id="checkbox-all-search"
                          type="checkbox"
                          className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <label htmlFor="checkbox-all-search" className="sr-only">Payment ID</label>
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tracking Id</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Total</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vendorsOrder.map((order: any, index: any) => (
                    <tr key={index} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 lg:px-8 py-4 whitespace-nowrap text-gray-900">
                        <div className="flex items-center">
                          <input
                            id={`checkbox-${order.orderId || index}`}
                            type="checkbox"
                            className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-normal text-gray-900 text-[12px]">
                        <span>{order.productName || order.orderId}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-normal text-gray-900 text-[12px]">
                        <span>{order.dateCreated || new Date().toLocaleDateString()}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-normal text-gray-900">
                        <span className="text-sm">{order.orderId || `ORD-${index}`}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-normal text-gray-900 text-[12px] ">
                        <span className='wrap'>{order.currency || 'NGN'} {order.amount?.toLocaleString() || '0'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-normal text-gray-900">
                        {getStatusDisplay(order.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-normal text-gray-900">
                        <div className="relative inline-block text-left group">
                          <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded inline-flex items-center text-[12px]">
                            Actions
                            <svg className="fill-current h-4 w-4 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                          </button>
                          <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                            <div className="py-1">
                              <button
                                onClick={() => toggleOrderModal(order.orderId || `ORD-${index}`)}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                View Order
                              </button>
                              <button
                                onClick={() => toggleBodyMeasurementModal(order.orderId || `ORD-${index}`)}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                View Measurement
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {/* Pagination */}
          {vendorsOrder.length > 0 && (
            <div className="mt-6 bg-white flex flex-col sm:flex-row items-center justify-between p-4 gap-3 border-t">
              <div className="flex items-center gap-2 order-2 sm:order-1">
                <span className="whitespace-nowrap text-sm text-gray-600">Rows:</span>
                <select
                  value={productOrderRequest.size}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="outline-none text-[#4B5563] text-sm rounded focus:ring-blue-500 focus:border-blue-500 block p-1 border"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                </select>
              </div>

              <div className="flex items-center gap-3 order-1 sm:order-2">
                <div className="text-sm text-gray-600 whitespace-nowrap">
                  {productOrderRequest.page + 1} of {numOfPages}
                </div>

                <div className="flex gap-1">
                  <button
                    className="p-2 rounded cursor-pointer border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                    onClick={previousPage}
                    disabled={productOrderRequest.page === 0}
                  >
                    <span className="text-sm">←</span>
                  </button>
                  <button
                    className="p-2 rounded cursor-pointer border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                    onClick={nextPage}
                    disabled={productOrderRequest.page + 1 >= numOfPages}
                  >
                    <span className="text-sm">→</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Body Measurement Modal */}
      <Modal
        isOpen={showBodyMeasurementModal}
        onClose={() => setShowBodyMeasurementModal(false)}
        title="Body Measurements"
      >
        {isLoadingOrderDetail ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : orderDetail ? (
          <div className="p-4 md:p-8 grid gap-4">
            {SingleOrderData?.bodyMeasurementDto ? (
              <>
                <div className="grid gap-2">
                  <h3 className="text-lg font-semibold">TOP (CM)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                    {[
                      { label: 'Neck', value: SingleOrderData.bodyMeasurementDto.neck },
                      { label: 'Shoulder', value: SingleOrderData.bodyMeasurementDto.shoulder },
                      { label: 'Tummy', value: SingleOrderData.bodyMeasurementDto.tummy },
                      { label: 'Short Sleeve', value: SingleOrderData.bodyMeasurementDto.shortSleeveAtBiceps },
                      { label: 'Hip Width', value: SingleOrderData.bodyMeasurementDto.hipWidth },
                      { label: 'Mid Sleeve (Elbow)', value: SingleOrderData.bodyMeasurementDto.midSleeveAtElbow },
                      { label: 'Chest', value: SingleOrderData.bodyMeasurementDto.chest },
                      { label: 'Length (Neck to Hip)', value: SingleOrderData.bodyMeasurementDto.neckToHipLength },
                      { label: 'Long Sleeve (wrist)', value: SingleOrderData.bodyMeasurementDto.longSleeveAtWrist },
                    ].map((item, index) => (
                      <div key={index} className="col-span-1 h-12 flex items-center">
                        <span className="text-gray-500 mr-2">{item.label}:</span>
                        <span className="font-medium">{item.value || 'N/A'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-2">
                  <h3 className="text-lg font-semibold">TROUSER (CM)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                    {[
                      { label: 'Waist', value: SingleOrderData.bodyMeasurementDto.waist },
                      { label: 'Knee', value: SingleOrderData.bodyMeasurementDto.knee },
                      { label: 'Ankle', value: SingleOrderData.bodyMeasurementDto.ankle },
                      { label: 'Thigh', value: SingleOrderData.bodyMeasurementDto.thigh },
                      { label: 'Knee Length', value: SingleOrderData.bodyMeasurementDto.knee },
                      { label: 'Trouser Length', value: SingleOrderData.bodyMeasurementDto.trouserLength },
                    ].map((item, index) => (
                      <div key={index} className="col-span-1 h-12 flex items-center">
                        <span className="text-gray-500 mr-2">{item.label}:</span>
                        <span className="font-medium">{item.value || 'N/A'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No body measurements available for this order.</p>
              </div>
            )}
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setShowBodyMeasurementModal(false)}
                className="bg-black text-white text-lg py-3 px-8 rounded font-medium cursor-pointer hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Unable to load order details.</p>
            <button
              onClick={() => setShowBodyMeasurementModal(false)}
              className="mt-4 bg-black text-white text-lg py-2 px-6 rounded font-medium cursor-pointer hover:bg-gray-800"
            >
              Close
            </button>
          </div>
        )}
      </Modal>

      {/* Order Detail Modal */}
      <Modal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        title="Order Details"
      >
        {isLoadingOrderDetail ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : orderDetail ? (
          <div className="p-4 md:p-8 grid gap-4">
            <div className="text-[#3D3D3D] grid gap-4">
              {[
                { label: 'Amount Paid', value: `${orderDetail.currency || 'NGN'} ${orderDetail.amount || '0'}.00` },
                { label: 'Quantity', value: orderDetail.quantity || 1 },
                { label: 'Charges', value: '2.00' },
                { label: 'Date', value: orderDetail.dateCreated || 'N/A' },
                { label: 'Order Reference', value: orderDetail.orderId || 'N/A' },
                { label: 'Status', value: orderDetail.status ? orderDetail.status.replaceAll('_', ' ').toLowerCase() : 'N/A' },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between border-b py-3 border-gray-300"
                >
                  <div className="text-gray-600">{item.label}</div>
                  <div className="font-medium">{item.value}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-between mt-8 gap-4">
              <button
                onClick={() => setShowOrderModal(false)}
                className="bg-black text-white text-lg py-3 px-8 rounded font-medium cursor-pointer hover:bg-gray-800 order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                onClick={() => updateProductOrder(orderRef)}
                className="bg-[#5cd1f8] text-white text-lg py-3 px-8 rounded font-medium cursor-pointer hover:bg-[#4ac0e7] flex items-center justify-center gap-2 order-1 sm:order-2"
              >
                {(() => {
                  switch (orderDetail.status) {
                    case 'PAYMENT_COMPLETED': return 'Accept Order';
                    // case 'PROCESSING': return 'Order Processing';
                    case 'VENDOR_PROCESSING_START': return 'Complete Order';
                    case 'VENDOR_PROCESSING_COMPLETED': return 'In Transit';
                    case 'IN_TRANSIT': return 'Delivered';
                    default: return 'Next';
                  }
                })()}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Unable to load order details.</p>
            <button
              onClick={() => setShowOrderModal(false)}
              className="mt-4 bg-black text-white text-lg py-2 px-6 rounded font-medium cursor-pointer hover:bg-gray-800"
            >
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

// Modal Component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <div
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-white px-6 pt-6 pb-4">
              <div className="flex items-center justify-between">
                {title && (
                  <h3 className="text-lg font-semibold leading-6 text-gray-900">
                    {title}
                  </h3>
                )}
                <button
                  type="button"
                  className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={onClose}
                >
                  <span className="sr-only">Close</span>
                  <span className="text-2xl">×</span>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="bg-white px-6 pb-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VendorOrders;