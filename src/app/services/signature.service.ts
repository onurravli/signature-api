import { env } from "../utils";

import axios from "axios";
import * as opentype from "opentype.js";
import sharp from "sharp";

class SignatureService {
  constructor() {
    this.generateSignature = this.generateSignature.bind(this);
  }
  private async getFontFile(fontFamily: string, apiKey: string, fontWeight: number | string): Promise<Buffer> {
    try {
      const fontInfoResponse = await axios.get(
        `https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}&family=${encodeURIComponent(fontFamily)}`,
      );
      if (!fontInfoResponse.data.items || !fontInfoResponse.data.items.length) {
        throw new Error(`Font ${fontFamily} not found`);
      }
      const fontUrl = fontInfoResponse.data.items[0].files[`${fontWeight}`];
      const fontResponse = await axios.get(fontUrl, {
        responseType: "arraybuffer",
      });
      return Buffer.from(fontResponse.data);
    } catch (error) {
      console.error({ error });
      throw new Error(`Failed to fetch font ${fontFamily}: ${(error as Error).message}`);
    }
  }
  async generateSignature(
    name: string,
    font: string,
    color: string,
    fontSize: number = 72,
    fontWeight: number | string,
    padding: number = 20,
    apiKey?: string,
  ) {
    try {
      if (!apiKey) {
        if (!env.GOOGLE_FONTS_API_KEY) {
          throw new Error("Either send apiKey or set GOOGLE_FONTS_API_KEY in environment variable.");
        }
        apiKey = env.GOOGLE_FONTS_API_KEY;
      }
      const fontBuffer = await this.getFontFile(font, apiKey, fontWeight);
      const loadedFont = opentype.parse(Uint8Array.from(fontBuffer).buffer);
      const path = loadedFont.getPath(name, 0, fontSize, fontSize, {});
      const bounds = path.getBoundingBox();
      const width = Math.ceil(bounds.x2 - bounds.x1) + padding * 2;
      const height = Math.ceil(bounds.y2 - bounds.y1) + padding * 2;
      const translateX = padding - bounds.x1;
      const translateY = padding - bounds.y1;
      const svg = `<svg width='${width}' height='${height}' viewBox='0 0 ${width} ${height}' xmlns='http://www.w3.org/2000/svg'><path transform='translate(${translateX}, ${translateY})' d='${path.toPathData(2)}' fill='${color}'/></svg>`;
      const svgBuffer = await sharp(Buffer.from(svg)).toFormat("png").toBuffer();
      return {
        svg: svg.replace(/\n/g, "").trim(),
        png: `data:image/png;base64,${svgBuffer.toString("base64")}`,
        width,
        height,
      };
    } catch (error) {
      throw new Error(`Failed to generate signature: ${(error as Error).message}`);
    }
  }
}

export default SignatureService;
