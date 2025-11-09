import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../../admin/common/InputField"; // ✅ your existing InputField path
import { termsData, coursesData } from "../../../lib/data"; // ✅ adjust path if needed

// -----------------------------
// 🧩 Zod Validation Schema
// -----------------------------
const schema = z.object({
    term: z.string().min(1, { message: "Term is required!" }),
    course: z.string().min(1, { message: "Course is required!" }),
    registrationOpen: z.string().min(1, { message: "Registration open date is required!" }),
    addDropStart: z.string().min(1, { message: "Add/Drop start date is required!" }),
    addDropEnd: z.string().min(1, { message: "Add/Drop end date is required!" }),
    registrationClose: z.string().min(1, { message: "Registration close date is required!" }),
    waitlistClose: z.string().min(1, { message: "Waitlist close date is required!" }),
});

// -----------------------------
// 🧩 Main Component
// -----------------------------
const DeadlineForm = ({ type, data, onSubmit }) => {
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
        <form
            onSubmit={handleFormSubmit}
            className="flex flex-col gap-8"
        >
            {/* FORM TITLE */}
            <h1 className="text-xl font-semibold">
                {type === "create" ? "Create New Deadline" : "Update Deadline"}
            </h1>

            {/* TERM & COURSE */}
            <span className="text-xs text-gray-400 font-medium">
                Academic Information
            </span>

            <div className="flex flex-wrap gap-4">
                {/* TERM SELECT */}
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Select Term</label>
                    <select
                        {...register("term")}
                        defaultValue={data?.term || ""}
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                    >
                        <option value="">-- Select Term --</option>
                        {termsData.map((term) => (
                            <option key={term.id} value={`${term.semester} ${term.year}`}>
                                {term.semester} {term.year}
                            </option>
                        ))}
                    </select>
                    {errors.term && (
                        <p className="text-xs text-red-400">{errors.term.message}</p>
                    )}
                </div>

                {/* COURSE SELECT */}
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Select Course</label>
                    <select
                        {...register("course")}
                        defaultValue={data?.course || ""}
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                    >
                        <option value="">-- Select Course --</option>
                        {coursesData.map((course) => (
                            <option key={course.id} value={course.courseName}>
                                {course.courseName}
                            </option>
                        ))}
                    </select>
                    {errors.course && (
                        <p className="text-xs text-red-400">{errors.course.message}</p>
                    )}
                </div>
            </div>

            {/* DEADLINE FIELDS */}
            <span className="text-xs text-gray-400 font-medium">
                Deadline Schedule
            </span>
            <div className="flex flex-wrap justify-between gap-4">
                <InputField
                    label="Registration Open"
                    name="registrationOpen"
                    type="date"
                    register={register}
                    error={errors.registrationOpen}
                    defaultValue={data?.registrationOpen}
                />

                <InputField
                    label="Add/Drop Start"
                    name="addDropStart"
                    type="date"
                    register={register}
                    error={errors.addDropStart}
                    defaultValue={data?.addDropStart}
                />

                <InputField
                    label="Add/Drop End"
                    name="addDropEnd"
                    type="date"
                    register={register}
                    error={errors.addDropEnd}
                    defaultValue={data?.addDropEnd}
                />

                <InputField
                    label="Registration Close"
                    name="registrationClose"
                    type="date"
                    register={register}
                    error={errors.registrationClose}
                    defaultValue={data?.registrationClose}
                />

                <InputField
                    label="Waitlist Close"
                    name="waitlistClose"
                    type="date"
                    register={register}
                    error={errors.waitlistClose}
                    defaultValue={data?.waitlistClose}
                />
            </div>

            {/* SUBMIT BUTTON */}
            <div className="flex justify-end">
                <button
                    type="submit"
                    className={`p-2 rounded-md text-white w-max ${type === "create"
                            ? "bg-blue-400 hover:bg-blue-500"
                            : "bg-green-500 hover:bg-green-600"
                        }`}
                >
                    {type === "create" ? "Create Deadline" : "Update Deadline"}
                </button>
            </div>
        </form>
    );
};

export default DeadlineForm;
