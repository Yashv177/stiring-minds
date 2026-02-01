import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

async function main() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/startup-benefits';
  
  await mongoose.connect(mongoUri);
  console.log('MongoDB connected');

  const { default: app } = await import('./app');
  
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

main().catch(console.error);
