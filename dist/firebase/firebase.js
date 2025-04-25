"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.firebaseAdmin = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const secret_1 = require("../secret");
// Build the service account object with correct typing
const serviceAccount = {
    projectId: secret_1.firebaseProjectId,
    privateKey: secret_1.firebasePrivateKey.replace(/\\n/g, "\n"),
    clientEmail: secret_1.firebaseClientEmail
};
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccount),
    projectId: secret_1.firebaseProjectId
});
exports.firebaseAdmin = firebase_admin_1.default;
