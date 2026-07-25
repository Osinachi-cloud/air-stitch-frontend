// MobileOrderItem.tsx
import React, { useState } from 'react';

interface MobileOrderItemProps {
  order: any;
  index: number;
  getStatusDisplay: (status: string) => JSX.Element;
  toggleOrderModal: (orderId: string) => void;
  toggleBodyMeasurementModal: (orderId: string) => void;
}

const MobileOrderItem: React.FC<MobileOrderItemProps> = ({
  order,
  index,
  getStatusDisplay,
  toggleOrderModal,
  toggleBodyMeasurementModal,
}) => {
  const [showMobileActions, setShowMobileActions] = useState(false);

  return (
    <div className="border-b border-surface-100 p-4 hover:bg-primary-50/50">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          {/* <input
            id={`checkbox-mobile-${order.orderId || index}`}
            type="checkbox"
            className="w-4 h-4 text-primary-600 bg-surface-100 border-surface-300 rounded focus:ring-primary-300 focus:ring-2"
          /> */} 
          <span className="text-[11px] font-bold text-surface-500">STATUS:</span>
        </div>
        <div className="text-right">
          {getStatusDisplay(order.status)}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-[11px] font-bold text-surface-500">PRODUCT:</span>
          <span>{order.productName || order.orderId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[11px] font-bold text-surface-500">DATE:</span>
          <span>{order.dateCreated || new Date().toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[11px] font-bold text-surface-500">ORDER ID:</span>
          <span className="text-sm">{order.orderId || `ORD-${index}`}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[11px] font-bold text-surface-500">AMOUNT:</span>
          <span>{order.currency || 'NGN'} {order.amount?.toLocaleString() || '0'}</span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-surface-100">
        <div className="relative">
          <button 
            onClick={() => setShowMobileActions(!showMobileActions)}
            className="bg-surface-100 hover:bg-surface-200 text-surface-800 font-medium py-2 px-4 rounded-xl inline-flex items-center justify-between w-full"
          >
            Actions
            <svg 
              className={`fill-current h-4 w-4 ml-1 transition-transform ${showMobileActions ? 'rotate-180' : ''}`} 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </button>
          
          {showMobileActions && (
            <div className="absolute z-50 mt-2 w-full bg-white rounded-xl shadow-elegant border border-surface-100">
              <div className="py-1">
                <button
                  onClick={() => {
                    toggleOrderModal(order.orderId || `ORD-${index}`);
                    setShowMobileActions(false);
                  }}
                  className="block w-full text-center px-4 py-2 text-xs text-surface-700 hover:bg-primary-50"
                >
                  View Order
                </button>
                <button
                  onClick={() => {
                    toggleBodyMeasurementModal(order.orderId || `ORD-${index}`);
                    setShowMobileActions(false);
                  }}
                  className="block w-full text-center px-4 py-2 text-xs text-surface-700 hover:bg-primary-50"
                >
                  View Measurement
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileOrderItem;