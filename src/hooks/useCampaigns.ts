import { useState, useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import { api } from "@/utils/api";

const DEFAULT_FILTERS = {};

export const useCampaigns = (filters: any = DEFAULT_FILTERS) => {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaigns = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
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
      fetchCampaigns(true);
      return res;
    } catch (err: any) {
      toast.error(err.message || "Failed to create campaign");
      throw err;
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    // Optimistic UI Update
    setCampaigns(prev => prev.map(c => c._id === id ? { ...c, status } : c));
    
    try {
      const res = await api.campaign.updateCampaignStatus(id, status);
      toast.success(`Campaign marked as ${status}`);
      // Background refetch to ensure sync without loader
      fetchCampaigns(true);
      return res;
    } catch (err: any) {
      fetchCampaigns(true); // Rollback
      toast.error(err.message || "Failed to update status");
      throw err;
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    try {
      if (!window.confirm("Are you sure you want to delete this campaign?")) return;
      
      // Optimistic delete
      setCampaigns(prev => prev.filter(c => c._id !== id));
      
      await api.campaign.deleteCampaign(id);
      toast.success("Campaign deleted");
      fetchCampaigns(true);
    } catch (err: any) {
      fetchCampaigns(true); // Rollback
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
