const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Skill = require('../models/Skill');

// Force Node to use public DNS to resolve Atlas SRV if srv URI is used
try { require('dns').setServers(['8.8.8.8', '1.1.1.1']); } catch {}

const defaultSkills = [
  { name: 'React', category: 'Frontend' },
  { name: 'Angular', category: 'Frontend' },
  { name: 'Vue', category: 'Frontend' },
  { name: 'JavaScript', category: 'Frontend' },
  { name: 'TypeScript', category: 'Frontend' },
  { name: 'Next.js', category: 'Frontend' },
  { name: 'HTML', category: 'Frontend' },
  { name: 'CSS', category: 'Frontend' },
  { name: 'Tailwind CSS', category: 'Frontend' },
  { name: 'Node.js', category: 'Backend' },
  { name: 'Express.js', category: 'Backend' },
  { name: 'Golang', category: 'Backend' },
  { name: 'Java', category: 'Backend' },
  { name: 'Spring Boot', category: 'Backend' },
  { name: 'Python', category: 'Backend' },
  { name: 'Django', category: 'Backend' },
  { name: 'MongoDB', category: 'Database' },
  { name: 'MySQL', category: 'Database' },
  { name: 'PostgreSQL', category: 'Database' },
  { name: 'Redis', category: 'Database' },
  { name: 'AWS', category: 'DevOps' },
  { name: 'Docker', category: 'DevOps' },
  { name: 'Kubernetes', category: 'DevOps' },
  { name: 'Git', category: 'DevOps' },
  { name: 'Flutter', category: 'Mobile' },
  { name: 'React Native', category: 'Mobile' },
  { name: 'Figma', category: 'Design' },
  { name: 'UI Design', category: 'Design' },
];

function getMongoUri() {
  // Prefer explicit non-SRV fallback if SRV fails on local DNS
  const srv = process.env.MONGODB_URI || '';
  const username = process.env.MONGODB_USERNAME;
  const password = process.env.MONGODB_PASSWORD;
  // Build direct connection string from SRV hosts discovered via OS DNS
  // These hosts were verified via PowerShell Resolve-DnsName
  const directHosts = [
    'ac-kuymd87-shard-00-00.5g1jaoo.mongodb.net:27017',
    'ac-kuymd87-shard-00-01.5g1jaoo.mongodb.net:27017',
    'ac-kuymd87-shard-00-02.5g1jaoo.mongodb.net:27017',
  ];
  const directUri = `mongodb://${username}:${password}@${directHosts.join(',')}/itmatch?ssl=true&replicaSet=atlas-nlcur7-shard-0&authSource=admin&retryWrites=true&w=majority`;
  // Return directUri if srv is an srv string (contains +srv) to avoid Node SRV DNS issue
  if (srv.includes('mongodb+srv')) return directUri;
  return srv || directUri;
}

const seedDB = async () => {
  const mongoUri = getMongoUri();
  console.log('Using Mongo URI:', mongoUri.replace(/:[^:@]*@/, ':****@'));
  try {
    console.log('Connecting to MongoDB for seeding...');
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    console.log('Connected to', mongoose.connection.host, '/', mongoose.connection.name);

    console.log('Clearing old collections...');
    await User.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});
    await Skill.deleteMany({});

    console.log('Seeding skills...');
    await Skill.insertMany(defaultSkills);

    const candidatePassword = await bcrypt.hash('candidate123', 10);
    const employerPassword = await bcrypt.hash('employer123', 10);
    const adminPassword = await bcrypt.hash('admin123', 10);

    console.log('Seeding users...');
    const candidate = await User.create({
      name: 'Nguyễn Văn Nam', email: 'nam.nguyen@example.com', password: candidatePassword, role: 'candidate',
      phone: '0987654321', skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Git'],
      cvUrl: 'https://example.com/cv-nam.pdf', experience: '1 năm làm bài tập lớn & dự án cá nhân',
      education: 'Đại học Công nghệ thông tin', bio: 'Lập trình viên Frontend đầy đam mê.', github: 'https://github.com/namnguyen', linkedin: 'https://linkedin.com/in/namnguyen',
    });
    const employer = await User.create({ name: 'VNG Corp Recruiter', email: 'recruiter@vng.com.vn', password: employerPassword, role: 'employer', phone: '02839623888' });
    const admin = await User.create({ name: 'Hệ thống Admin', email: 'admin@itmatch.vn', password: adminPassword, role: 'admin' });

    console.log('Seeding jobs...');
    const d = (days) => new Date(Date.now() + days*24*60*60*1000);
    const jobsToCreate = [
      { companyId: employer._id, slug: 'senior-frontend-engineer-grab', title: 'Senior Frontend Engineer', company: 'Grab', logo: 'G', tone: 'tone-emerald', location: 'Hồ Chí Minh', salary: '2,500 – 4,000 USD', mode: 'Hybrid', experience: '3+ năm', tags: ['React', 'TypeScript', 'Next.js'], requirements: ['React', 'TypeScript', 'Next.js', 'Git', 'REST API'], description: 'Phát triển và tối ưu hóa các ứng dụng gọi xe.', level: 'Senior', quantity: 2, deadline: d(30), status: 'active', views: 120, applicants: 1 },
      { companyId: employer._id, slug: 'backend-engineer-golang-vng', title: 'Backend Engineer — Golang', company: 'VNG Corporation', logo: 'V', tone: 'tone-blue', location: 'Hồ Chí Minh', salary: '2,000 – 3,500 USD', mode: 'On-site', experience: '2+ năm', tags: ['Golang', 'Microservices', 'AWS'], requirements: ['Golang', 'Microservices', 'AWS', 'Docker', 'MySQL'], description: 'Xây dựng hệ thống backend chịu tải cao cho Zalo/ZaloPay.', level: 'Middle', quantity: 3, deadline: d(15), status: 'active', views: 85, applicants: 0 },
      { companyId: employer._id, slug: 'junior-qa-tester-fpt', title: 'Junior QA Tester', company: 'FPT Software', logo: 'F', tone: 'tone-orange', location: 'Hà Nội', salary: '500 – 800 USD', mode: 'On-site', experience: '0-1 năm', tags: ['Manual Test', 'Jira', 'SQL'], requirements: ['Manual Test', 'Jira', 'SQL'], description: 'Kiểm thử thủ công cho dự án outsourcing.', level: 'Junior', quantity: 5, deadline: d(20), status: 'active', views: 60, applicants: 0 },
      { companyId: employer._id, slug: 'intern-react-fresher-nashtech', title: 'Fresher Frontend (React) Intern', company: 'NashTech', logo: 'N', tone: 'tone-violet', location: 'Remote', salary: '500 – 800 USD', mode: 'Remote', experience: 'Intern', tags: ['React', 'JavaScript', 'HTML'], requirements: ['React', 'JavaScript', 'HTML'], description: 'Thực tập Frontend có lương, đào tạo bài bản.', level: 'Intern', quantity: 10, deadline: d(45), status: 'active', views: 200, applicants: 0 },
      { companyId: employer._id, slug: 'middle-devops-aws-shopee', title: 'Middle DevOps Engineer', company: 'Shopee', logo: 'S', tone: 'tone-sky', location: 'Hà Nội', salary: '1,200 – 2,000 USD', mode: 'Hybrid', experience: '2+ năm', tags: ['AWS', 'Docker', 'Kubernetes'], requirements: ['AWS', 'Docker', 'Kubernetes'], description: 'Vận hành hạ tầng thương mại điện tử.', level: 'Middle', quantity: 2, deadline: d(10), status: 'active', views: 95, applicants: 0 },
      { companyId: employer._id, slug: 'senior-data-engineer-momo', title: 'Senior Data Engineer', company: 'MoMo', logo: 'M', tone: 'tone-pink', location: 'Hồ Chí Minh', salary: '2,500 – 4,000 USD', mode: 'On-site', experience: '4+ năm', tags: ['Python', 'PostgreSQL', 'AWS'], requirements: ['Python', 'PostgreSQL', 'AWS'], description: 'Xây dựng pipeline dữ liệu lớn.', level: 'Senior', quantity: 1, deadline: d(25), status: 'active', views: 70, applicants: 0 },
      { companyId: employer._id, slug: 'fresher-java-spring-tiki', title: 'Fresher Java Spring Boot', company: 'Tiki', logo: 'T', tone: 'tone-blue', location: 'Hồ Chí Minh', salary: '500 – 800 USD', mode: 'Remote', experience: '0-1 năm', tags: ['Java', 'Spring Boot', 'MySQL'], requirements: ['Java', 'Spring Boot', 'MySQL'], description: 'Tham gia phát triển hệ thống TMĐT.', level: 'Fresher', quantity: 4, deadline: d(-2), status: 'active', views: 40, applicants: 0 },
      { companyId: employer._id, slug: 'middle-mobile-flutter-be', title: 'Middle Flutter Developer', company: 'Be Group', logo: 'B', tone: 'tone-emerald', location: 'Hà Nội', salary: '1,200 – 2,000 USD', mode: 'Hybrid', experience: '2+ năm', tags: ['Flutter', 'Dart', 'Git'], requirements: ['Flutter', 'Dart', 'Git'], description: 'Phát triển ứng dụng gọi xe.', level: 'Middle', quantity: 3, deadline: d(12), status: 'active', views: 55, applicants: 0 },
    ];
    const [job1] = await Job.insertMany(jobsToCreate);
    console.log('Seeding applications...');
    await Application.create({ userId: candidate._id, jobId: job1._id, companyId: employer._id, cvUrl: candidate.cvUrl, coverLetter: 'Kính gửi Grab, tôi có kinh nghiệm React và Git.', matchScore: 40, status: 'pending' });
    console.log('Database seeded successfully!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};
seedDB();
