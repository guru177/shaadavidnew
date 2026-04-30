"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const BLOG_POSTS = [
  {
    id: 1,
    title: "ഇംഗ്ലീഷ് സംസാരിക്കാൻ പഠിക്കുമ്പോൾ ശ്രദ്ധിക്കേണ്ട 5 കാര്യങ്ങൾ",
    excerpt: "വ്യാകരണ ഭയമില്ലാതെ ആത്മവിശ്വാസത്തോടെ ഇംഗ്ലീഷ് സംസാരിക്കാൻ സഹായിക്കുന്ന ലളിതമായ വഴികൾ...",
    date: "28 April 2026",
    category: "പഠന വിദ്യകൾ",
    image: "/about.jpg",
    slug: "tips-to-speak-english-fluently"
  },
  {
    id: 2,
    title: "ദിവസവും 15 മിനിറ്റ് ഇംഗ്ലീഷ് പഠനം: എങ്ങനെ ഫലപ്രദമാക്കാം?",
    excerpt: "നിങ്ങളുടെ ജോലിത്തിരക്കിനിടയിലും ഇംഗ്ലീഷ് ഭാഷാ നൈപുണ്യം എങ്ങനെ മെച്ചപ്പെടുത്താം എന്ന് നോക്കാം...",
    date: "25 April 2026",
    category: "ഭാഷാ നൈപുണ്യം",
    image: "/about.jpg",
    slug: "daily-learning-routine"
  },
  {
    id: 3,
    title: "ഇംഗ്ലീഷ് വാക്കുകൾ മറന്നുപോകാതിരിക്കാൻ ചില ട്രിക്കുകൾ",
    excerpt: "പുതിയ വാക്കുകൾ പഠിക്കുമ്പോഴും അവ കൃത്യസമയത്ത് ഉപയോഗിക്കാൻ കഴിയാത്തവർക്കും ഈ ടിപ്‌സ് ഉപകാരപ്പെടും...",
    date: "20 April 2026",
    category: "വൊക്കാബുലറി",
    image: "/about.jpg",
    slug: "how-to-remember-vocabulary"
  },
  {
    id: 4,
    title: "ഇന്റർവ്യൂകളിൽ ഇംഗ്ലീഷ് ആത്മവിശ്വാസത്തോടെ സംസാരിക്കാം",
    excerpt: "ജോലി ഇന്റർവ്യൂകളിൽ ഇംഗ്ലീഷ് കൈകാര്യം ചെയ്യുമ്പോൾ ശ്രദ്ധിക്കേണ്ട പ്രധാന കാര്യങ്ങൾ...",
    date: "15 April 2026",
    category: "കരിയർ",
    image: "/about.jpg",
    slug: "english-for-interviews"
  }
];

export default function BlogsPage() {
  return (
    <main className="relative min-h-screen w-full flex flex-col font-sans bg-[#F8FAFC]">
      <Header />

      {/* Hero Section */}
      <div className="w-full min-h-[50vh] sm:min-h-[60vh] lg:min-h-[70vh] relative overflow-hidden flex items-center justify-center text-center px-4 pt-28 lg:pt-32">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/blog-bg.png"
            alt="Blog Background"
            fill
            className="object-cover opacity-50 grayscale-[10%]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0c1622] via-[#0c1622]/90 to-[#1a2c42]/80"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] via-transparent to-transparent"></div>
        </div>

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10 z-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#395c80] rounded-full mix-blend-screen filter blur-[120px] opacity-40 animate-pulse z-0"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-emerald-500 rounded-full mix-blend-screen filter blur-[150px] opacity-10 z-0"></div>

        <div className="relative z-10 max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-12 sm:pb-16 lg:pb-24 px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-white mb-6 sm:mb-8 tracking-tight font-malayalam drop-shadow-lg leading-[1.4]">ബ്ലോഗ് വിശേഷങ്ങൾ</h1>
          <p className="text-white/90 text-base sm:text-xl max-w-3xl mx-auto leading-[1.6] font-medium font-malayalam drop-shadow-md px-2">
            ഇംഗ്ലീഷ് പഠനം ലളിതമാക്കാനുള്ള വഴികളും ടിപ്‌സുകളും ഇവിടെ വായിക്കാം. നിങ്ങളുടെ ആത്മവിശ്വാസം വർദ്ധിപ്പിക്കാനുള്ള ലേഖനങ്ങൾ.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-[1920px] mx-auto px-5 md:px-8 xl:px-12 2xl:px-16 pb-32 relative z-10">


        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-12">
          {BLOG_POSTS.slice(1).map((post) => (
            <Link key={post.id} href={`/blogs/${post.slug}`} className="group flex flex-col h-full bg-white/60 backdrop-blur-xl border border-white rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
              <div className="relative h-64 overflow-hidden">
                <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-6 left-6">
                  <span className="bg-white/90 backdrop-blur-md text-[#0c1622] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest font-malayalam shadow-sm">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-8 flex flex-col flex-1">
                <div className="text-gray-400 text-xs font-bold mb-4 font-malayalam uppercase tracking-widest">{post.date}</div>
                <h3 className="text-xl font-bold text-[#0c1622] mb-4 font-malayalam group-hover:text-[#395c80] transition-colors leading-snug">
                  {post.title}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-3 mb-8 font-malayalam flex-1 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[#395c80] font-bold text-xs uppercase tracking-wider flex items-center gap-2 font-malayalam">
                    Read More
                    <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Load More Button */}
        <div className="mt-20 flex justify-center">
          <button className="bg-white border-2 border-gray-100 text-[#0c1622] px-10 py-4 rounded-2xl font-bold hover:border-[#0c1622] hover:bg-[#0c1622] hover:text-white transition-all duration-300 shadow-sm font-malayalam">
            കൂടുതൽ ലേഖനങ്ങൾ
          </button>
        </div>

      </div>

      <Footer />
    </main>
  );
}
