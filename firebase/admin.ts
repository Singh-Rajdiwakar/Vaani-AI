import type { Auth } from "firebase-admin/auth";
import type { Firestore } from "firebase-admin/firestore";
import { createRequire } from "node:module";

function polyfillSlowBuffer() {
  try {
    const req = createRequire(import.meta.url);
    const buf = req("node:buffer");
    if (buf && !buf.SlowBuffer) {
      buf.SlowBuffer = buf.Buffer;
    }
  } catch {
    //
  }
}

// Polyfill immediately on module import
polyfillSlowBuffer();

function formatPrivateKey(key: string | undefined): string | undefined {
  if (!key) return undefined;
  let cleaned = key.trim();

  // Strip all leading and trailing quotes (single, double, escaped)
  while (
    (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
    (cleaned.startsWith("'") && cleaned.endsWith("'")) ||
    (cleaned.startsWith('\\"') && cleaned.endsWith('\\"'))
  ) {
    if (cleaned.startsWith('\\"')) {
      cleaned = cleaned.slice(2, -2).trim();
    } else {
      cleaned = cleaned.slice(1, -1).trim();
    }
  }

  // Convert literal \n or \\n to actual newlines
  cleaned = cleaned.replace(/\\n/g, "\n").trim();
  return cleaned;
}

let cachedAuth: Auth | null = null;
let cachedDb: Firestore | null = null;

export async function getFirebaseAdmin() {
  // Ensure polyfill is in place before dynamic imports
  polyfillSlowBuffer();

  if (cachedAuth && cachedDb) {
    return { auth: cachedAuth, db: cachedDb };
  }

  const { initializeApp, getApps, cert } = await import("firebase-admin/app");
  const { getAuth } = await import("firebase-admin/auth");
  const { getFirestore } = await import("firebase-admin/firestore");

  if (!getApps().length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = formatPrivateKey(process.env.FIREBASE_PRIVATE_KEY);

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
