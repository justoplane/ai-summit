import { setAuthCookie } from "@/lib/auth";
import { env } from "@/lib/env";

/** Password-only gate. Not real security by design; it just hides the host screen. */
export async function POST(request: Request) {
  const form = await request.formData();
  const password = form.get("password");

  if (typeof password !== "string" || password !== env.appPassword) {
    return Response.redirect(new URL("/login?error=1", request.url), 303);
  }

  await setAuthCookie();
  return Response.redirect(new URL("/", request.url), 303);
}
