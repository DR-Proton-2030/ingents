"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
	CloseCircle,
	User,
	Letter,
	ShieldUser,
	AddCircle
} from "@solar-icons/react";
import { toast } from "react-toastify";

export type UserRole = 'company_admin' | 'employee' | 'manager';
const roles: { id: UserRole; label: string; icon: any }[] = [
	{ id: 'company_admin', label: 'Company Admin', icon: ShieldUser },
	{ id: 'employee', label: 'Employee', icon: User },
	{ id: 'manager', label: 'Manager', icon: ShieldUser },
];

interface InviteUsersModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const InviteUsersModal: React.FC<InviteUsersModalProps> = ({ isOpen, onClose }) => {
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [tempPassword, setTempPassword] = useState("");
	const [role, setRole] = useState<UserRole>("employee");
	const [loading, setLoading] = useState(false);

	// Handle escape key to close
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
			document.body.style.overflow = "hidden";
		}
		return () => {
			document.removeEventListener("keydown", handleEscape);
			document.body.style.overflow = "";
		};
	}, [isOpen, onClose]);

	const handleInvite = async () => {
		if (!fullName || !email || !tempPassword) {
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
					password: tempPassword,
					role,
				}),
				credentials: "include",
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data?.error || "Invite failed");
			}

			toast.success("User invited successfully");
			// Reset form
			setFullName("");
			setEmail("");
			setTempPassword("");
			setRole("employee");
			onClose();
		} catch (error: any) {
			console.error("Invite error:", error);
			toast.error(error.message || "Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	if (typeof document === "undefined") return null;

	return createPortal(
		<div
			className={`fixed inset-0 z-[9999] transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
				}`}
			onClick={onClose}
		>
			{/* Backdrop */}
			<div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

			{/* Drawer Panel */}
			<div
				className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"
					}`}
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header: Exact match to MeetingDrawer */}
				<div className="sticky m-3 top-0 bg-gradient-to-r from-orange-500 to-orange-400 p-4 text-white shrink-0 rounded-xl">
					<div className="flex items-center justify-between">
						<h2 className="text-lg font-semibold flex items-center gap-2">
							Invite New User
						</h2>
						<button
							onClick={onClose}
							className="p-2 hover:bg-white/20 rounded-full transition-colors"
						>
							<CloseCircle className="w-5 h-5" />
						</button>
					</div>
				</div>

				{/* Content */}
				<div className="flex-1 overflow-y-auto px-6 py-8 space-y-8 scrollbar-hide">
					{/* User Details Section */}
					<div className="space-y-6">


						<div className="space-y-5">
							<div className="relative group">
								<label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 ml-1  group-focus-within:text-orange-500 transition-colors">
									Full Name
								</label>
								<div className="relative">
									<User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
									<input
										type="text"
										placeholder="e.g. John Doe"
										value={fullName}
										onChange={(e) => setFullName(e.target.value)}
										className="w-full h-14 pl-12 pr-4 rounded-2xl bg-gray-100 border-2 border-transparent focus:border-orange-500/20 focus:bg-white outline-none text-sm font-bold text-gray-800 transition-all "
									/>
								</div>
							</div>

							<div className="relative group">
								<label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 ml-1  group-focus-within:text-orange-500 transition-colors">
									Email Address
								</label>
								<div className="relative">
									<Letter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
									<input
										type="email"
										placeholder="e.g. john@company.com"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										className="w-full h-14 pl-12 pr-4 rounded-2xl bg-gray-100 border-2 border-transparent focus:border-orange-500/20 focus:bg-white outline-none text-sm font-bold text-gray-800 transition-all "
									/>
								</div>
							</div>

							<div className="relative group">
								<label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 ml-1 group-focus-within:text-orange-500 transition-colors">
									Temporary Password
								</label>
								<div className="relative">
									<ShieldUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
									<input
										type="text"
										placeholder="e.g. Temp@1234"
										value={tempPassword}
										onChange={(e) => setTempPassword(e.target.value)}
										className="w-full h-14 pl-12 pr-4 rounded-2xl bg-gray-100 border-2 border-transparent focus:border-orange-500/20 focus:bg-white outline-none text-sm font-bold text-gray-800 transition-all"
									/>
								</div>
							</div>
						</div>
					</div>

					{/* Role Selection Section */}
					<div className="space-y-6">
						<h3 className="text-xs font-black text-gray-400 uppercase  flex items-center gap-2">
							<ShieldUser className="w-3 h-3" />
							Access Control
						</h3>

						<div className="grid grid-cols-1 gap-3">
							{roles.map((r) => {
								const Icon = r.icon;
								const isActive = role === r.id;
								return (
									<button
										key={r.id}
										onClick={() => setRole(r.id)}
										className={`flex items-center gap-4 p-2 rounded-2xl border-2 transition-all text-left ${isActive
											? "border-orange-500 bg-orange-50  ring-2 ring-gray-500/5 px-6"
											: "border-gray-100 bg-gray-100/50 hover:border-orange-200 hover:bg-gray-100"
											}`}
									>
										<div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${isActive ? "bg-orange-500 text-white" : "bg-white text-gray-400 border border-gray-100"
											}`}>
											<Icon className="w-6 h-6" />
										</div>
										<div>
											<p className={`text-sm font-bold ${isActive ? "text-orange-900" : "text-gray-700"}`}>
												{r.label}
											</p>
											<p className={`text-[10px]  font-bold tracking-tight mt-0.5 ${isActive ? "text-orange-600/70" : "text-gray-400"}`}>
												{r.id.replace("_", " ")} permissions
											</p>
										</div>
										{isActive && (
											<div className="ml-auto w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
												<div className="w-2 h-2 rounded-full bg-white animate-pulse" />
											</div>
										)}
									</button>
								);
							})}
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="p-6 bg-white border-t border-gray-100 shrink-0 shadow-[0_-10px_40px_-20px_rgba(0,0,0,0.05)]">
					<div className="flex gap-4">
						<button
							onClick={onClose}
							className="flex-1 h-14 rounded-2xl border border-gray-100 text-gray-500 text-xs font-black \ hover:bg-gray-100 transition-all active:scale-95 "
						>
							Discard
						</button>
						<button
							onClick={handleInvite}
							disabled={loading}
							className="flex-[2] h-14 rounded-2xl bg-black/80 text-white text-xs font-black  flex items-center justify-center gap-3 hover:bg-orange-500 transition-all active:scale-95 shadow-xl shadow-gray-200 disabled:opacity-50 disabled:pointer-events-none"
						>
							{loading ? (
								<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
							) : (
								<>
									<AddCircle className="w-4 h-4" />
									Send Invitation
								</>
							)}
						</button>
					</div>
				</div>
			</div>
		</div>,
		document.body
	);
};

export default InviteUsersModal;
