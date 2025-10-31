import React from "react";

const LoginPage = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: perform login
  };

  return (
    <>
      <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
            
                * {
                    font-family: 'Poppins', sans-serif;
                }
            `}</style>

      {/* Outer container centers the card vertically & horizontally */}
      <div className="min-h-screen flex items-center justify-center bg-black p-6">
        <div className="w-full max-w-md rounded-xl px-6 py-8 border border-slate-700 bg-slate-800 text-white text-sm">
          <h2 className="text-2xl font-semibold text-center">Sign In</h2>
          <p className="text-slate-300 mt-1 text-center">Login to your account</p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block mb-1 font-medium text-slate-300"
              >
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                className="w-full p-2 mb-0 bg-slate-900 border border-slate-700 rounded-md focus:outline-none focus:ring-1 transition focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-1 font-medium text-slate-300"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                className="w-full p-2 mb-0 bg-slate-900 border border-slate-700 rounded-md focus:outline-none focus:ring-1 transition focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Role Dropdown */}
            <div>
              <label htmlFor="role" className="block mb-1 font-medium text-slate-300">
                Role
              </label>
              <select
                id="role"
                name="role"
                className="w-full p-2 bg-slate-900 border border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                defaultValue=""
              >
                <option value="" disabled>
                  Select Role
                </option>
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="text-right">
              <a
                href="#"
                className="font-medium text-indigo-400 hover:text-indigo-300 text-sm"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full mt-2 px-4 py-2.5 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
