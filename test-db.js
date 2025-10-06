const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(' Successfully connected to MongoDB!');
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(' Available collections:', collections.map(c => c.name));
    
    await mongoose.connection.close();
    console.log('Database test completed successfully!');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();