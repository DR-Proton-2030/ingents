import { get, post } from "../apiMethod";

export const aiTokenUsageAPI = {
  getUsage: () => get("/ai-token-usage"),
};
