import type { Job } from "bullmq";
import { BadgrClient } from "../badgr/client";

import config from "../config";

export interface Payload {
  badgeClassEntityId: string;
  email: string;
  issuerEntityId: string;
  createNotification: boolean;
}

export default async function (job: Job) {
  const {
    badgeClassEntityId,
    createNotification,
    email,
    issuerEntityId,
  }: Payload = job.data;

  const client = new BadgrClient({
    endpoint: config.BADGR_URL,
    username: config.BADGR_USERNAME,
    password: config.BADGR_PASSWORD,
    admin: true,
    client_id: config.BADGR_CLIENT_ID,
    client_secret: config.BADGR_CLIENT_SECRET,
  });

  return await client.grant({
    badgeClassEntityId,
    email,
    issuerEntityId,
    createNotification,
  });
}
