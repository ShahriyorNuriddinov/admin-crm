import React from "react";

const Input = ({ label, setState, type = "text", state }) => {
  return (
    <input
      value={state}
      type={type}
      placeholder={label}
      onChange={(e) => setState(e.target.value)}
      className="bg-white/40 text-foreground placeholder:text-gray-500 flex h-9 w-full rounded-md px-3 py-2 border border-white/30 focus-visible:ring-foreground"
    />
  );
};

export default Input;
