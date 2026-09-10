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
