import { useQuery, useMutation } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { CheckCircle2, UserRound, Phone, FileText, Briefcase, GraduationCap, Github, Linkedin, Sparkles, AlertCircle } from 'lucide-react';
import Header from '../components/Header';
import { getProfile, updateProfile, uploadAvatar, uploadCv } from '../services/authApi';
import { fetchSkills } from '../services/jobsApi';
import useAuthStore from '../store/authStore';

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    cvUrl: '',
    experience: '',
    education: '',
    bio: '',
    github: '',
    linkedin: '',
    avatar: '',
  });

  const [selectedSkills, setSelectedSkills] = useState([]);
  const [saveStatus, setSaveStatus] = useState({ kind: 'idle', message: '' });
  const [upAvatar, setUpAvatar] = useState(false);
  const [upCv, setUpCv] = useState(false);

  // Fetch full profile details (to get latest DB state)
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });

  // Fetch all available skills
  const { data: skills = [], isLoading: skillsLoading } = useQuery({
    queryKey: ['skills'],
    queryFn: fetchSkills,
  });

  // Load profile values into state
  useEffect(() => {
    if (profileData?.user) {
      const u = profileData.user;
      setFormData({
        name: u.name || '',
        phone: u.phone || '',
        cvUrl: u.cvUrl || '',
        experience: u.experience || '',
        education: u.education || '',
        bio: u.bio || '',
        github: u.github || '',
        linkedin: u.linkedin || '',
        avatar: u.avatar || '',
      });
      setSelectedSkills(u.skills || []);
    }
  }, [profileData]);

  // Update profile mutation
  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      setSaveStatus({ kind: 'success', message: data.message || 'Cập nhật hồ sơ thành công!' });
      updateUser(data.user); // Update Zustand state
      setTimeout(() => setSaveStatus({ kind: 'idle', message: '' }), 3000);
    },
    onError: (err) => {
      setSaveStatus({ kind: 'error', message: err.message || 'Đã xảy ra lỗi khi lưu' });
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillToggle = (skillName) => {
    setSelectedSkills((prev) => {
      if (prev.includes(skillName)) {
        return prev.filter((s) => s !== skillName);
      } else {
        return [...prev, skillName];
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaveStatus({ kind: 'idle', message: '' });

    updateMutation.mutate({
      ...formData,
      skills: selectedSkills,
    });
  };

  const handleAvatarFile = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUpAvatar(true);
    try { const r = await uploadAvatar(file); setFormData(p => ({ ...p, avatar: r.url })); updateUser(r.user); setSaveStatus({ kind: 'success', message: 'Upload avatar thành công!' }); } catch (err) { setSaveStatus({ kind: 'error', message: err.message }); } finally { setUpAvatar(false); }
  };
  const handleCvFile = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUpCv(true);
    try { const r = await uploadCv(file); setFormData(p => ({ ...p, cvUrl: r.url })); updateUser(r.user); setSaveStatus({ kind: 'success', message: 'Upload CV thành công!' }); } catch (err) { setSaveStatus({ kind: 'error', message: err.message }); } finally { setUpCv(false); }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
        <Header />
        <div className="max-w-4xl w-full mx-auto px-4 py-20 flex-grow">
          <div className="bg-white border border-gray-200 rounded-3xl p-8 animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4" />
            <div className="h-12 bg-gray-200 rounded w-full" />
            <div className="h-12 bg-gray-200 rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Group skills by category
  const categories = {};
  skills.forEach((skill) => {
    if (!categories[skill.category]) {
      categories[skill.category] = [];
    }
    categories[skill.category].push(skill);
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Header />

      <main className="flex-grow max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Ứng viên</p>
          <h1 className="text-3xl font-black text-gray-900 mt-1">Cập nhật hồ sơ cá nhân</h1>
        </div>

        {saveStatus.kind === 'success' && (
          <div className="mb-6 flex items-center gap-2 p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-xs font-semibold border border-emerald-100">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>{saveStatus.message}</span>
          </div>
        )}

        {saveStatus.kind === 'error' && (
          <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-2xl text-xs font-semibold border border-red-100">
            <span>{saveStatus.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid md:grid-cols-[1fr_280px] gap-8">
          {/* Main profile form */}
          <div className="bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-gray-700">Họ và tên</span>
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus-within:border-blue-500 transition-colors">
                <UserRound size={18} className="text-gray-400" />
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent outline-none text-sm text-gray-800"
                />
              </div>
            </label>

            <div className="grid sm:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-bold text-gray-700">Số điện thoại</span>
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus-within:border-blue-500 transition-colors">
                  <Phone size={18} className="text-gray-400" />
                  <input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-transparent outline-none text-sm text-gray-800"
                  />
                </div>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-bold text-gray-700">Avatar</span>
                <div className="flex items-center gap-3">
                  {formData.avatar ? <img src={formData.avatar} alt="avatar" className="w-12 h-12 rounded-full object-cover border" /> : <div className="w-12 h-12 rounded-full bg-gray-100 border flex items-center justify-center text-gray-400 text-xs">No img</div>}
                  <label className="text-xs font-bold px-3 py-2 bg-white border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">{upAvatar ? 'Đang tải...' : 'Chọn ảnh'}<input type="file" accept="image/*" className="hidden" onChange={handleAvatarFile} disabled={upAvatar} /></label>
                </div>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-bold text-gray-700">CV (PDF)</span>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold px-3 py-2 bg-white border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">{upCv ? 'Đang tải...' : 'Upload CV'}<input type="file" accept=".pdf" className="hidden" onChange={handleCvFile} disabled={upCv} /></label>
                  {formData.cvUrl && <a href={formData.cvUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-600 underline truncate max-w-[180px]">Xem CV</a>}
                </div>
                <input name="cvUrl" type="url" value={formData.cvUrl} onChange={handleChange} placeholder="https://.../cv.pdf (hoặc upload file)" className="mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 text-sm text-gray-800" />
              </label>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-bold text-gray-700">Kinh nghiệm làm việc</span>
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus-within:border-blue-500 transition-colors">
                  <Briefcase size={18} className="text-gray-400" />
                  <input
                    name="experience"
                    type="text"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="Ví dụ: 2 năm kinh nghiệm React"
                    className="w-full bg-transparent outline-none text-sm text-gray-800"
                  />
                </div>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-bold text-gray-700">Học vấn / Bằng cấp</span>
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus-within:border-blue-500 transition-colors">
                  <GraduationCap size={18} className="text-gray-400" />
                  <input
                    name="education"
                    type="text"
                    value={formData.education}
                    onChange={handleChange}
                    placeholder="Ví dụ: Đại học Bách Khoa"
                    className="w-full bg-transparent outline-none text-sm text-gray-800"
                  />
                </div>
              </label>
            </div>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-gray-700">Mô tả tóm tắt bản thân</span>
              <textarea
                name="bio"
                rows={4}
                value={formData.bio}
                onChange={handleChange}
                placeholder="Giới thiệu nhanh về mục tiêu nghề nghiệp, stack đang quan tâm..."
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 text-sm text-gray-800"
              />
            </label>

            <div className="grid sm:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-bold text-gray-700">Link GitHub</span>
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus-within:border-blue-500 transition-colors">
                  <Github size={18} className="text-gray-400" />
                  <input
                    name="github"
                    type="url"
                    value={formData.github}
                    onChange={handleChange}
                    className="w-full bg-transparent outline-none text-sm text-gray-800"
                  />
                </div>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-bold text-gray-700">Link LinkedIn</span>
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus-within:border-blue-500 transition-colors">
                  <Linkedin size={18} className="text-gray-400" />
                  <input
                    name="linkedin"
                    type="url"
                    value={formData.linkedin}
                    onChange={handleChange}
                    className="w-full bg-transparent outline-none text-sm text-gray-800"
                  />
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-sm text-sm"
            >
              {updateMutation.isPending ? 'Đang lưu...' : 'Lưu hồ sơ'}
            </button>
          </div>

          {/* Skill Selector Sidebar (for Matching Score) */}
          <div className="bg-white border border-gray-200/80 rounded-3xl p-5 shadow-sm space-y-6 h-fit">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5 border-b border-gray-100 pb-3">
              <Sparkles size={16} className="text-blue-600" />
              <span>Kỹ năng của bạn</span>
            </h3>

            {skillsLoading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            ) : (
              <div className="space-y-6 max-h-[450px] overflow-y-auto pr-1">
                {Object.keys(categories).map((cat) => (
                  <div key={cat} className="space-y-2">
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
                      {cat}
                    </span>
                    <div className="flex flex-col gap-1.5">
                      {categories[cat].map((skill) => {
                        const isChecked = selectedSkills.includes(skill.name);
                        return (
                          <label key={skill.name} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleSkillToggle(skill.name)}
                              className="rounded text-blue-600 focus:ring-blue-500 size-3.5 cursor-pointer"
                            />
                            <span className={isChecked ? 'font-bold text-blue-600' : ''}>
                              {skill.name}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="text-[10px] text-gray-400 leading-normal flex items-start gap-1 p-2 bg-blue-50/50 rounded-xl">
              <AlertCircle size={14} className="shrink-0 text-blue-600" />
              <span>Hãy chọn đúng kỹ năng của bạn để thuật toán tính điểm Matching Score khớp chuẩn nhất!</span>
            </div>
          </div>
        </form>
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 mt-16 text-center text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4">
          © 2026 itmatch. Một sản phẩm tuyển dụng công nghệ độc lập cho sinh viên CNTT.
        </div>
      </footer>
    </div>
  );
}
