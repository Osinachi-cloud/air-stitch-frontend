'use client';

import { useState, useEffect, useMemo } from 'react';
import { Order, ProductOrderStatistics, ProductOrderRequest, Status, OrderStatus } from '@/types/order';
import { mockOrderService } from './mockData';
import { baseUrL } from '@/env/URLs';
import { useFetch } from '@/hooks/useFetch';

const Orders = () => {
  const [orderTotal, setOrderTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

  const fetchOrdersUrl = `${baseUrL}/fetch-customer-orders?page=${productOrderRequest?.page - 1}&size=${productOrderRequest.size}${separator}${dynamicParams}`;

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

  // Fixed useMemo for totalNumberOfPages
  const totalNumberOfPages = useMemo(() => {
    if (!customersOrder?.total || !productOrderRequest?.size) {
      return 1; // Default to 1 page if data is not available
    }

    const total = customersOrder.total;
    const size = productOrderRequest.size;

    if (total % size === 0) {
      return total / size;
    } else {
      return 1 + Math.floor(total / size);
    }
  }, [customersOrder?.total, productOrderRequest?.size]);

  const filterByStatus = (status: OrderStatus | null) => {
    setProductOrderRequest(prev => ({
      ...prev,
      status,
      orderId: null,
      page: 1
    }));
  };

  const nextPage = (): void => {
    if (productOrderRequest.page < totalNumberOfPages) {
      const newPage = productOrderRequest.page + 1;
      setProductOrderRequest(prev => ({ ...prev, page: newPage }));
    }
  };

  const previousPage = (): void => {
    if (productOrderRequest.page > 1) {
      const newPage = productOrderRequest.page - 1;
      setProductOrderRequest(prev => ({ ...prev, page: newPage }));
    }
  };

  const getSize = (size: number): void => {
    setProductOrderRequest(prev => ({ ...prev, size, page: 1 }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setProductOrderRequest(prev => ({ ...prev, orderId: value }));
  };

  const getStatusBadge = (status: OrderStatus) => {
    const statusConfig: Record<OrderStatus, { bg: string; text: string; label: string }> = {
      PROCESSING: { bg: 'bg-[lightgrey]', text: 'text-[#fff]', label: 'PROCESSING' },
      ACTIVE: { bg: 'bg-[#e9dffc]', text: 'text-[#7b57fc]', label: 'ACTIVE' },
      FAILED: { bg: 'bg-[#fdeae9]', text: 'text-[#F57E77]', label: 'FAILED' },
      IN_TRANSIT: { bg: 'bg-[#E4E7FD]', text: 'text-[#5570F1]', label: 'IN TRANSIT' },
      COMPLETED: { bg: 'bg-[#DEEEE7]', text: 'text-[#32936F]', label: 'COMPLETED' },
      PAYMENT_COMPLETED: { bg: 'bg-[#fef2dc]', text: 'text-[orange]', label: 'PAID' },
      VENDOR_PROCESSING_START: { bg: 'bg-[#d9fcd1]', text: 'text-[#30a532]', label: 'STARTED' },
      VENDOR_PROCESSING_COMPLETED: { bg: 'bg-[#d4e1f9]', text: 'text-[#387dfd]', label: 'COMPLETED' },
      REJECTED: { bg: 'bg-[#fdeae9]', text: 'text-[#F57E77]', label: 'REJECTED' }
    };

    const config = statusConfig[status] || statusConfig.PROCESSING;

    return (
      <div className={`${config.bg} p-2 py-1 text-[12px] flex items-center justify-center w-[120px] gap-4 rounded`}>
        <span className={config.text}>{config.label}</span>
      </div>
    );
  };

  return (
    <div className="bg-[#F5F4F7] min-h-screen p-2 md:p-4 lg:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-20 gap-4">
        <div>
          <h2 className="text-[#15192C] font-semibold text-xl md:text-2xl leading-8">Orders Summary</h2>
        </div>
        <div className="flex justify-center gap-2 items-center bg-white p-3 md:p-4 rounded-xl cursor-pointer w-full md:w-auto">
          <div className="flex justify-center h-5">
            <span className="text-[#7B57FC] text-lg">↓</span>
          </div>
          <span className="text-[#7B57FC] text-sm md:text-base">Export</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
        <div
          onClick={() => filterByStatus(Status.all)}
          className="cursor-pointer flex justify-between bg-white rounded-xl p-4 md:p-6 gap-4 hover:bg-[#dddfdf] transition-colors"
        >
          <div>
            <div className="text-gray-500 text-sm md:text-base leading-6">All Orders</div>
            <div className="flex items-center gap-1">
              <span className="text-lg md:text-xl font-medium leading-8">{productOrderStatistics?.allOrdersCount}</span>
            </div>
          </div>
          <div>
            <div className="bg-black w-8 h-8 md:w-10 md:h-10 flex justify-center items-center rounded-full">
              <span className="text-white text-sm md:text-base">🛒</span>
            </div>
          </div>
        </div>

        <div
          onClick={() => filterByStatus(Status.inTransit)}
          className="cursor-pointer flex justify-between bg-white rounded-xl p-4 md:p-6 gap-4 hover:bg-[#dddfdf] transition-colors"
        >
          <div>
            <div className="text-gray-500 text-sm md:text-base leading-6">In Transit</div>
            <div className="flex items-center gap-1">
              <span className="text-lg md:text-xl font-medium leading-8">{productOrderStatistics?.inTransitOrdersCount}</span>
            </div>
          </div>
          <div>
            <div className="bg-gray-500 w-8 h-8 md:w-10 md:h-10 flex justify-center items-center rounded-full">
              <span className="text-white text-sm md:text-base">⏰</span>
            </div>
          </div>
        </div>

        <div
          onClick={() => filterByStatus(Status.paid)}
          className="cursor-pointer flex justify-between bg-white rounded-xl p-4 md:p-6 gap-4 hover:bg-[#dddfdf] transition-colors"
        >
          <div>
            <div className="text-gray-500 text-sm md:text-base leading-6">Paid</div>
            <div className="flex items-center gap-1">
              <span className="text-lg md:text-xl font-medium leading-8">{productOrderStatistics?.paymentCompletedCount}</span>
            </div>
          </div>
          <div>
            {/* <div className="bg-gray-500 w-8 h-8 md:w-10 md:h-10 flex justify-center items-center rounded-full">
              <span className="text-white text-sm md:text-base">⏰</span>
            </div> */}
            <div className="bg-[#519C66] w-8 h-8 md:w-10 md:h-10 flex justify-center items-center rounded-full">
              <span className="text-white text-sm md:text-base">✓</span>
            </div>
          </div>
        </div>

        {/* <div
          onClick={() => filterByStatus(Status.rejected)}
          className="cursor-pointer flex justify-between bg-white rounded-xl p-4 md:p-6 gap-4 hover:bg-[#dddfdf] transition-colors"
        >
          <div>
            <div className="text-gray-500 text-sm md:text-base leading-6">Cancelled</div>
            <div className="flex items-center gap-1">
              <span className="text-lg md:text-xl font-medium leading-8">{productOrderStatistics?.cancelledOrdersCount}</span>
            </div>
          </div>
          <div>
            <div className="bg-[#CC5F5F] w-8 h-8 md:w-10 md:h-10 flex justify-center items-center rounded-full">
              <span className="text-white text-sm md:text-base">✕</span>
            </div>
          </div>
        </div> */}

        <div
          onClick={() => filterByStatus(Status.failed)}
          className="cursor-pointer flex justify-between bg-white rounded-xl p-4 md:p-6 gap-4 hover:bg-[#dddfdf] transition-colors"
        >
          <div>
            <div className="text-gray-500 text-sm md:text-base leading-6">Failed</div>
            <div className="flex items-center gap-1">
              <span className="text-lg md:text-xl font-medium leading-8">{productOrderStatistics?.failedOrdersCount}</span>
            </div>
          </div>
          <div>
            {/* <div className="bg-[#2148C0] w-8 h-8 md:w-10 md:h-10 flex justify-center items-center rounded-full">
              <span className="text-white text-sm md:text-base">🔄</span>
            </div> */}
            <div>
              <div className="bg-[#CC5F5F] w-8 h-8 md:w-10 md:h-10 flex justify-center items-center rounded-full">
                <span className="text-white text-sm md:text-base">✕</span>
              </div>
            </div>
          </div>
        </div>

        {/* <div
          onClick={() => filterByStatus(Status.completed)}
          className="cursor-pointer flex justify-between bg-white rounded-xl p-4 md:p-6 gap-4 hover:bg-[#dddfdf] transition-colors"
        >
          <div>
            <div className="text-gray-500 text-sm md:text-base leading-6">Delivered</div>
            <div className="flex items-center gap-1">
              <span className="text-lg md:text-xl font-medium leading-8">{productOrderStatistics?.completedOrdersCount}</span>
            </div>
          </div>
          <div>
            <div className="bg-[#519C66] w-8 h-8 md:w-10 md:h-10 flex justify-center items-center rounded-full">
              <span className="text-white text-sm md:text-base">✓</span>
            </div>
          </div>
        </div> */}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl mt-6 md:mt-8 overflow-hidden">
        <div className="p-4 md:p-6 pt-6 md:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 py-2">
            <div className="flex justify-center gap-2 items-center bg-white p-3 rounded-xl">
              <span className="text-base md:text-lg font-medium">Customer Orders</span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="bg-[#FBFBFB] border rounded-xl flex p-2 flex-1 sm:flex-none sm:w-64">
                <div className="flex justify-center items-center cursor-pointer px-2" onClick={refetchOrders}>
                  <span className="text-gray-400 text-sm">🔍</span>
                </div>
                <input
                  value={productOrderRequest.orderId || ''}
                  onChange={handleSearchChange}
                  onKeyPress={(e) => e.key === 'Enter' && refetchOrders()}
                  type="text"
                  className="block p-1 w-full bg-[#FBFBFB] text-gray-900 outline-none rounded-lg text-sm"
                  placeholder="Search orders..."
                />
              </div>
              <div className="flex items-center gap-2 cursor-pointer border p-2 rounded-xl whitespace-nowrap flex-shrink-0">
                <span className="text-sm">📅</span>
                <span className="text-sm hidden sm:inline">Filter</span>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {ordersLoading ? (
            <div className="p-8 text-center">Loading...</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 hidden md:table-header-group text-xs md:text-sm italic font-thin text-[#374151] uppercase">
                <tr className="border-b">
                  <th scope="col" className="px-4 md:px-6 lg:px-8 py-3">
                    <div className="flex items-center">
                      <input
                        id="checkbox-all-search"
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <label htmlFor="checkbox-all-search" className="sr-only">Payment ID</label>
                    </div>
                  </th>
                  <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                  <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
                  <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tracking Id</th>
                  <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customersOrder && customersOrder?.data?.map((order: any) => (
                  <tr key={order.orderId} className="block md:table-row hover:bg-teal-50 transition duration-150 border-b">
                    <td className="hidden md:table-cell px-4 md:px-6 lg:px-8 py-3 whitespace-nowrap text-gray-900">
                      <div className="flex items-center">
                        <input
                          id={`checkbox-${order.orderId}`}
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <label htmlFor={`checkbox-${order.orderId}`} className="sr-only">checkbox</label>
                      </div>
                    </td>

                    <td className="px-4 py-3 md:py-4 md:px-6 flex items-center gap-2 md:table-cell whitespace-normal text-gray-900">
                      <span className="md:hidden text-xs font-bold text-gray-500 whitespace-nowrap">PRODUCT:</span>
                      <span>{order.productName || "Product Name"}</span>
                    </td>

                    <td className="px-4 py-3 md:py-4 md:px-6 flex items-center gap-2 md:table-cell whitespace-normal text-gray-900">
                      <span className="md:hidden text-xs font-bold text-gray-500 whitespace-nowrap">DATE:</span>
                      <span>{order.dateCreated}</span>
                    </td>

                    <td className="px-4 py-3 md:py-4 md:px-6 flex items-center gap-2 md:table-cell whitespace-normal text-gray-900">
                      <span className="md:hidden text-xs font-bold text-gray-500 whitespace-nowrap">AMOUNT:</span>
                      <span>{order.currency}{order.amount.toLocaleString()}</span>
                    </td>

                    <td className="px-4 py-3 md:py-4 md:px-6 flex items-center gap-2 md:table-cell whitespace-normal text-gray-900">
                      <span className="md:hidden text-xs font-bold text-gray-500 whitespace-nowrap">ORDER ID:</span>
                      <span className="text-sm">{order.orderId}</span>
                    </td>

                    <td className="px-4 py-3 md:py-4 md:px-6 flex items-center gap-2 md:table-cell whitespace-normal text-gray-900">
                      <span className="md:hidden text-xs font-bold text-gray-500 whitespace-nowrap">STATUS:</span>
                      {getStatusBadge(order.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="mt-6 bg-white flex flex-col sm:flex-row items-center justify-between p-4 gap-3 border-t">
          <div className="flex items-center gap-2 order-2 sm:order-1">
            <span className="whitespace-nowrap text-sm text-gray-600">Rows:</span>
            <select
              value={productOrderRequest.size}
              onChange={(e) => getSize(Number(e.target.value))}
              className="outline-none text-[#4B5563] text-sm rounded focus:ring-blue-500 focus:border-blue-500 block p-1 border"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
            </select>
          </div>

          <div className="flex items-center gap-3 order-1 sm:order-2">
            <div className="text-sm text-gray-600 whitespace-nowrap">
              {productOrderRequest.page} of {totalNumberOfPages}
            </div>

            <div className="flex gap-1">
              <button
                className="p-2 rounded cursor-pointer border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                onClick={previousPage}
                disabled={productOrderRequest.page === 1}
              >
                <span className="text-sm">←</span>
              </button>
              <button
                className="p-2 rounded cursor-pointer border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                onClick={nextPage}
                disabled={productOrderRequest.page >= totalNumberOfPages}
              >
                <span className="text-sm">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;