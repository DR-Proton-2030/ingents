"use client";
import React, { Suspense } from "react";
import TeamChatScreen from "@/components/screens/chat/teamChat/TeamChatScreen";
import Layout from "@/screens/layout/Layout";

const TeamChatPage = () => {
    return (
        <Layout showSidebar={true}>
            <div className="h-full">
                <Suspense fallback={<div>Loading chat...</div>}>
                    <TeamChatScreen />
                </Suspense>
            </div>
        </Layout>
    );
};

export default TeamChatPage;
