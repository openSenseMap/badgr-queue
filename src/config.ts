import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

// Interface to load env variables
// Note these variables can possibly be undefined
// as someone could skip these varibales or not setup a .env file at all
interface ENV {
  REDIS_HOST: string | undefined;
  REDIS_PORT: number | undefined;
  REDIS_USERNAME: string | undefined;
  REDIS_PASSWORD: string | undefined;
  REDIS_DB: number | undefined;
  BADGR_URL: string | undefined;
  BADGR_ISSUER_ID: string | undefined;
  BADGR_USERNAME: string | undefined;
  BADGR_PASSWORD: string | undefined;
  BADGR_CLIENT_ID: string | undefined;
  BADGR_CLIENT_SECRET: string | undefined;
  BULLMQ_QUEUE_NAME: string | undefined;
}

interface Config extends ENV {}

// Loading process.env as ENV interface
const getConfig = (): ENV => {
  return {
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT
      ? Number(process.env.REDIS_PORT)
      : undefined,
    REDIS_USERNAME: process.env.REDIS_USERNAME,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    REDIS_DB: process.env.REDIS_DB ? Number(process.env.REDIS_DB) : undefined,
    BADGR_URL: process.env.BADGR_URL,
    BADGR_ISSUER_ID: process.env.BADGR_ISSUER_ID,
    BADGR_USERNAME: process.env.BADGR_USERNAME,
    BADGR_PASSWORD: process.env.BADGR_PASSWORD,
    BADGR_CLIENT_ID: process.env.BADGR_CLIENT_ID,
    BADGR_CLIENT_SECRET: process.env.BADGR_CLIENT_SECRET,
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
