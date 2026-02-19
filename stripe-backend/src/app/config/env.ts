import dotenv from "dotenv";

dotenv.config();

const DEFAULT_SUCCESS_URL = "http://localhost:5173/success";
const DEFAULT_CANCEL_URL = "http://localhost:5173/failed";

interface EnvConfig {
  PORT: string;
  DB_URL: string;
  NODE_ENV: "development" | "production";
  //   FRONTEND_URL: string;

  STRIPE_SECRET_KEY: string;
  WEBHOOK_SECRET_KEY: string;
  SUCCESS_URL: string;
  CANCEL_URL: string;
}

const loadEnvVariables = (): EnvConfig => {
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = "development";
  }

  if (process.env.NODE_ENV === "development") {
    process.env.SUCCESS_URL = DEFAULT_SUCCESS_URL;
    process.env.CANCEL_URL = DEFAULT_CANCEL_URL;
  }

  const requiredEnvVariables: string[] = [
    "PORT",
    "DB_URL",
    "NODE_ENV",
    // "FRONTEND_URL",

    "STRIPE_SECRET_KEY",
    "WEBHOOK_SECRET_KEY",
    "SUCCESS_URL",
    "CANCEL_URL",
  ];

  requiredEnvVariables.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing require environment variable ${key}`);
    }
  });

  return {
    PORT: process.env.PORT as string,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    DB_URL: process.env.DB_URL!,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",

    //     FRONTEND_URL: process.env.FRONTEND_URL as string,

    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY as string,
    WEBHOOK_SECRET_KEY: process.env.WEBHOOK_SECRET_KEY as string,
    SUCCESS_URL: process.env.SUCCESS_URL as string,
    CANCEL_URL: process.env.CANCEL_URL as string,
  };
};

export const envVars = loadEnvVariables();
