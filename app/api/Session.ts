"use server";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Set a cookie on the response with a given name and token object.
 */
export const setToken = async (
  res: NextResponse,
  name: string,
  token: any
): Promise<NextResponse> => {
  const expireTimeInHours = process.env.NEXT_PUBLIC_SESSION_EXPIRE;

  if (!expireTimeInHours || !token) return res;

  const maxAge = parseInt(expireTimeInHours, 10) * 60 * 60;

  if (isNaN(maxAge)) return res;

  res.cookies.set(name, JSON.stringify(token), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    maxAge,
  });

  return Promise.resolve(res);
};

/**
 * Get a cookie value by name from the request context.
 */
export const getToken = async (name: string): Promise<string | null> => {
  const cookieStore = cookies();
  const value = (await cookieStore).get(name)?.value ?? null;
  return Promise.resolve(value);
};

/**
 * Remove a cookie by setting maxAge to 0 on the response.
 */
export const removeToken = async (
  res: NextResponse,
  name: string
): Promise<NextResponse> => {
  res.cookies.set(name, "", {
    maxAge: 0,
    path: "/",
  });

  return Promise.resolve(res);
};
