import { JwtPayload, SignOptions } from "jsonwebtoken";
import { jwtUtils } from "./jwt";
import { envVars } from "../../config/env";
import { Response } from "express";
import { cookieUtils } from "./cookie";

// Get access token
// Get access token (data from auth service data.user)
const getAccessToken = (payload: JwtPayload) => {
    const accessToken = jwtUtils.createToken(payload, envVars.ACCESS_TOKEN_SECRET,
        { expiresIn: envVars.ACCESS_TOKEN_EXPIRES_IN } as SignOptions);
    // console.log("Get access token======", accessToken)
    return accessToken;
}

// Get refresh token
const getRefreshToken = (payload: JwtPayload) => {
    const refreshToken = jwtUtils.createToken(payload, envVars.REFRESH_TOKEN_SECRET,
        { expiresIn: envVars.REFRESH_TOKEN_EXPIRES_IN } as SignOptions);
    // console.log("Get refresh token=====", refreshToken)
    return refreshToken;
}


// Set Access token Cookie

//setAccessTokenCookie (data from auth controller)
const setAccessTokenCookie = (res: Response, token: string) => {
    cookieUtils.setCookie(res, 'accessToken', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: "/",
        maxAge: 60 * 60 * 1000 // 60 minutes
    })
}

// Set Refresh token Cookie
const setRefreshTokenCookie = (res: Response, token: string) => {
    cookieUtils.setCookie(res, 'refreshToken', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: "/",
        maxAge: 60 * 60 * 60 * 24 * 7, // 7 days
    })
}

// Set Better auth cookies
const setBetterAuthSessionCookies = (res: Response, token: string) => {
    cookieUtils.setCookie(res, 'better-auth.session_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: "/",
        maxAge: 60 * 60 * 60 * 24, // 1 day
    })
}



export const tokenUtils = {
    getAccessToken,
    getRefreshToken,
    setAccessTokenCookie,
    setRefreshTokenCookie,
    setBetterAuthSessionCookies
}