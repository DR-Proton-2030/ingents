"use client";
import React, { Suspense } from "react";
import TeamChatScreen from "@/components/screens/chat/teamChat/TeamChatScreen";

const TeamChatPage = () => {
    return (
        <div className="p-6 h-full">
            <Suspense fallback={<div>Loading chat...</div>}>
                <TeamChatScreen />
            </Suspense>
        </div>
    );
};

export default TeamChatPage;
