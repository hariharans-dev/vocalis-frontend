"use server";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Set a cookie on the response with a given name and token object.
 */
export const setToken = async <T>(
  res: NextResponse<T>,
  name: string,
  token: any
): Promise<NextResponse<T>> => {
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

  return res;
};

/**
 * Get a cookie value by name from the request context.
 */
export const getToken = async (name: string): Promise<string | null> => {
  const cookieStore = cookies();
  return (await cookieStore).get(name)?.value ?? null;
};

/**
 * Remove a cookie by setting maxAge to 0 on the response.
 */
export const removeToken = async <T>(
  res: NextResponse<T>,
  name: string
): Promise<NextResponse<T>> => {
  res.cookies.set(name, "", {
    maxAge: 0,
    path: "/",
  });
  return res;
};
