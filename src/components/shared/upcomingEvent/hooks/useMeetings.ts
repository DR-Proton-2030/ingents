import { useState, useEffect } from "react";
import { getMeetings, Meeting } from "@/utils/api/meeting/meeting.api";

interface UseMeetingsResult {
  meetings: Meeting[];
  isLoading: boolean;
  error: string | null;
}

export const useMeetings = (fromDate: string, toDate: string): UseMeetingsResult => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getMeetings(fromDate, toDate, 1, 50);
        setMeetings(response.data || []);
      } catch (err) {
        console.error("Failed to fetch meetings:", err);
        setError("Failed to load meetings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeetings();
  }, [fromDate, toDate]);

  return { meetings, isLoading, error };
};

export default useMeetings;
