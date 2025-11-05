import "dotenv/config";

import express from "express";
import type { Request, Response } from "express";
import nunjucks from "nunjucks";
import { logger } from "./middlewares/loggerMiddleware";
import {
  generateMessageId,
  storeMessage,
  burnMessage,
} from "./services/burnMessageUtils";

import cors from "cors";
const app = express();
const port = process.env.PORT || 3000;

app.use(logger);
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("static"));

nunjucks.configure("src/templates", {
  autoescape: true,
  express: app,
});

app.get("/", (req: Request, res: Response) => {
  res.redirect("/create");
});

app.get("/create", (req: Request, res: Response) => {
  res.render("create.html", { title: "Create Burn Message" });
});

app.post("/create", async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    if (
      !message ||
      typeof message !== "string" ||
      message.trim().length === 0
    ) {
      return res.status(400).render("create.html", {
        title: "Create Burn Message",
        error: "Message cannot be empty",
      });
    }

    if (message.length > 2000) {
      return res.status(400).render("create.html", {
        title: "Create Burn Message",
        error: "Message too long (maximum 2000 characters)",
      });
    }

    const messageId = generateMessageId();
    await storeMessage(messageId, message);

    res.render("success.html", {
      title: "Message Created",
      messageId,
      protocol: req.protocol,
      host: req.get("host"),
    });
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).render("create.html", {
      title: "Create Burn Message",
      error: "Failed to create message. Please try again.",
    });
  }
});

app.get("/message/:id", async (req: Request, res: Response) => {
  try {
    const messageId = req.params.id;

    if (
      !messageId ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        messageId,
      )
    ) {
      return res.status(404).render("notFound.html", {
        title: "Message Not Found",
      });
    }

    const message = await burnMessage(messageId);

    if (message === null) {
      return res.status(404).render("notFound.html", {
        title: "Message Not Found",
      });
    }

    res.render("message.html", {
      title: "Burn Message",
      message,
    });
  } catch (error) {
    console.error("Error retrieving message:", error);
    res.status(500).render("notFound.html", {
      title: "Message Not Found",
    });
  }
});

app.get("/home", (req: Request, res: Response) => {
  res.render("home.html", { title: "Home Page" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
