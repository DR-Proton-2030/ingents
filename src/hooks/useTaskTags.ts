import { useState, useEffect, useCallback } from "react";
import { api } from "@/utils/api";
import { ITag } from "@/types/interface/tag.interface";
import { toast } from "react-toastify";

export const useTaskTags = () => {
  const [tags, setTags] = useState<ITag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTags = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.taskTag.getTaskTags();
      console.log("Tags API Raw Response:", res);
      
      let tagsData: ITag[] = [];
      
      if (res && typeof res === 'object') {
        if (Array.isArray(res.data)) {
          tagsData = res.data;
        } else if (Array.isArray(res)) {
          tagsData = res;
        } else if (res.tags && Array.isArray(res.tags)) {
          tagsData = res.tags;
        }
      }

      console.log("Extracted Tags Data:", tagsData);
      
      if (Array.isArray(tagsData)) {
        // Show all tags for now, or filter if is_active is explicitly false
        const activeTags = tagsData.filter((tag: ITag) => tag.is_active !== false);
        setTags(activeTags);
      } else {
        setTags([]);
      }
    } catch (err: any) {
      const msg = err.message || "Failed to fetch tags";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreateTag = async (name: string, color: string) => {
    try {
      const res = await api.taskTag.createTaskTag({ name, color });
      const createdTag = res?.data || res;
      if (createdTag) {
        toast.success("Tag created successfully");
        fetchTags();
        return createdTag;
      }
    } catch (err: any) {
      const msg = err.message || "Failed to create tag";
      toast.error(msg);
      throw err;
    }
  };

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  return {
    tags,
    loading,
    error,
    refreshTags: fetchTags,
    createTag: handleCreateTag,
  };
};
