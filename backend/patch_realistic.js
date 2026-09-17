require('dotenv').config();
try{require('dns').setServers(['8.8.8.8','1.1.1.1'])}catch{}
const mongoose=require('mongoose');
const Company=require('./src/models/Company');
const Job=require('./src/models/Job');
async function getUri(){
  const h=['ac-kuymd87-shard-00-00.5g1jaoo.mongodb.net:27017','ac-kuymd87-shard-00-01.5g1jaoo.mongodb.net:27017','ac-kuymd87-shard-00-02.5g1jaoo.mongodb.net:27017'];
  const u=process.env.MONGODB_USERNAME, p=process.env.MONGODB_PASSWORD;
  return 'mongodb://'+u+':'+p+'@'+h.join(',')+'/itmatch?ssl=true&replicaSet=atlas-nlcur7-shard-0&authSource=admin&retryWrites=true&w=majority';
}
(async()=>{
  const uri=await getUri();
  console.log('conn...');
  await mongoose.connect(uri,{serverSelectionTimeoutMS:15000});
  console.log('connected');
  const r=await Company.updateOne({slug:'it-ai'},{$set:{isVerified:false}});
  console.log('IT-AI modified',r.modifiedCount);
  const t=await Job.findOne({company:'Tiki', title:/Fresher Java/i});
  if(t){ t.status='closed'; await t.save(); console.log('Tiki Fresher -> closed');}
  console.log('pending',await Job.countDocuments({status:'pending'}),'active',await Job.countDocuments({status:'active'}),'closed',await Job.countDocuments({status:'closed'}));
  await mongoose.disconnect();
  console.log('done');
})().catch(e=>{console.error(e);process.exit(1)});
