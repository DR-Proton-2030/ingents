import * as apiMethod from "../apiMethod";

const unwrapPayload = <T>(response: any): T => {
    if (response && typeof response === "object" && "data" in response) {
        const levelOne = (response as any).data;
        if (levelOne && typeof levelOne === "object" && "data" in levelOne) {
            return levelOne.data as T;
        }
        return levelOne as T;
    }

    return response as T;
};

export interface AssistantResponse {
    message: string;
    requiresAction?: boolean;
    usedTools?: string[];
    connectedApps?: string[];
}

export const chatWithAssistant = async (
    messages: { role: string; content: string }[],
    projectContext?: string
) => {
    const response = await apiMethod.post("/virtual-assistant/chat", { messages, projectContext });
    return unwrapPayload<AssistantResponse>(response);
};
