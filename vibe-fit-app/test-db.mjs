import { MongoClient } from 'mongodb';
import fs from 'fs';

async function testNode(host) {
  const uri = `mongodb://Apsara:Apsara11197%40@${host}:27017/vibefit?ssl=true&authSource=admin&directConnection=true&serverSelectionTimeoutMS=3000`;
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('vibefit');
    await db.collection('test').insertOne({ ping: 1 });
    console.log(`SUCCESS_PRIMARY: ${host}`);
    fs.writeFileSync('.env.local', `MONGODB_URI="${uri}"\n`);
    process.exit(0);
  } catch (err) {
    console.log(`FAILED: ${host} - ${err.message}`);
  } finally {
    await client.close();
  }
}

async function main() {
  await testNode('ac-l2wg79o-shard-00-00.gphr2ku.mongodb.net');
  await testNode('ac-l2wg79o-shard-00-01.gphr2ku.mongodb.net');
  await testNode('ac-l2wg79o-shard-00-02.gphr2ku.mongodb.net');
  console.log('All tests finished.');
  process.exit(1);
}

main();
