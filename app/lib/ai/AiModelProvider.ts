export interface AiModelProvider {
    generatePersona(topic: string): Promise<any>;
}