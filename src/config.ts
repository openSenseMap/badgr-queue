import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

import { cleanEnv, str, num, url, makeValidator } from "envalid";

const badgeMappingValidator = makeValidator((value) => {
  try {
    const mapping = new Map<string, string>();
    const parsedValue = JSON.parse(value);
    for (const entry of parsedValue) {
      const keys = Object.keys(entry);
      mapping.set(keys[0], entry[keys[0]]);
    }
    return mapping;
  } catch (error) {
    throw new Error("Expected an array of string arrays");
  }
});

const config = cleanEnv(process.env, {
  REDIS_HOST: str(),
  REDIS_PORT: num(),
  REDIS_USERNAME: str(),
  REDIS_PASSWORD: str(),
  REDIS_DB: num(),
  BADGR_URL: url(),
  BADGR_ISSUER_ID: str(),
  BADGR_USERNAME: str(),
  BADGR_PASSWORD: str(),
  BADGR_CLIENT_ID: str(),
  BADGR_CLIENT_SECRET: str(),
  BULLMQ_QUEUE_NAME: str(),
  // BADGE_MAPPINGS: badgeMappingValidator(),
});

export default config;
