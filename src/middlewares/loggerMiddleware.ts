import type { Request, Response, NextFunction } from "express";
import {
  writeFile,
  access,
  constants,
  appendFile,
  mkdir,
} from "node:fs/promises";
import * as path from "node:path";

const LOG_DIR = path.join(__dirname, "..", "..", "logs");
const LOG_FILE = path.join(LOG_DIR, "logs.txt");

async function addLogMessage(message: string): Promise<void> {
  try {
    if (message.length > 20) {
      const fileExist = await fileExists();
      if (!fileExist) {
        await createLogFile();
      }

      await appendFile(LOG_FILE, message + "\n");
    } else {
      throw Error("Log message too short");
    }
  } catch (error) {
    console.error("Error writing log message:", error);
  }
}

async function fileExists(): Promise<boolean> {
  try {
    await access(LOG_FILE, constants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
}

async function createLogFile(): Promise<void> {
  try {
    try {
      await access(LOG_DIR, constants.F_OK);
    } catch (error) {
      console.log("Logs directory does not exist, creating it...");
      await mkdir(LOG_DIR, { recursive: true });
    }

    // Create the log file
    await writeFile(LOG_FILE, "", { encoding: "utf8" });
  } catch (error) {
    console.error("Error creating log file:", error);
  }
}

fileExists()
  .then(async (fileExist: boolean) => {
    if (!fileExist) {
      await createLogFile();
    }
  })
  .catch((error) => {
    console.error("Error checking file existence:", error);
  });

/**
 * Definition of log entry
 *
 * fields:
 * - current date and time
 * - HTTP method
 * - IP address
 * - request URL
 */
export async function logger(req: Request, res: Response, next: NextFunction) {
  const { ip, method, originalUrl: url } = req;

  /** dateTime */
  const dateTime = new Date().toISOString();

  //console.log(`[${dateTime}] ${method} ${ip} - ${url}`);
  await addLogMessage([dateTime, method, ip, url].join(" "));
  next();
}
