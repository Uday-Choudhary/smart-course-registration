import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../students/InputField"; // Reusing InputField

const schema = z.object({
  sectionName: z
    .string()
    .min(3, { message: "Section name must be at least 3 characters long!" })
    .max(50, { message: "Section name must be at most 50 characters long!" }),
  capacity: z.preprocess(
    (val) => Number(val), // Convert string to number
    z.number({ invalid_type_error: "Capacity must be a number!" })
      .min(1, { message: "Capacity must be at least 1!" })
      .max(100, { message: "Capacity cannot exceed 100!" })
  ),
  grade: z.preprocess(
    (val) => Number(val), // Convert string to number
    z.number({ invalid_type_error: "Grade must be a number!" })
      .min(1, { message: "Grade must be at least 1!" })
      .max(12, { message: "Grade cannot exceed 12!" })
  ),
  supervisor: z
    .string()
    .min(3, { message: "Supervisor name must be at least 3 characters long!" }),
});

const SectionForm = ({ type, data, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: data || {},
  });

  // Reset form when data changes for update operations
  React.useEffect(() => {
    if (data) {
      reset(data);
    } else {
      reset({});
    }
  }, [data, reset]);

  const handleFormSubmit = (formData) => {
    console.log("Section form data:", formData);
    if (onSubmit) onSubmit(formData);
  };

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit(handleFormSubmit)}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new section" : "Update section"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Section Name"
          name="sectionName"
          register={register}
          error={errors?.sectionName}
        />
        <InputField
          label="Capacity"
          name="capacity"
          type="number"
          register={register}
          error={errors?.capacity}
        />
        <InputField
          label="Grade"
          name="grade"
          type="number"
          register={register}
          error={errors?.grade}
        />
        <InputField
          label="Supervisor"
          name="supervisor"
          register={register}
          error={errors?.supervisor}
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
      >
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default SectionForm;