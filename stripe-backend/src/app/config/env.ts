import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: string;
  DB_URL: string;
  NODE_ENV: "development" | "production";
  //   FRONTEND_URL: string;

  STRIPE_SECRET_KEY: string;
  WEBHOOK_SECRET_KEY: string;
}

const loadEnvVariables = (): EnvConfig => {
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = "development";
  }
  const requiredEnvVariables: string[] = [
    "PORT",
    "DB_URL",
    "NODE_ENV",
    // "FRONTEND_URL",

    "STRIPE_SECRET_KEY",
    "WEBHOOK_SECRET_KEY",
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
  };
};

export const envVars = loadEnvVariables();
