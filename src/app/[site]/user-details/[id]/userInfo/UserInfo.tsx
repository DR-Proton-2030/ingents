import { Briefcase, CheckCircle, Clock, Shield, Users } from "lucide-react";
import React, { JSX } from "react";

interface StaffInfoProps {
  user?: {
    full_name: string;
    role: string;
      has_joined: boolean;
    email: string;
    avatar?: string;
  };
}

const roleConfig: Record<
  string,
  { label: string; color: string; icon: JSX.Element }
> = {
  company_admin: {
    label: "Company Admin",
    color: "text-blue-600 bg-blue-100",
    icon: <Shield className="h-4 w-4" />,
  },
  employee: {
    label: "Employee",
    color: "text-yellow-700 bg-yellow-100",
    icon: <Users className="h-4 w-4" />,
  },
  manager: {
    label: "Manager",
    color: "text-green-700 bg-green-100",
    icon: <Briefcase className="h-4 w-4" />,
  },
};


const statusConfig = {
  pending: {
    label: "Pending",
    color: "text-yellow-700 bg-yellow-100",
    icon: <Clock className="h-4 w-4" />,
  },
  joined: {
    label: "Invitation Accepted",
    color: "text-green-700 bg-green-100",
    icon: <CheckCircle className="h-4 w-4" />,
  },
};

const UserInfoCard: React.FC<StaffInfoProps> = ({
  user = {
    full_name: "Hang Minh Nguyen",
    role: "UI - UX Designer",
    department: "Product Department",
    staff_id: "SJ53862",
    staff_account: "hangntm1",
    phone: "0913 854 235",
    email: "hangntm@sjlabs.com",
    avatar: "",
  },
}) => {
  return (
    <div className="w-full mt-2 rounded-xl border border-gray-200 bg-white px-6 py-6 p-6 pt-4 shadow-sm">
      <div className="flex items-center gap-6">
        {/* Avatar */}
        <div className="shrink-0">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.full_name}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xl font-semibold text-white">
              {user.full_name.charAt(0)}
            </div>
          )}
        </div>

        {/* Name & Role */}
        <div className="min-w-[260px]">
          <h2 className="text-2xl font-bold text-gray-900">
            {user.full_name}
          </h2>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
  {/* Role Badge */}
  <span
    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-medium ${
      roleConfig[user.role]?.color
    }`}
  >
    {roleConfig[user.role]?.icon}
    {roleConfig[user.role]?.label}
  </span>

  {/* Status Badge */}
  <span
    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-medium ${
      user.has_joined
        ? statusConfig.joined.color
        : statusConfig.pending.color
    }`}
  >
    {user.has_joined
      ? statusConfig.joined.icon
      : statusConfig.pending.icon}
    {user.has_joined
      ? statusConfig.joined.label
      : statusConfig.pending.label}
  </span>
</div>

        </div>

        {/* Divider */}
        <div className="h-12 w-px bg-gray-200" />

        {/* Info Section */}
        <div className="grid flex-1 grid-cols-2 gap-x-10 gap-y-2 text-sm">
          <div className="flex gap-2">
            <span className="text-gray-400">Staff ID:</span>
            <span className="font-medium text-gray-900">
              12356787
            </span>
          </div>

          <div className="flex gap-2">
            <span className="text-gray-400">Phone number:</span>
            <span className="font-medium text-gray-900">
              +9173839393
            </span>
          </div>

         

          <div className="flex gap-2">
            <span className="text-gray-400">Email:</span>
            <span className="font-medium text-gray-900">
              {user.email}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfoCard;
