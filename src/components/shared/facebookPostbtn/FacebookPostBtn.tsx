/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import AuthContext from "@/contexts/authContext/authContext";
import { generateLumaVideoFromText } from "@/service/luma";

import { useContext, useEffect, useState } from "react";
import { BsFacebook, BsCheck } from "react-icons/bs";

export default function FacebookPostBtn({message, file}: any) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { user } = useContext(AuthContext);
  const [pageId, setPageId] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
//   const [message, setMessage] = useState<string>('');
//   const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (user) {
      setPageId(user.facebook?.project_id ?? "");
      setUserId(user.id ?? "");
    } else {
      setPageId("");
      setUserId("");
    }
  }, [user]);


  async function submit(e?: React.FormEvent | React.MouseEvent) {
    e?.preventDefault();
    // reset success when user triggers another upload
    setSuccess(false);
    setLoading(true);
    setResult(null);
    try {
      const form = new FormData();
      form.append('userId', userId || '68ef911fd860ee30f6103bdb');
      form.append('pageId', pageId || '806839612517191');
      form.append('message', message || 'Test post');
      if (file) form.append('image', file, file.name);

      const resp = await fetch('/api/test/facebook/post', { method: 'POST', body: form });
      const json = await resp.json();
      setResult(JSON.stringify(json));
      // mark success based on HTTP ok or explicit json.ok
      if (resp.ok || (json && (json.ok === true || json.success === true))) {
        setSuccess(true);
      } else {
        setSuccess(false);
      }
    } catch (err: any) {
      setResult(String(err?.message || err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4">
      <div className="">
        <button
          onClick={submit}
          disabled={loading}
          aria-busy={loading}
          className={
            `group flex items-center justify-start w-11 h-11 rounded-full cursor-pointer relative overflow-hidden
   transition-all duration-200 shadow-lg hover:w-32 hover:rounded-full active:translate-x-1 active:translate-y-1 disabled:opacity-60 ` +
            (success ? ' bg-green-600' : ' bg-blue-600')
          }
        >
          <div
            className="flex items-center justify-center w-full transition-all duration-300 group-hover:justify-start group-hover:px-3"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            ) : success ? (
              <BsCheck className="text-white" />
            ) : (
              <BsFacebook className="text-white" />
            )}
          </div>
          <div
            className="absolute right-5 transform translate-x-full opacity-0 text-white text-lg font-semibold transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
          >
            {loading ? 'Uploading' : success ? 'Uploaded' : 'Upload'}
          </div>
        </button>
      </div>
      {/* {result && (
        <pre className="mt-4 p-2 bg-gray-100">{result}</pre>
      )} */}
    </div>
  );
}
