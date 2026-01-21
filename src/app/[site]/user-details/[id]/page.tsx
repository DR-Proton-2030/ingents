"use client";
import React, { useState, useCallback, useEffect } from "react";
import Layout from "@/screens/layout/Layout";
import { ViewMode, Task as TaskType } from "@/types/interface/task.interface";
import { useTasks } from "@/hooks/useTasks";
import { TaskFormData } from "@/types/interface/task-modal.interface";
import CreateTaskModal from "@/components/screens/taskManagment/CreateTaskModal";
import TaskSection from "@/components/screens/taskManagment/TaskSection";
import TaskHeader from "@/components/screens/taskManagment/TaskHeader";
import DataTable from "@/components/shared/dataTable/DataTable";
import { IUser } from "@/constants/@types/interface/user";
import { useParams, useRouter } from "next/navigation";
import { getColumns } from "@/components/shared/column/column";
import { getFullColumns } from "@/components/shared/column/getFullColumn";
import UserInfo from "./userInfo/UserInfo";
import UserAccess from "./userAccess/UserAccess";
import { Loading } from "@/components/shared/loadingScreen/Loading";


interface IUserDetail {
  _id: string;
  full_name: string;
  email: string;
  role: string;
  has_joined: boolean;
  avatar?: string;
}
const UserDetailsPage = () => {
  const params = useParams();
  const userId = params.id;

  const [user, setUser] = useState<IUserDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/getUserDetails/${userId}`, {
          method: "GET",
          credentials: "include",
        });


        const result = await res.json();
        console.log("result:", result)
        setUser(result.data); // assuming your backend returns { data: { ...user } }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (!user && !loading) return <div className="p-6">User not found</div>;

  if (loading) {
    return (
      <Layout showSidebar={true}>
        <Loading />
      </Layout>
    );
  }

  return (
    <Layout showSidebar={true}>
      <div className="w-full flex flex-col mb-4">
        <h1 className="text-xl font-bold text-gray-700 pl-2">User Profile</h1>
        {/* //@ts-ignore */}
        <UserInfo user={user} />
      </div>
      <div className="w-full flex flex-col mt-3">
        <h1 className="text-xl font-bold text-gray-700 pl-2">User Access</h1>
        <UserAccess />
      </div>

    </Layout>

  );
};

export default UserDetailsPage;
