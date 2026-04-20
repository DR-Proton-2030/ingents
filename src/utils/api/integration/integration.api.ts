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

export interface Integration {
    name: string;
    displayName: string;
    description: string;
    logo: string;
    isConnected: boolean;
    status: string;
}

export const getIntegrations = async () => {
    const response = await apiMethod.get("/integrations/list");
    return unwrapPayload<Integration[]>(response);
};

export const initiateConnection = async (toolkitName: string, redirectUrl?: string) => {
    const response = await apiMethod.post("/integrations/connect", { toolkitName, redirectUrl });
    return unwrapPayload<{ authUrl?: string }>(response);
};

export const executeAction = async (actionName: string, parameters: Record<string, any>) => {
    const response = await apiMethod.post("/integrations/execute", { actionName, parameters });
    return unwrapPayload<any>(response);
};
