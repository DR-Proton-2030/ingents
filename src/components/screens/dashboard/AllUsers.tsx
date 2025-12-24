"use client";

import CommonModal from "@/components/shared/commonModal/CommonModal";
import DataTable from "@/components/shared/dataTable/DataTable";
import InviteUsersModal from "@/components/shared/inviteUsersModal/InviteUsersModal";
import { useRouter } from "next/navigation";
import { Check, Eye, Plus, User, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { IUser } from "@/constants/@types/interface/user";
import { getColumns } from "@/components/shared/column/column";

const AllUsers: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const router = useRouter();
  const columns = getColumns(router);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/users/getUser", { method: "GET", credentials: "include" });
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
   setUsers(mappedUsers.slice(0, 5));

    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => {
    setModalOpen(false);
    fetchUsers(); // refresh after adding a user
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6 bg-gray-50">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">All Members</h1>

        <div className="flex gap-3">
          {/* View All Users button (neumorphism style) */}
          {/* <button className="px-5 py-2.5 rounded-xl text-sm font-normal text-orange-600 bg-orange-50 shadow-[6px_6px_12px_rgba(194,65,12,0.25),-6px_-6px_12px_rgba(255,255,255,0.9)] hover:shadow-[inset_4px_4px_8px_rgba(194,65,12,0.25),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] active:shadow-[inset_6px_6px_12px_rgba(194,65,12,0.35),inset_-6px_-6px_12px_rgba(255,255,255,0.9)] transition-all duration-200">
            View All Users
          </button> */}

          {/* Add New User button */}
         <button
  onClick={() => router.push("/dashboard/users")}
  className="px-6 py-2.5 rounded-xl text-sm font-normal text-white bg-orange-500 shadow-[6px_6px_12px_rgba(194,65,12,0.6),-6px_-6px_12px_rgba(255,255,255,0.25)] hover:shadow-[inset_4px_4px_8px_rgba(194,65,12,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.25)] active:shadow-[inset_6px_6px_12px_rgba(194,65,12,0.7),inset_-6px_-6px_12px_rgba(255,255,255,0.3)] transition-all duration-200 flex items-center gap-2"
>
  <Eye size={16} />
  View All Users
</button>

        </div>
      </div>

      {loading && <div className="text-center py-10 text-gray-500">Loading users...</div>}

      <DataTable data={users} columns={columns} />

      {modalOpen && (
        <CommonModal isOpen={modalOpen} onClose={handleCloseModal}>
          <InviteUsersModal onClose={handleCloseModal} />
        </CommonModal>
      )}
    </div>
  );
};

export default AllUsers;
