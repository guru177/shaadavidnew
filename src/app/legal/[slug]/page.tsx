import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getLegalPage, getLegalPages } from "@/lib/legal";
import { LEGAL_NAV, isLegalSlug } from "@/types/legal";

export async function generateStaticParams() {
  return LEGAL_NAV.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getLegalPage(slug);
  if (!page) return { title: "Legal | Shaa David" };
  return {
    title: `${page.title} | Shaa David's Academy`,
    description: `${page.title} for Shaa David's Academy.`,
  };
}

function formatDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function LegalPageView({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!isLegalSlug(slug)) notFound();

  const page = getLegalPage(slug);
  if (!page) notFound();

  const all = getLegalPages();

  return (
    <main className="relative min-h-screen w-full flex flex-col font-sans bg-[#F8FAFC]">
      <Header />

      <section className="relative w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0c1622] via-[#15263a] to-[#29425e]" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#F8FAFC] to-transparent" />

        <div className="relative z-10 w-full max-w-[1920px] mx-auto px-5 md:px-8 xl:px-12 2xl:px-16 pt-36 sm:pt-40 lg:pt-44 pb-16 sm:pb-20">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/60 mb-4">
            Legal
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-[1.35] max-w-3xl">
            {page.title}
          </h1>
          <p className="mt-4 text-sm text-white/70">
            Last updated · {formatDate(page.lastUpdated)}
          </p>
        </div>
      </section>

      <div className="w-full max-w-[1920px] mx-auto px-5 md:px-8 xl:px-12 2xl:px-16 pb-24 sm:pb-32 -mt-4 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-10">
          <aside className="lg:col-span-3 xl:col-span-3 order-2 lg:order-1">
            <div className="lg:sticky lg:top-28 rounded-[28px] bg-white border border-gray-100 shadow-sm p-5 sm:p-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400 mb-4">
                Policies
              </h2>
              <nav className="flex flex-col gap-1.5">
                {LEGAL_NAV.map((item) => {
                  const active = item.slug === slug;
                  return (
                    <Link
                      key={item.slug}
                      href={item.href}
                      className={`rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                        active
                          ? "bg-[#0c1622] text-white"
                          : "text-gray-600 hover:bg-[#F4F7FA] hover:text-[#0c1622]"
                      }`}
                    >
                      {all[item.slug]?.title || item.title}
                    </Link>
                  );
                })}
              </nav>
              <Link
                href="/contact"
                className="mt-5 inline-flex text-sm font-semibold text-[#395c80] hover:underline"
              >
                Need help? Contact us →
              </Link>
            </div>
          </aside>

          <article className="lg:col-span-9 xl:col-span-9 order-1 lg:order-2">
            <div className="bg-white rounded-[28px] sm:rounded-[36px] border border-gray-100 shadow-[0_20px_60px_rgba(15,23,42,0.05)] p-6 sm:p-10 lg:p-12">
              <div className="text-[#334155] text-base sm:text-lg leading-[1.9]">
                {page.content.split("\n").map((line, i) => {
                  const trimmed = line.trim();
                  if (!trimmed) return <div key={i} className="h-3" />;
                  if (trimmed.startsWith("###")) {
                    return (
                      <h2
                        key={i}
                        className="text-xl sm:text-2xl font-bold text-[#0c1622] mt-10 first:mt-0 mb-4 leading-snug"
                      >
                        {trimmed.replace(/^###\s*/, "")}
                      </h2>
                    );
                  }
                  return (
                    <p key={i} className="mb-5 text-[15px] sm:text-base leading-[1.85] text-gray-600">
                      {trimmed}
                    </p>
                  );
                })}
              </div>
            </div>
          </article>
        </div>
      </div>

      <Footer />
    </main>
  );
}
