import { getDictionary } from "@/lib/dictionary";

export default async function Home({ params } : { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  const dict = await getDictionary(resolvedParams.lang as 'en' | 'cs');

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden pt-32">
      <div className="glass relative z-10 w-full max-w-2xl p-10 md:p-16 rounded-4xl flex flex-col items-center text-center space-y-8">
        <span className="bg-secondary text-secondary-foreground text-sm font-medium px-4 py-1.5 rounded-full">
          {dict.home.badge}
        </span>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          {dict.home.title}
        </h1>

        <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
          {dict.home.description}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
          <button className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-medium transition-transform hover:-translate-y-0.5">
            {dict.home.waitlistBtn}
          </button>
          <button className="bg-transparent border border-border px-8 py-3 rounded-xl font-medium transition-colors hover:bg-secondary/50">
            {dict.home.manifestoBtn}
          </button>
        </div>
      </div>
    </main>
  );
}
