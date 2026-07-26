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
  Package,
  Calendar,
  RefreshCw,
  Eye,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

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

const VendorOrders: React.FC = () => {
    const router = useRouter();
    const { value, getUserDetails } = useLocalStorage("tailorDetails", null);
    const userDetails = getUserDetails();
    const token = userDetails?.accessToken;

    const [productOrderRequest, setProductOrderRequest] = useState<ProductOrderRequest>({
      page: 0,
      size: 10,
      status: null,
      orderId: null,
    });


  const [orderTotal, setOrderTotal] = useState<number>(0);
  const [numOfPages, setNumOfPages] = useState<number>(0);
  const [showOrderModal, setShowOrderModal] = useState<boolean>(false);
  const [orderRef, setOrderRef] = useState<string>('');
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
  const [showBodyMeasurementModal, setShowBodyMeasurementModal] = useState<boolean>(false);
  const [isLoadingOrderDetail, setIsLoadingOrderDetail] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

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
    if (url.length > 0) return url.substring(1);
    return url;
  };

  const dynamicParams = buildUrl(productOrderRequest);
  const separator = dynamicParams ? '&' : '';

  const fetchOrdersUrl = `${baseUrL}/fetch-vendor-orders?page=${productOrderRequest.page}&size=${productOrderRequest.size}${separator}${dynamicParams}`;
  const getOrderByIdUrl = orderRef ? `${baseUrL}/get-order-by-orderId?orderId=${orderRef}` : null;
  const orderStatsUrl = `${baseUrL}/order-stats-for-vendor`;

  const { data: ordersData, isLoading: ordersLoading, error: ordersError, callApi: refetchOrders } = useFetch('GET', null, fetchOrdersUrl);
  const { data: SingleOrderData, isLoading: singleOrdersLoading, callApi: refetchSingleOrder } = useCallFetch('GET', null, getOrderByIdUrl, true);
  const { data: statsData, isLoading: statsLoading, callApi: refetchStats } = useFetch('GET', null, orderStatsUrl);

  const fetchOrderDetail = async (orderId: string) => {
    setIsLoadingOrderDetail(true);
    try {
      const response = await fetch(`${baseUrL}/fetch-vendor-orders?orderId=${orderId}`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data.data && data.data.length > 0) {
        setOrderDetail(data.data[0]);
      } else {
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
      case 'PAYMENT_COMPLETED': orderStatus = 'VENDOR_PROCESSING_START'; break;
      case 'VENDOR_PROCESSING_START': orderStatus = 'VENDOR_PROCESSING_COMPLETED'; break;
      case 'VENDOR_PROCESSING_COMPLETED': orderStatus = 'IN_TRANSIT'; break;
      case 'IN_TRANSIT': orderStatus = 'COMPLETED'; break;
      default: return;
    }
    try {
      const response = await fetch(`${baseUrL}/update-order-status/${orderId}?orderStatus=${orderStatus}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
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
    const data = ordersData;
    if (data?.data) {
      if (Array.isArray(data.data)) return data.data;
      if (data.data.data && Array.isArray(data.data.data)) return data.data.data;
      if (data.data.fetchVendorOrdersBy?.data) return data.data.fetchVendorOrdersBy.data;
    }
    return [];
  }, [ordersData]);

  const productOrderStatistics = useMemo(() => {
    return statsData || {
      allOrdersCount: 0, processingOrdersCount: 0, cancelledOrdersCount: 0,
      failedOrdersCount: 0, completedOrdersCount: 0, inTransitOrdersCount: 0, paymentCompletedCount: 0,
    };
  }, [statsData]);

  useEffect(() => {
    if (ordersData) {
      let total = 0;
      if (ordersData.total !== undefined) total = ordersData.total;
      else if (ordersData.data?.total !== undefined) total = ordersData.data.total;
      else if (ordersData.data?.fetchVendorOrdersBy?.total !== undefined) total = ordersData.data.fetchVendorOrdersBy.total;

      if (total > 0) {
        setOrderTotal(total);
        setNumOfPages(total % productOrderRequest.size === 0 ? total / productOrderRequest.size : 1 + Math.floor(total / productOrderRequest.size));
      }
    }
  }, [ordersData, productOrderRequest.size]);

  const filterByStatus = (statusValue: OrderStatus | null, label: string) => {
    setActiveFilter(label);
    setProductOrderRequest(prev => ({ ...prev, status: statusValue, page: 0 }));
  };

  const nextPage = () => {
    if (productOrderRequest.page + 1 < numOfPages) {
      setProductOrderRequest(prev => ({ ...prev, page: prev.page + 1 }));
    }
  };
  const previousPage = () => {
    if (productOrderRequest.page > 0) {
      setProductOrderRequest(prev => ({ ...prev, page: prev.page - 1 }));
    }
  };
  const handlePageSizeChange = (size: number) => setProductOrderRequest(prev => ({ ...prev, size, page: 0 }));
  const toggleOrderModal = async (orderId: string) => { setOrderRef(orderId); setShowOrderModal(true); await fetchOrderDetail(orderId); };
  const toggleBodyMeasurementModal = async (orderId: string) => { setOrderRef(orderId); setShowBodyMeasurementModal(true); await fetchOrderDetail(orderId); };
  const handleSearch = () => { setProductOrderRequest(prev => ({ ...prev, page: 0 })); refetchOrders(); };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setProductOrderRequest(prev => ({ ...prev, orderId: e.target.value || null }));

  const getStatusDisplay = (status: string) => {
    const map: Record<string, { bg: string; text: string; label: string; icon: React.ReactNode }> = {
      PROCESSING: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'PROCESSING', icon: <Clock className="w-3 h-3" /> },
      ACTIVE: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'ACTIVE', icon: <TrendingUp className="w-3 h-3" /> },
      FAILED: { bg: 'bg-red-100', text: 'text-red-700', label: 'FAILED', icon: <AlertCircle className="w-3 h-3" /> },
      IN_TRANSIT: { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'IN TRANSIT', icon: <Truck className="w-3 h-3" /> },
      COMPLETED: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'COMPLETED', icon: <CheckCircle2 className="w-3 h-3" /> },
      PAYMENT_COMPLETED: { bg: 'bg-green-100', text: 'text-green-700', label: 'PAID', icon: <CreditCard className="w-3 h-3" /> },
      VENDOR_PROCESSING_START: { bg: 'bg-cyan-100', text: 'text-cyan-700', label: 'STARTED', icon: <RefreshCw className="w-3 h-3" /> },
      VENDOR_PROCESSING_COMPLETED: { bg: 'bg-violet-100', text: 'text-violet-700', label: 'COMPLETED', icon: <CheckCircle2 className="w-3 h-3" /> },
      REJECTED: { bg: 'bg-rose-100', text: 'text-rose-700', label: 'REJECTED', icon: <XCircle className="w-3 h-3" /> },
    };
    const s = map[status] || { bg: 'bg-gray-100', text: 'text-gray-700', label: status, icon: <Package className="w-3 h-3" /> };
    return (
      <div className={`${s.bg} ${s.text} px-3 py-1.5 text-[11px] font-bold flex items-center gap-1.5 rounded-full w-fit`}>
        {s.icon}
        <span>{s.label}</span>
      </div>
    );
  };

  const statCards = [
    { label: 'All Orders', count: productOrderStatistics.allOrdersCount, icon: ShoppingBag, iconBg: 'bg-slate-100', iconColor: 'text-slate-600', status: statusOptions.all, filterLabel: 'all' },
    { label: 'Paid', count: productOrderStatistics.paymentCompletedCount, icon: CreditCard, iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', status: statusOptions.paid, filterLabel: 'paid' },
    { label: 'Processing', count: productOrderStatistics.processingOrdersCount, icon: Clock, iconBg: 'bg-amber-100', iconColor: 'text-amber-600', status: statusOptions.processing, filterLabel: 'processing' },
    { label: 'In Transit', count: productOrderStatistics.inTransitOrdersCount, icon: Truck, iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600', status: statusOptions.inTransit, filterLabel: 'inTransit' },
    { label: 'Delivered', count: productOrderStatistics.completedOrdersCount, icon: CheckCircle2, iconBg: 'bg-rose-100', iconColor: 'text-rose-600', status: statusOptions.completed, filterLabel: 'completed' },
    { label: 'Cancelled', count: productOrderStatistics.cancelledOrdersCount, icon: XCircle, iconBg: 'bg-red-100', iconColor: 'text-red-600', status: statusOptions.rejected, filterLabel: 'cancelled' },
  ];

  if (statsLoading && !statsData) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full pb-10">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl mb-8 bg-slate-800 shadow-xl">
        <div className="relative z-10 p-6 md:p-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <button onClick={() => router.back()} className="flex items-center justify-center w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all backdrop-blur-sm">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-white text-xs font-semibold">Vendor Dashboard</span>
                </div>
              </div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-white mt-2">Orders Summary</h1>
              <p className="text-white/70 text-sm mt-1 max-w-md">Track and manage all your customer orders in one place.</p>
            </div>
            <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-5 py-2.5 rounded-xl transition-all backdrop-blur-sm font-medium text-sm">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {statCards.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeFilter === item.filterLabel;
          return (
            <div
              key={index}
              onClick={() => filterByStatus(item.status, item.filterLabel)}
              className={`cursor-pointer relative overflow-hidden rounded-2xl p-4 bg-white border border-surface-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                isActive ? 'ring-2 ring-offset-2 ring-primary-400 scale-[1.02]' : ''
              }`}
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-8 h-8 rounded-lg ${item.iconBg} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${item.iconColor}`} />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-surface-400" />
                </div>
                <p className="text-surface-500 text-[11px] font-medium">{item.label}</p>
                <p className="text-surface-800 text-xl font-display font-bold mt-0.5">{item.count.toLocaleString()}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Orders Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-card overflow-hidden border border-white">
        <div className="p-5 border-b border-surface-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base font-display font-bold text-surface-800">Vendor Orders</h2>
                <p className="text-xs text-surface-500">{orderTotal} total orders</p>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="bg-surface-50 border border-surface-200 rounded-xl flex p-2 flex-1 md:flex-none md:w-80 focus-within:ring-2 focus-within:ring-primary-300 transition-all">
                <Search className="w-4 h-4 text-surface-400 mx-2 mt-1.5" />
                <input
                  value={productOrderRequest.orderId || ''}
                  onChange={handleSearchChange}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  type="text"
                  className="block p-1 w-full bg-transparent text-surface-800 rounded-lg text-sm outline-none"
                  placeholder="Search by order ID..."
                />
              </div>
              <button className="flex items-center gap-2 bg-white border border-surface-200 p-2.5 rounded-xl hover:bg-surface-50 text-xs font-semibold text-surface-700 transition-all shadow-sm">
                <Filter className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Filter</span>
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {ordersLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : ordersError ? (
            <div className="text-center p-10">
              <AlertCircle className="w-12 h-12 text-red-200 mx-auto mb-3" />
              <p className="text-red-500 font-medium">Error loading orders</p>
              <p className="text-sm text-surface-400 mt-1">{ordersError}</p>
            </div>
          ) : vendorsOrder.length === 0 ? (
            <div className="text-center p-10">
              <Package className="w-12 h-12 text-surface-200 mx-auto mb-3" />
              <p className="text-surface-500 font-medium">No orders found</p>
              <p className="text-sm text-surface-400 mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div className="md:hidden">
                {vendorsOrder.map((order: any, index: any) => (
                  <MobileOrderItem key={index} order={order} index={index} getStatusDisplay={getStatusDisplay} toggleOrderModal={toggleOrderModal} toggleBodyMeasurementModal={toggleBodyMeasurementModal} />
                ))}
              </div>

              <table className="min-w-full divide-y divide-surface-100 hidden md:table">
                <thead className="bg-surface-50">
                  <tr className="border-b border-surface-100">
                    <th className="px-5 py-3"></th>
                    <th className="px-5 py-3 text-left text-[11px] font-bold text-surface-500 uppercase tracking-wider">Product</th>
                    <th className="px-5 py-3 text-left text-[11px] font-bold text-surface-500 uppercase tracking-wider">Date</th>
                    <th className="px-5 py-3 text-left text-[11px] font-bold text-surface-500 uppercase tracking-wider">Tracking ID</th>
                    <th className="px-5 py-3 text-left text-[11px] font-bold text-surface-500 uppercase tracking-wider">Total</th>
                    <th className="px-5 py-3 text-left text-[11px] font-bold text-surface-500 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3 text-left text-[11px] font-bold text-surface-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-surface-100">
                  {vendorsOrder.map((order: any, index: any) => (
                    <tr key={index} className="hover:bg-surface-50 transition duration-200 group">
                      <td className="px-5 py-4">
                        <div className="w-10 h-10 rounded-xl bg-surface-100 flex items-center justify-center">
                          <Package className="w-4 h-4 text-surface-500" />
                        </div>
                      </td>
                      <td className="px-5 py-4 text-surface-800">
                        <p className="text-xs font-semibold">{order.productName || order.orderId}</p>
                        <p className="text-[10px] text-surface-400 mt-0.5">{order.productCategory || 'General'}</p>
                      </td>
                      <td className="px-5 py-4 text-surface-600 text-xs">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-surface-400" />
                          {order.dateCreated || new Date().toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs font-mono bg-surface-100 px-2 py-1 rounded-lg text-surface-600">{order.orderId || `ORD-${index}`}</span>
                      </td>
                      <td className="px-5 py-4 text-xs font-bold text-surface-800">
                        {order.currency || 'NGN'} {order.amount?.toLocaleString() || '0'}
                      </td>
                      <td className="px-5 py-4">
                        {getStatusDisplay(order.status)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => toggleOrderModal(order.orderId || `ORD-${index}`)} className="p-2 rounded-lg bg-surface-100 text-surface-600 hover:bg-surface-200 transition-colors">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => toggleBodyMeasurementModal(order.orderId || `ORD-${index}`)} className="p-2 rounded-lg bg-surface-100 text-surface-600 hover:bg-surface-200 transition-colors">
                            <Package className="w-3.5 h-3.5" />
                          </button>
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
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between p-5 gap-3 border-t border-surface-100 bg-surface-50/50">
              <div className="flex items-center gap-2 order-2 sm:order-1">
                <span className="whitespace-nowrap text-xs text-surface-500">Rows per page:</span>
                <select value={productOrderRequest.size} onChange={(e) => handlePageSizeChange(Number(e.target.value))} className="text-surface-600 text-xs rounded-lg focus:ring-primary-300 block p-1.5 border border-surface-200 bg-white">
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                </select>
              </div>

              <div className="flex items-center gap-3 order-1 sm:order-2">
                <div className="text-xs text-surface-500 whitespace-nowrap">
                  Page <span className="font-bold text-surface-800">{productOrderRequest.page + 1}</span> of <span className="font-bold text-surface-800">{numOfPages}</span>
                </div>
                <div className="flex gap-1">
                  <button className="p-2 rounded-xl cursor-pointer border border-surface-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white hover:border-primary-300 hover:text-primary-600 transition-all bg-white shadow-sm" onClick={previousPage} disabled={productOrderRequest.page === 0}>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: Math.min(5, numOfPages) }, (_, i) => {
                    const pageNum = i;
                    return (
                      <button key={i} onClick={() => setProductOrderRequest(prev => ({ ...prev, page: pageNum }))} className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${productOrderRequest.page === pageNum ? 'bg-brand-gradient text-white shadow-lg' : 'bg-white text-surface-600 border border-surface-200 hover:border-primary-300 hover:text-primary-600'}`}>
                        {pageNum + 1}
                      </button>
                    );
                  })}
                  <button className="p-2 rounded-xl cursor-pointer border border-surface-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white hover:border-primary-300 hover:text-primary-600 transition-all bg-white shadow-sm" onClick={nextPage} disabled={productOrderRequest.page + 1 >= numOfPages}>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Body Measurement Modal */}
      <Modal isOpen={showBodyMeasurementModal} onClose={() => setShowBodyMeasurementModal(false)} title="Body Measurements">
        {isLoadingOrderDetail ? (
          <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>
        ) : orderDetail ? (
          <div className="p-4 md:p-6 grid gap-4">
            {SingleOrderData?.bodyMeasurementDto ? (
              <>
                <div className="bg-surface-50 rounded-2xl p-4 border border-surface-200">
                  <h3 className="text-sm font-display font-bold text-surface-800 mb-3 flex items-center gap-2">
                    <Package className="w-4 h-4" /> TOP (CM)
                  </h3>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                    {[{ label: 'Neck', value: SingleOrderData.bodyMeasurementDto.neck }, { label: 'Shoulder', value: SingleOrderData.bodyMeasurementDto.shoulder }, { label: 'Tummy', value: SingleOrderData.bodyMeasurementDto.tummy }, { label: 'Short Sleeve', value: SingleOrderData.bodyMeasurementDto.shortSleeveAtBiceps }, { label: 'Hip Width', value: SingleOrderData.bodyMeasurementDto.hipWidth }, { label: 'Mid Sleeve', value: SingleOrderData.bodyMeasurementDto.midSleeveAtElbow }, { label: 'Chest', value: SingleOrderData.bodyMeasurementDto.chest }, { label: 'Length', value: SingleOrderData.bodyMeasurementDto.neckToHipLength }, { label: 'Long Sleeve', value: SingleOrderData.bodyMeasurementDto.longSleeveAtWrist }].map((item, index) => (
                      <div key={index} className="flex items-center text-sm bg-white/70 rounded-lg px-3 py-2">
                        <span className="text-surface-500 text-xs w-24">{item.label}</span>
                        <span className="font-bold text-surface-800">{item.value || 'N/A'}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-surface-50 rounded-2xl p-4 border border-surface-200">
                  <h3 className="text-sm font-display font-bold text-surface-800 mb-3 flex items-center gap-2">
                    <Package className="w-4 h-4" /> TROUSER (CM)
                  </h3>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                    {[{ label: 'Waist', value: SingleOrderData.bodyMeasurementDto.waist }, { label: 'Knee', value: SingleOrderData.bodyMeasurementDto.knee }, { label: 'Ankle', value: SingleOrderData.bodyMeasurementDto.ankle }, { label: 'Thigh', value: SingleOrderData.bodyMeasurementDto.thigh }, { label: 'Knee Length', value: SingleOrderData.bodyMeasurementDto.knee }, { label: 'Trouser Length', value: SingleOrderData.bodyMeasurementDto.trouserLength }].map((item, index) => (
                      <div key={index} className="flex items-center text-sm bg-white/70 rounded-lg px-3 py-2">
                        <span className="text-surface-500 text-xs w-24">{item.label}</span>
                        <span className="font-bold text-surface-800">{item.value || 'N/A'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-6"><p className="text-sm text-surface-500">No body measurements available.</p></div>
            )}
            <div className="flex justify-center mt-4">
              <button onClick={() => setShowBodyMeasurementModal(false)} className="bg-brand-gradient hover:bg-brand-gradient-hover text-white text-sm py-2.5 px-8 rounded-xl font-semibold cursor-pointer transition-all shadow-lg">
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-surface-500">Unable to load order details.</p>
            <button onClick={() => setShowBodyMeasurementModal(false)} className="mt-4 bg-brand-gradient hover:bg-brand-gradient-hover text-white text-sm py-2 px-6 rounded-xl font-semibold cursor-pointer transition-all">Close</button>
          </div>
        )}
      </Modal>

      {/* Order Detail Modal */}
      <Modal isOpen={showOrderModal} onClose={() => setShowOrderModal(false)} title="Order Details">
        {isLoadingOrderDetail ? (
          <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>
        ) : orderDetail ? (
          <div className="p-4 md:p-6 grid gap-4">
            <div className="bg-white rounded-2xl border border-surface-100 p-4 grid gap-3">
              {[{ label: 'Amount Paid', value: `${orderDetail.currency || 'NGN'} ${orderDetail.amount || '0'}.00`, icon: CreditCard }, { label: 'Quantity', value: orderDetail.quantity || 1, icon: Package }, { label: 'Charges', value: '₦2.00', icon: AlertCircle }, { label: 'Date', value: orderDetail.dateCreated || 'N/A', icon: Calendar }, { label: 'Order Reference', value: orderDetail.orderId || 'N/A', icon: ShoppingBag }, { label: 'Status', value: orderDetail.status ? orderDetail.status.replaceAll('_', ' ').toLowerCase() : 'N/A', icon: CheckCircle2 }].map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-surface-100 last:border-0">
                  <div className="flex items-center gap-2 text-xs text-surface-500">
                    <item.icon className="w-3.5 h-3.5 text-primary-400" />
                    {item.label}
                  </div>
                  <div className="font-semibold text-surface-800 text-sm">{item.value}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row justify-between mt-2 gap-3">
              <button onClick={() => setShowOrderModal(false)} className="bg-surface-100 text-surface-700 text-sm py-3 px-8 rounded-xl font-semibold cursor-pointer hover:bg-surface-200 transition-colors order-2 sm:order-1">
                Close
              </button>
              <button onClick={() => updateProductOrder(orderRef)} className="bg-brand-gradient hover:bg-brand-gradient-hover text-white text-sm py-3 px-8 rounded-xl font-semibold cursor-pointer flex items-center justify-center gap-2 order-1 sm:order-2 transition-all shadow-lg shadow-primary-500/25">
                <RefreshCw className="w-4 h-4" />
                {(() => {
                  switch (orderDetail.status) {
                    case 'PAYMENT_COMPLETED': return 'Accept Order';
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
            <button onClick={() => setShowOrderModal(false)} className="mt-4 bg-brand-gradient hover:bg-brand-gradient-hover text-white text-sm py-2 px-6 rounded-xl font-semibold cursor-pointer transition-all">Close</button>
          </div>
        )}
      </Modal>
    </div>
  );
};

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
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity" onClick={onClose}></div>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <div className="relative transform overflow-hidden rounded-3xl bg-white text-left shadow-elegant transition-all w-full max-w-lg border border-surface-100" onClick={(e) => e.stopPropagation()}>
            <div className="bg-surface-50 px-6 pt-6 pb-4 border-b border-surface-100 flex items-center justify-between">
              {title && <h3 className="text-sm font-display font-bold text-surface-800">{title}</h3>}
              <button type="button" className="rounded-full w-8 h-8 flex items-center justify-center bg-surface-100 text-surface-400 hover:text-surface-600 hover:bg-surface-200 transition-all" onClick={onClose}>
                <span className="text-xl leading-none">×</span>
              </button>
            </div>
            <div className="px-6 py-5">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VendorOrders;
