import { createGroq } from "@ai-sdk/groq";
import { en as aiEn } from "@blocknote/xl-ai/locales";
import { createAIExtension } from "@blocknote/xl-ai";
import { Settings } from "@prisma/client";

export function getAIConfig(settings: Settings | null) {
  const provider = createGroq({
    baseURL: "/api/ai",
    apiKey: "",
  });
  const model = provider(settings?.aiModel || "llama-3.3-70b-versatile");
  
  const extension = createAIExtension({
    model,
    stream: true,
  });
  
  return { model, aiEn, extension };
}
