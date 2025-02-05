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
const redis_1 = require("redis");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const redisPort = process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : undefined;
// Create a Redis client
const redisClient = (0, redis_1.createClient)({
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
const connectToRedis = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield redisClient.connect();
        console.log('🎉 Redis client is ready');
    }
    catch (err) {
        console.error('❌ Failed to connect to Redis:', err);
    }
});
connectToRedis();
exports.default = redisClient;
