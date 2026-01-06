
import { UserPlus } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

const SearchAndAssign = ({ onSelect }: any) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState([]);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0 });

  // useEffect(() => {
  //   setFiltered(
  //     users.filter((u: any) =>
  //       u.name.toLowerCase().includes(search.toLowerCase()) ||
  //       (u.email && u.email.toLowerCase().includes(search.toLowerCase()))
  //     )
  //   );
  // }, [search, users]);

  // Update popup position when opening
  useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPopupPos({
        top: rect.bottom + 8,
        left: rect.left,
      });
    }
  }, [open]);

  // Close popup on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        ref.current && !ref.current.contains(e.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const popupContent = (
    <div
      ref={ref}
      className="w-80 bg-white border border-gray-200 rounded-xl shadow-2xl z-[9999] p-0 animate-fade-in"
      style={{
        position: 'fixed',
        top: popupPos.top,
        left: popupPos.left,
        minWidth: 320,
        maxWidth: 400,
      }}
    >
      <div className="flex items-center px-4 pt-4 pb-2">
        <span className="mr-2">
          <UserPlus className="w-5 h-5 text-gray-400" />
        </span>
        <input
          autoFocus
          className="flex-1 outline-none border-none bg-transparent text-base py-2 px-2"
          placeholder="Search or enter email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="max-h-72 overflow-y-auto hidescroll">
        {filtered.length === 0 ? (
          <div className="px-4 py-3 text-gray-400 text-sm">No users found</div>
        ) : (
          filtered.map((user: any, idx: number) => (
            <button
              key={user.id}
              className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 transition text-left ${idx === 0 ? 'mt-1' : ''}`}
              onClick={() => {
                setOpen(false);
                onSelect && onSelect(user);
              }}
            >
              <span className={`flex items-center justify-center w-8 h-8 rounded-full text-white font-semibold text-base ${user.color}`}>{user.initials}</span>
              <span className="text-gray-900 text-base">{user.name}</span>
            </button>
          ))
        )}
      </div>
      <div className="border-t border-gray-100 px-4 py-3">
        <button className="w-full flex items-center justify-center gap-2 text-sm text-violet-700 font-medium py-2 rounded hover:bg-violet-50 transition">
          <span className="inline-block w-5 h-5">
            <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14.5A6.5 6.5 0 1110 3.5a6.5 6.5 0 010 13z" fill="#a78bfa"/><path d="M10 7v3.5l2.5 2.5" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
          Set up fill with AI
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        className="search-user flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100"
        onClick={() => setOpen((v) => !v)}
        aria-label="Assign user"
        type="button"
      >
        <UserPlus className="w-5 h-5 text-gray-600" />
      </button>
      {open && typeof document !== 'undefined' && createPortal(popupContent, document.body)}
    </div>
  );
};

export default SearchAndAssign;