require('dotenv').config();
const mongoose=require('mongoose');
(async()=>{
  await mongoose.connect(process.env.MONGO_URI||process.env.MONGODB_URI);
  const db=mongoose.connection.db;
  try{
    const idx=await db.collection('companies').indexes();
    console.log('before', idx.map(i=>i.name));
    const has=idx.find(i=>i.name==='email_1');
    if(has){
      try{ await db.collection('companies').dropIndex('email_1'); console.log('dropped email_1'); }catch(e){ console.log('drop err', e.message); }
    }
    // clean docs with null email -> unset
    await db.collection('companies').updateMany({email:null}, {$unset:{email:""}});
    await db.collection('companies').updateMany({email:""}, {$unset:{email:""}});
    await db.collection('companies').createIndex({email:1},{unique:true,sparse:true});
    console.log('recreated sparse');
    const idx2=await db.collection('companies').indexes();
    console.log('after', idx2.map(i=>i.name+':'+JSON.stringify(i)));
  }catch(e){ console.error(e); }
  await mongoose.disconnect();
})();
