import { Worker } from "bullmq";

// Import config
import config from "./config";

// Import logger
// import logger from "./logger";

// Bullmq worker
import badgrWorker from "./worker";

let worker: Worker;

export function createWorker() {
  return new Worker(config.BULLMQ_QUEUE_NAME || "queue", badgrWorker, {
    connection: {
      host: config.REDIS_HOST,
      port: config.REDIS_PORT,
      username: config.REDIS_USERNAME,
      password: config.REDIS_PASSWORD,
      db: config.REDIS_DB,
    },
    autorun: false,
  });
}

async function main() {
  try {
    worker = createWorker();

    worker.on("error", (err) => {
      // logger.error(err);
    });

    // Start worker
    worker.run();
  } catch (error) {
    // logger.error(error);
  }
}

process.on("uncaughtException", function (err) {
  // Handle the error safely
  // logger.error(err, "Uncaught exception");
});

process.on("unhandledRejection", (reason, promise) => {
  // Handle the error safely
  // logger.error({ promise, reason }, "Unhandled Rejection at: Promise");
});

process.on("SIGINT", async () => {
  // logger.info("Going to close worker connection...");
  await worker.close();
  // logger.info("Worker was closed!");
});

// 🔥 Fire it up!
main();
