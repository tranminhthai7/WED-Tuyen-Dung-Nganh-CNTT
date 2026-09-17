require('dotenv').config();
const m=require('mongoose');
const u=process.env.MONGODB_USERNAME, p=process.env.MONGODB_PASSWORD;
const hosts=['ac-kuymd87-shard-00-00.5g1jaoo.mongodb.net:27017','ac-kuymd87-shard-00-01.5g1jaoo.mongodb.net:27017','ac-kuymd87-shard-00-02.5g1jaoo.mongodb.net:27017'];
const uri='mongodb://'+u+':'+p+'@'+hosts.join(',')+'/itmatch?ssl=true&replicaSet=atlas-nlcur7-shard-0&authSource=admin&retryWrites=true&w=majority';
m.connect(uri,{serverSelectionTimeoutMS:8000}).then(async()=>{
  const Job=require('./src/models/Job');
  const Company=require('./src/models/Company');
  const User=require('./src/models/User');
  const r=await Job.updateMany({company:'Nhà tuyển dụng'},{$set:{company:'IT-AI',logo:'I'}});
  console.log('fixed',r.modifiedCount);
  const js=await Job.find().select('title company status').lean();
  js.forEach(j=>console.log(j.title+' | '+j.company+' | '+j.status));
  console.log('companies',await Company.countDocuments(),'users',await User.countDocuments());
  await m.disconnect();
}).catch(e=>{console.error(e.message);process.exit(1)});
