import Image from "next/image";
import Link from "next/link";
import CaseDecrypt from '../components/case-decrypt';

export default function Home() {
  return (
    <div className="font-['Orbitron'] flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 relative">
      <main className="flex flex-col gap-[32px] items-center text-center max-w-4xl matrix-float">
        <div className="text-center matrix-glass p-8 rounded-2xl border border-cyan-500/20 shadow-2xl backdrop-blur-lg">
          <h1 className="text-5xl font-bold text-cyan-200/70 mb-4 font-['Orbitron'] tracking-wider">
            ForensiAI
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto rounded-full mb-8 shadow-[0_0_10px_rgba(0,255,255,0.5)]"></div>
          <p className="text-slate-200 text-lg mb-8 font-['Space_Mono'] tracking-wide">
            Advanced forensic analysis powered by AI
          </p>
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            className="rounded-full border border-cyan-500/30 transition-all duration-300 flex items-center justify-center bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 hover:from-cyan-500/30 hover:to-blue-500/30 hover:text-cyan-200 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto shadow-lg hover:shadow-[0_0_25px_rgba(0,255,255,0.4)] font-['Orbitron'] matrix-glow-hover"
            href="/login"
          >
            Sign In
          </Link>
          <Link
            className="rounded-full border border-emerald-500/30 transition-all duration-300 flex items-center justify-center bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 hover:from-emerald-500/30 hover:to-green-500/30 hover:text-emerald-200 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto shadow-lg hover:shadow-[0_0_25px_rgba(0,255,136,0.4)] font-['Orbitron'] matrix-glow-hover"
            href="/signup"
          >
            Create Account
          </Link>
        </div>

        <div className="mt-8 text-center matrix-glass p-6 rounded-xl border border-cyan-500/10 backdrop-blur-md">
          <p className="text-sm text-slate-300 mb-4 font-['Space_Mono'] tracking-wide">
            Demo Navigation:
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/login"
              className="text-cyan-300 hover:text-cyan-200 underline font-['Space_Mono'] transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]"
            >
              Login Page
            </Link>
            <Link
              href="/signup"
              className="text-cyan-300 hover:text-cyan-200 underline font-['Space_Mono'] transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]"
            >
              Signup Page
            </Link>
            <Link
              href="/dashboard"
              className="text-emerald-300 hover:text-emerald-200 underline font-medium font-['Space_Mono'] transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(0,255,136,0.6)]"
            >
              Dashboard (Demo)
            </Link>
          </div>
        </div>
      </main>

      <footer className="flex gap-[24px] flex-wrap items-center justify-center text-slate-300 font-['Space_Mono']">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4 hover:text-cyan-300 transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]"
          href="https://nextjs.org/learn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
            className="filter brightness-0 invert opacity-70"
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4 hover:text-cyan-300 transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]"
          href="https://vercel.com/templates?framework=next.js"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
            className="filter brightness-0 invert opacity-70"
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4 hover:text-cyan-300 transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]"
          href="https://nextjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
            className="filter brightness-0 invert opacity-70"
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
