require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
try{require('dns').setServers(['8.8.8.8','1.1.1.1'])}catch{}
const User = require('./src/models/User');
const Company = require('./src/models/Company');
const Job = require('./src/models/Job');
const Application = require('./src/models/Application');
const Skill = require('./src/models/Skill');

function getMongoUri(){
  const srv=process.env.MONGODB_URI||'';
  const u=process.env.MONGODB_USERNAME, p=process.env.MONGODB_PASSWORD;
  const hosts=['ac-kuymd87-shard-00-00.5g1jaoo.mongodb.net:27017','ac-kuymd87-shard-00-01.5g1jaoo.mongodb.net:27017','ac-kuymd87-shard-00-02.5g1jaoo.mongodb.net:27017'];
  const direct='mongodb://'+u+':'+p+'@'+hosts.join(',')+'/itmatch?ssl=true&replicaSet=atlas-nlcur7-shard-0&authSource=admin&retryWrites=true&w=majority';
  if(srv.includes('mongodb+srv')) return direct;
  return srv||direct;
}
const slugify=s=>String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const d=days=>new Date(Date.now()+days*24*60*60*1000);
const daysAgo=n=>new Date(Date.now()-n*24*60*60*1000);

async function run(){
  const uri=getMongoUri();
  console.log('Connecting...',uri.replace(/:[^:@]*@/,' :****@'));
  await mongoose.connect(uri,{serverSelectionTimeoutMS:15000});
  console.log('Connected to',mongoose.connection.name);

  console.log('Clearing...');
  await Promise.all([User.deleteMany({}), Company.deleteMany({}), Job.deleteMany({}), Application.deleteMany({}), Skill.deleteMany({})]);

  await Skill.insertMany([
    {name:'React',category:'Frontend'},{name:'Vue',category:'Frontend'},{name:'Angular',category:'Frontend'},{name:'Next.js',category:'Frontend'},{name:'JavaScript',category:'Frontend'},{name:'TypeScript',category:'Frontend'},{name:'HTML',category:'Frontend'},{name:'CSS',category:'Frontend'},{name:'Tailwind CSS',category:'Frontend'},
    {name:'Node.js',category:'Backend'},{name:'Express.js',category:'Backend'},{name:'NestJS',category:'Backend'},{name:'Java',category:'Backend'},{name:'Spring Boot',category:'Backend'},{name:'Golang',category:'Backend'},{name:'Python',category:'Backend'},{name:'Django',category:'Backend'},{name:'C#',category:'Backend'},{name:'.NET',category:'Backend'},
    {name:'MySQL',category:'Database'},{name:'PostgreSQL',category:'Database'},{name:'MongoDB',category:'Database'},{name:'Redis',category:'Database'},
    {name:'AWS',category:'DevOps'},{name:'Docker',category:'DevOps'},{name:'Kubernetes',category:'DevOps'},{name:'CI/CD',category:'DevOps'},{name:'Git',category:'DevOps'},{name:'Linux',category:'DevOps'},
    {name:'Figma',category:'Design'},{name:'UX Research',category:'Design'},{name:'SQL',category:'Database'},{name:'Power BI',category:'Other'},
    {name:'Flutter',category:'Mobile'},{name:'React Native',category:'Mobile'},{name:'Kotlin',category:'Mobile'},{name:'Swift',category:'Mobile'},
    {name:'Manual Test',category:'Other'},{name:'Automation Test',category:'Other'},{name:'Jira',category:'Other'},{name:'Selenium',category:'Other'},
  ]);

  const adminPass=await bcrypt.hash('admin123',10);
  const empPass=await bcrypt.hash('employer123',10);
  const candPass=await bcrypt.hash('candidate123',10);

  const admin=await User.create({name:'Hệ thống Admin',email:'admin@itmatch.vn',password:adminPass,role:'admin'});
  console.log('Admin:',admin.email);

  // 1 employer = 1 company — CHUẨN THỰC TẾ
  const employerDefs=[
    {name:'VNG Corporation HR',email:'recruiter@vng.com.vn',phone:'02839623888'},
    {name:'FPT Software HR',email:'hr@fpt.com.vn',phone:'02473002222'},
    {name:'Shopee Vietnam Talent',email:'talent@shopee.vn',phone:'02871008888'},
    {name:'MoMo Talent',email:'careers@momo.vn',phone:'02873089999'},
    {name:'Tiki HR',email:'hr@tiki.vn',phone:'19006035'},
    {name:'KMS Technology',email:'jobs@kms-technology.com',phone:'02838117000'},
    {name:'Grab Vietnam HR',email:'careers@grab.com.vn',phone:'02838228888'},
    {name:'NashTech HR',email:'hr@nashtech.vn',phone:'02838117001'},
    {name:'Be Group Talent',email:'talent@be.com.vn',phone:'02871009999'},
    {name:'Viettel Digital HR',email:'tuyendung@viettel.com.vn',phone:'02462668888'},
    {name:'CMC Global HR',email:'hr@cmcglobal.vn',phone:'02471005555'},
    {name:'Rikkeisoft HR',email:'hr@rikkeisoft.com',phone:'02436230021'},
  ];
  const employerUsers=[];
  for(const e of employerDefs){
    const u=await User.create({...e,password:empPass,role:'employer'});
    employerUsers.push(u);
  }
  const empMap=Object.fromEntries(employerUsers.map(u=>[u.email,u]));
  console.log('Employers:',employerUsers.length,'(1-1)');

  const candidates = await User.insertMany([
    {name:'Nguyễn Văn Nam',email:'nam.nguyen@example.com',password:candPass,role:'candidate',phone:'0987654321',skills:['React','JavaScript','HTML','CSS','Git'],experience:'1 năm',education:'ĐH CNTT',bio:'Frontend dev'},
    {name:'Trần Minh Thái',email:'thai@gmail.com',password:candPass,role:'candidate',phone:'0901234567',skills:['Node.js','React','MongoDB','AWS'],experience:'2 năm',education:'ĐH Bách Khoa',bio:'Fullstack - chủ sở hữu IT-AI'},
    {name:'Lê Thị Hương',email:'huong.le@example.com',password:candPass,role:'candidate',phone:'0912345678',skills:['Java','Spring Boot','MySQL','Docker'],experience:'3 năm',education:'ĐH KHTN',bio:'Backend Java'},
    {name:'Phạm Quốc Bảo',email:'bao.pham@example.com',password:candPass,role:'candidate',phone:'0923456789',skills:['Python','Django','PostgreSQL','AWS'],experience:'2 năm',education:'ĐH CNTT',bio:'Python dev'},
    {name:'Hoàng Anh Tuấn',email:'tuan.hoang@example.com',password:candPass,role:'candidate',phone:'0934567890',skills:['Flutter','Dart','Firebase'],experience:'1 năm',education:'ĐH FPT',bio:'Mobile dev'},
    {name:'Vũ Minh Châu',email:'chau.vu@example.com',password:candPass,role:'candidate',phone:'0945678901',skills:['Figma','UI Design','UX Research'],experience:'2 năm',education:'ĐH Mỹ thuật',bio:'Product Designer'},
    {name:'Đặng Văn Minh',email:'minh@gmail.com',password:candPass,role:'candidate',phone:'0956789012',skills:['React','Node.js','TypeScript'],experience:'1 năm',education:'ĐH Công nghiệp',bio:'Fresher'},
    {name:'Bùi Thanh Thảo',email:'thao.bui@example.com',password:candPass,role:'candidate',phone:'0967890123',skills:['Manual Test','Jira','SQL','Selenium'],experience:'2 năm',education:'ĐH CNTT',bio:'QA Tester'},
    {name:'Nguyễn Thu Hà',email:'ha.nguyen@example.com',password:candPass,role:'candidate',phone:'0978123456',skills:['Golang','Microservices','AWS','Docker'],experience:'4 năm',education:'ĐH BK HCM',bio:'Senior Backend Golang'},
    {name:'Lê Văn Dũng',email:'dung.le@example.com',password:candPass,role:'candidate',phone:'0988123456',skills:['C#','.NET','Azure','SQL Server'],experience:'3 năm',education:'ĐH CNTT',bio:'.NET Developer'},
  ]);
  console.log('Candidates:',candidates.length);

  const itAiEmployer = await User.create({name:'IT-AI HR',email:'itai@company.vn',password:empPass,role:'employer',phone:'0909999888'});

  const companiesData=[
    {owner:empMap['recruiter@vng.com.vn'],name:'VNG Corporation',slug:'vng-corporation',email:'contact@vng.com.vn',website:'https://vng.com.vn',industry:'Game / Social',size:'1000+',address:'Z06 Đường số 13, Tân Thuận, Q7, HCM',description:'Tập đoàn công nghệ hàng đầu VN - Zalo, ZaloPay, game. Môi trường năng động, phúc lợi tốt.',techStack:['Golang','Java','React','AWS','Kubernetes'],logo:'V'},
    {owner:empMap['hr@fpt.com.vn'],name:'FPT Software',slug:'fpt-software',email:'contact@fpt.com.vn',website:'https://fpt-software.com',industry:'Outsourcing',size:'1000+',address:'Tòa FPT, Duy Tân, Cầu Giấy, Hà Nội',description:'Công ty phần mềm lớn nhất VN, khách hàng toàn cầu.',techStack:['Java','.NET','React','AWS','Azure'],logo:'F'},
    {owner:empMap['talent@shopee.vn'],name:'Shopee',slug:'shopee',email:'hr@shopee.vn',website:'https://shopee.vn',industry:'E-commerce',size:'1000+',address:'Saigon Centre, Lê Lợi, Q1, HCM',description:'Sàn TMĐT hàng đầu ĐNA, tăng trưởng nhanh.',techStack:['Golang','React','AWS','Kubernetes','Redis'],logo:'S'},
    {owner:empMap['careers@momo.vn'],name:'MoMo',slug:'momo',email:'talent@momo.vn',website:'https://momo.vn',industry:'Fintech',size:'500-1000',address:'Lê Đại Hành, Q11, HCM',description:'Ví điện tử số 1 VN - 30M+ users.',techStack:['Java','Kotlin','React Native','AWS','Kafka'],logo:'M'},
    {owner:empMap['hr@tiki.vn'],name:'Tiki',slug:'tiki',email:'hr@tiki.vn',website:'https://tiki.vn',industry:'E-commerce',size:'500-1000',address:'52 Út Tịch, Tân Bình, HCM',description:'Sàn TMĐT Tiki - giao nhanh 2h.',techStack:['Java','Spring Boot','React','MySQL','Redis'],logo:'T'},
    {owner:empMap['jobs@kms-technology.com'],name:'KMS Technology',slug:'kms-technology',email:'jobs@kms-technology.com',website:'https://kms-technology.com',industry:'Product / Outsourcing',size:'500-1000',address:'123 Cộng Hòa, Tân Bình, HCM',description:'Product development cho thị trường US.',techStack:['.NET','Java','React','AWS','Azure'],logo:'K'},
    {owner:itAiEmployer,name:'IT-AI',slug:'it-ai',email:'contact@it-ai.vn',website:'https://it-ai.vn',industry:'AI',size:'50-100',address:'Hà Nội',description:'Startup AI - ứng dụng CV & matching thông minh cho ITMatch.',techStack:['React','Python','Node.js','AWS'],logo:'I'},
    {owner:empMap['careers@grab.com.vn'],name:'Grab Vietnam',slug:'grab-vietnam',email:'careers@grab.com',website:'https://grab.com',industry:'Super App',size:'1000+',address:'Mapletree Business Centre, Q7, HCM',description:'Super App gọi xe, giao đồ ăn, thanh toán.',techStack:['React','Golang','AWS','Kubernetes'],logo:'G'},
    {owner:empMap['hr@nashtech.vn'],name:'NashTech',slug:'nashtech',email:'vn.careers@nashtechglobal.com',website:'https://nashtechglobal.com',industry:'Outsourcing',size:'500-1000',address:'Etown, Cộng Hòa, Tân Bình, HCM',description:'Thuộc Nash Squared - outsourcing UK, văn hóa quốc tế.',techStack:['React','.NET','Java','Azure'],logo:'N'},
    {owner:empMap['talent@be.com.vn'],name:'Be Group',slug:'be-group',email:'hr@be.com.vn',website:'https://be.com.vn',industry:'Super App',size:'500-1000',address:'167 Trần Não, Q2, HCM',description:'Ứng dụng gọi xe Be - Make in Vietnam.',techStack:['Flutter','Golang','AWS'],logo:'B'},
    {owner:empMap['tuyendung@viettel.com.vn'],name:'Viettel Digital',slug:'viettel-digital',email:'tuyendung@viettel.com.vn',website:'https://viettel.com.vn',industry:'Telco / Fintech',size:'1000+',address:'1 Giang Văn Minh, Ba Đình, Hà Nội',description:'Viettel Money, MyViettel và hệ sinh thái số.',techStack:['Java','React','Kubernetes','AWS'],logo:'V'},
    {owner:empMap['hr@cmcglobal.vn'],name:'CMC Global',slug:'cmc-global',email:'hr@cmcglobal.com.vn',website:'https://cmcglobal.com.vn',industry:'Outsourcing',size:'500-1000',address:'Duy Tân, Cầu Giấy, Hà Nội',description:'Tập đoàn CNTT CMC - outsourcing Nhật, US.',techStack:['Java','React','AWS','SAP'],logo:'C'},
    {owner:empMap['hr@rikkeisoft.com'],name:'Rikkeisoft',slug:'rikkeisoft',email:'hr@rikkeisoft.com',website:'https://rikkeisoft.com',industry:'Outsourcing',size:'1000+',address:'Handico Tower, Phạm Hùng, Hà Nội',description:'Top outsourcing HN - khách Nhật, US.',techStack:['Java','PHP','React','AWS'],logo:'R'},
  ];
  const compPass = await bcrypt.hash('company123',10);
  for(const c of companiesData){
    const isVerified = c.name === 'IT-AI' ? false : true;
    await Company.create({ownerId:c.owner._id,name:c.name,slug:c.slug,email:c.email,password:compPass,website:c.website,industry:c.industry,size:c.size,address:c.address,description:c.description,techStack:c.techStack,logo:'https://ui-avatars.com/api/?name='+encodeURIComponent(c.logo)+'&background=16423f&color=fff&size=200',isVerified,isActive:true});
  }
  console.log('Companies:',await Company.countDocuments(),'(IT-AI pending)');

  // Nhiều việc như web thật — stagger thời gian đăng
  const jobsToCreate=[
    // VNG - 4 jobs
    {email:'recruiter@vng.com.vn',company:'VNG Corporation',title:'Backend Engineer — Golang',location:'Hồ Chí Minh',salary:'2,000 – 3,500 USD',mode:'Hybrid',level:'Middle',quantity:3,experience:'2+ năm',tags:['Golang','Microservices','AWS'],requirements:['Golang','Microservices','AWS','Docker','MySQL'],description:'Xây hệ thống backend chịu tải cao cho Zalo/ZaloPay, thiết kế microservices, tối ưu DB.',deadline:d(15),ago:2,views:342},
    {email:'recruiter@vng.com.vn',company:'VNG Corporation',title:'Senior Frontend Engineer (React)',location:'Hồ Chí Minh',salary:'2,500 – 4,500 USD',mode:'On-site',level:'Senior',quantity:2,experience:'4+ năm',tags:['React','TypeScript','Next.js'],requirements:['React','TypeScript','Next.js','GraphQL'],description:'Phát triển Zalo Mini App & web platform, tối ưu performance.',deadline:d(20),ago:5,views:298},
    {email:'recruiter@vng.com.vn',company:'VNG Corporation',title:'DevOps Engineer (Kubernetes)',location:'Hồ Chí Minh',salary:'1,800 – 3,000 USD',mode:'Hybrid',level:'Senior',quantity:1,experience:'3+ năm',tags:['Kubernetes','AWS','Docker'],requirements:['Kubernetes','AWS','Docker','Jenkins'],description:'Vận hành infra ZaloPay, multi-AZ, auto scaling.',deadline:d(25),ago:1,views:156},
    {email:'recruiter@vng.com.vn',company:'VNG Corporation',title:'Data Scientist (AI)',location:'Hồ Chí Minh',salary:'2,200 – 4,000 USD',mode:'Hybrid',level:'Middle',quantity:1,experience:'2+ năm',tags:['Python','ML','TensorFlow'],requirements:['Python','TensorFlow','PyTorch','SQL'],description:'Xây model gợi ý, fraud detection cho ZaloPay.',deadline:d(30),ago:7,views:201},
    // FPT - 4
    {email:'hr@fpt.com.vn',company:'FPT Software',title:'Junior QA Tester',location:'Hà Nội',salary:'500 – 800 USD',mode:'On-site',level:'Junior',quantity:5,experience:'0-1 năm',tags:['Manual Test','Jira','SQL'],requirements:['Manual Test','Jira','SQL'],description:'Kiểm thử dự án outsourcing Nhật, viết test case, log bug.',deadline:d(18),ago:3,views:210},
    {email:'hr@fpt.com.vn',company:'FPT Software',title:'Java Developer (Spring Boot)',location:'Đà Nẵng',salary:'1,000 – 2,000 USD',mode:'On-site',level:'Middle',quantity:4,experience:'2+ năm',tags:['Java','Spring Boot','MySQL'],requirements:['Java','Spring Boot','MySQL','Docker'],description:'Phát triển hệ thống ngân hàng số cho khách hàng Nhật.',deadline:d(22),ago:4,views:267},
    {email:'hr@fpt.com.vn',company:'FPT Software',title:'.NET Developer (Azure)',location:'Hà Nội',salary:'1,200 – 2,200 USD',mode:'Hybrid',level:'Middle',quantity:2,experience:'2+ năm',tags:['C#','.NET','Azure'],requirements:['C#','.NET','Azure','SQL Server'],description:'Dự án healthcare US, agile, CI/CD fully automated.',deadline:d(14),ago:6,views:143},
    {email:'hr@fpt.com.vn',company:'FPT Software',title:'Bridge Engineer (BrSE) — Japanese',location:'Hà Nội',salary:'1,500 – 2,500 USD',mode:'On-site',level:'Middle',quantity:2,experience:'2+ năm',tags:['BrSE','Japanese N2','Java'],requirements:['Japanese N2','Java','Communication'],description:'Cầu nối khách Nhật, yêu cầu tiếng Nhật N2.',deadline:d(20),ago:8,views:189},
    // Shopee - 3
    {email:'talent@shopee.vn',company:'Shopee',title:'Middle DevOps Engineer',location:'Hà Nội',salary:'1,200 – 2,000 USD',mode:'Hybrid',level:'Middle',quantity:2,experience:'2+ năm',tags:['AWS','Docker','Kubernetes'],requirements:['AWS','Docker','Kubernetes','Terraform'],description:'Vận hành hạ tầng TMĐT hàng triệu request/ngày.',deadline:d(12),ago:2,views:178},
    {email:'talent@shopee.vn',company:'Shopee',title:'Data Analyst (E-commerce)',location:'Hồ Chí Minh',salary:'1,200 – 2,200 USD',mode:'Hybrid',level:'Junior',quantity:2,experience:'1+ năm',tags:['SQL','Python','BI'],requirements:['SQL','Python','Tableau','Excel'],description:'Phân tích hành vi mua sắm, xây dashboard BI cho team Growth.',deadline:d(14),ago:9,views:203},
    {email:'talent@shopee.vn',company:'Shopee',title:'Product Manager (E-commerce)',location:'Hồ Chí Minh',salary:'2,000 – 3,500 USD',mode:'On-site',level:'Senior',quantity:1,experience:'3+ năm',tags:['Product','SQL','Agile'],requirements:['Product','Agile','SQL','UX'],description:'Dẫn dắt roadmap Shopee Live, phối hợp tech/design.',deadline:d(25),ago:12,views:267},
    // MoMo - 3
    {email:'careers@momo.vn',company:'MoMo',title:'Senior Data Engineer',location:'Hồ Chí Minh',salary:'2,500 – 4,000 USD',mode:'On-site',level:'Senior',quantity:1,experience:'4+ năm',tags:['Python','PostgreSQL','AWS'],requirements:['Python','PostgreSQL','AWS','Spark'],description:'Xây data pipeline, DWH cho hệ thống ví điện tử 30M user.',deadline:d(25),ago:3,views:165},
    {email:'careers@momo.vn',company:'MoMo',title:'Senior Mobile Engineer (React Native)',location:'Hồ Chí Minh',salary:'2,000 – 3,500 USD',mode:'Hybrid',level:'Senior',quantity:2,experience:'3+ năm',tags:['React Native','TypeScript','Redux'],requirements:['React Native','TypeScript','Redux','Jest'],description:'Phát triển app MoMo, tối ưu performance & UX.',deadline:d(20),ago:5,views:221},
    {email:'careers@momo.vn',company:'MoMo',title:'Security Engineer (AppSec)',location:'Hồ Chí Minh',salary:'2,000 – 3,200 USD',mode:'On-site',level:'Middle',quantity:1,experience:'2+ năm',tags:['Security','Pentest','AWS'],requirements:['Security','Pentest','AWS','OWASP'],description:'Đảm bảo an toàn ví điện tử, audit PCI DSS.',deadline:d(28),ago:10,views:98},
    // Tiki - 2
    {email:'hr@tiki.vn',company:'Tiki',title:'Fresher Java Spring Boot',location:'Hồ Chí Minh',salary:'500 – 800 USD',mode:'Remote',level:'Fresher',quantity:4,experience:'0-1 năm',tags:['Java','Spring Boot','MySQL'],requirements:['Java','Spring Boot','MySQL'],description:'Tham gia phát triển hệ thống TMĐT Tiki.',deadline:d(-2),ago:20,views:198},
    {email:'hr@tiki.vn',company:'Tiki',title:'Senior Backend (TikiNOW)',location:'Hồ Chí Minh',salary:'1,800 – 3,000 USD',mode:'Hybrid',level:'Senior',quantity:2,experience:'3+ năm',tags:['Java','Kafka','Redis'],requirements:['Java','Kafka','Redis','MySQL'],description:'Tối ưu hệ thống giao nhanh 2h.',deadline:d(18),ago:4,views:176},
    // KMS - 3
    {email:'jobs@kms-technology.com',company:'KMS Technology',title:'Senior .NET Developer',location:'Hồ Chí Minh',salary:'2,000 – 3,200 USD',mode:'Hybrid',level:'Senior',quantity:3,experience:'3+ năm',tags:['C#','.NET','Azure'],requirements:['C#','.NET','Azure','SQL Server'],description:'Làm sản phẩm healthcare US, agile, CI/CD.',deadline:d(16),ago:2,views:187},
    {email:'jobs@kms-technology.com',company:'KMS Technology',title:'Automation QA Engineer',location:'Hồ Chí Minh',salary:'1,000 – 1,800 USD',mode:'Hybrid',level:'Middle',quantity:2,experience:'2+ năm',tags:['Selenium','Java','CI/CD'],requirements:['Selenium','Java','TestNG','Jenkins'],description:'Xây framework automation test cho sản phẩm US.',deadline:d(28),ago:6,views:98},
    {email:'jobs@kms-technology.com',company:'KMS Technology',title:'Frontend Leader (React)',location:'Hồ Chí Minh',salary:'2,200 – 3,500 USD',mode:'Hybrid',level:'Senior',quantity:1,experience:'4+ năm',tags:['React','TypeScript','Next.js'],requirements:['React','TypeScript','Next.js','GraphQL'],description:'Dẫn dắt team frontend 8 người, xây design system.',deadline:d(22),ago:9,views:134},
    // Grab - 3
    {email:'careers@grab.com.vn',company:'Grab Vietnam',title:'Senior Frontend Engineer',location:'Hồ Chí Minh',salary:'2,500 – 4,000 USD',mode:'Hybrid',level:'Senior',quantity:2,experience:'3+ năm',tags:['React','TypeScript','Next.js'],requirements:['React','TypeScript','Next.js','Git'],description:'Phát triển ứng dụng gọi xe Grab.',deadline:d(30),ago:1,views:276},
    {email:'careers@grab.com.vn',company:'Grab Vietnam',title:'Backend Golang (GrabFood)',location:'Hồ Chí Minh',salary:'2,000 – 3,500 USD',mode:'On-site',level:'Middle',quantity:3,experience:'2+ năm',tags:['Golang','Kafka','Redis'],requirements:['Golang','Kafka','Redis','PostgreSQL'],description:'Backend GrabFood, handle peak 100k TPS.',deadline:d(20),ago:3,views:198},
    {email:'careers@grab.com.vn',company:'Grab Vietnam',title:'Product Designer (SuperApp)',location:'Hồ Chí Minh',salary:'1,800 – 3,000 USD',mode:'Hybrid',level:'Middle',quantity:1,experience:'2+ năm',tags:['Figma','UX Research','Design System'],requirements:['Figma','UX Research','Design System'],description:'Thiết kế trải nghiệm SuperApp cho 30M users.',deadline:d(15),ago:7,views:167},
    // NashTech - 2
    {email:'hr@nashtech.vn',company:'NashTech',title:'Fresher Frontend (React) Intern',location:'Remote',salary:'500 – 800 USD',mode:'Remote',level:'Intern',quantity:10,experience:'Intern',tags:['React','JavaScript','HTML'],requirements:['React','JavaScript','HTML'],description:'Thực tập có lương, đào tạo bài bản, cơ hội lên chính thức.',deadline:d(40),ago:2,views:412},
    {email:'hr@nashtech.vn',company:'NashTech',title:'Senior Java Developer (Banking)',location:'Hồ Chí Minh',salary:'2,000 – 3,000 USD',mode:'Hybrid',level:'Senior',quantity:2,experience:'3+ năm',tags:['Java','Spring Boot','AWS'],requirements:['Java','Spring Boot','AWS','PostgreSQL'],description:'Dự án core banking UK.',deadline:d(18),ago:5,views:201},
    // Be - 2
    {email:'talent@be.com.vn',company:'Be Group',title:'Middle Flutter Developer',location:'Hà Nội',salary:'1,200 – 2,000 USD',mode:'Hybrid',level:'Middle',quantity:3,experience:'2+ năm',tags:['Flutter','Dart','Firebase'],requirements:['Flutter','Dart','Firebase','REST API'],description:'Phát triển app gọi xe Be, bản đồ, thanh toán.',deadline:d(12),ago:3,views:143},
    {email:'talent@be.com.vn',company:'Be Group',title:'Backend Golang (Be Delivery)',location:'Hà Nội',salary:'1,500 – 2,500 USD',mode:'On-site',level:'Middle',quantity:2,experience:'2+ năm',tags:['Golang','PostgreSQL','Redis'],requirements:['Golang','PostgreSQL','Redis','Kafka'],description:'Backend giao hàng Be, real-time tracking.',deadline:d(20),ago:8,views:112},
    // Viettel - 2
    {email:'tuyendung@viettel.com.vn',company:'Viettel Digital',title:'Backend Java Engineer (Viettel Money)',location:'Hà Nội',salary:'1,500 – 2,800 USD',mode:'On-site',level:'Middle',quantity:5,experience:'2+ năm',tags:['Java','Spring Boot','Kafka'],requirements:['Java','Spring Boot','Kafka','Redis'],description:'Xây backend Viettel Money - ví điện tử quốc dân.',deadline:d(18),ago:2,views:234},
    {email:'tuyendung@viettel.com.vn',company:'Viettel Digital',title:'AI Engineer (Telco LLM)',location:'Hà Nội',salary:'2,000 – 3,500 USD',mode:'On-site',level:'Senior',quantity:2,experience:'3+ năm',tags:['Python','LLM','PyTorch'],requirements:['Python','LLM','PyTorch','AWS'],description:'Xây LLM cho tổng đài Viettel, RAG trên dữ liệu telco.',deadline:d(30),ago:6,views:189},
    // CMC - 3
    {email:'hr@cmcglobal.vn',company:'CMC Global',title:'Frontend Developer (React)',location:'Hà Nội',salary:'1,000 – 1,800 USD',mode:'On-site',level:'Junior',quantity:3,experience:'1+ năm',tags:['React','TypeScript','Tailwind CSS'],requirements:['React','TypeScript','Tailwind CSS','REST API'],description:'Làm dự án outsourcing Nhật, UI/UX chuẩn Nhật.',deadline:d(24),ago:4,views:167},
    {email:'hr@cmcglobal.vn',company:'CMC Global',title:'DevOps Engineer (AWS)',location:'Hà Nội',salary:'1,500 – 2,500 USD',mode:'Hybrid',level:'Middle',quantity:2,experience:'2+ năm',tags:['AWS','Terraform','Docker'],requirements:['AWS','Terraform','Docker','Kubernetes'],description:'Vận hành hạ tầng AWS cho khách hàng enterprise.',deadline:d(20),ago:7,views:112},
    {email:'hr@cmcglobal.vn',company:'CMC Global',title:'SAP Consultant (FICO)',location:'Hà Nội',salary:'1,500 – 2,800 USD',mode:'On-site',level:'Middle',quantity:2,experience:'2+ năm',tags:['SAP','FICO','ERP'],requirements:['SAP','FICO','ERP','ABAP'],description:'Triển khai SAP cho enterprise Nhật.',deadline:d(18),ago:11,views:87},
    // Rikkeisoft - 3
    {email:'hr@rikkeisoft.com',company:'Rikkeisoft',title:'Frontend React (Japanese JLPT N3)',location:'Hà Nội',salary:'1,000 – 2,000 USD',mode:'On-site',level:'Middle',quantity:5,experience:'1+ năm',tags:['React','TypeScript','Japanese'],requirements:['React','TypeScript','Japanese N3'],description:'Dự án web Nhật, cơ hội onsite Tokyo.',deadline:d(22),ago:3,views:210},
    {email:'hr@rikkeisoft.com',company:'Rikkeisoft',title:'PHP Developer (Laravel)',location:'Đà Nẵng',salary:'800 – 1,500 USD',mode:'Hybrid',level:'Junior',quantity:3,experience:'1+ năm',tags:['PHP','Laravel','MySQL'],requirements:['PHP','Laravel','MySQL','Vue'],description:'Phát triển hệ thống e-commerce Nhật.',deadline:d(20),ago:9,views:98},
    {email:'hr@rikkeisoft.com',company:'Rikkeisoft',title:'BrSE — Cầu nối Nhật Bản',location:'Hà Nội',salary:'1,800 – 3,000 USD',mode:'On-site',level:'Senior',quantity:2,experience:'3+ năm',tags:['BrSE','Japanese N2','Agile'],requirements:['Japanese N2','Agile','Communication'],description:'Làm trực tiếp với khách Nhật, N2 trở lên.',deadline:d(30),ago:14,views:134},
    // IT-AI - 3 (để demo pending/closed)
    {email:'itai@company.vn',company:'IT-AI',title:'AI Engineer (Python / LLM)',location:'Hà Nội',salary:'2,000 – 4,000 USD',mode:'Hybrid',level:'Middle',quantity:2,experience:'2+ năm',tags:['Python','LLM','PyTorch','AWS'],requirements:['Python','LLM','PyTorch','FastAPI'],description:'Xây mô hình matching CV-Job, RAG, fine-tune LLM cho ITMatch.',deadline:d(25),ago:2,views:189},
    {email:'itai@company.vn',company:'IT-AI',title:'Fullstack Developer (React + Node.js)',location:'Hà Nội',salary:'1,200 – 2,200 USD',mode:'Hybrid',level:'Junior',quantity:3,experience:'1+ năm',tags:['React','Node.js','MongoDB'],requirements:['React','Node.js','MongoDB','Git'],description:'Phát triển nền tảng tuyển dụng ITMatch, làm việc với team AI.',deadline:d(30),ago:3,views:156},
    {email:'itai@company.vn',company:'IT-AI',title:'Backend Developer (Node.js)',location:'Hà Nội',salary:'1,000 – 2,000 USD',mode:'Remote',level:'Junior',quantity:2,experience:'1+ năm',tags:['Node.js','Express.js','MongoDB'],requirements:['Node.js','Express.js','MongoDB','Go'],description:'Phát triển API tuyển dụng, tích hợp AI matching.',deadline:d(22),ago:5,views:134},
  ];

  const createdJobs=[];
  for(let idx=0; idx<jobsToCreate.length; idx++){
    const j=jobsToCreate[idx];
    const owner= (empMap[j.email] || await User.findOne({email:j.email}).lean() || itAiEmployer);
    const slug=slugify(j.title+'-'+j.company)+'-'+Date.now().toString().slice(-4)+Math.floor(Math.random()*90+10);
    const isExpired = j.deadline && j.deadline < new Date();
    let status='active';
    if(isExpired) status='closed';
    else if(j.company==='IT-AI' && idx===jobsToCreate.length-1) status='pending';
    else if(j.company==='Tiki' && j.title.includes('Fresher')) status='closed';
    // 10% pending ngẫu nhiên cho web sống động
    const createdAt = daysAgo(j.ago || Math.floor(Math.random()*14));
    const doc=await Job.create({companyId:owner._id,slug,title:j.title,company:j.company,logo:j.company.charAt(0).toUpperCase(),tone:'tone-blue',location:j.location,salary:j.salary,mode:j.mode,level:j.level,quantity:j.quantity,experience:j.experience,tags:j.tags,requirements:j.requirements,description:j.description,deadline:j.deadline,status,views:j.views,applicants:0,createdAt,updatedAt:createdAt});
    createdJobs.push(doc);
  }
  console.log('Jobs:',createdJobs.length,'(active/pending/closed stagger)');

  const statuses=['pending','viewed','interview','accepted','rejected'];
  let appCount=0;
  for(let i=0;i<candidates.length;i++){
    const cand=candidates[i];
    const shuffled=[...createdJobs].sort(()=>0.5-Math.random()).slice(0,2+Math.floor(Math.random()*3));
    for(const job of shuffled){
      const status=statuses[Math.floor(Math.random()*statuses.length)];
      await Application.create({userId:cand._id,jobId:job._id,companyId:job.companyId,cvUrl:cand.cvUrl||'https://example.com/cv.pdf',coverLetter:'Kính gửi '+job.company+', tôi quan tâm vị trí '+job.title+'. Kinh nghiệm: '+(cand.experience||'')+' Kỹ năng: '+(cand.skills||[]).join(', '),matchScore:30+Math.floor(Math.random()*60),status,companyNote:status==='rejected'?'Cảm ơn bạn đã quan tâm':status==='interview'?'Mời bạn phỏng vấn tuần tới':'',createdAt:daysAgo(Math.floor(Math.random()*10)),updatedAt:new Date()});
      await Job.updateOne({_id:job._id},{$inc:{applicants:1}});
      appCount++;
    }
  }
  console.log('Applications:',appCount);
  console.log('Done! Users:',await User.countDocuments(),' Companies:',await Company.countDocuments(),' Jobs:',await Job.countDocuments(),' Apps:',await Application.countDocuments());
  await mongoose.disconnect();
  process.exit(0);
}
run().catch(e=>{console.error(e);process.exit(1)});
