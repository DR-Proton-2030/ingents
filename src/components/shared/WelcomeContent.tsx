import React from "react";
import { Mic, MessageSquare } from "lucide-react";

export default function WelcomeContent() {
  const features = [
    {
      icon: "💬",
      title: "Natural Language Conversations",
      description: "Chat naturally with AI",
    },
    {
      icon: "🧠",
      title: "Knowledge Base",
      description: "Access vast information",
    },
    {
      icon: "⭐",
      title: "Personalized Recommendations",
      description: "Get tailored suggestions",
    },
    {
      icon: "🔗",
      title: "Seamless Integrations",
      description: "Connect with your tools",
    },
  ];

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          {/* Logo */}
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-green-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-2xl">V</span>
          </div>

          {/* Welcome Text */}
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Welcome to Versacc!
          </h1>

          <p className="text-gray-600 text-sm leading-relaxed mb-8">
            Versacc is your personal AI-powered assistant, ready to help you
            navigate your day and provide valuable insights. We&apos;re here to
            make your life easier. Let&apos;s get started on this exciting
            journey together!
          </p>

          {/* Features */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 text-left"
              >
                <span className="text-lg">{feature.icon}</span>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-gray-500">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Input */}
      <div className="p-6 border-t border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Tell me what do you want?"
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            <button className="p-1 text-gray-400 hover:text-gray-600">
              <Mic className="w-4 h-4" />
            </button>
            <button className="p-1.5 bg-teal-500 text-white rounded-md hover:bg-teal-600">
              <MessageSquare className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
