import { getGreeting, siteConfig } from "@/lib/site";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 bg-zinc-50 px-6 text-center font-sans dark:bg-black">
      <span className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium tracking-wide text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        Foundation online
      </span>
      <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
        {getGreeting()}
      </h1>
      <p className="max-w-md text-zinc-600 dark:text-zinc-400">
        {siteConfig.tagline}
      </p>
      <p className="text-sm text-zinc-500 dark:text-zinc-500">
        Next.js + TypeScript + Tailwind. CI and deploy are wired up — start
        building the product in <code className="font-mono">src/</code>.
      </p>
    </main>
  );
}
