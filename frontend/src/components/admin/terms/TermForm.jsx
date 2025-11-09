import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../../admin/common/InputField"; // ✅ use your existing input field

// 🧩 Schema validation using Zod
const schema = z.object({
  year: z
    .string()
    .min(4, { message: "Year is required and must be at least 4 digits" })
    .max(4, { message: "Year must be 4 digits" }),
  semester: z.string().min(1, { message: "Semester is required!" }),
});

// 🧩 Form Component
const TermForm = ({ type, data, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: data || {},
  });

  const handleFormSubmit = handleSubmit((formData) => {
    onSubmit(formData);
  });

  return (
    <form onSubmit={handleFormSubmit} className="flex flex-col gap-8">
      {/* Title */}
      <h1 className="text-xl font-semibold text-gray-800">
        {type === "create" ? "Add New Term" : "Update Term"}
      </h1>

      {/* Academic Info */}
      <span className="text-xs text-gray-400 font-medium">
        Academic Term Information
      </span>

      <div className="flex flex-wrap justify-between gap-4">
        <InputField
          label="Year"
          name="year"
          register={register}
          error={errors.year}
          defaultValue={data?.year}
          type="number"
        />

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Semester</label>
          <select
            {...register("semester")}
            defaultValue={data?.semester || ""}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          >
            <option value="">-- Select Semester --</option>
            <option value="Spring">Spring</option>
            <option value="Summer">Summer</option>
            <option value="Fall">Fall</option>
            <option value="Winter">Winter</option>
          </select>
          {errors.semester && (
            <p className="text-xs text-red-400">{errors.semester.message}</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className={`p-2 rounded-md text-white w-max ${type === "create"
              ? "bg-blue-400 hover:bg-blue-500"
              : "bg-green-500 hover:bg-green-600"
            }`}
        >
          {type === "create" ? "Create Term" : "Update Term"}
        </button>
      </div>
    </form>
  );
};

export default TermForm;
