import admin from "firebase-admin";
import {
  firebaseClientEmail,
  firebasePrivateKey,
  firebaseProjectId,
} from "../secret";

// Build the service account object with correct typing
const serviceAccount: admin.ServiceAccount = {
  projectId: firebaseProjectId,
  privateKey: firebasePrivateKey.replace(/\\n/g, "\n"),
  clientEmail: firebaseClientEmail
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: firebaseProjectId
});

export const firebaseAdmin = admin;
