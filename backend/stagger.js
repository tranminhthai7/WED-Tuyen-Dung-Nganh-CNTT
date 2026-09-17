require('dotenv').config();
const m=require('mongoose');
(async()=>{
  let uri=process.env.MONGODB_URI||'';
  if(uri.includes('mongodb+srv')) uri='mongodb://'+process.env.MONGODB_USERNAME+':'+process.env.MONGODB_PASSWORD+'@ac-kuymd87-shard-00-00.5g1jaoo.mongodb.net:27017,ac-kuymd87-shard-00-01.5g1jaoo.mongodb.net:27017,ac-kuymd87-shard-00-02.5g1jaoo.mongodb.net:27017/itmatch?ssl=true&replicaSet=atlas-nlcur7-shard-0&authSource=admin&retryWrites=true&w=majority';
  await m.connect(uri);
  const Job=require('./src/models/Job');
  const jobs=await Job.find().sort({createdAt:1});
  const days=[0,0,0,1,1,2,3,5,7,10,2,4,6,1,0,3,8,12,15,20];
  for(let i=0;i<jobs.length;i++){
    const dAgo=days[i]||Math.floor(Math.random()*5);
    const hrs=Math.floor(Math.random()*8);
    const d=new Date(Date.now()-(dAgo*24+hrs)*3600*1000);
    await Job.updateOne({_id:jobs[i]._id},{$set:{createdAt:d,updatedAt:d}});
  }
  console.log('staggered',jobs.length);
  await m.disconnect();
})().catch(e=>{console.error(e);process.exit(1)});
