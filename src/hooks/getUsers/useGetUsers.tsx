"use client";
import { IUser } from "@/types/interface/user.interface";
import { api } from "@/utils/api";
import { useCallback, useEffect, useState } from "react";

// module-level cache to share data across all instances of the hook
let cachedUsers: IUser[] | null = null;
let isFetching = false;
const listeners: Set<(users: IUser[]) => void> = new Set();

const useGetUsers = () => {
  const [users, setUsers] = useState<IUser[]>(cachedUsers || []);

  const fetchUsers = useCallback(async () => {
    // If we have cached data, use it immediately
    if (cachedUsers) {
      setUsers(cachedUsers);
      return;
    }

    // If a request is already in progress, just subscribe to the result
    if (isFetching) {
      listeners.add(setUsers);
      return;
    }

    // Start fetching
    isFetching = true;
    try {
      const response = await api.user.getUser({});
      cachedUsers = response;
      setUsers(response);

      // Notify all current hook instances
      listeners.forEach((listener) => listener(response));
      listeners.clear();
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      isFetching = false;
    }
  }, []);

  useEffect(() => {
    // Add to listeners if we don't have data yet
    if (!cachedUsers) {
      listeners.add(setUsers);
    }

    fetchUsers();

    // Cleanup listener on unmount
    return () => {
      listeners.delete(setUsers);
    };
  }, [fetchUsers]);

  return { users };
};

export default useGetUsers;
