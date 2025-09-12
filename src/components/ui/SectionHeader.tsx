"use client";
import React from "react";

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ icon, title }) => {
  return (
    <div className="text-center mb-12">
      <div className="flex justify-start items-center mb-4">
        {icon}
        <h1 className="text-2xl font ml-2">{title}</h1>
      </div>
    </div>
  );
};

export default SectionHeader;
