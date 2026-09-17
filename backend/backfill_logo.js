require('dotenv').config();
const m=require('mongoose');
const u=process.env.MONGODB_USERNAME,p=process.env.MONGODB_PASSWORD;
const hosts=['ac-kuymd87-shard-00-00.5g1jaoo.mongodb.net:27017','ac-kuymd87-shard-00-01.5g1jaoo.mongodb.net:27017','ac-kuymd87-shard-00-02.5g1jaoo.mongodb.net:27017'];
const uri='mongodb://'+u+':'+p+'@'+hosts.join(',')+'/itmatch?ssl=true&replicaSet=atlas-nlcur7-shard-0&authSource=admin&retryWrites=true&w=majority';
m.connect(uri).then(async()=>{
  const Company=m.model('Company',new m.Schema({},{strict:false}),'companies');
  const Job=m.model('Job',new m.Schema({},{strict:false}),'jobs');
  const cs=await Company.find({}).lean();
  let total=0;
  for(const c of cs){
    if(!c.logo||!c.name) continue;
    const r=await Job.updateMany({company:c.name},{ $set:{logo:c.logo}});
    console.log(c.name, 'logo', c.logo.slice(0,70), '->', r.modifiedCount,'jobs');
    total+=r.modifiedCount;
  }
  console.log('Total updated',total);
  await m.disconnect();
}).catch(e=>{console.error(e);process.exit(1)});
