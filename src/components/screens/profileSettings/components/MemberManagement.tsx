"use client";
import React, { useEffect, useState } from "react";
import DataTable from "@/components/shared/dataTable/DataTable";
import { getFullColumns } from "@/components/shared/column/getFullColumn";
import { useRouter } from "next/navigation";
import { IUser } from "@/constants/@types/interface/user";
import { Loading } from "@/components/shared/loadingScreen/Loading";

export const MemberManagement = () => {
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
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Member Management</h1>
        <p className="text-gray-600">Manage your company members, remove team members, or invite new people to your organization.</p>
      </div>
      <DataTable data={users} columns={columns} />
    </div>
  );
};
