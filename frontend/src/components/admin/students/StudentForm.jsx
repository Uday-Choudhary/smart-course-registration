import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import InputField from "../common/InputField";

const schema = z.object({
  full_name: z.string().min(1, "Full name is required!"),
  email: z.string().email("Invalid email address!"),
  phone: z.string().min(1, "Phone is required!"),
  address: z.string().optional(),
  bloodType: z.string().optional(),
  birthday: z.string().optional(),
  sex: z.enum(["male", "female"], { required_error: "Sex is required!" }),
});

const StudentForm = ({ type, data, onSubmit: onSubmitProp }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: data
      ? {
          full_name: data.full_name || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          bloodType: data.bloodType || "",
          birthday: data.birthday || "",
          sex: data.sex || "",
        }
      : {
          full_name: "",
          email: "",
          phone: "",
          address: "",
          bloodType: "",
          birthday: "",
          sex: "",
        },
  });

  const onSubmit = (formData) => {
    onSubmitProp?.(formData);
  };

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new student" : "Update student"}
      </h1>

      {/* Personal & Contact Info */}
      <span className="text-xs text-gray-400 font-medium">Student Information</span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField label="Full Name" name="full_name" defaultValue={data?.full_name} register={register} error={errors?.full_name} />
        <InputField label="Email" name="email" type="email" defaultValue={data?.email} register={register} error={errors?.email} />
        <InputField label="Phone" name="phone" defaultValue={data?.phone} register={register} error={errors?.phone} />
        <InputField label="Address" name="address" defaultValue={data?.address} register={register} error={errors?.address} />
        <InputField label="Blood Type" name="bloodType" defaultValue={data?.bloodType} register={register} error={errors?.bloodType} />
        <InputField label="Birthday" name="birthday" type="date" defaultValue={data?.birthday} register={register} error={errors?.birthday} />

        {/* Sex */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Sex</label>
          <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register("sex")} defaultValue={data?.sex || ""}>
            <option value="">Select Sex</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors?.sex && <p className="text-xs text-red-400">{errors.sex.message}</p>}
        </div>
      </div>

      <button type="submit" className="bg-blue-400 text-white p-2 rounded-md hover:bg-blue-500">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default StudentForm;
