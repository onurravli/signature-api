import { signatureRouter } from "./routes";

import express, { Application } from "express";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/signature", signatureRouter);

app.all("*", (req, res) => {
  res.status(404).json({ error: "Not found" });
});

export default app;
