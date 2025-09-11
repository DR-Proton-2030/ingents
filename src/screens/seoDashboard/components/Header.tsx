"use client";
import { ArrowUpToLine, MoveUpRight } from "lucide-react";
import React, { useState } from "react";

interface DomainData {
  id: string;
  name: string;
  url: string;
  isLive: boolean;
  logo?: string;
  lastChecked: string;
}

export const Header = () => {
  const [connectedDomains, setConnectedDomains] = useState<DomainData[]>([
    {
      id: "1",
      name: "Kinetic.com",
      url: "https://kinetic.com",
      isLive: true,
      logo: "🚀",
      lastChecked: "2 min ago",
    },
    {
      id: "2",
      name: "MyStore.shop",
      url: "https://mystore.shop",
      isLive: false,
      logo: "🛍️",
      lastChecked: "5 min ago",
    },
  ]);

  const [selectedDomain, setSelectedDomain] = useState<DomainData>(
    connectedDomains[0]
  );
  const [showDomainModal, setShowDomainModal] = useState(false);
  const [newDomainUrl, setNewDomainUrl] = useState("");

  const handleConnectDomain = () => {
    if (newDomainUrl) {
      const newDomain: DomainData = {
        id: Date.now().toString(),
        name: new URL(newDomainUrl).hostname,
        url: newDomainUrl,
        isLive: Math.random() > 0.3, // Random live status for demo
        logo: "🌐",
        lastChecked: "Just now",
      };

      setConnectedDomains((prev) => [...prev, newDomain]);
      setNewDomainUrl("");
      setShowDomainModal(false);
    }
  };

  return (
    <>
      <div className="pt-4 mb-6 ">
        <div className="flex items-center justify-between">
          {/* Domain Selection */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setShowDomainModal(true)}
                className="flex items-center space-x-3 bg-white hover:bg-gray-200 border border-gray-200 rounded-full px-4 py-2 transition-colors"
              >
                {/* Globe Icon */}
                <div className=" rounded-full flex items-center justify-center text-lg">
                  🌐
                </div>

                {/* Selected Domain Info */}
                <div className="flex flex-col items-start">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-800 font-medium">
                      {selectedDomain.name}
                    </span>
                    <div
                      className={`w-2 h-2 rounded-full ${
                        selectedDomain.isLive ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                  </div>
                  <span className="text-xs text-gray-500">
                    {selectedDomain.isLive ? "Online" : "Offline"} •{" "}
                    {selectedDomain.lastChecked}
                  </span>
                </div>

                {/* Dropdown Arrow */}
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Domain Dropdown */}
              {showDomainModal && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                  <div className="p-4 relative">
                    <h3 className="text-gray-900 font-medium mb-3">
                      Connected Domains
                    </h3>

                    {/* Domain List */}
                    <div className="space-y-2 mb-4">
                      {connectedDomains.map((domain) => (
                        <div
                          key={domain.id}
                          onClick={() => {
                            setSelectedDomain(domain);
                            setShowDomainModal(false);
                          }}
                          className={`flex items-center space-x-3 p-3 rounded-2xl cursor-pointer transition-colors ${
                            selectedDomain.id === domain.id
                              ? "bg-gray-100"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          <span className="text-lg">{domain.logo}</span>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-800 text-sm font-medium">
                                {domain.name}
                              </span>
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  domain.isLive ? "bg-green-500" : "bg-red-500"
                                }`}
                              />
                            </div>
                            <span className="text-xs text-gray-500">
                              {domain.url}
                            </span>
                          </div>
                          {domain.isLive && (
                            <span className="text-xs text-green-600 font-medium">
                              LIVE
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Add New Domain */}
                    <div className="border-t border-gray-200 pt-4">
                      <label className="text-sm text-gray-700 mb-2 block">
                        Connect New Domain
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="url"
                          value={newDomainUrl}
                          onChange={(e) => setNewDomainUrl(e.target.value)}
                          placeholder="https://yourdomain.com"
                          className="flex-1 bg-gray-50 border border-gray-300 rounded-full px-3 py-3 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500"
                        />
                        <button
                          onClick={handleConnectDomain}
                          disabled={!newDomainUrl}
                          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                        >
                          Connect
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowDomainModal(false)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Dashboard Actions */}
          <div className="flex items-center space-x-4">
            {/* WP Admin Button */}
            <button className="flex items-center space-x-2 bg-white hover:bg-gray-200 border border-gray-200 rounded-full px-4 py-2 transition-colors">
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M21.469 6.825c.84 1.537.84 3.413 0 4.95l-3.469 6.343c-.84 1.537-2.394 2.482-4.094 2.482H9.094c-1.7 0-3.254-.945-4.094-2.482L1.531 11.775c-.84-1.537-.84-3.413 0-4.95L5 .482C5.84-1.055 7.394-2 9.094-2h4.812c1.7 0 3.254.945 4.094 2.482L21.469 6.825z" />
                </svg>
              </div>
              <span className="text-gray-800 text-sm font-medium">
                WP Admin
              </span>
              <div className="w-2 h-2 rounded-full bg-green-500" />
            </button>

            {/* External Link Icon */}
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg
                className="w-5 h-5 text-gray-500 hover:text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-6 ">
        <div className="w-[70%]">
          <label className="text-ms font-semibold text-gray-700 mb-2 block">
            Test with keywords
          </label>
          <div className="flex space-x-2">
            <input
              type="url"
              value={newDomainUrl}
              onChange={(e) => setNewDomainUrl(e.target.value)}
              placeholder="eg: Ai Development company"
              className="flex-1 bg-gray-50 border border-gray-300 rounded-full px-3 py-3 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleConnectDomain}
              disabled={!newDomainUrl}
              className="bg-purple-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-3 rounded-full text-sm font-medium transition-colors"
            >
              <MoveUpRight />
            </button>
          </div>
        </div>
        {/* Domain Stats Bar */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-gray-600">SSL Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-gray-600">CDN Enabled</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <span className="text-gray-600">SEO Score: 87/100</span>
              </div>
            </div>
            <div className="text-gray-500">
              Last crawled: {selectedDomain.lastChecked}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
