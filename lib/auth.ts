import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const AUTH_COOKIE = "dd_session";
export const AUTH_COOKIE_VALUE = "1";

/** Read-only check. Safe in Server Components. */
export async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  return store.get(AUTH_COOKIE)?.value === AUTH_COOKIE_VALUE;
}

/** Call at the top of any page that requires the password. */
export async function requireAuth(): Promise<void> {
  if (!(await isAuthed())) redirect("/login");
}

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

/** Route handlers only: cookies can't be written while a Server Component renders. */
export async function setAuthCookie(): Promise<void> {
  const store = await cookies();
  store.set(AUTH_COOKIE, AUTH_COOKIE_VALUE, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: ONE_YEAR_SECONDS,
    secure: process.env.NODE_ENV === "production",
  });
}

/** Route handlers only. */
export async function clearAuthCookie(): Promise<void> {
  const store = await cookies();
  store.delete(AUTH_COOKIE);
}
