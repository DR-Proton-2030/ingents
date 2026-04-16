import { useState, useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import { api } from "@/utils/api";

const DEFAULT_FILTERS = {};

export const useCampaigns = (filters: any = DEFAULT_FILTERS) => {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.campaign.getCampaigns(filters);
      setCampaigns(res?.data || []);
    } catch (err: any) {
      const msg = err.message || "Failed to fetch campaigns";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const handleCreateCampaign = async (payload: any) => {
    try {
      const res = await api.campaign.createCampaign(payload);
      toast.success("Campaign created successfully!");
      fetchCampaigns();
      return res;
    } catch (err: any) {
      toast.error(err.message || "Failed to create campaign");
      throw err;
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await api.campaign.updateCampaignStatus(id, status);
      toast.success(`Campaign marked as ${status}`);
      fetchCampaigns();
      return res;
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
      throw err;
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    try {
      if (!window.confirm("Are you sure you want to delete this campaign?")) return;
      await api.campaign.deleteCampaign(id);
      toast.success("Campaign deleted");
      fetchCampaigns();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete campaign");
      throw err;
    }
  };

  return {
    campaigns,
    loading,
    error,
    refetchCampaigns: fetchCampaigns,
    handleCreateCampaign,
    handleUpdateStatus,
    handleDeleteCampaign,
  };
};
