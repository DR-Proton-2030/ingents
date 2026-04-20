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

export interface GithubPrToTrelloSetupPayload {
    projectId: string;
    githubRepoOwner: string;
    githubRepoName: string;
    trelloListId: string;
    githubWebhookSecret?: string;
}

export interface GithubPrToTrelloSetupResponse {
    automationId: string;
    projectId: string;
    webhookUrl: string;
    webhookSecret: string;
    github: {
        events: string[];
        contentType: string;
    };
    instructions: string;
}

export const setupGithubPrToTrelloAutomation = async (
    payload: GithubPrToTrelloSetupPayload
) => {
    const response = await apiMethod.post("/automation/github-pr-to-trello/setup", payload);
    return unwrapPayload<GithubPrToTrelloSetupResponse>(response);
};
