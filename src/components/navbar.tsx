"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";
import { ClientWrapper } from "@/components/client-wrapper";

export function Navbar() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard") || pathname?.startsWith("/cases");

  return (
    <ClientWrapper>
      <nav className="sticky top-0 z-50 w-full border-b border-cyan-500/20 bg-slate-900/80 backdrop-blur-md matrix-glass matrix-scan-line">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <Link
              href={isDashboard ? "/dashboard" : "/"}
              className="flex items-center space-x-2 matrix-glow-hover"
            >
              <h1 className="text-xl font-bold text-cyan-200/70 font-['Orbitron'] tracking-tight">
                ForensiAI
              </h1>
            </Link>

            {/* Right side - Navigation Links + Theme Toggle */}
            <div className="flex items-center space-x-6">
              {/* Navigation Links */}
              <div className="hidden md:flex items-center space-x-6">
                {isDashboard ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="text-cyan-200 hover:text-cyan-300 transition-all duration-300 font-['Space_Mono'] hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.6)] matrix-glow-hover"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        // Clear any user session data if needed
                        if (typeof window !== 'undefined') {
                          // You can add more logout logic here like clearing tokens, etc.
                          localStorage.removeItem('user_session');
                        }
                        window.location.href = "/";
                      }}
                      className="text-red-300 hover:text-red-200 transition-all duration-300 font-['Space_Mono'] hover:drop-shadow-[0_0_8px_rgba(255,68,68,0.6)] matrix-glow-hover"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="text-cyan-200 hover:text-cyan-300 transition-all duration-300 font-['Space_Mono'] hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.6)] matrix-glow-hover"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 text-cyan-300 hover:text-cyan-200 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] border border-cyan-500/30 hover:border-cyan-400 font-['Orbitron'] matrix-glow-hover"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile menu + Theme Toggle */}
              <div className="flex items-center space-x-4">
                {/* Mobile menu button (if needed) */}
                <div className="md:hidden flex items-center space-x-2">
                  {!isDashboard && (
                    <Link
                      href="/login"
                      className="text-cyan-300 hover:text-cyan-200 text-sm font-['Space_Mono'] transition-colors duration-300"
                    >
                      Sign In
                    </Link>
                  )}
                </div>
                <ModeToggle />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </ClientWrapper>
  );
}
