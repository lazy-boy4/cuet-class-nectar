
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cuet-navy px-4 text-center">
      <div className="glass-card mx-auto max-w-md p-8">
        <h1 className="mb-2 text-6xl font-bold text-white">404</h1>
        <p className="mb-8 text-xl text-white/80">Oops! Page not found</p>
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
          <Link
            to="/"
            className="inline-flex items-center justify-center space-x-2 rounded-md border border-white/10 bg-white/5 px-4 py-2 text-white backdrop-blur-sm transition-all hover:bg-white/10"
          >
            <Home size={18} />
            <span>Return Home</span>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center space-x-2 rounded-md bg-blue-600 px-4 py-2 text-white transition-all hover:bg-blue-700"
          >
            <ArrowLeft size={18} />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
