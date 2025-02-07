"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const redisClient = new ioredis_1.default({
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
const pingRedis = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield redisClient.ping();
        console.log('✅ Redis is alive:', response); // Should return "PONG"
    }
    catch (err) {
        console.error('❌ Error pinging Redis:', err);
    }
});
// Call pingRedis every 10 minutes (600000 ms)
pingRedis();
setInterval(pingRedis, 600000);
exports.default = redisClient;
