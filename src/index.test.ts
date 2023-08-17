import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  test,
} from "@jest/globals";
import { Worker, Queue } from "bullmq";
import { createWorker } from ".";
import config from "./config";
import { Payload } from "./worker";
import { InboxDto, MailSlurp } from "mailslurp-client";

describe("Worker", () => {
  let worker: Worker | undefined = undefined;
  let queue: Queue | undefined = undefined;
  let inbox: InboxDto;
  let mailslurp: MailSlurp;

  beforeAll(async () => {
    mailslurp = new MailSlurp({
      apiKey: process.env.MAILSLURP_API_KEY || "",
    });
    inbox = await mailslurp.inboxController.createInboxWithDefaults();

    queue = new Queue(config.BULLMQ_QUEUE_NAME || "badgr-queue", {
      connection: {
        host: config.REDIS_HOST,
        port: config.REDIS_PORT,
        username: config.REDIS_USERNAME,
        password: config.REDIS_PASSWORD,
        db: config.REDIS_DB,
      },
    });
  });

  afterAll(() => {
    worker?.close();
  });

  test("should be able to create a worker", () => {
    worker = createWorker();

    expect(worker).toBeDefined();
  });

  test("should be able to create a job", async () => {
    const payload: Payload = {
      badgeClassEntityId: process.env.BADGE_CLASS_ENTITY_ID || "",
      email: inbox.emailAddress,
      issuerEntityId: process.env.ISSUER_ENTITY_ID || "",
      createNotification: true,
    };
    queue?.add("test", payload);
    const email = await mailslurp.waitForLatestEmail(inbox.id);
    expect(email.from).toBe("noreply@mybadges.org");
  }, 20_000);
});
