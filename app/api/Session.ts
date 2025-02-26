import Cookies from "js-cookie";

export const setToken = (name: string, token: any | undefined) => {
  const expireTimeInHours = process.env.NEXT_PUBLIC_SESSION_EXPIRE;

  if (!expireTimeInHours || !token) {
    return;
  }

  const expireTimeInHoursNumber = parseInt(expireTimeInHours, 10);

  if (isNaN(expireTimeInHoursNumber)) {
    console.error("NEXT_PUBLIC_SESSION_EXPIRE is not a valid number.");
    return;
  }

  const expiresInSeconds = expireTimeInHoursNumber * 60 * 60;
  const expires = new Date(new Date().getTime() + expiresInSeconds * 1000);
  Cookies.set(name, token, { expires: expires });
};

export const getToken = (name: string): string | undefined => {
  return Cookies.get(name);
};

export const removeToken = (name: string): void => {
  Cookies.remove(name);
};
