import { IUser } from "@/constants/@types/interface/user";
import { Check, Eye, User, X, Briefcase, Shield } from "lucide-react";

export const getColumns = (router: ReturnType<typeof import("next/navigation").useRouter>) => {
  const roleConfig = {
    company_admin: {
      label: "Company Admin",
      className: "bg-blue-100 text-blue-800",
      icon: <Shield className="w-4 h-4" fill="currentColor" strokeWidth={0} />,
    },
    employee: {
      label: "Employee",
      className: "bg-yellow-100 text-yellow-800",
      icon: <User className="w-4 h-4" fill="currentColor" strokeWidth={0} />,
    },
    manager: {
      label: "Manager",
      className: "bg-green-100 text-green-700",
      icon: <Briefcase className="w-4 h-4" fill="currentColor" strokeWidth={0} />,
    },
  } as const;

  return [
    {
      title: "Name",
      render: (user: IUser) => (
        <div className="flex items-center gap-3">
          {user.avatar ? (
            <img src={user.avatar} className="w-10 h-10 rounded-full" alt="" />
          ) : (
            <User className="w-10 h-10 text-gray-400" />
          )}
          <span className="font-medium">{user.full_name}</span>
        </div>
      ),
    },
    {
      title: "Email",
      render: (user: IUser) => <span className="text-sm text-gray-500">{user.email}</span>,
    },
    // {
    //   title: "Status",
    //   render: (user: IUser) => (
    //     <span
    //       className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-semibold ${
    //         user.has_joined ? "bg-green-100 text-green-800" : "bg-red-50 text-red-600"
    //       }`}
    //     >
    //       {user.has_joined ? <Check size={14} /> : <X size={14} />}
    //       {user.has_joined ? "Joined" : "Pending"}
    //     </span>
    //   ),
    // },
    // {
    //   title: "Role",
    //   render: (user: IUser) => {
    //     const role = roleConfig[user.role];
    //     return (
    //       <span
    //         className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-semibold ${role.className}`}
    //       >
    //         {role.icon}
    //         {role.label}
    //       </span>
    //     );
    //   },
    // },
    {
      title: "View",
      render: (user: IUser) => (
        <button
          onClick={() => router.push(`/users/${user._id}`)}
          className="
            inline-flex items-center gap-1.5
            rounded-lg px-3 py-1.5
            text-xs font-semibold
            bg-blue-50 text-blue-700
            hover:bg-blue-100
            shadow-sm hover:shadow
            transition
          "
        >
          <Eye className="w-3.5 h-3.5" />
          View
        </button>
      ),
    },
  ];
};
