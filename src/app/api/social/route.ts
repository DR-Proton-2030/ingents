import { proxyAssistantRequest } from "../utils/assistantProxy";

export async function POST(req: Request) {
  return proxyAssistantRequest(req);
}
