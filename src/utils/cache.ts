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
    await redisClient.setEx(key, ttl, JSON.stringify(value));
  } catch (err) {
    console.error(`Error setting cache for key: ${key}`, err);
  }
};

// Function to delete a cached key
export const delCache = async (key: string): Promise<void> => {
  try {
    await redisClient.del(key);
  } catch (err) {
    console.error(`Error deleting cache for key: ${key}`, err);
  }
};
