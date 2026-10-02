import React from "react";

const authLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="w-full mx-auto">{children}</div>;
};

export default authLayout;
