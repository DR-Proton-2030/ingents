"use client";
import React from "react";
import { MessageSquare, UserPlus, Calendar, ExternalLink, Clock } from "lucide-react";

interface CommunityEngagementProps {
  comments: any[];
  subscribers: any[];
  schedule: any[];
}

const CommunityEngagement = ({ comments = [], subscribers = [], schedule = [] }: CommunityEngagementProps) => {
  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Recent Comments */}
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent Comments</h3>
              <p className="text-xs text-gray-400 font-medium mt-1">Direct feedback from your audience</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-2xl">
               <MessageSquare className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          
          <div className="space-y-6">
            {comments.length > 0 ? (
              comments.map((comment, idx) => (
                <div key={idx} className="flex gap-4 p-5 rounded-3xl bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-slate-100 group">
                  <img 
                    src={comment.authorProfileImageUrl} 
                    className="w-12 h-12 rounded-full border-2 border-white shadow-sm" 
                    alt="" 
                  />
                  <div className="flex-grow">
                     <div className="flex justify-between items-start mb-1">
                        <h4 className="text-sm font-black text-slate-900">{comment.author || comment.authorDisplayName}</h4>
                        <span className="text-[10px] font-bold text-slate-400">{new Date(comment.publishedAt).toLocaleDateString()}</span>
                     </div>
                     <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{comment.text}</p>
                     <div className="mt-3 flex items-center gap-3">
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-blue-50 border border-blue-100">
                           <span className="text-[10px] font-black text-blue-600 uppercase">Reply Center</span>
                           {comment.replyCount > 0 && (
                             <span className="text-[10px] bg-blue-500 text-white px-1.5 rounded-md font-black min-w-[18px] text-center">
                               {comment.replyCount}
                             </span>
                           )}
                        </div>
                        <div className="w-1 h-1 rounded-full bg-slate-200" />
                        <a 
                          href={comment.videoId ? `https://www.youtube.com/watch?v=${comment.videoId}` : '#'} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[10px] font-bold text-slate-400 hover:text-blue-500 transition-colors truncate max-w-[150px]"
                        >
                          On: {comment.videoTitle || comment.videoId || 'Your video'}
                        </a>
                     </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                 <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-200">
                    <MessageSquare className="w-8 h-8" />
                 </div>
                 <h4 className="text-sm font-black text-slate-900 mb-1">No comments yet</h4>
                 <p className="text-xs font-medium text-gray-400 max-w-xs">Engagement data will appear as soon as your viewers start commenting.</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Subscribers */}
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent New Subscribers</h3>
              <p className="text-xs text-gray-400 font-medium mt-1">Meet your latest community members</p>
            </div>
            <div className="p-3 bg-red-50 rounded-2xl">
               <UserPlus className="w-5 h-5 text-red-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subscribers.length > 0 ? (
              subscribers.map((sub, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 rounded-[28px] bg-slate-50/50 hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100">
                   <img 
                    src={sub.thumbnails?.default?.url} 
                    className="w-10 h-10 rounded-full border border-white" 
                    alt="" 
                  />
                  <div className="flex-grow min-w-0">
                     <h4 className="text-xs font-black text-slate-900 truncate">{sub.title}</h4>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{Number(sub.subscriberCount).toLocaleString()} Subs</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-1 md:col-span-2 flex flex-col items-center justify-center py-16 text-center">
                 <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-200">
                    <UserPlus className="w-8 h-8" />
                 </div>
                 <h4 className="text-sm font-black text-slate-900 mb-1">Waiting for new members</h4>
                 <p className="text-xs font-medium text-gray-400 max-w-xs">Your new subscribers (with public settings) will show up here.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Post Schedule */}
      <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
        <div className="flex justify-between items-start mb-10">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Content Calendar</h3>
            <p className="text-xs text-gray-400 font-medium mt-1">Your upcoming releases and scheduled posts</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-2xl">
             <Calendar className="w-5 h-5 text-purple-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {schedule.length > 0 ? (
            schedule.map((item, idx) => (
              <div key={idx} className="p-6 rounded-[35px] bg-slate-50/50 border border-slate-100/50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4">
                   <Clock className="w-4 h-4 text-purple-300 group-hover:text-purple-500 transition-colors" />
                </div>
                <div className="flex flex-col h-full">
                   <div className="mb-4">
                      <span className="px-3 py-1 rounded-full bg-purple-100 text-[10px] font-black text-purple-600 uppercase tracking-widest">Scheduled</span>
                   </div>
                   <h4 className="text-sm font-black text-slate-900 mb-2 line-clamp-1">{item.title}</h4>
                   <p className="text-[11px] text-slate-500 font-medium mb-6 line-clamp-2">{item.description}</p>
                   <div className="mt-auto pt-4 border-t border-slate-200/50 flex justify-between items-center">
                      <div>
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Release Date</p>
                         <p className="text-xs font-black text-slate-900">{new Date(item.scheduledAt).toLocaleDateString()}</p>
                      </div>
                      <button className="p-2 rounded-xl bg-white shadow-sm border border-slate-100 text-slate-400 hover:text-purple-600 transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                   </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-1 md:col-span-3 flex flex-col items-center justify-center py-16 text-center">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-200">
                  <Calendar className="w-8 h-8" />
               </div>
               <h4 className="text-sm font-black text-slate-900 mb-1">Clear Horizon</h4>
               <p className="text-xs font-medium text-gray-400 max-w-xs">No upcoming scheduled posts. Time to plan your next viral hit!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityEngagement;
