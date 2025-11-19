import { GeminiProvider } from "./GeminiProvider";
import { AiModelProvider } from "./AiModelProvider";
import { OpenaiProvider } from "./OpenaiProvider";

export class AiFactory {
    static create(provider:string) :AiModelProvider{
        switch(provider){
            case 'gemini':
                return new GeminiProvider(process.env.GOOGLE_API_KEY || '');

            case 'openai':
                return new OpenaiProvider(process.env.OPENAI_API_KEY || '');
            default:
                return new GeminiProvider(process.env.GOOGLE_API_KEY || '');
        }
    }
}