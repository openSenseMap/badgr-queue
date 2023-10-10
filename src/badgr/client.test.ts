import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

import { beforeAll, describe, expect, test } from "@jest/globals";
import { BadgrClient } from "./client";
import MailSlurp, { InboxDto } from "mailslurp-client";
import config from "../config";

describe("Badgr Client without Credentials", () => {
  test("getAccessToken throws error", () => {
    const emptyClient = new BadgrClient();

    const getAccessToken = async () => await emptyClient.getAccessToken();

    expect(getAccessToken()).rejects.toThrowError();
  });
});

describe("Badgr Client", () => {
  let inbox: InboxDto;
  let mailslurp: MailSlurp;

  beforeAll(async () => {
    const inboxId = process.env.MAILSLURP_INBOX_ID || "";
    mailslurp = new MailSlurp({
      apiKey: process.env.MAILSLURP_API_KEY || "",
    });
    inbox = await mailslurp.getInbox(inboxId);
  });

  const client = new BadgrClient({
    endpoint: config.BADGR_URL,
    username: config.BADGR_USERNAME,
    password: config.BADGR_PASSWORD,
    admin: true,
    client_id: config.BADGR_CLIENT_ID,
    client_secret: config.BADGR_CLIENT_SECRET,
  });

  test("getAccessToken", async () => {
    const { accessToken } = await client.getAccessToken();

    expect(accessToken).toBeTruthy();
  });

  test("grant badge", async () => {
    const result = await client.grant({
      badgeClassEntityId: process.env.BADGE_CLASS_ENTITY_ID || "",
      email: inbox.emailAddress,
      issuerEntityId: process.env.ISSUER_ENTITY_ID || "",
      createNotification: true,
    });

    expect(result).toBe(true);

    const email = await mailslurp.waitForLatestEmail(inbox.id);

    expect(email.from).toBe("noreply@mybadges.org");
  }, 10_000);
});
