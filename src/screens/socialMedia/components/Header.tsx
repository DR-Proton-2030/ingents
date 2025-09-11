/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { FiMail, FiChevronDown, FiCrop } from "react-icons/fi";
import { motion } from "framer-motion";

export default function Header({
  companies,
  selectedCompany,
  setSelectedCompany,
}: any) {
  return (
    <header className="flex justify-between items-center">
      <div className="flex items-center space-x-4">
        {/* {companies.map((company: any, index: number) => (
          <div key={company.id} className="relative">
            <motion.div
              onClick={() => setSelectedCompany(index)}
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.06 }}
              className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer shadow-sm"
              style={{
                backgroundColor: company.id === 3 ? company.bgColor : "white",
              }}
            >
              {company.logo}
            </motion.div>
            {selectedCompany === index && (
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-1 bg-purple-600 rounded-full" />
            )}
          </div>
        ))} */}
      </div>

      <div className="flex items-center space-x-6 bg-white px-4 py-2 rounded-full border border-gray-200">
        <motion.button
          whileHover={{ scale: 1.04 }}
          className="text-gray-500 hover:text-gray-800"
        >
          <FiCrop size={22} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.04 }}
          className="relative text-gray-500 hover:text-gray-800"
        >
          <FiMail size={22} />
          <span className="absolute -top-1 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            3
          </span>
        </motion.button>
        <div className="flex items-center space-x-2">
          <img
            src="https://i.pravatar.cc/150?u=a042581f4e29026701d"
            alt="User"
            className="w-9 h-9 rounded-full"
          />
          <FiChevronDown className="text-gray-400" />
        </div>
      </div>
    </header>
  );
}
