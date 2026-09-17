import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Building2, Crown, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import Header from '../components/Header';
import { upgradePackage } from '../services/jobsApi';

export default function PricingPage() {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState('');

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

  const handleUpgrade = async (planId) => {
    if (!isAuthenticated) return navigate('/auth?role=employer');
    if (user.role !== 'employer') return alert('Chỉ nhà tuyển dụng mới có thể nâng cấp gói');
    
    if (planId === 'Enterprise') return alert('Đã gửi yêu cầu liên hệ!');
    if (planId === 'Free') return; // Default

    setLoading(planId);
    try {
      const res = await upgradePackage(planId);
      alert(res.message);
      setTimeout(() => navigate('/employer/dashboard'), 1500);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading('');
    }
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
                onClick={() => handleUpgrade(plan.id)}
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
    </div>
  );
}
