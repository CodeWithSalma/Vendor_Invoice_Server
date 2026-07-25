const mongoose = require("mongoose");

// Cache connection di luar function supaya di-reuse antar
// serverless invocations (Vercel spin up function baru tiap request,
// tapi variable module-level tetap hidup selama instance masih warm)
let cachedConnection = null;

const connectDB = async () => {
  // Kalau sudah connected, langsung return — tidak buat koneksi baru
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not set");
  }

  cachedConnection = await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000, // timeout 10 detik kalau MongoDB tidak respond
    socketTimeoutMS: 30000,          // timeout 30 detik per operasi query
    maxPoolSize: 10,
    bufferCommands: false,           // langsung error kalau tidak connected, jangan buffer
  });

  console.log(`MongoDB connected: ${mongoose.connection.host}`);
  return cachedConnection;
};

module.exports = connectDB;
