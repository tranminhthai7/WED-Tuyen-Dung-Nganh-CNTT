require('dotenv').config();
const m=require('mongoose');
const u=process.env.MONGODB_USERNAME, p=process.env.MONGODB_PASSWORD;
const hosts=['ac-kuymd87-shard-00-00.5g1jaoo.mongodb.net:27017','ac-kuymd87-shard-00-01.5g1jaoo.mongodb.net:27017','ac-kuymd87-shard-00-02.5g1jaoo.mongodb.net:27017'];
const uri='mongodb://'+u+':'+p+'@'+hosts.join(',')+'/itmatch?ssl=true&replicaSet=atlas-nlcur7-shard-0&authSource=admin&retryWrites=true&w=majority';
m.connect(uri,{serverSelectionTimeoutMS:8000}).then(async()=>{
  const Company=require('./src/models/Company');
  const Job=require('./src/models/Job');
  const all=await Company.find().sort({createdAt:1}).lean();
  console.log('Before:', all.length, all.map(c=>`${c.name} | ${c.ownerId} | ${c._id} | verified=${c.isVerified}`));
  // dedupe by normalized name, keep oldest
  const seen=new Map();
  let removed=0;
  for(const c of all){
    const key=String(c.name||'').toLowerCase().trim();
    if(!key) continue;
    if(!seen.has(key)){ seen.set(key,c); continue; }
    const keep=seen.get(key);
    console.log(`DUPLICATE "${c.name}" keep ${keep._id} (${keep.ownerId}) delete ${c._id} (${c.ownerId})`);
    // move jobs if any point to duplicate via ownerId? jobs use company string, not owner, but also fix companyId
    await Job.updateMany({company: c.name, companyId: c.ownerId}, {$set:{companyId: keep.ownerId}});
    await Company.deleteOne({_id: c._id});
    removed++;
  }
  console.log('Removed', removed);
  // ensure indexes
  try{ await Company.collection.createIndex({name:1},{unique:true}); }catch(e){ console.log('name index',e.message)}
  try{ await Company.collection.createIndex({slug:1},{unique:true,sparse:true}); }catch(e){ console.log('slug index',e.message)}
  try{ await Company.collection.createIndex({email:1},{unique:true,sparse:true}); }catch(e){ console.log('email index',e.message)}
  console.log('After:', await Company.countDocuments());
  await m.disconnect();
}).catch(e=>{console.error(e);process.exit(1)});
