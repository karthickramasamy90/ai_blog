import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyCUyXBXRTDdVRqhJdkBIrj2MiR969GGQHk");

async function listModels() {
  const models = await genAI.listModels();
  console.log(models);
}

listModels();
