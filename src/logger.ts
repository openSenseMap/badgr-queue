import path, { join } from "path";
import { fileURLToPath } from "url";
import pino, { Logger } from "pino";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const errFile = join(__dirname, `mailer.err`);
const infoFile = join(__dirname, `mailer.info`);

const transport = pino.transport({
  targets: [
    {
      level: "error",
      target: "pino/file",
      options: {
        destination: errFile,
      },
    },
    {
      level: "info",
      target: "pino/file",
      options: {
        destination: infoFile,
      },
    },
  ],
});

const logger: Logger = pino({
  transport,
});

export default logger;
