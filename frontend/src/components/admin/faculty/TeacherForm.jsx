import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../common/InputField";
import { getAllCourses } from "../../../api/courses";

const schema = z.object({
  full_name: z.string().min(1, { message: "Full name is required!" }),
  email: z.string().email({ message: "Invalid email address!" }),
  phone: z.string().min(1, { message: "Phone is required!" }),
  sex: z.enum(["male", "female"], { message: "Sex is required!" }),
  subjects: z.array(z.string()).optional(),
});

const TeacherForm = ({ type, data, onSubmit }) => {
  const [courses, setCourses] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const coursesData = await getAllCourses();
        setCourses(coursesData);
      } catch (err) {
        console.error("Error loading courses:", err);
      }
    };
    loadCourses();
  }, []);

  useEffect(() => {
    if (data) {
      setSelectedSubjects(data.subjects || []);
    }
  }, [data]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: data
      ? {
          full_name: data.full_name || "",
          email: data.email || "",
          phone: data.phone || "",
          sex: data.sex || "",
          subjects: data.subjects || [],
        }
      : {
          full_name: "",
          email: "",
          phone: "",
          sex: "",
          subjects: [],
        },
  });

  const handleSubjectChange = (courseCode, isChecked) => {
    let updatedSubjects;
    if (isChecked) {
      updatedSubjects = [...selectedSubjects, courseCode];
    } else {
      updatedSubjects = selectedSubjects.filter((s) => s !== courseCode);
    }
    setSelectedSubjects(updatedSubjects);
    setValue("subjects", updatedSubjects);
  };

  const handleFormSubmit = (formData) => {
    const submitData = {
      ...formData,
      subjects: selectedSubjects,
    };
    if (onSubmit) onSubmit(submitData);
  };

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit(handleFormSubmit)}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new faculty" : "Update faculty"}
      </h1>

      {/* ==== BASIC INFORMATION ==== */}
      <span className="text-xs text-gray-400 font-medium">Basic Information</span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Full Name"
          name="full_name"
          register={register}
          error={errors?.full_name}
        />
        <InputField
          label="Email"
          name="email"
          type="email"
          register={register}
          error={errors?.email}
        />
        <InputField
          label="Phone"
          name="phone"
          register={register}
          error={errors?.phone}
        />

        {/* ==== SEX ==== */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Sex</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("sex")}
          >
            <option value="">Select Sex</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors?.sex && (
            <p className="text-xs text-red-400">{errors.sex.message}</p>
          )}
        </div>
      </div>

      {/* ==== SUBJECTS ==== */}
      <span className="text-xs text-gray-400 font-medium">Subjects</span>
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-48 overflow-y-auto p-2 border border-gray-200 rounded-md">
          {courses.map((course) => (
            <label
              key={course.id}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
            >
              <input
                type="checkbox"
                checked={selectedSubjects.includes(course.code)}
                onChange={(e) => handleSubjectChange(course.code, e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                {course.code} - {course.title}
              </span>
            </label>
          ))}
        </div>
        {selectedSubjects.length > 0 && (
          <p className="text-xs text-gray-500">
            Selected: {selectedSubjects.join(", ")}
          </p>
        )}
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

export default TeacherForm;
