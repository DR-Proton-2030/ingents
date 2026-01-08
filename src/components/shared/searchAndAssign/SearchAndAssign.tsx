
import { UserPlus } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';


interface SearchAndAssignProps {
  onSelect: (user: any) => void;
  searchApi: (query: string) => Promise<any[]>;
}

const SearchAndAssign: React.FC<SearchAndAssignProps> = ({
  onSelect,
  searchApi,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0 });

  // 🔍 CALL SEARCH API
  useEffect(() => {
    if (!search.trim()) {
      setFiltered([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const users = await searchApi(search);
        setFiltered(users);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [search, searchApi]);

  // popup position
  useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPopupPos({ top: rect.bottom + 8, left: rect.left });
    }
  }, [open]);

  // outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node) &&
        !buttonRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const popupContent = (
    <div
      ref={ref}
      className="w-80 bg-white border rounded-xl shadow-2xl z-[9999]"
      style={{ position: "fixed", top: popupPos.top, left: popupPos.left }}
    >
      {/* search input */}
      <div className="flex items-center px-4 pt-4 pb-2">
        <UserPlus className="w-5 h-5 text-gray-400 mr-2" />
        <input
          autoFocus
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="flex-1 outline-none bg-transparent py-2"
        />
      </div>

      {/* results */}
      <div className="max-h-72 overflow-y-auto">
        {loading && (
          <div className="px-4 py-3 text-sm text-gray-400">Searching…</div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="px-4 py-3 text-sm text-gray-400">
            No users found
          </div>
        )}

        {filtered.map((user) => (
          <button
            key={user._id}
            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onSelect(user);
              setOpen(false);
              setSearch("");
              setFiltered([]);
            }}
          >
            <div className="w-8 h-8 rounded-full bg-violet-500 text-white flex items-center justify-center">
              {user.full_name?.[0]}
            </div>
            <span>{user.full_name}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="relative w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center p-2 cursor-pointer">
    <button
  ref={buttonRef}
  type="button"
  onClick={(e) => {
    e.stopPropagation();
    e.preventDefault();
    setOpen((v) => !v);
  }}
>

        <UserPlus className="w-5 h-5 text-orange-600" />
      </button>

      {open && createPortal(popupContent, document.body)}
    </div>
  );
};


export default SearchAndAssign;