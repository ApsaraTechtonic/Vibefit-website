/* eslint-disable @typescript-eslint/no-require-imports */
const { MongoClient } = require('mongodb');

async function wipeDatabase() {
  const uri = "mongodb://Apsara:Apsara11197%40@ac-l2wg79o-shard-00-02.gphr2ku.mongodb.net:27017/vibefit?ssl=true&authSource=admin&directConnection=true&serverSelectionTimeoutMS=3000";
  
  const client = new MongoClient(uri);
  
  try {
    console.log("Connecting to MongoDB...");
    await client.connect();
    const db = client.db('vibefit');
    
    console.log("Wiping 'users' collection...");
    const userResult = await db.collection('users').deleteMany({});
    console.log(`Deleted ${userResult.deletedCount} users.`);
    
    console.log("Wiping 'logs' collection...");
    const logsResult = await db.collection('logs').deleteMany({});
    console.log(`Deleted ${logsResult.deletedCount} logs.`);
    
    console.log("Database wiped completely! You can now start from scratch.");
  } catch (error) {
    console.error("Error wiping database:", error);
  } finally {
    await client.close();
  }
}

wipeDatabase();
