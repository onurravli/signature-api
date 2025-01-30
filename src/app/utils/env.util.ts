import { config } from "dotenv";

config();

const env = {
  GOOGLE_FONTS_API_KEY: process.env.GOOGLE_FONTS_API_KEY,
  PORT: process.env.PORT,
};

export default env;
