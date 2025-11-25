import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { apiClient } from "../../api/client";
import { User, Mail, Phone, MapPin, Calendar, Droplet, Save, Shield } from "lucide-react";

export default function AdminProfile() {
  const { updateUserInContext } = useAuth();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiClient.get("/api/profile", { auth: true });
        setForm(res.user);
      } catch (err) {
        console.error("load profile:", err);
      }
    };
    load();
  }, []);

  const change = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true);
    setMsg("");
    try {
      // API expects subjects as array for faculty; admin doesn't use subjects but backend handles it.
      const payload = {
        name: form.name,
        phone: form.phone,
        address: form.address,
        birthday: form.birthday,
        sex: form.sex,
        bloodType: form.bloodType,
        // admin typically won't send subjects
      };
      const res = await apiClient.put("/api/profile", payload, { auth: true });
      setMsg("Profile updated successfully");
      if (updateUserInContext) updateUserInContext(res.user);
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      console.error(err);
      setMsg(err?.data?.error || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (!form) return <div className="p-8 text-center text-gray-500">Loading profile...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
        <p className="text-gray-500">Manage your personal information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Sidebar - Profile Card */}
        <div className="col-span-1 md:col-span-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
            <div className="h-32 bg-gradient-to-r from-slate-700 to-slate-900 shrink-0"></div>
            <div className="px-6 pb-8 pt-20 relative flex-1">
              <div className="w-24 h-24 rounded-full bg-white p-1 absolute -top-12 left-1/2 transform -translate-x-1/2 shadow-md">
                <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center text-3xl font-bold text-slate-700">
                  {form.name ? form.name.split(" ").map(n => n[0]).slice(0, 2).join("") : "A"}
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800">{form.name}</h3>
                <p className="text-slate-600 font-medium text-sm">{form.email}</p>
                <div className="mt-4 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                  <Shield size={12} />
                  Administrator
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 text-gray-600 text-sm">
                  <Mail size={16} className="text-gray-400" />
                  <span className="truncate">{form.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 text-sm">
                  <Phone size={16} className="text-gray-400" />
                  <span>{form.phone || "No phone added"}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 text-sm">
                  <MapPin size={16} className="text-gray-400" />
                  <span className="truncate">{form.address || "No address added"}</span>
                </div>
              </div>
            </div>

            <div className="px-6 pb-6 pt-6 border-t border-gray-100">
              <Link
                to="/change-password"
                className="block w-full py-2 px-4 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl text-center hover:bg-gray-50 transition"
              >
                Change Password
              </Link>
            </div>
          </div>
        </div>

        {/* Right Content - Edit Form */}
        <div className="col-span-1 md:col-span-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Personal Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={form.name || ""}
                    onChange={(e) => change("name", e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 outline-none transition"
                    placeholder="Your full name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={form.email || ""}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={form.phone || ""}
                    onChange={(e) => change("phone", e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 outline-none transition"
                    placeholder="+91 98XX5X32XX"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Gender</label>
                <select
                  value={form.sex || ""}
                  onChange={(e) => change("sex", e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 outline-none transition appearance-none"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Address</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-3 text-gray-400" />
                  <textarea
                    value={form.address || ""}
                    onChange={(e) => change("address", e.target.value)}
                    rows="2"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 outline-none transition resize-none"
                    placeholder="Your full address"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                <div className="relative">
                  <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    value={form.birthday || ""}
                    onChange={(e) => change("birthday", e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 outline-none transition"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Blood Type</label>
                <div className="relative">
                  <Droplet size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={form.bloodType || ""}
                    onChange={(e) => change("bloodType", e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 outline-none transition"
                    placeholder="e.g. O+"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-end gap-4 pt-6 border-t border-gray-100">
              {msg && <span className={`text-sm ${msg.includes("failed") ? "text-red-500" : "text-green-600"}`}>{msg}</span>}
              <button
                onClick={save}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-medium transition disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-slate-200"
              >
                <Save size={18} />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}
