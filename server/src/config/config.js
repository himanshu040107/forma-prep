import dotenv from 'dotenv';
dotenv.config();
const config={
    MONGO_URI:process.env.MONGO_URI,
    JWT_SECRET:process.env.JWT_SECRET,
    GOOGLE_GENAI_API_KEY:process.env.GOOGLE_GENAI_API_KEY,
}
export default config;