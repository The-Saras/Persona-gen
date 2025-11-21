import axios from "axios";
import { AiModelProvider } from "./AiModelProvider";
import {prompt} from './prompt'

export class OpenaiProvider implements AiModelProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    
  }

  async generatePersona(topic: string,inst:string, promptTemplate:string): Promise<string> {
    
    


    try {
      const url =
        "https://terracez-sales-ai.cognitiveservices.azure.com/openai/deployments/gpt-5-mini/chat/completions?api-version=2025-01-01-preview";
      const response = await axios.post(
        url,
        {
          messages: [
            {
              role: "user",
              content: promptTemplate,
            },
          ],
          max_completion_tokens: 16384,
          model: "gpt-5-mini",
        },
        {
          headers: {
            "api-key": this.apiKey,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data?.choices?.[0]?.message?.content;
    } catch (error: any) {
      console.error("API error:", error.response?.data || error.message);
      throw new Error("Failed to generate persona");
    }
  }
}
