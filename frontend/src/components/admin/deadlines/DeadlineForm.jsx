import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../../admin/common/InputField";
import { getAllTerms } from "../../../api/terms";
import { getAllCourses } from "../../../api/courses";
import { createDeadline, updateDeadline } from "../../../api/deadlines";

// -----------------------------
// 🧩 Zod Validation Schema
// -----------------------------
const schema = z.object({
    termId: z.string().min(1, { message: "Term is required!" }),
    courseId: z.string().min(1, { message: "Course is required!" }),
    registrationOpen: z.string().min(1, { message: "Registration open date is required!" }),
    addDropStart: z.string().min(1, { message: "Add/Drop start date is required!" }),
    addDropEnd: z.string().min(1, { message: "Add/Drop end date is required!" }),
    registrationClose: z.string().min(1, { message: "Registration close date is required!" }),
    waitlistClose: z.string().min(1, { message: "Waitlist close date is required!" }),
});

// -----------------------------
// 🧩 Main Component
// -----------------------------
const DeadlineForm = ({ type, data, onClose }) => {
    const [terms, setTerms] = useState([]);
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            termId: data?.course?.term?.id?.toString() || "",
            courseId: data?.courseId?.toString() || "",
            registrationOpen: data?.registrationOpen ? new Date(data.registrationOpen).toISOString().split('T')[0] : "",
            addDropStart: data?.addDropStart ? new Date(data.addDropStart).toISOString().split('T')[0] : "",
            addDropEnd: data?.addDropEnd ? new Date(data.addDropEnd).toISOString().split('T')[0] : "",
            registrationClose: data?.registrationClose ? new Date(data.registrationClose).toISOString().split('T')[0] : "",
            waitlistClose: data?.waitlistClose ? new Date(data.waitlistClose).toISOString().split('T')[0] : "",
        },
    });

    const selectedTermId = watch("termId");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [termsData, coursesData] = await Promise.all([
                    getAllTerms(),
                    getAllCourses()
                ]);
                setTerms(termsData);
                setCourses(coursesData);
            } catch (err) {
                console.error("Failed to load form data", err);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedTermId) {
            const filtered = courses.filter(c => c.termId === parseInt(selectedTermId));
            setFilteredCourses(filtered);
        } else {
            setFilteredCourses([]);
        }
    }, [selectedTermId, courses]);

    const handleFormSubmit = handleSubmit(async (formData) => {
        setLoading(true);
        setSubmitError("");
        try {
            if (type === "create") {
                await createDeadline(formData);
                alert("Deadline created successfully!");
            } else {
                await updateDeadline(data.id, formData);
                alert("Deadline updated successfully!");
            }
            onClose();
        } catch (err) {
            console.error(err);
            setSubmitError(err.response?.data?.error || "Failed to save deadline");
        } finally {
            setLoading(false);
        }
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

            {submitError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {submitError}
                </div>
            )}

            {/* TERM & COURSE */}
            <span className="text-xs text-gray-400 font-medium">
                Academic Information
            </span>

            <div className="flex flex-wrap gap-4">
                {/* TERM SELECT */}
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Select Term</label>
                    <select
                        {...register("termId")}
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        disabled={type === "update"} // Disable term selection on update to prevent confusion or complex logic
                    >
                        <option value="">-- Select Term --</option>
                        {terms.map((term) => (
                            <option key={term.id} value={term.id}>
                                {term.semester} {term.year}
                            </option>
                        ))}
                    </select>
                    {errors.termId && (
                        <p className="text-xs text-red-400">{errors.termId.message}</p>
                    )}
                </div>

                {/* COURSE SELECT */}
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Select Course</label>
                    <select
                        {...register("courseId")}
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        disabled={!selectedTermId || type === "update"}
                    >
                        <option value="">-- Select Course --</option>
                        {filteredCourses.map((course) => (
                            <option key={course.id} value={course.id}>
                                {course.code} - {course.title}
                            </option>
                        ))}
                    </select>
                    {errors.courseId && (
                        <p className="text-xs text-red-400">{errors.courseId.message}</p>
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
                />

                <InputField
                    label="Add/Drop Start"
                    name="addDropStart"
                    type="date"
                    register={register}
                    error={errors.addDropStart}
                />

                <InputField
                    label="Add/Drop End"
                    name="addDropEnd"
                    type="date"
                    register={register}
                    error={errors.addDropEnd}
                />

                <InputField
                    label="Registration Close"
                    name="registrationClose"
                    type="date"
                    register={register}
                    error={errors.registrationClose}
                />

                <InputField
                    label="Waitlist Close"
                    name="waitlistClose"
                    type="date"
                    register={register}
                    error={errors.waitlistClose}
                />
            </div>

            {/* SUBMIT BUTTON */}
            <div className="flex justify-end gap-2">
                <button
                    type="button"
                    onClick={onClose}
                    className="p-2 rounded-md bg-gray-300 hover:bg-gray-400 text-gray-800"
                    disabled={loading}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className={`p-2 rounded-md text-white w-max ${type === "create"
                        ? "bg-blue-400 hover:bg-blue-500"
                        : "bg-green-500 hover:bg-green-600"
                        } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    {loading ? "Saving..." : type === "create" ? "Create Deadline" : "Update Deadline"}
                </button>
            </div>
        </form>
    );
};

export default DeadlineForm;
