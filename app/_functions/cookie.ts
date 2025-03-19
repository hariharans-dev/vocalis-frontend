"use server";

import { cookies } from "next/headers";

export async function getCookie(name: string) {
  const cookieStore = cookies();
  const cookie = (await cookieStore).get(name);
  const parsedCookie = cookie ? JSON.parse(cookie.value) : null;
  return parsedCookie;
}

export async function createCookie(name: string, data: any) {
  const cookieStore = cookies();
  const stringifiedValue = JSON.stringify(data);
  (await cookieStore).set(name, stringifiedValue);
  return "success";
}
