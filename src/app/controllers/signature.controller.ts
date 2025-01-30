import { SignatureService } from "../services";

import { Request, Response } from "express";

class SignatureController {
  constructor(public readonly signatureService: SignatureService) {
    this.generateSignature = this.generateSignature.bind(this);
  }
  async generateSignature(req: Request, res: Response) {
    try {
      const { name, font, color, fontSize, fontWeight, padding, apiKey, response } = req.body;
      const signature = await this.signatureService.generateSignature(
        name,
        font,
        color,
        fontSize,
        fontWeight,
        padding,
        apiKey,
      );
      if (response === "png") {
        res.send(signature.png);
      } else if (response === "svg") {
        res.send(signature.svg);
      } else {
        res.json({ ...signature, ...req.body });
      }
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}

export default SignatureController;
