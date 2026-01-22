import { MinimalisticMagnifer, CloseCircle, AddCircle, User } from '@solar-icons/react';
import { UserPlusRounded } from '@solar-icons/react/ssr';
import { Plus } from 'lucide-react';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useGetUsers from '@/hooks/getUsers/useGetUsers';
import { IUser } from '@/types/interface/user.interface';

interface SearchAndAssignProps {
  onSelect: (user: any) => void;
  // Let's keep it optional but prioritize the internal useGetUsers
  searchApi?: (query: string) => Promise<any[]>;
}

const SearchAndAssign: React.FC<SearchAndAssignProps> = ({
  onSelect,
  searchApi,
}) => {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { users: allUsers } = useGetUsers();

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredUsers = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return [];
    return (Array.isArray(allUsers) ? allUsers : []).filter((u) => (
      u.full_name?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term)
    ));
  }, [allUsers, search]);

  const handleSelectUser = (user: IUser) => {
    onSelect(user);
    setOpen(false);
    setSearch("");
  };

  const modalContent = (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[400px] bg-white shadow-2xl rounded-[32px] border border-white/20 flex flex-col overflow-hidden"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xl font-bold text-gray-800">Assign Teammate</h4>
            <button
              onClick={() => setOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <CloseCircle className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="relative mb-6">
            <MinimalisticMagnifer className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full h-12 pl-12 pr-4 rounded-2xl transition-all outline-none text-sm font-bold bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500/10 border border-transparent focus:border-orange-500 text-gray-800"
            />
          </div>

          <div className="space-y-4">
            <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
              Search Results
            </h5>
            <div className="max-h-80 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
              {search.trim() === "" ? (
                <div className="text-center py-12">
                  <User className="w-12 h-12 text-gray-100 mx-auto mb-3" />
                  <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">Type to search people</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-sm font-bold text-gray-400">No teammates found</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Try a different name or email</p>
                </div>
              ) : (
                filteredUsers.map((u: IUser) => (
                  <button
                    key={u.id || (u as any)._id}
                    type="button"
                    onClick={() => handleSelectUser(u)}
                    className="w-full p-3 flex items-center gap-4 hover:bg-orange-50 rounded-2xl transition-all group text-left border border-transparent hover:border-orange-100 shadow-sm hover:shadow-md"
                  >
                    <div className="w-11 h-11 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-sm font-black shadow-sm uppercase overflow-hidden ring-2 ring-white group-hover:ring-orange-200 transition-all">
                      {u.profile_picture ? (
                        <img src={u.profile_picture} alt="" className="w-full h-full object-cover" />
                      ) : (
                        u.full_name?.charAt(0) || "?"
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 group-hover:text-orange-600 truncate transition-colors">
                        {u.full_name}
                      </p>
                      <p className="text-[10px] text-gray-500 truncate">{u.email}</p>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-gray-50 group-hover:bg-orange-500 flex items-center justify-center transition-all group-hover:scale-110">
                      <Plus className="w-4 h-4 text-gray-400 group-hover:text-white" />
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="relative rounded-full bg-gray-200 flex items-center justify-center p-2 cursor-pointer  hover:bg-gray-300 transition-all">
      <button
        ref={buttonRef}
        className='text-xs font-bold flex items-center gap-1.5 focus:outline-none'
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setOpen((v) => !v);
        }}
      >
        <UserPlusRounded className="w-4 h-4 text-gray-600" />
        <span className="text-gray-700">Add</span>
      </button>

      {mounted && createPortal(
        <AnimatePresence>
          {open && modalContent}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};


export default SearchAndAssign;