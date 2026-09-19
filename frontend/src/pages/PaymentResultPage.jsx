import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { vnpayReturn } from '../services/jobsApi';
import Header from '../components/Header';

export default function PaymentResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('Đang xử lý kết quả thanh toán...');

  useEffect(() => {
    const processPayment = async () => {
      try {
        if (!location.search) {
          setStatus('error');
          setMessage('Không tìm thấy thông tin thanh toán');
          return;
        }

        const res = await vnpayReturn(location.search);
        if (res.success) {
          setStatus('success');
          setMessage(res.message || 'Thanh toán thành công! Gói cước của bạn đã được nâng cấp.');
        } else {
          setStatus('error');
          setMessage(res.message || 'Thanh toán thất bại.');
        }
      } catch (err) {
        setStatus('error');
        setMessage(err.message || 'Có lỗi xảy ra khi xác thực thanh toán.');
      }
    };

    processPayment();
  }, [location.search]);

  return (
    <>
      <Header />
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          {status === 'loading' && (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-[#00b074] border-t-transparent rounded-full animate-spin mb-4"></div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Đang xử lý</h2>
              <p className="text-gray-600">{message}</p>
            </div>
          )}
          
          {status === 'success' && (
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Thanh toán thành công!</h2>
              <p className="text-gray-600 mb-8">{message}</p>
              <Link to="/employer/dashboard" className="px-6 py-3 bg-[#00b074] text-white font-medium rounded-xl hover:bg-[#009663] transition-colors w-full">
                Về trang quản lý
              </Link>
            </div>
          )}
          
          {status === 'error' && (
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Giao dịch thất bại</h2>
              <p className="text-gray-600 mb-8">{message}</p>
              <div className="flex gap-4 w-full">
                <Link to="/pricing" className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors">
                  Thử lại
                </Link>
                <Link to="/employer/dashboard" className="flex-1 px-4 py-3 bg-[#00b074] text-white font-medium rounded-xl hover:bg-[#009663] transition-colors">
                  Về trang quản lý
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
