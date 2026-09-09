import React from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogShareButtons from "@/components/blog/BlogShareButtons";
import { getDb } from "@/lib/db";
import { buildPageMetadata } from "@/lib/seo";
import type { BlogPost } from "@/types/blog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const db = getDb();
  const post = ((db.blogs || []) as BlogPost[]).find((p) => p.slug === slug);
  if (!post) return { title: "Blog post" };

  const title = post.seoTitle || post.title;
  const description =
    post.seoDescription ||
    post.excerpt ||
    `Read ${post.title} on Shaa David's Academy blog.`;

  return buildPageMetadata({
    title,
    description,
    keywords: post.seoKeywords,
    path: `/blogs/${post.slug}`,
    image: post.image,
    type: "article",
  });
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const db = getDb();
  const allBlogs = (db.blogs || []) as BlogPost[];
  const post = allBlogs.find((p) => p.slug === slug);

  if (!post) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#F8FAFC] px-6">
        <p className="font-malayalam text-xl text-[#0c1622]">Blog post not found!</p>
        <Link href="/blogs" className="text-sm font-semibold text-[#395c80] hover:underline">
          ← Back to blogs
        </Link>
      </main>
    );
  }

  const related = allBlogs.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <main className="relative min-h-screen w-full flex flex-col font-sans bg-[#F8FAFC]">
      <Header />

      {/* Cinematic article hero */}
      <section className="relative w-full min-h-[52vh] sm:min-h-[60vh] lg:min-h-[68vh] overflow-hidden flex items-end">
        <div className="absolute inset-0">
          <Image
            src={post.image}
            alt=""
            fill
            className="object-cover scale-[1.02]"
            priority
            unoptimized={post.image.startsWith("http")}
          />
          {/* Keep hero dark so white type stays readable */}
          <div className="absolute inset-0 bg-[#0c1622]/78" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0c1622]/95 via-[#0c1622]/55 to-[#152a42]/80" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#F8FAFC] to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-[1920px] mx-auto px-5 md:px-8 xl:px-12 2xl:px-16 pt-36 sm:pt-40 lg:pt-44 pb-16 sm:pb-20">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-white/85 hover:text-white transition-colors mb-7 group text-[11px] sm:text-xs tracking-[0.18em] uppercase font-bold drop-shadow"
          >
            <svg
              className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to journal
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.16em] font-malayalam shadow-sm">
              {post.category}
            </span>
            <span className="text-white/80 text-xs sm:text-sm font-semibold tracking-wide drop-shadow">
              {post.date}
              {post.readTime ? ` · ${post.readTime}` : ""}
            </span>
          </div>

          <h1 className="max-w-5xl text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white font-malayalam-display leading-[1.65] tracking-normal drop-shadow-md overflow-visible py-1">
            {post.title}
          </h1>

          <div className="mt-8 flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white/20 border border-white/35 flex items-center justify-center text-white text-xs font-bold tracking-wider shadow-sm">
              SD
            </div>
            <div>
              <p className="text-sm font-semibold text-white font-malayalam drop-shadow">
                {post.author || "Shaa David"}
              </p>
              <p className="text-xs text-white/75">Shaa David&apos;s Academy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Article body — full site width */}
      <div className="w-full max-w-[1920px] mx-auto px-5 md:px-8 xl:px-12 2xl:px-16 relative z-20 pb-24 sm:pb-32 pt-8 sm:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
          <article className="lg:col-span-8 xl:col-span-9">
            <div className="bg-white rounded-[28px] sm:rounded-[36px] border border-gray-100/80 shadow-[0_20px_60px_rgba(15,23,42,0.06)] overflow-hidden">
              <div className="relative aspect-[16/10] sm:aspect-[21/9]">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  unoptimized={post.image.startsWith("http")}
                />
              </div>

              <div className="p-6 sm:p-10 lg:p-12">
                {post.excerpt && (
                  <p className="text-lg sm:text-xl text-[#395c80] font-medium font-malayalam leading-[1.7] mb-10 border-l-[3px] border-[#395c80]/40 pl-5">
                    {post.excerpt}
                  </p>
                )}

                <div className="font-malayalam text-[#334155] text-base sm:text-lg leading-[1.9] selection:bg-[#395c80]/10">
                  {post.content.split("\n").map((line: string, i: number) => {
                    const trimmed = line.trim();
                    if (trimmed.startsWith("###")) {
                      return (
                        <h2
                          key={i}
                          className="text-2xl sm:text-[1.75rem] font-bold text-[#0c1622] mt-10 mb-5 leading-[1.45]"
                        >
                          {trimmed.replace(/^###\s*/, "")}
                        </h2>
                      );
                    }
                    if (!trimmed) return <div key={i} className="h-3" />;
                    return (
                      <p key={i} className="mb-6 sm:mb-7">
                        {trimmed}
                      </p>
                    );
                  })}
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="flex flex-wrap gap-2">
                    {[post.category, "ഇംഗ്ലീഷ്", "പഠനം"].filter(Boolean).map((tag) => (
                      <span
                        key={tag}
                        className="px-3.5 py-1.5 rounded-full bg-[#F4F7FA] text-[#475569] text-xs font-semibold font-malayalam border border-gray-100"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <BlogShareButtons title={post.title} />
                </div>
              </div>
            </div>
          </article>

          <aside className="lg:col-span-4 xl:col-span-3 flex flex-col gap-8 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[28px] bg-[#0c1622] p-7 sm:p-8 text-white relative overflow-hidden">
              <div className="absolute -top-16 -right-10 w-44 h-44 bg-[#395c80]/40 rounded-full blur-3xl" />
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/45 mb-3">
                Newsletter
              </p>
              <h3 className="text-xl sm:text-2xl font-bold font-malayalam relative z-10 leading-snug">
                പുതിയ ലേഖനങ്ങൾ നേരിട്ട് നിങ്ങളുടെ ഇൻബോക്സിൽ
              </h3>
              <p className="text-white/50 text-sm mt-3 mb-7 relative z-10 font-malayalam leading-relaxed">
                പഠന ടിപ്പുകളും അപ്‌ഡേറ്റുകളും ഒരിക്കലും നഷ്ടപ്പെടുത്തരുത്.
              </p>
              <div className="space-y-3 relative z-10">
                <input
                  type="email"
                  placeholder="നിങ്ങളുടെ ഇമെയിൽ"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white outline-none focus:border-white/30 transition-colors font-malayalam text-sm"
                />
                <button
                  type="button"
                  className="w-full bg-white text-[#0c1622] py-3.5 rounded-2xl text-sm font-bold hover:bg-white/90 transition-colors font-malayalam"
                >
                  Subscribe
                </button>
              </div>
            </div>

            {related.length > 0 && (
              <div className="rounded-[28px] bg-white border border-gray-100 p-6 sm:p-7 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-bold text-[#0c1622] font-malayalam">കൂടുതൽ വായിക്കാം</h3>
                  <Link
                    href="/blogs"
                    className="text-[11px] font-bold text-gray-400 hover:text-[#0c1622] uppercase tracking-widest"
                  >
                    All
                  </Link>
                </div>
                <div className="flex flex-col gap-5">
                  {related.map((item) => (
                    <Link
                      key={item.id}
                      href={`/blogs/${item.slug}`}
                      className="group flex gap-3.5 items-start"
                    >
                      <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-gray-100">
                        <Image
                          src={item.image}
                          alt=""
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          unoptimized={item.image.startsWith("http")}
                        />
                      </div>
                      <div className="min-w-0 pt-0.5">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                          {item.date}
                        </p>
                        <h4 className="text-sm font-bold text-[#0c1622] group-hover:text-[#395c80] transition-colors line-clamp-3 font-malayalam leading-snug">
                          {item.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      <Footer />
    </main>
  );
}
