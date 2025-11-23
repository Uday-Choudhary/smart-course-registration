import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { apiClient } from "../../api/client";

export default function AdminProfile() {
  const { user, updateUserInContext } = useAuth();
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
      setMsg("Profile updated");
      if (updateUserInContext) updateUserInContext(res.user);
    } catch (err) {
      console.error(err);
      setMsg(err?.data?.error || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (!form) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex gap-6">
          {/* Left card - avatar + summary */}
          <div className="w-1/3 bg-white rounded-xl shadow px-6 py-8">
            <div className="flex flex-col items-center gap-4">
              <div className="w-28 h-28 rounded-full bg-indigo-100 flex items-center justify-center text-3xl font-bold text-indigo-700">
                {form.name ? form.name.split(" ").map(n=>n[0]).slice(0,2).join("") : "U"}
              </div>
              <h3 className="text-lg font-semibold">{form.name}</h3>
              <p className="text-sm text-slate-500">{form.email}</p>
              <p className="text-xs text-slate-400 mt-2">Role: {form.role}</p>
            </div>
          </div>

          {/* Right card - editable fields */}
          <div className="flex-1 bg-white rounded-xl shadow px-6 py-8">
            <h2 className="text-xl font-semibold mb-4">My Profile</h2>

            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <div className="text-xs text-slate-500">Full name</div>
                <input
                  value={form.name || ""}
                  onChange={(e) => change("name", e.target.value)}
                  className="mt-1 w-full p-2 border rounded bg-slate-50"
                />
              </label>

              <label className="block">
                <div className="text-xs text-slate-500">Email</div>
                <input value={form.email || ""} disabled className="mt-1 w-full p-2 border rounded bg-slate-100 text-slate-500" />
              </label>

              <label className="block">
                <div className="text-xs text-slate-500">Phone</div>
                <input value={form.phone || ""} onChange={(e)=>change("phone", e.target.value)} className="mt-1 w-full p-2 border rounded" />
              </label>

              <label className="block">
                <div className="text-xs text-slate-500">Sex</div>
                <select value={form.sex || ""} onChange={(e)=>change("sex", e.target.value)} className="mt-1 w-full p-2 border rounded">
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <label className="block col-span-2">
                <div className="text-xs text-slate-500">Address</div>
                <input value={form.address||""} onChange={(e)=>change("address", e.target.value)} className="mt-1 w-full p-2 border rounded" />
              </label>

              <label className="block">
                <div className="text-xs text-slate-500">Birthday</div>
                <input type="date" value={form.birthday||""} onChange={(e)=>change("birthday", e.target.value)} className="mt-1 w-full p-2 border rounded" />
              </label>

              <label className="block">
                <div className="text-xs text-slate-500">Blood Type</div>
                <input value={form.bloodType||""} onChange={(e)=>change("bloodType", e.target.value)} className="mt-1 w-full p-2 border rounded" />
              </label>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button onClick={save} disabled={saving} className="px-4 py-2 bg-indigo-600 text-white rounded shadow">
                {saving ? "Saving..." : "Save changes"}
              </button>
              <span className="text-sm text-slate-500">{msg}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
