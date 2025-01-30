import { SignatureController } from "../controllers";
import { SignatureService } from "../services";

import { Router } from "express";

const signatureRouter: Router = Router();
const signatureService: SignatureService = new SignatureService();
const signatureController: SignatureController = new SignatureController(signatureService);

signatureRouter.post("/", signatureController.generateSignature);

export default signatureRouter;
