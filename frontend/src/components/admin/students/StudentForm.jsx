import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import InputField from "../common/InputField";

const schema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long!").max(20),
  email: z.string().email("Invalid email address!"),
  password: z.string().min(8, "Password must be at least 8 characters long!"),
  firstName: z.string().min(1, "First name is required!"),
  lastName: z.string().min(1, "Last name is required!"),
  phone: z.string().min(1, "Phone is required!"),
  address: z.string().min(1, "Address is required!"),
  bloodType: z.string().min(1, "Blood Type is required!"),
  birthday: z.string().min(1, "Birthday is required!"),
  sex: z.enum(["male", "female"], { required_error: "Sex is required!" }),
  img: z.any().optional(),
});

const StudentForm = ({ type, data }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (formData) => {
    console.log("Student Form Data:", formData);
  };

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new student" : "Update student"}
      </h1>

      {/* Authentication Info */}
      <span className="text-xs text-gray-400 font-medium">Authentication Information</span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField label="Username" name="username" defaultValue={data?.username} register={register} error={errors?.username} />
        <InputField label="Email" name="email" defaultValue={data?.email} register={register} error={errors?.email} />
        <InputField label="Password" name="password" type="password" defaultValue={data?.password} register={register} error={errors?.password} />
      </div>

      {/* Personal Info */}
      <span className="text-xs text-gray-400 font-medium">Personal Information</span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField label="First Name" name="firstName" defaultValue={data?.firstName} register={register} error={errors?.firstName} />
        <InputField label="Last Name" name="lastName" defaultValue={data?.lastName} register={register} error={errors?.lastName} />
        <InputField label="Phone" name="phone" defaultValue={data?.phone} register={register} error={errors?.phone} />
        <InputField label="Address" name="address" defaultValue={data?.address} register={register} error={errors?.address} />
        <InputField label="Blood Type" name="bloodType" defaultValue={data?.bloodType} register={register} error={errors?.bloodType} />
        <InputField label="Birthday" name="birthday" type="date" defaultValue={data?.birthday} register={register} error={errors?.birthday} />

        {/* Sex */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Sex</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("sex")}
            defaultValue={data?.sex || ""}
          >
            <option value="">Select Sex</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.sex && <p className="text-xs text-red-400">{errors.sex.message}</p>}
        </div>

        {/* Image Upload */}
        <div className="flex flex-col gap-2 w-full md:w-1/4 justify-center">
          <label htmlFor="img" className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer">
            <img src="/upload.png" alt="" width={28} height={28} />
            <span>Upload a photo</span>
          </label>
          <input type="file" id="img" {...register("img")} className="hidden" />
          {errors.img && <p className="text-xs text-red-400">{errors.img.message}</p>}
        </div>
      </div>

      <button className="bg-blue-400 text-white p-2 rounded-md hover:bg-blue-500">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default StudentForm;
