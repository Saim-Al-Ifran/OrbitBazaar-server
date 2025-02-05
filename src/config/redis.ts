import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();  

const redisPort = process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : undefined;

// Create a Redis client
const redisClient = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_HOST, 
      port: redisPort, 
    },
  });

// Event handlers for Redis connection
redisClient.on('connect', () => {
  console.log('✅ Connected to Redis Cloud');
});

redisClient.on('error', (err) => {
  console.error('❌ Redis error:', err);
});

// Async function to connect
const connectToRedis = async () => {
  try {
    await redisClient.connect();
    console.log('🎉 Redis client is ready');
  } catch (err) {
    console.error('❌ Failed to connect to Redis:', err);
  }
};

connectToRedis();

export default redisClient;
