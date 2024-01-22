require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  serverApi: ServerApiVersion.v1
});

async function run() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");
    // Rest of your code
  } catch (e) {
    console.error(e);
  }
}

run().catch(console.dir);
