import React from "react";

const InputField = ({ label, name, type = "text", register, error, defaultValue, isTextArea = false }) => {
  return (
    <div className="flex flex-col gap-2 w-full md:w-1/4">
      <label className="text-xs text-gray-500">{label}</label>
      {isTextArea ? (
        <textarea
          {...register(name)}
          defaultValue={defaultValue}
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full h-24" // Added h-24 for height
        ></textarea>
      ) : (
        <input
          type={type}
          {...register(name)}
          defaultValue={defaultValue}
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
        />
      )}
      {error && <p className="text-xs text-red-400">{error.message}</p>}
    </div>
  );
};

export default InputField;
