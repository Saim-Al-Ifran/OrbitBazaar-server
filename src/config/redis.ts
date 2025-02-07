import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();  

 
const redisClient = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD
});


// Event handlers for Redis connection
redisClient.on('connect', () => {
  console.log('✅ Connected to Redis Cloud');
});

redisClient.on('error', (err) => {
  console.error('❌ Redis error:', err);
});

// Function to periodically check Redis health
const pingRedis = async () => {
  try {
    const response = await redisClient.ping();
    console.log('✅ Redis is alive:', response); // Should return "PONG"
  } catch (err) {
    console.error('❌ Error pinging Redis:', err);
  }
};

// Call pingRedis every 10 minutes (600000 ms)
pingRedis();
setInterval(pingRedis, 600000);

export default redisClient;
