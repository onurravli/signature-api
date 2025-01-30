import { signatureRouter } from "./routes";

import express, { Application } from "express";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/signature", signatureRouter);

app.all("*", (req, res) => {
  res.status(404).json({
    error: "Not found",
    message: "To generate signatures, make a POST request to /api/v1/signature with the following parameters:",
    example: {
      name: "Your Name",
      font: "Font Name",
      color: "Color (hex or name)",
      fontSize: "Font size in pixels",
      fontWeight: "Font weight (e.g. normal, bold)",
      padding: "Padding in pixels",
      response: "png, svg, or json",
    },
  });
});

export default app;
