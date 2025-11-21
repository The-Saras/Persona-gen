export interface AiModelProvider {
    generatePersona(topic: string,inst:string): Promise<any>;
}