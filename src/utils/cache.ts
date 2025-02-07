import redisClient from '../config/redis';

// Function to get a cached value
export const getCache = async (key: string): Promise<string | null> => {
  try {
    return await redisClient.get(key);
  } catch (err) {
    console.error(`Error getting cache for key: ${key}`, err);
    return null;
  }
};

// Function to set a cached value with an expiration
export const setCache = async (key: string, value: any, ttl: number): Promise<void> => {
  try {
    await redisClient.setex(key, ttl, JSON.stringify(value));
  } catch (err) {
    console.error(`Error setting cache for key: ${key}`, err);
  }
};

// Function to delete a cached key
export const deleteCache = async (key: string): Promise<void> => {
  try {
    await redisClient.del(key);
  } catch (err) {
    console.error(`Error deleting cache for key: ${key}`, err);
  }
};

export const deleteCacheByPattern = async (pattern: string): Promise<void> => {
  try {
    const keys = await redisClient.keys(pattern); // ✅ Find all matching keys
    if (keys.length > 0) {
      await redisClient.del(...keys); // ✅ Delete all found keys
    }
  } catch (err) {
    console.error(`Error deleting cache for pattern: ${pattern}`, err);
  }
};

