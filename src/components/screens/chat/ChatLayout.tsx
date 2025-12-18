import React, { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  title?: string;
  footer?: React.ReactNode;
}>;

export const ChatLayout: React.FC<Props> = ({ children, title, footer }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-5xl flex flex-col">
        <header className="px-6 py-4 border-b border-white/5">
          <h2 className="text-sm text-white/80 font-semibold">
            {title ?? "AI Chat"}
          </h2>
        </header>

        <main className="flex-1 p-6">{children}</main>

        <footer className="px-6 py- ">{footer}</footer>
      </div>
    </div>
  );
};

export default ChatLayout;
