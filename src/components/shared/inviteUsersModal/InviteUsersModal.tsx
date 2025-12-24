import { X } from "lucide-react";

import React, { useState } from "react";
import { toast } from "react-toastify";

export type UserRole = 'company_admin' | 'employee' | 'manager';
const roles: UserRole[] = ['company_admin', 'employee', 'manager'];

interface InviteUsersModalProps {
	onClose: () => void;
}

const InviteUsersModal: React.FC<InviteUsersModalProps> = ({ onClose }) => {
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [role, setRole] = useState<UserRole>("employee");
	const [loading, setLoading] = useState(false);

	const handleInvite = async () => {
  if (!fullName || !email) {
    toast.error("Please fill all fields");
    return;
  }

  try {
    setLoading(true);

    const res = await fetch("/api/users/inviteUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        full_name: fullName,
        email,
        role,
      }),
      credentials: "include", // ✅ VERY IMPORTANT for cookies
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error || "Invite failed");
    }

    toast.success("User invited successfully");
    onClose();
  } catch (error: any) {
    console.error("Invite error:", error);
    toast.error(error.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};


	return (
		<div
			onClick={onClose}
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
		>
			<div
				onClick={(e) => e.stopPropagation()}
				className="relative w-full max-w-md rounded-3xl bg-white/95 backdrop-blur-lg p-6 shadow-2xl border border-white/20"
			>
				{/* Close button */}
				<button
					onClick={onClose}
					className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
				>
					<X className="w-5 h-5" />
				</button>

				<h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
					Invite User
				</h2>

				<div className="space-y-4">
					{/* Full Name */}
					<div className="flex flex-col">
						<label className="text-sm font-medium text-gray-700 mb-1">Full Name</label>
						<input
							type="text"
							placeholder="Enter full name"
							value={fullName}
							onChange={(e) => setFullName(e.target.value)}
							className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-700 placeholder-gray-400 shadow-sm outline-none focus:ring-2 focus:ring-orange-400 transition"
						/>
					</div>

					{/* Email */}
					<div className="flex flex-col">
						<label className="text-sm font-medium text-gray-700 mb-1">Email Address</label>
						<input
							type="email"
							placeholder="Enter email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-700 placeholder-gray-400 shadow-sm outline-none focus:ring-2 focus:ring-orange-400 transition"
						/>
					</div>

					{/* Role */}
					<div className="flex flex-col">
						<label className="text-sm font-medium text-gray-700 mb-1">Role</label>
						<select
							value={role}
							onChange={(e) => setRole(e.target.value as UserRole)}
							className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-700 shadow-sm outline-none focus:ring-2 focus:ring-orange-400 transition"
						>
							{roles.map((r) => (
								<option key={r} value={r}>
									{r.replace("_", " ").toUpperCase()}
								</option>
							))}
						</select>
					</div>
				</div>

				{/* Actions */}
				<div className="mt-6 flex justify-end gap-3">
					<button
						onClick={onClose}
						className="rounded-xl px-5 py-2 text-gray-600 hover:bg-gray-100 transition"
					>
						Cancel
					</button>

					<button
						onClick={handleInvite}
						disabled={loading}
						className="rounded-xl bg-orange-500 px-6 py-2 text-white font-semibold hover:bg-orange-600 disabled:opacity-60 transition"
					>
						{loading ? "Inviting..." : "Invite"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default InviteUsersModal;
