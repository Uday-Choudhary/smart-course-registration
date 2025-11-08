import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../students/InputField"; // Reusing InputField

const schema = z.object({
  courseName: z
    .string()
    .min(3, { message: "Course name must be at least 3 characters long!" })
    .max(50, { message: "Course name must be at most 50 characters long!" }),
  teachers: z
    .string()
    .min(1, { message: "At least one teacher is required!" }), // Assuming comma-separated for now
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long!" })
    .optional(),
});

const CourseForm = ({ type, data, onSubmit }) => {
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
    console.log("Course form data:", formData);
    // Convert teachers string to array if needed, or handle in parent
    const processedData = {
      ...formData,
      teachers: formData.teachers.split(',').map(t => t.trim()),
    };
    if (onSubmit) onSubmit(processedData);
  };

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit(handleFormSubmit)}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new course" : "Update course"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Course Name"
          name="courseName"
          register={register}
          error={errors?.courseName}
        />
        <InputField
          label="Teachers (comma-separated)"
          name="teachers"
          register={register}
          error={errors?.teachers}
        />
        <InputField
          label="Description"
          name="description"
          register={register}
          error={errors?.description}
          isTextArea={true} // Assuming InputField can handle textarea
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

export default CourseForm;