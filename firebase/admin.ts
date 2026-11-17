import type { Auth } from "firebase-admin/auth";
import type { Firestore } from "firebase-admin/firestore";

let cachedAuth: Auth | null = null;
let cachedDb: Firestore | null = null;

export async function getFirebaseAdmin() {
  if (cachedAuth && cachedDb) {
    return { auth: cachedAuth, db: cachedDb };
  }

  const { initializeApp, getApps, cert } = await import("firebase-admin/app");
  const { getAuth } = await import("firebase-admin/auth");
  const { getFirestore } = await import("firebase-admin/firestore");

  if (!getApps().length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error(
        "Firebase Admin credentials are missing. Configure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY."
      );
    }

    initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
    });
  }

  cachedAuth = getAuth();
  cachedDb = getFirestore();

  return { auth: cachedAuth, db: cachedDb };
}
