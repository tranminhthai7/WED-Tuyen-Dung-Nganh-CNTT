const mongoose = require('mongoose');

try { require('dns').setServers(['8.8.8.8', '1.1.1.1']); } catch {}

function buildDirectUri() {
  const username = process.env.MONGODB_USERNAME;
  const password = process.env.MONGODB_PASSWORD;
  if (!username || !password) return null;
  const hosts = [
    'ac-kuymd87-shard-00-00.5g1jaoo.mongodb.net:27017',
    'ac-kuymd87-shard-00-01.5g1jaoo.mongodb.net:27017',
    'ac-kuymd87-shard-00-02.5g1jaoo.mongodb.net:27017',
  ];
  return `mongodb://${username}:${password}@${hosts.join(',')}/itmatch?ssl=true&replicaSet=atlas-nlcur7-shard-0&authSource=admin&retryWrites=true&w=majority`;
}

const connectDB = async () => {
  const rawUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/itmatch';

  // Try SRV first if it's srv
  if (rawUri.includes('mongodb+srv')) {
    try {
      await mongoose.connect(rawUri, { serverSelectionTimeoutMS: 5000 });
      console.log('MongoDB connected successfully (SRV)');
      return true;
    } catch (e) {
      console.warn('SRV connect failed, trying direct hosts fallback:', e.message);
      const direct = buildDirectUri();
      if (!direct) {
        console.warn('No fallback credentials, running in demo mode.');
        return false;
      }
      try {
        await mongoose.connect(direct, { serverSelectionTimeoutMS: 8000 });
        console.log('MongoDB connected successfully (direct fallback)');
        return true;
      } catch (e2) {
        console.warn('MongoDB not available. Running in demo mode without database. ->', e2.message);
        return false;
      }
    }
  }

  try {
    await mongoose.connect(rawUri, { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB connected successfully');
    return true;
  } catch (error) {
    console.warn('MongoDB not available. Running in demo mode without database. ->', error.message);
    return false;
  }
};

module.exports = connectDB;
