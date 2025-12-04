import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { Eye, EyeOff, GraduationCap, ArrowRight, Lock } from "lucide-react";
import { DotMap, Button, Input, cn } from "../../components/ui/TravelConnectSignIn";

const ChangePassword = () => {
    const navigate = useNavigate();
    const { changePassword } = useAuth();

    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (formData.newPassword !== formData.confirmPassword) {
            setError("New passwords don't match");
            return;
        }

        if (formData.newPassword.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        try {
            setLoading(true);
            await changePassword(formData.oldPassword, formData.newPassword);
            setSuccess("Password changed successfully!");
            setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
            setTimeout(() => navigate(-1), 2000);
        } catch (err) {
            setError(err.message || "Failed to change password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="flex w-full h-full items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-4xl overflow-hidden rounded-2xl flex bg-white shadow-xl h-[700px]"
                >
                    {/* Left side - Map */}
                    <div className="hidden md:block w-1/2 h-full relative overflow-hidden border-r border-gray-100">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100">
                            <DotMap />

                            {/* Logo and text overlay */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10">
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6, duration: 0.5 }}
                                    className="mb-6"
                                >
                                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-200 rotate-3">
                                        <Lock className="text-white h-8 w-8" />
                                    </div>
                                </motion.div>
                                <motion.h2
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7, duration: 0.5 }}
                                    className="text-3xl font-bold mb-2 text-center text-slate-800"
                                >
                                    Secure Your Account
                                </motion.h2>
                                <motion.p
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8, duration: 0.5 }}
                                    className="text-sm text-center text-slate-600 max-w-xs leading-relaxed"
                                >
                                    Update your password regularly to keep your account safe and secure.
                                </motion.p>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Form */}
                    <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center bg-white">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h1 className="text-2xl md:text-3xl font-bold mb-1 text-gray-800">Change Password</h1>
                            <p className="text-gray-500 mb-8">Enter your current and new password</p>

                            <form className="space-y-5" onSubmit={handleSubmit}>
                                {/* Current Password */}
                                <div>
                                    <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                        Current Password <span className="text-blue-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Input
                                            id="oldPassword"
                                            name="oldPassword"
                                            type={showOldPassword ? "text" : "password"}
                                            value={formData.oldPassword}
                                            onChange={handleChange}
                                            placeholder="Enter current password"
                                            required
                                            className="bg-gray-50 border-gray-200 placeholder:text-gray-400 text-gray-800 w-full pr-10 focus:border-blue-500 focus:ring-blue-500"
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                                            onClick={() => setShowOldPassword(!showOldPassword)}
                                        >
                                            {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                {/* New Password */}
                                <div>
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                        New Password <span className="text-blue-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Input
                                            id="newPassword"
                                            name="newPassword"
                                            type={showNewPassword ? "text" : "password"}
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                            placeholder="Enter new password"
                                            required
                                            className="bg-gray-50 border-gray-200 placeholder:text-gray-400 text-gray-800 w-full pr-10 focus:border-blue-500 focus:ring-blue-500"
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                        >
                                            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                        Confirm New Password <span className="text-blue-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Confirm new password"
                                            required
                                            className="bg-gray-50 border-gray-200 placeholder:text-gray-400 text-gray-800 w-full pr-10 focus:border-blue-500 focus:ring-blue-500"
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                {error && (
                                    <div className="text-red-500 text-sm bg-red-50 p-2 rounded border border-red-100">
                                        {error}
                                    </div>
                                )}

                                {success && (
                                    <div className="text-green-600 text-sm bg-green-50 p-2 rounded border border-green-100">
                                        {success}
                                    </div>
                                )}

                                <motion.div
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.98 }}
                                    onHoverStart={() => setIsHovered(true)}
                                    onHoverEnd={() => setIsHovered(false)}
                                    className="pt-2"
                                >
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className={cn(
                                            "w-full bg-gradient-to-r relative overflow-hidden from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-2 rounded-lg transition-all duration-300",
                                            isHovered ? "shadow-lg shadow-blue-200" : ""
                                        )}
                                    >
                                        <span className="flex items-center justify-center">
                                            {loading ? "Updating..." : "Update Password"}
                                            {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                                        </span>
                                        {isHovered && !loading && (
                                            <motion.span
                                                initial={{ left: "-100%" }}
                                                animate={{ left: "100%" }}
                                                transition={{ duration: 1, ease: "easeInOut" }}
                                                className="absolute top-0 bottom-0 left-0 w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                                style={{ filter: "blur(8px)" }}
                                            />
                                        )}
                                    </Button>
                                </motion.div>

                                <div className="text-center mt-6">
                                    <button
                                        type="button"
                                        onClick={() => navigate(-1)}
                                        className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                                    >
                                        Cancel and go back
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ChangePassword;
