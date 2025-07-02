import { createGroq } from "@ai-sdk/groq";
import { en as aiEn } from "@blocknote/xl-ai/locales";
import { createAIExtension } from "@blocknote/xl-ai";

export function getAIConfig(settings: any) {
  const provider = createGroq({
    baseURL: "/api/ai",
    apiKey: "",
  });
  const model = provider(settings?.aiModel || "llama-3.3-70b-versatile");
  return { model, aiEn };
}

export function getAIExtension(model: any) {
  return createAIExtension({
    model,
    stream: true,
  });
}
