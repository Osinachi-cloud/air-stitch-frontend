'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useCallFetch, useFetch } from '@/hooks/useFetch';
import {
  ProductOrderRequest,
  OrderDetail,
  OrderStatus,
} from '@/types/order';
import { baseUrL } from '@/env/URLs';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import MobileOrderItem from './MobileOrderItem';


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

// const VendorOrders: React.FC<VendorOrdersProps> = ({
//   vendorId
// }) => {

const VendorOrders: React.FC = () => {
    const router = useRouter();
    const { value, getUserDetails } = useLocalStorage("tailorDetails", null);
    const userDetails = getUserDetails();
    const token = userDetails?.accessToken;
    // vendorId may be stored as vendorId or emailAddress depending on backend response
    const vendorId = userDetails?.vendorId || (userDetails?.emailAddress as string) || "";

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
      PROCESSING: { bg: 'bg-surface-200', text: 'text-surface-800', label: 'PROCESSING' },
      ACTIVE: { bg: 'bg-primary-100', text: 'text-primary-700', label: 'ACTIVE' },
      FAILED: { bg: 'bg-red-100', text: 'text-red-700', label: 'FAILED' },
      IN_TRANSIT: { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'IN TRANSIT' },
      COMPLETED: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'COMPLETED' },
      PAYMENT_COMPLETED: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'PAID' },
      VENDOR_PROCESSING_START: { bg: 'bg-green-100', text: 'text-green-700', label: 'STARTED' },
      VENDOR_PROCESSING_COMPLETED: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'COMPLETED' },
      REJECTED: { bg: 'bg-red-100', text: 'text-red-700', label: 'REJECTED' }
    };

    const config = statusConfig[status] || { bg: 'bg-surface-100', text: 'text-surface-600', label: status };

    return (
      <div className={`${config.bg} px-2.5 py-1 text-[11px] font-semibold flex items-center justify-center w-auto min-w-[100px] gap-2 rounded-full`}>
        <span className={config.text}>{config.label}</span>
      </div>
    );
  };

  // Loading state
  if (statsLoading && !statsData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="py-6 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-20 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-surface-300 text-surface-600 hover:border-primary-600 hover:text-primary-700 hover:bg-primary-50 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <h2 className="text-lg font-display font-bold text-surface-800">Vendor Orders Summary</h2>
          </div>
        </div>
        <div className="flex justify-center gap-2 items-center bg-white p-2.5 rounded-xl cursor-pointer w-full md:w-auto hover:bg-surface-50 shadow-card">
          <div className="flex justify-center h-5">
            <span className="text-primary-600 text-lg">↓</span>
          </div>
          <span className="text-primary-600 text-xs font-semibold">Export</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { label: 'All Orders', count: productOrderStatistics.allOrdersCount, icon: '🛒', bgColor: 'bg-black', status: statusOptions.all },
          { label: 'In Transit', count: productOrderStatistics.inTransitOrdersCount, icon: '⏰', bgColor: 'bg-surface-500', status: statusOptions.inTransit },
          { label: 'Processing', count: productOrderStatistics.processingOrdersCount, icon: '⏳', bgColor: 'bg-[#7B57FC]', status: statusOptions.processing },
          { label: 'Paid', count: productOrderStatistics.paymentCompletedCount, icon: '💰', bgColor: 'bg-[#519C66]', status: statusOptions.paid },
          { label: 'Cancelled', count: productOrderStatistics.cancelledOrdersCount, icon: '✕', bgColor: 'bg-[#CC5F5F]', status: statusOptions.rejected },
          // { label: 'Failed', count: productOrderStatistics.failedOrdersCount, icon: '🔄', bgColor: 'bg-[#2148C0]', status: statusOptions.failed },
          { label: 'Delivered', count: productOrderStatistics.completedOrdersCount, icon: '✓', bgColor: 'bg-[#519C66]', status: statusOptions.completed },
        ].map((item, index) => (
          <div
            key={index}
            onClick={() => filterByStatus(item.status)}
            className="cursor-pointer flex justify-between bg-white rounded-2xl shadow-card p-4 gap-3 hover:shadow-card-hover transition-all"
          >
            <div>
              <div className="text-xs font-medium text-surface-500">{item.label}</div>
              <div className="flex items-center gap-1">
                <span className="text-xl font-display font-bold text-surface-800">{item.count}</span>
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
      <div className="bg-white rounded-2xl shadow-card mt-6 overflow-hidden border border-surface-100">
        <div className="p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 py-2">
            <div className="flex justify-center gap-2 items-center bg-white p-2 rounded-xl">
              <span className="text-sm font-display font-bold text-surface-800">Vendors Orders</span>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="bg-surface-50 border border-surface-200 rounded-xl flex p-2 flex-1 md:flex-none md:w-80">
                <div className="flex justify-center items-center cursor-pointer px-2" onClick={handleSearch}>
                  <span className="text-surface-400 text-sm">🔍</span>
                </div>
                <input
                  value={productOrderRequest.orderId || ''}
                  onChange={handleSearchChange}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  type="text"
                  className="block p-1 w-full bg-surface-50 text-surface-800 rounded-lg text-sm"
                  placeholder="Search by amount, payment method..."
                />
              </div>
              <div className="flex items-center gap-2 cursor-pointer border border-surface-200 p-2 rounded-xl whitespace-nowrap hover:bg-surface-50 text-xs font-semibold">
                <div>
                  <span className="text-xs">📅</span>
                </div>
                <span className="text-sm hidden md:inline">Filter</span>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {ordersLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : ordersError ? (
            <div className="text-center p-8 text-red-500">
              Error loading orders: {ordersError}
            </div>
          ) : vendorsOrder.length === 0 ? (
            <div className="text-center p-8 text-surface-500">
              No orders found
            </div>
          ) : (
            <>
              {/* Mobile View */}
              {/* <div className="md:hidden">
                {vendorsOrder.map((order: any, index: any) => (
                  <div key={index} className="border-b p-4 hover:bg-surface-50">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center">
                        <input
                          id={`checkbox-mobile-${order.orderId || index}`}
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 bg-surface-100 border-surface-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                      </div>
                      <div className="text-right">
                        {getStatusDisplay(order.status)}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs font-bold text-surface-500">PRODUCT:</span>
                        <span>{order.productName || order.orderId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs font-bold text-surface-500">DATE:</span>
                        <span>{order.dateCreated || new Date().toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs font-bold text-surface-500">ORDER ID:</span>
                        <span className="text-xs">{order.orderId || `ORD-${index}`}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs font-bold text-surface-500">AMOUNT:</span>
                        <span>{order.currency || 'NGN'} {order.amount?.toLocaleString() || '0'}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <div className="relative inline-block text-left w-full">
                        <button className="bg-surface-100 hover:bg-surface-200 text-surface-800 font-medium py-2 px-4 rounded inline-flex items-center justify-between w-full">
                          Actions
                          <svg className="fill-current h-4 w-4 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                          </svg>
                        </button>
                        <div className="absolute z-50 mt-2 w-full bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                          <div className="py-1">
                            <button
                              onClick={() => toggleOrderModal(order.orderId || `ORD-${index}`)}
                              className="block w-full text-center px-4 py-2 text-sm text-surface-700 hover:bg-surface-100"
                            >
                              View Order
                            </button>
                            <button
                              onClick={() => toggleBodyMeasurementModal(order.orderId || `ORD-${index}`)}
                              className="block w-full text-center px-4 py-2 text-sm text-surface-700 hover:bg-surface-100"
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
              <table className="min-w-full divide-y divide-surface-100 hidden md:table">
                <thead className="bg-surface-50 text-[11px] font-semibold text-surface-500 uppercase">
                  <tr className="border-b border-surface-100">
                    <th scope="col" className="px-4 py-2.5">
                      <div className="flex items-center">
                        <input
                          id="checkbox-all-search"
                          type="checkbox"
                          className="w-3 h-3 text-primary-600 bg-surface-100 border-surface-300 rounded focus:ring-primary-300 focus:ring-2"
                        />
                        <label htmlFor="checkbox-all-search" className="sr-only">Payment ID</label>
                      </div>
                    </th>
                    <th scope="col" className="px-4 py-2.5 text-left text-[11px] font-semibold text-surface-500 uppercase tracking-wider">Product Name</th>
                    <th scope="col" className="px-4 py-2.5 text-left text-[11px] font-semibold text-surface-500 uppercase tracking-wider">Order Date</th>
                    <th scope="col" className="px-4 py-2.5 text-left text-[11px] font-semibold text-surface-500 uppercase tracking-wider">Tracking Id</th>
                    <th scope="col" className="px-4 py-2.5 text-left text-[11px] font-semibold text-surface-500 uppercase tracking-wider">Order Total</th>
                    <th scope="col" className="px-4 py-2.5 text-left text-[11px] font-semibold text-surface-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-4 py-2.5 text-left text-[11px] font-semibold text-surface-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-surface-100">
                  {vendorsOrder.map((order: any, index: any) => (
                    <tr key={index} className="hover:bg-primary-50/50 transition duration-150">
                      <td className="px-4 py-3 whitespace-nowrap text-surface-800">
                        <div className="flex items-center">
                          <input
                            id={`checkbox-${order.orderId || index}`}
                            type="checkbox"
                            className="w-3 h-3 text-primary-600 bg-surface-100 border-surface-300 rounded focus:ring-primary-300 focus:ring-2"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-normal text-surface-800 text-xs">
                        <span>{order.productName || order.orderId}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-normal text-surface-800 text-xs">
                        <span>{order.dateCreated || new Date().toLocaleDateString()}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-normal text-surface-800">
                        <span className="text-xs">{order.orderId || `ORD-${index}`}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-normal text-surface-800 text-xs">
                        <span className='wrap'>{order.currency || 'NGN'} {order.amount?.toLocaleString() || '0'}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-normal text-surface-800">
                        {getStatusDisplay(order.status)}
                      </td>
                      <td className="px-4 py-3 whitespace-normal text-surface-800">
                        <div className="relative inline-block text-left group">
                          <button className="bg-surface-100 hover:bg-surface-200 text-surface-800 font-medium py-1.5 px-3 rounded-lg inline-flex items-center text-xs">
                            Actions
                            <svg className="fill-current h-4 w-4 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                          </button>
                          <div className="absolute left-0 mt-2 w-44 bg-white rounded-xl shadow-elegant border border-surface-100 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                            <div className="py-1">
                              <button
                                onClick={() => toggleOrderModal(order.orderId || `ORD-${index}`)}
                                className="block w-full text-left px-3 py-2 text-xs text-surface-700 hover:bg-primary-50"
                              >
                                View Order
                              </button>
                              <button
                                onClick={() => toggleBodyMeasurementModal(order.orderId || `ORD-${index}`)}
                                className="block w-full text-left px-3 py-2 text-xs text-surface-700 hover:bg-primary-50"
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
            <div className="mt-4 bg-white flex flex-col sm:flex-row items-center justify-between p-4 gap-3 border-t border-surface-100">
              <div className="flex items-center gap-2 order-2 sm:order-1">
                <span className="whitespace-nowrap text-xs text-surface-600">Rows:</span>
                <select
                  value={productOrderRequest.size}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="text-surface-600 text-xs rounded-lg focus:ring-primary-300 focus:border-primary-400 block p-1 border border-surface-200"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                </select>
              </div>

              <div className="flex items-center gap-3 order-1 sm:order-2">
                <div className="text-xs text-surface-600 whitespace-nowrap">
                  {productOrderRequest.page + 1} of {numOfPages}
                </div>

                <div className="flex gap-1">
                  <button
                    className="p-1.5 rounded-lg cursor-pointer border border-surface-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-50 transition-colors"
                    onClick={previousPage}
                    disabled={productOrderRequest.page === 0}
                  >
                    <span className="text-xs">←</span>
                  </button>
                  <button
                    className="p-1.5 rounded-lg cursor-pointer border border-surface-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-50 transition-colors"
                    onClick={nextPage}
                    disabled={productOrderRequest.page + 1 >= numOfPages}
                  >
                    <span className="text-xs">→</span>
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : orderDetail ? (
          <div className="p-4 md:p-6 grid gap-3">
            {SingleOrderData?.bodyMeasurementDto ? (
              <>
                <div className="grid gap-2">
                  <h3 className="text-sm font-display font-bold text-surface-800">TOP (CM)</h3>
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
                      <div key={index} className="col-span-1 h-10 flex items-center text-sm">
                        <span className="text-surface-500 mr-2 text-xs">{item.label}:</span>
                        <span className="font-medium text-surface-800">{item.value || 'N/A'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-2">
                  <h3 className="text-sm font-display font-bold text-surface-800">TROUSER (CM)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                    {[
                      { label: 'Waist', value: SingleOrderData.bodyMeasurementDto.waist },
                      { label: 'Knee', value: SingleOrderData.bodyMeasurementDto.knee },
                      { label: 'Ankle', value: SingleOrderData.bodyMeasurementDto.ankle },
                      { label: 'Thigh', value: SingleOrderData.bodyMeasurementDto.thigh },
                      { label: 'Knee Length', value: SingleOrderData.bodyMeasurementDto.knee },
                      { label: 'Trouser Length', value: SingleOrderData.bodyMeasurementDto.trouserLength },
                    ].map((item, index) => (
                      <div key={index} className="col-span-1 h-10 flex items-center text-sm">
                        <span className="text-surface-500 mr-2 text-xs">{item.label}:</span>
                        <span className="font-medium text-surface-800">{item.value || 'N/A'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-surface-500">No body measurements available for this order.</p>
              </div>
            )}
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setShowBodyMeasurementModal(false)}
                className="bg-primary-600 hover:bg-primary-700 text-white text-sm py-2.5 px-6 rounded-xl font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-surface-500">Unable to load order details.</p>
            <button
              onClick={() => setShowBodyMeasurementModal(false)}
              className="mt-4 bg-primary-600 hover:bg-primary-700 text-white text-sm py-2 px-5 rounded-xl font-semibold cursor-pointer"
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : orderDetail ? (
          <div className="p-4 md:p-6 grid gap-3">
            <div className="text-surface-800 grid gap-3">
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
                  className="flex justify-between border-b py-2.5 border-surface-200"
                >
                  <div className="text-xs text-surface-600">{item.label}</div>
                  <div className="font-medium text-surface-800">{item.value}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-between mt-6 gap-3">
              <button
                onClick={() => setShowOrderModal(false)}
                className="bg-black text-white text-lg py-3 px-8 rounded font-medium cursor-pointer hover:bg-surface-800 order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                onClick={() => updateProductOrder(orderRef)}
                className="bg-primary-600 hover:bg-primary-700 text-white text-sm py-2.5 px-6 rounded-xl font-semibold cursor-pointer flex items-center justify-center gap-2 order-1 sm:order-2"
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
          <div className="text-center py-6">
            <p className="text-sm text-surface-500">Unable to load order details.</p>
            <button
              onClick={() => setShowOrderModal(false)}
              className="mt-4 bg-primary-600 hover:bg-primary-700 text-white text-sm py-2 px-5 rounded-xl font-semibold cursor-pointer"
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
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <div
            className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-elegant transition-all w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-white px-5 pt-5 pb-3">
              <div className="flex items-center justify-between">
                {title && (
                  <h3 className="text-sm font-display font-bold text-surface-800">
                    {title}
                  </h3>
                )}
                <button
                  type="button"
                  className="rounded-md bg-white text-surface-400 hover:text-surface-500"
                  onClick={onClose}
                >
                  <span className="sr-only">Close</span>
                  <span className="text-2xl">×</span>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="bg-white px-5 pb-5">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VendorOrders;

