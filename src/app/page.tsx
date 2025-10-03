import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] items-center text-center max-w-4xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-800 to-blue-500 bg-clip-text text-transparent mb-4">
            ForensiAI
          </h1>
          <div className="w-16 h-1 bg-gradient-to-r from-indigo-800 to-blue-500 mx-auto rounded-full mb-8"></div>
          <p className="text-slate-600 dark:text-slate-400 text-lg mb-8">
            Advanced forensic analysis powered by AI
          </p>
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-gradient-to-r from-indigo-800 to-blue-500 text-white hover:from-indigo-900 hover:to-blue-600 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto shadow-lg hover:shadow-xl"
            href="/login"
          >
            Sign In
          </Link>
          <Link
            className="rounded-full border border-solid border-indigo-600 dark:border-indigo-400 transition-colors flex items-center justify-center hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-700 dark:hover:border-indigo-300 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto text-indigo-600 dark:text-indigo-400"
            href="/signup"
          >
            Create Account
          </Link>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Demo Navigation:
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/login"
              className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 underline"
            >
              Login Page
            </Link>
            <Link
              href="/signup"
              className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 underline"
            >
              Signup Page
            </Link>
            <Link
              href="/dashboard"
              className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 underline font-medium"
            >
              Dashboard (Demo)
            </Link>
          </div>
        </div>
      </main>

      <footer className="flex gap-[24px] flex-wrap items-center justify-center text-slate-600 dark:text-slate-400">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
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
            className="dark:invert"
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
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
            className="dark:invert"
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
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
            className="dark:invert"
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
