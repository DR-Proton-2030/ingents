/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import AuthContext from "@/contexts/authContext/authContext";
import { generateLumaVideoFromText } from "@/service/luma";

import { useContext, useEffect, useState } from "react";

export default function FacebookPostForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const { user } = useContext(AuthContext);
  const [pageId, setPageId] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [message, setMessage] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [scheduleAt, setScheduleAt] = useState<string>('');
 
  useEffect(() => {
    if (user) {
      setPageId(user.facebook?.project_id ?? "");
      setUserId(user.id ?? "");
    } else {
      setPageId("");
      setUserId("");
    }
  }, [user]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const form = new FormData();
      form.append('userId', userId || '68ef911fd860ee30f6103bdb');
      form.append('pageId', pageId || '806839612517191');
      form.append('message', message || 'Test post');
      if (scheduleAt) form.append('scheduleAt', scheduleAt);
      if (file) form.append('image', file, file.name);

      const resp = await fetch('/api/test/facebook/post', { method: 'POST', body: form });
      const json = await resp.json();
      setResult(JSON.stringify(json));
    } catch (err: any) {
      setResult(String(err?.message || err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">Test Facebook Post</h3>
      <form onSubmit={submit} className="space-y-2">
        <div>
          <label className="block text-sm">Message</label>
          <input value={message} onChange={(e) => setMessage(e.target.value)} className="border p-1 w-full" />
        </div>
        <div>
          <label className="block text-sm">Image</label>
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </div>
        <div>
          <label className="block text-sm">Schedule At (ISO string)</label>
          <input value={scheduleAt} onChange={(e) => setScheduleAt(e.target.value)} placeholder="2026-02-10T15:30:00Z" className="border p-1 w-full" />
        </div>
        <div>
          <button disabled={loading} className="px-3 py-1 bg-blue-600 text-white rounded">{loading ? 'Posting...' : 'Post'}</button>
        </div>
      </form>
      {result && (
        <pre className="mt-4 p-2 bg-gray-100">{result}</pre>
      )}
    </div>
  );
}
