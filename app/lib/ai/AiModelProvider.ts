export interface AiModelProvider {
    generatePersona(topic: string,inst:string, promptTemplate:string): Promise<any>;
}