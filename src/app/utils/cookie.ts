import { CookieOptions, Request, Response } from "express";

const setCookie = (res: Response, key: string, value: string, options: CookieOptions) => {
    res.cookie(key, value, options);
}

// Get cookie from request
const getCookie = (req: Request, key: string) => {
    return req.cookies?.[key];
}

// Clear cookie
const clearCookie = (res: Response, key: string, options: CookieOptions) => {
    res.clearCookie(key, options);
}

export const cookieUtils = {
    setCookie,
    getCookie,
    clearCookie
}