import { Link } from "react-router-dom";

export default function Promotion() {
    return (
      <section className="relative w-[80%] rounded-xl mx-auto bg-gradient-to-r bg-blue-400 text-white py-20 px-6 md:px-16 lg:px-24 flex flex-col lg:flex-row items-center justify-between gap-10">
        {/* Left Content */}
        <div className="max-w-2xl text-center lg:text-left">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Simplify Asset Management with <span className="text-white">AssetHive</span>
          </h2>
          <p className="text-lg md:text-xl opacity-90 mb-6">
            Track, organize, and manage your company's assets with ease. Boost efficiency, reduce loss, and gain real-time insights—all in one powerful platform.
          </p>
          <div>
            <Link to={"/join-as-hr-manager"} className="inline-flex items-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold text-lg hover:bg-opacity-90 transition-all">
              Get Started <span className="text-xl">→</span>
            </Link>
          </div>
        </div>
      </section>
    );
  }
  