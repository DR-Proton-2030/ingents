import React from "react";

interface OrganizationMembersProps {
  members: any[];
}

export function OrganizationMembers({ members }: OrganizationMembersProps) {
  const safeMembers = Array.isArray(members) ? members : [];

  return (
    <div className="px-1">
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-lg font-bold text-gray-900">
          Organization Members
        </h3>
        <span className="inline-flex items-center justify-center min-w-[28px] h-7 rounded-full bg-gray-100 text-sm font-semibold text-gray-500 px-2">
          {safeMembers.length}
        </span>
      </div>

      <div className="space-y-4">
        {safeMembers.slice(0, 5).map((member: any) => (
          <div key={member._id || member.id} className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              {member.profile_picture ? (
                <img
                  src={member.profile_picture}
                  alt={member.full_name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-orange-400 flex items-center justify-center text-white text-lg font-bold border-2 border-white shadow-sm">
                  {(member.full_name || "U")[0].toUpperCase()}
                </div>
              )}
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {member.full_name}
              </p>
              <p className="text-xs text-gray-400 truncate">{member.email}</p>
            </div>
          </div>
        ))}

        {safeMembers.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">
            No members yet
          </p>
        )}
      </div>
    </div>
  );
}
