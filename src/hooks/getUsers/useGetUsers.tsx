"use client";
import { IUser } from "@/types/interface/user.interface";
import { api } from "@/utils/api";
import { useCallback, useEffect, useState } from "react";

const useGetUsers = () => {
  const [users, setUsers] = useState<IUser[]>([]);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await api.user.getUser({});
      console.log("useGetUsers response:", response);

      // Backend may return an array directly, or an object like { data: [...], success: true }
      if (Array.isArray(response)) {
        setUsers(response);
      } else if (response && Array.isArray((response as any).data)) {
        setUsers((response as any).data as IUser[]);
      } else if (
        response &&
        (response as any).data &&
        Array.isArray((response as any).data.data)
      ) {
        setUsers((response as any).data.data as IUser[]);
      } else if (response && Array.isArray((response as any).users)) {
        setUsers((response as any).users as IUser[]);
      } else {
        // Fallback: try to coerce single object into an array, or clear
        console.warn("Unexpected users response shape, setting users to empty array", response);
        setUsers([]);
      }
    } catch (err) {
      console.error("Error fetching users in useGetUsers:", err);
      setUsers([]);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users };
};

export default useGetUsers;
