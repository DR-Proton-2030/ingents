import { get, post, patch } from "../apiMethod";
import API from "../api";

export const getCampaigns = async (filters: any) => {
  return await get("/campaign", filters);
};

export const createCampaign = async (payload: any) => {
  return await post("/campaign/create", payload);
};

export const updateCampaignStatus = async (id: string, status: string) => {
  return await patch(`/campaign/${id}/status`, { status });
};

export const deleteCampaign = async (id: string) => {
  const res = await API.delete(`/campaign/${id}`);
  return res.data;
};
