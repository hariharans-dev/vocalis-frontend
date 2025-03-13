"use server";

import { cookies } from "next/headers";

export async function getEventCookie() {
  const cookieStore = cookies();
  const cookie = (await cookieStore).get("event");
  const parsedCookie = cookie ? JSON.parse(cookie.value) : null;
  return parsedCookie;
}
