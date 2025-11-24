require('dotenv').config();
const { MongoClient } = require('mongodb');

// Load from environment variables
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const dbName = process.env.DB_NAME || "vaultDB";

let client = null;

async function connect() {
  try {
    if (!client) {
      client = new MongoClient(uri);
      await client.connect();
console.log(`✅ Connected to MongoDB at ${uri}`);
    }
    return client.db(dbName);
  } catch (error) {
    console.error('⚠️  MongoDB connection failed:', error.message);
    console.log('   Using JSON file storage instead');
    return null;
  }
}

async function getCollection() {
  try {
    const db = await connect();
    if (db) {
      return db.collection('records');
    }
    return null;
  } catch (error) {
    return null;
  }
}

async function close() {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

module.exports = { connect, getCollection, close };
