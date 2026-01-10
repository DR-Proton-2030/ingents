"use client";
import React, { useEffect, useState } from "react";
import Layout from "../layout/Layout";

import DataTable from "@/components/shared/dataTable/DataTable";
import { getFullColumns } from "@/components/shared/column/getFullColumn";
import { useRouter } from "next/navigation";
import { IUser } from "@/constants/@types/interface/user";

export const AllUsersPage = () => {
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState<IUser[]>([]);

  const router = useRouter();
  const columns = getFullColumns(router);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/users/getUser", {
        method: "GET",
        credentials: "include",
      });
      const result = await res.json();
      const usersArray = result?.data || [];
      const mappedUsers = usersArray.map((user: any, index: number) => ({
        _id: user._id,
        full_name: user.full_name,
        email: user.email || "no-email@example.com",
        role: user.role || "employee",
        has_joined: user.has_joined ?? false,
        avatar: user.avatar || `https://i.pravatar.cc/150?img=${index + 1}`,
      }));
      setUsers(mappedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <Layout showSidebar={true}>
        <div className="mx-auto max-w-7xl px-4 py-6 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading tasks...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showSidebar={true}>
      <div className="mx-auto max-w-7xl px-4 py-6 space-y-6 hidescroll">
        {/* Header with tabs and search */}
        <DataTable data={users} columns={columns} />

        {/* Task Sections */}
        <div className="space-y-4"></div>
      </div>
    </Layout>
  );
};
