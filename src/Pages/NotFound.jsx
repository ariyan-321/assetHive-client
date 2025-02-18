import { Link } from "react-router-dom";

export default function NotFound() {
    return (
      <section className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white text-center px-6">
        <h1 className="text-7xl font-bold mb-4">404</h1>
        <h2 className="text-3xl md:text-4xl font-semibold mb-6">Page Not Found</h2>
        <p className="text-lg md:text-xl opacity-90 mb-6 max-w-lg">
          Oops! The page you are looking for does not exist. It might have been moved or deleted.
        </p>
        <Link
          to={"/"} 
          className="inline-flex items-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold text-lg hover:bg-opacity-90 transition-all"
        >
          Go Home
        </Link>
      </section>
    );
  }
  