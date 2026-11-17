import { createRequire } from "node:module";

type BufferModule = typeof import("node:buffer") & {
  SlowBuffer?: typeof import("node:buffer").Buffer;
};

async function initFirebaseAdmin() {
  const nodeBuffer = createRequire(import.meta.url)("node:buffer") as BufferModule;
  nodeBuffer.SlowBuffer ??= nodeBuffer.Buffer;

  const [{ initializeApp, getApps, cert }, { getAuth }, { getFirestore }] =
    await Promise.all([
      import("firebase-admin/app"),
      import("firebase-admin/auth"),
      import("firebase-admin/firestore"),
    ]);
  const apps = getApps();

  if (!apps.length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error(
        "Firebase Admin credentials are missing. Configure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY."
      );
    }

    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  }

  return {
    auth: getAuth(),
    db: getFirestore(),
  };
}

export async function getFirebaseAdmin() {
  return initFirebaseAdmin();
}
