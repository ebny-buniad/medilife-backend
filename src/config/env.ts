import dotenv from 'dotenv'
import AppError from '../app/errors/AppError';
import { StatusCodes } from 'http-status-codes';

dotenv.config();

interface EnvConfig {
    NODE_ENV: string,
    PORT: string,
    DATABASE_URL: string,
    BETTER_AUTH_SECRET: string,
    BETTER_AUTH_URL: string,

    ACCESS_TOKEN_SECRET: string,
    REFRESH_TOKEN_SECRET: string,
    ACCESS_TOKEN_EXPIRES_IN: string,
    REFRESH_TOKEN_EXPIRES_IN: string,

    NAME: string,
    PROFILE_PHOTO: string,
    CONTACT_NUMBER: string,
    SUPER_ADMIN_EMAIL: string,
    SUPER_ADMIN_PASSWORD: string
}

const requiredEnvVariables = [
    'NODE_ENV',
    'PORT',
    'DATABASE_URL',
    'BETTER_AUTH_SECRET',
    'BETTER_AUTH_URL',
    'ACCESS_TOKEN_SECRET',
    'REFRESH_TOKEN_SECRET',
    'ACCESS_TOKEN_EXPIRES_IN',
    'REFRESH_TOKEN_EXPIRES_IN',

    'NAME',
    'PROFILE_PHOTO',
    'CONTACT_NUMBER',
    'SUPER_ADMIN_EMAIL',
    'SUPER_ADMIN_PASSWORD'
]

requiredEnvVariables.forEach((variable) => {
    if (!process.env[variable]) {
        throw new AppError(StatusCodes.NOT_FOUND, `Environment variable ${variable} is required but not set in .env file`)
    }
})

const loadEnvVariables = (): EnvConfig => {
    return {
        NODE_ENV: process.env.NODE_ENV as string,
        PORT: process.env.PORT as string,
        DATABASE_URL: process.env.DATABASE_URL as string,
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL as string,

        ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
        REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
        ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
        REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN as string,

        NAME: process.env.NAME as string,
        PROFILE_PHOTO: process.env.PROFILE_PHOTO as string,
        SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
        CONTACT_NUMBER: process.env.CONTACT_NUMBER as string,
        SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,
    }
}

export const envVars = loadEnvVariables();