import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

// Interface to load env variables
// Note these variables can possibly be undefined
// as someone could skip these varibales or not setup a .env file at all
interface ENV {
  SMTP_HOST: string | undefined;
  SMTP_PORT: number | undefined;
  SMTP_SECURE: boolean | undefined;
  SMTP_USERNAME: string | undefined;
  SMTP_PASSWORD: string | undefined;
  REDIS_HOST: string | undefined;
  REDIS_PORT: number | undefined;
  REDIS_USERNAME: string | undefined;
  REDIS_PASSWORD: string | undefined;
  REDIS_DB: number | undefined;
  BULLMQ_QUEUE_NAME: string | undefined;
}

interface Config {
  SMTP_HOST: string | undefined;
  SMTP_PORT: number | undefined;
  SMTP_SECURE: boolean | undefined;
  SMTP_USERNAME: string | undefined;
  SMTP_PASSWORD: string | undefined;
  REDIS_HOST: string | undefined;
  REDIS_PORT: number | undefined;
  REDIS_USERNAME: string | undefined;
  REDIS_PASSWORD: string | undefined;
  REDIS_DB: number | undefined;
  BULLMQ_QUEUE_NAME: string | undefined;
}

// Loading process.env as ENV interface
const getConfig = (): ENV => {
  return {
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT
      ? Number(process.env.SMTP_PORT)
      : undefined,
    SMTP_SECURE: process.env.SMTP_SECURE
      ? Boolean(JSON.parse(process.env.SMTP_SECURE))
      : undefined,
    SMTP_USERNAME: process.env.SMTP_USERNAME,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT
      ? Number(process.env.REDIS_PORT)
      : undefined,
    REDIS_USERNAME: process.env.REDIS_USERNAME,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    REDIS_DB: process.env.REDIS_DB ? Number(process.env.REDIS_DB) : undefined,
    BULLMQ_QUEUE_NAME: process.env.BULLMQ_QUEUE_NAME,
  };
};

// Throwing an Error if any field was undefined we don't
// want our app to run if it can't connect to DB and ensure
// that these fields are accessible. If all is good return
// it as Config which just removes the undefined from our type
// definition.

const getSanitzedConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in config.env`);
    }
  }
  return config as Config;
};

const config = getConfig();

const sanitizedConfig = getSanitzedConfig(config);

export default sanitizedConfig;
