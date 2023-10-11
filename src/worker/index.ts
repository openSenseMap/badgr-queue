import type { Job } from "bullmq";
import { BadgrClient } from "../badgr/client";

import config from "../config";
import logger from "../logger";

export interface Spec {
  path: string;
  method: string; // should be changed to enum
}

export interface Route {
  name: string;
  method: string; // should be changed to enum
  path: string;
  spec: Spec;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chain: any;
}

export interface Payload {
  email: string;
  route: Route;
}

export default async function worker(job: Job) {
  try {
    const { email, route }: Payload = job.data;
    const createNotification = true;

    logger.info({ email, route }, "Job payload");

    const client = new BadgrClient({
      endpoint: config.BADGR_URL,
      username: config.BADGR_USERNAME,
      password: config.BADGR_PASSWORD,
      admin: true,
      client_id: config.BADGR_CLIENT_ID,
      client_secret: config.BADGR_CLIENT_SECRET,
    });

    if (!config.BADGE_MAPPINGS.get(route.name)) {
      throw new Error(`No BadgeClassEntityId found for route ${route.name}`);
    }

    return await client.grant({
      badgeClassEntityId: config.BADGE_MAPPINGS.get(route.name) || "",
      email,
      issuerEntityId: config.BADGR_ISSUER_ID,
      createNotification,
    });
  } catch (error) {
    logger.error(error, "Error in job");
    throw error;
  }
}
