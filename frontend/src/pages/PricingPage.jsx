import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles, Zap, Building2, Crown, ArrowRight, X, CreditCard, QrCode, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import Header from '../components/Header';
import { upgradePackage } from '../services/jobsApi';

export default function PricingPage() {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState('');
  
  // Modal states
  const [showPayment, setShowPayment] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [paymentStep, setPaymentStep] = useState(1); // 1: Form, 2: Loading, 3: Success

  const plans = [
    {
      id: 'Free',
      name: 'Khởi đầu',
      price: 'Miễn phí',
      desc: 'Dành cho startup và công ty nhỏ',
      icon: Building2,
      color: 'blue',
      features: ['Đăng tối đa 3 tin tuyển dụng', 'Xem danh sách ứng viên', 'Tin hiển thị tiêu chuẩn', 'Hỗ trợ email'],
      cta: 'Đang sử dụng',
    },
    {
      id: 'Pro',
      name: 'Chuyên nghiệp',
      price: '1.000.000đ',
      period: '/tháng',
      desc: 'Tối ưu hiệu quả tuyển dụng',
      icon: Zap,
      color: 'teal',
      popular: true,
      features: ['Đăng tối đa 20 tin tuyển dụng', 'Gắn nhãn HOT nổi bật', 'Tin ghim lên đầu danh sách', 'Ưu tiên hiển thị với AI', 'Hỗ trợ trực tiếp'],
      cta: 'Nâng cấp ngay',
    },
    {
      id: 'Enterprise',
      name: 'Doanh nghiệp',
      price: 'Liên hệ',
      desc: 'Tuyển dụng số lượng lớn',
      icon: Crown,
      color: 'violet',
      features: ['Đăng tin không giới hạn', 'Tất cả đặc quyền bản Pro', 'Xem CV ẩn của ứng viên', 'Tuyển dụng cùng AI', 'Quản lý nhiều tài khoản con'],
      cta: 'Liên hệ tư vấn',
    }
  ];

  const handleUpgradeClick = (planId) => {
    if (!isAuthenticated) return navigate('/auth?role=employer');
    if (user.role !== 'employer') return alert('Chỉ nhà tuyển dụng mới có thể nâng cấp gói');
    
    if (planId === 'Enterprise') {
      setShowContact(true);
      return;
    }
    if (planId === 'Free') return;

    setShowPayment(true);
    setPaymentStep(1);
  };

  const processPayment = async () => {
    setPaymentStep(2); // Loading
    
    // Simulate network & bank processing delay
    setTimeout(async () => {
      try {
        const res = await upgradePackage('Pro');
        setPaymentStep(3); // Success
        setTimeout(() => {
          setShowPayment(false);
          navigate('/employer/dashboard');
        }, 3000);
      } catch (e) {
        alert(e.message);
        setPaymentStep(1);
      }
    }, 2000);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setLoading('contact');
    setTimeout(() => {
      setLoading('');
      setShowContact(false);
      alert('Yêu cầu đã được gửi! Chuyên viên tư vấn sẽ liên hệ với bạn trong 30 phút nữa.');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f6fbf9] flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-12 lg:py-20 w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-teal-600 font-bold tracking-wider text-sm mb-3">GÓI DỊCH VỤ</p>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-5 tracking-tight">Tuyển đúng người, <br/>với chi phí tối ưu nhất.</h1>
          <p className="text-slate-600 text-lg">Chọn gói dịch vụ phù hợp với quy mô công ty để bắt đầu kết nối với hàng ngàn ứng viên tiềm năng trên ITMatch.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <motion.div 
              key={plan.id}
              whileHover={{ y: -8 }}
              className={`relative bg-white rounded-3xl p-8 border-2 transition-shadow ${plan.popular ? 'border-teal-500 shadow-xl shadow-teal-500/10' : 'border-slate-200 hover:border-slate-300 hover:shadow-lg'}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <span className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                    <Sparkles size={14} /> PHỔ BIẾN NHẤT
                  </span>
                </div>
              )}
              
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-${plan.color}-50 text-${plan.color}-600`}>
                <plan.icon size={24} />
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
              <p className="text-sm text-slate-500 mb-6 h-10">{plan.desc}</p>
              
              <div className="mb-8">
                <span className="text-4xl font-black text-slate-900">{plan.price}</span>
                {plan.period && <span className="text-slate-500 font-medium">{plan.period}</span>}
              </div>

              <button 
                onClick={() => handleUpgradeClick(plan.id)}
                disabled={loading === plan.id || plan.id === 'Free'}
                className={`w-full py-3.5 rounded-xl font-bold text-sm transition flex justify-center items-center gap-2 ${plan.popular ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-md' : plan.id === 'Free' ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-slate-900 hover:bg-black text-white'}`}
              >
                {loading === plan.id ? 'Đang xử lý...' : plan.cta} 
                {plan.id !== 'Free' && <ArrowRight size={16} />}
              </button>

              <div className="mt-8 space-y-4">
                <p className="text-xs font-bold text-slate-900 uppercase tracking-wide">Bao gồm:</p>
                {plan.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span className="text-sm text-slate-600">{f}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPayment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
              {/* Left sidebar - Order Summary */}
              <div className="bg-slate-50 p-6 md:p-8 md:w-2/5 border-b md:border-b-0 md:border-r border-slate-200">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">Đơn hàng của bạn</h3>
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center shrink-0">
                    <Zap size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Gói Chuyên nghiệp</h4>
                    <p className="text-xs text-slate-500">1 tháng sử dụng</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-200 mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-500">Tạm tính</span>
                    <span className="font-medium">1.000.000đ</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-500">VAT (10%)</span>
                    <span className="font-medium">100.000đ</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-slate-900 pt-4 border-t border-slate-200 mt-2">
                    <span>Tổng cộng</span>
                    <span>1.100.000đ</span>
                  </div>
                </div>
                <div className="bg-blue-50 text-blue-700 text-xs p-3 rounded-xl border border-blue-100 font-medium">
                  Đây là môi trường thử nghiệm (Sandbox). Bạn sẽ không bị trừ tiền thật.
                </div>
              </div>

              {/* Right side - Payment Process */}
              <div className="p-6 md:p-8 md:w-3/5 relative min-h-[400px] flex flex-col">
                {paymentStep === 1 && (
                  <button onClick={() => setShowPayment(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                    <X size={20} />
                  </button>
                )}

                {paymentStep === 1 && (
                  <div className="flex-1 flex flex-col">
                    <h3 className="text-xl font-black text-slate-900 mb-6">Thanh toán an toàn</h3>
                    
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      <button onClick={() => setSelectedMethod('card')} className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition-colors ${selectedMethod === 'card' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                        <CreditCard size={24} />
                        <span className="text-xs font-bold">Thẻ tín dụng</span>
                      </button>
                      <button onClick={() => setSelectedMethod('vnpay')} className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition-colors ${selectedMethod === 'vnpay' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                        <QrCode size={24} />
                        <span className="text-xs font-bold">VNPay QR</span>
                      </button>
                      <button onClick={() => setSelectedMethod('momo')} className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition-colors ${selectedMethod === 'momo' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                        <Smartphone size={24} />
                        <span className="text-xs font-bold">Ví MoMo</span>
                      </button>
                    </div>

                    {selectedMethod === 'card' ? (
                      <div className="space-y-4 mb-8">
                        <div>
                          <label className="text-xs font-bold text-slate-700 mb-1.5 block">Số thẻ</label>
                          <input type="text" defaultValue="4242 4242 4242 4242" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-mono text-sm" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-bold text-slate-700 mb-1.5 block">Ngày hết hạn</label>
                            <input type="text" defaultValue="12/28" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-mono text-sm" />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-700 mb-1.5 block">CVC</label>
                            <input type="password" defaultValue="123" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-mono text-sm" />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-700 mb-1.5 block">Tên in trên thẻ</label>
                          <input type="text" defaultValue="NGUYEN VAN A" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm uppercase" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center mb-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 p-6 text-center">
                        <QrCode size={48} className="text-slate-400 mb-3" />
                        <p className="text-sm font-bold text-slate-700">Mở ứng dụng ngân hàng / ví</p>
                        <p className="text-xs text-slate-500 mt-1">Quét mã QR (Giả lập) để thanh toán</p>
                      </div>
                    )}

                    <div className="mt-auto">
                      <button onClick={processPayment} className="w-full bg-slate-900 hover:bg-black text-white font-bold py-3.5 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2">
                        Xác nhận thanh toán 1.100.000đ <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                )}

                {paymentStep === 2 && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin mb-6"></div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">Đang xử lý giao dịch...</h3>
                    <p className="text-sm text-slate-500">Vui lòng không đóng cửa sổ này.</p>
                  </div>
                )}

                {paymentStep === 3 && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                      <Check size={40} strokeWidth={3} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">Thanh toán thành công!</h3>
                    <p className="text-sm text-slate-500 mb-6">Tài khoản của bạn đã được nâng cấp lên gói <strong>Pro</strong>.</p>
                    <p className="text-xs text-slate-400 animate-pulse">Đang chuyển hướng về bảng điều khiển...</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Contact Sales Modal */}
      <AnimatePresence>
        {showContact && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative p-6 sm:p-8"
            >
              <button onClick={() => setShowContact(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                <X size={20} />
              </button>
              
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-violet-100 text-violet-600">
                <Crown size={24} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Liên hệ gói Doanh nghiệp</h3>
              <p className="text-sm text-slate-500 mb-6">Để lại thông tin, chuyên viên của ITMatch sẽ tư vấn giải pháp tuyển dụng phù hợp nhất cho công ty bạn.</p>
              
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">Họ và tên</label>
                  <input required type="text" placeholder="Nguyễn Văn A" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">Số điện thoại</label>
                  <input required type="tel" placeholder="0901234567" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">Ghi chú thêm (Tùy chọn)</label>
                  <textarea rows={3} placeholder="Nhu cầu tuyển dụng của bạn..." className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm"></textarea>
                </div>
                <button type="submit" disabled={loading === 'contact'} className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-colors mt-2">
                  {loading === 'contact' ? 'Đang gửi...' : 'Gửi yêu cầu'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
