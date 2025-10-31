import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  useEffect(() => {
    const openMenu = document.getElementById("open-menu");
    const closeMenu = document.getElementById("close-menu");
    const navLinks = document.getElementById("mobile-navLinks");

    const openMenuHandler = () => {
      navLinks.classList.remove("-translate-x-full");
      navLinks.classList.add("translate-x-0");
    };

    const closeMenuHandler = () => {
      navLinks.classList.remove("translate-x-0");
      navLinks.classList.add("-translate-x-full");
    };

    openMenu?.addEventListener("click", openMenuHandler);
    closeMenu?.addEventListener("click", closeMenuHandler);

    return () => {
      openMenu?.removeEventListener("click", openMenuHandler);
      closeMenu?.removeEventListener("click", closeMenuHandler);
    };
  }, []);

  return (
    <section className="flex flex-col items-center text-sm bg-[url('https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/bg-with-grid.png')] bg-cover bg-center bg-no-repeat font-poppins">
      {/* Banner */}
      {/* <div className="w-full py-2.5 font-medium text-sm text-white text-center bg-gradient-to-r from-[#4F39F6] to-[#FDFEFF]">
        <p>
          <span className="px-3 py-1 rounded-md text-indigo-600 bg-white mr-2">
            Launch offer
          </span>
          Try prebuiltui today and get $50 free credits
        </p>
      </div> */}



      {/* Hero Section */}
      <main className="flex flex-col items-center max-md:px-2">
        {/* <a
          href="https://prebuiltui.com"
          className="mt-32 flex items-center gap-2 border border-indigo-200 rounded-full p-1 pr-3 text-sm font-medium text-indigo-500 bg-indigo-200/20"
        >
          <span className="bg-indigo-600 text-white text-xs px-3 py-1 rounded-full">
            NEW
          </span>
          <p className="flex items-center gap-1">
            <span>Try 7 days free trial option </span>
            <svg
              className="mt-1"
              width="6"
              height="9"
              viewBox="0 0 6 9"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m1 1 4 3.5L1 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </p>
        </a> */}

        <h1 className="text-center text-5xl leading-[68px] md:text-6xl md:leading-[80px] font-semibold max-w-4xl text-slate-900 py-20">
          Smart Course Registration System
        </h1>
        <p className="text-center text-base text-slate-700 max-w-lg mt-2">
        A dynamic platform for students, faculty, and admins to manage courses effortlessly — with smart suggestions, conflict detection, and insightful analytics.

        </p>

        <div className="flex items-center gap-4 mt-8">
          <Link 
          to="/login">
            <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95 rounded-lg px-7 h-11">
              Get started
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.166 10h11.667m0 0L9.999 4.165m5.834 5.833-5.834 5.834"
                  stroke="#fff"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </Link>

          {/* <button className="border border-slate-600 active:scale-95 hover:bg-white/10 transition text-slate-600 rounded-lg px-8 h-11">
            Pricing
          </button> */}
        </div>

        <img
          src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/dashboard-image-1.png"
          className="w-full rounded-[15px] max-w-4xl mt-16"
          alt="hero section showcase"
        />
      </main>
    </section>
  );
};

export default Home;
