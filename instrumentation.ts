export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    try {
      const { createRequire } = await import("node:module");
      const req = createRequire(import.meta.url);
      const buf = req("node:buffer");
      if (buf && !buf.SlowBuffer) {
        buf.SlowBuffer = buf.Buffer;
      }
    } catch {
      // Ignore if not supported in runtime
    }
  }
}
