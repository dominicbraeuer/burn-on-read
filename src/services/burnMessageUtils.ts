import {
  writeFile,
  unlink,
  readFile,
  access,
  constants,
  mkdir,
} from "node:fs/promises";
import * as path from "node:path";
import { randomUUID } from "node:crypto";
import validator from "validator";

const MESSAGES_DIR = path.join(__dirname, "..", "..", "burn-messages");

/**
 * Generates a unique ID for burn messages
 */
export function generateMessageId(): string {
  return randomUUID();
}

/**
 * Sanitizes user input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  // Remove any HTML tags and escape special characters
  let sanitized = validator.escape(input);
  // Normalize whitespace
  sanitized = sanitized.replace(/\s+/g, " ").trim();
  return sanitized;
}

/**
 * Stores a message to a temporary file
 */
export async function storeMessage(
  messageId: string,
  content: string,
): Promise<void> {
  try {
    try {
      await access(MESSAGES_DIR, constants.F_OK);
    } catch (error) {
      console.log("Messages directory does not exist, creating it...");
      await mkdir(MESSAGES_DIR, { recursive: true });
    }

    const filePath = path.join(MESSAGES_DIR, `${messageId}.txt`);
    const sanitizedContent = sanitizeInput(content);

    if (sanitizedContent.length === 0) {
      throw new Error("Message content cannot be empty");
    }

    await writeFile(filePath, sanitizedContent, { encoding: "utf8" });
  } catch (error) {
    console.error("Error storing message:", error);
    throw error;
  }
}

export async function burnMessage(messageId: string): Promise<string | null> {
  try {
    const filePath = path.join(MESSAGES_DIR, `${messageId}.txt`);

    try {
      await access(filePath, constants.F_OK);
    } catch {
      return null;
    }

    const content = await readFile(filePath, { encoding: "utf8" });
    await unlink(filePath);
    return content;
  } catch (error) {
    console.error("Error burning message:", error);
    throw error;
  }
}
