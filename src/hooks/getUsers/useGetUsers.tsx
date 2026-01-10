"use client";
import { IUser } from "@/types/interface/user.interface";
import { api } from "@/utils/api";
import { useCallback, useEffect, useState } from "react";

const useGetUsers = () => {
  const [users, setUsers] = useState<IUser[]>([]);

  const fetchUsers = useCallback(async () => {
    const response = await api.user.getUser({});
    console.log("----response", response); 
    setUsers(response);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users };
};

export default useGetUsers;
