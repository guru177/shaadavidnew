import React from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getDb } from '@/lib/db';

// Dynamic DB fetch used below

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const db = getDb();
  const allBlogs = db.blogs || [];
  const post = allBlogs.find((p: any) => p.slug === params.slug);

  if (!post) {
    return <div className="min-h-screen flex items-center justify-center font-malayalam text-xl">Blog post not found!</div>;
  }

  return (
    <main className="relative min-h-screen w-full flex flex-col font-sans bg-[#F8FAFC]">
      <Header />

      {/* Elegant Hero Section */}
      <div className="w-full h-[50vh] sm:h-[70vh] lg:h-[85vh] relative overflow-hidden flex items-center justify-center pt-32 sm:pt-24 lg:pt-32">
        <Image 
          src={post.image} 
          alt={post.title} 
          fill 
          className="object-cover scale-105 opacity-50"
          priority
        />
        {/* Clean Light Overlay */}
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>
        
        {/* Bottom Fade to blend with content area */}
        <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-[#F8FAFC] to-transparent z-0 pointer-events-none"></div>
        
        <div className="relative z-10 w-full max-w-[1920px] mx-auto px-5 md:px-8 xl:px-12 2xl:px-16 text-center flex flex-col items-center">
            <Link href="/blogs" className="inline-flex items-center gap-2 text-[#395c80]/70 hover:text-[#0c1622] transition-all mb-8 sm:mb-12 group font-malayalam text-[10px] sm:text-sm tracking-widest uppercase font-bold">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Back to Journal
            </Link>
            
            <div className="flex items-center gap-2 sm:gap-3 text-white text-[9px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-6 sm:mb-8 font-malayalam bg-gradient-to-r from-[#0c1622] to-[#395c80] shadow-md px-4 sm:px-5 py-1.5 sm:py-2 rounded-full border border-white/10">
                <span>{post.category}</span>
                <span className="text-white/40">•</span>
                <span>{post.date}</span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#0c1622] to-[#395c80] bg-clip-text text-transparent mb-6 sm:mb-10 leading-[1.4] font-malayalam tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-1000 pt-4 -mt-4 pb-4 -mb-4 px-4">
                {post.title}
            </h1>
        </div>
      </div>

      {/* Refined Content Area */}
      <div className="w-full max-w-[1920px] mx-auto px-0 sm:px-5 md:px-8 xl:px-12 2xl:px-16 py-12 sm:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Main Article Body */}
          <article className="lg:col-span-8 lg:col-start-1">
            {/* Immersive Glassy Article Header */}
            <div className="bg-white/40 backdrop-blur-xl border-y sm:border border-white/60 p-5 sm:p-8 rounded-none sm:rounded-[40px] shadow-sm sm:shadow-[0_20px_50px_rgba(0,0,0,0.04)] mb-12 sm:mb-16">
                {/* Featured Image in 4:3 Ratio */}
                <div className="relative w-full aspect-[4/3] rounded-[24px] sm:rounded-[32px] overflow-hidden mb-6 sm:mb-8 shadow-xl">
                    <Image src={post.image} alt={post.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>

                {/* Post Metadata Row inside glassy box */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[#395c80] font-bold text-[10px] sm:text-xs uppercase tracking-widest font-malayalam px-1">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#0c1622] flex items-center justify-center text-white text-[8px] sm:text-[10px] shadow-lg">SD</div>
                        <span>{post.author}</span>
                    </div>
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-gray-300/60 rounded-full"></div>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <span className="text-gray-500">{post.date}</span>
                    </div>
                    <div className="hidden xs:block w-1 h-1 sm:w-1.5 sm:h-1.5 bg-gray-300/60 rounded-full"></div>
                    <div className="hidden xs:flex items-center gap-1.5 sm:gap-2">
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                        <span className="text-emerald-600">{post.category}</span>
                    </div>
                </div>

                {/* Article Content inside the container */}
                <div className="prose prose-lg sm:prose-xl prose-slate max-w-none prose-headings:text-[#0c1622] prose-headings:font-bold prose-p:text-gray-600 prose-p:leading-[1.9] prose-p:text-base sm:prose-p:text-lg prose-li:text-gray-600 font-malayalam selection:bg-[#395c80]/10 px-1 mt-6">
                  {post.content.split('\n').map((line, i) => {
                    if (line.trim().startsWith('###')) {
                      return <h3 key={i} className="text-2xl sm:text-3xl font-bold mt-4 mb-6 sm:mb-8 text-[#0c1622] relative inline-block">
                        {line.replace('###', '').trim()}
                        <span className="absolute -bottom-2 left-0 w-10 sm:w-12 h-1 bg-emerald-500 rounded-full"></span>
                      </h3>;
                    }
                    if (line.trim() === '') return <div key={i} className="h-4" />;
                    return <p key={i} className="mb-6 sm:mb-8">{line.trim()}</p>;
                  })}
                </div>

                {/* Elegant Post Footer */}
                <div className="mt-12 pt-8 border-t border-gray-200/50">
                    <div className="flex flex-wrap items-center justify-between gap-8">
                        <div className="flex flex-wrap gap-2">
                            {['ഇംഗ്ലീഷ് പ്രാവീണ്യം', 'ഭാഷാ പരിശീലനം', 'സംസാരശേഷി'].map(tag => (
                                <span key={tag} className="px-5 py-2 bg-gray-50/50 text-gray-500 rounded-full text-xs font-bold tracking-widest hover:bg-[#0c1622] hover:text-white transition-all cursor-pointer border border-gray-200/50 backdrop-blur-sm font-malayalam">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest font-malayalam">ഷെയർ ചെയ്യൂ:</span>
                            <div className="flex gap-3">
                                {/* WhatsApp */}
                                <button aria-label="Share on WhatsApp" className="w-10 h-10 rounded-full bg-white/60 border border-gray-200/50 flex items-center justify-center text-gray-500 hover:border-[#25D366] hover:text-white hover:bg-[#25D366] transition-all shadow-sm backdrop-blur-sm group">
                                    <svg className="w-4 h-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/><path d="M9 10a.5.5 0 0 0 1 0v-1a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/></svg>
                                </button>
                                {/* Facebook */}
                                <button aria-label="Share on Facebook" className="w-10 h-10 rounded-full bg-white/60 border border-gray-200/50 flex items-center justify-center text-gray-500 hover:border-[#1877F2] hover:text-white hover:bg-[#1877F2] transition-all shadow-sm backdrop-blur-sm group">
                                    <svg className="w-4 h-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                                </button>
                                {/* X (Twitter) */}
                                <button aria-label="Share on X" className="w-10 h-10 rounded-full bg-white/60 border border-gray-200/50 flex items-center justify-center text-gray-500 hover:border-black hover:text-white hover:bg-black transition-all shadow-sm backdrop-blur-sm group">
                                    <svg className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
                                </button>
                                {/* Copy Link */}
                                <button aria-label="Copy Link" className="w-10 h-10 rounded-full bg-white/60 border border-gray-200/50 flex items-center justify-center text-gray-500 hover:border-[#395c80] hover:text-white hover:bg-[#395c80] transition-all shadow-sm backdrop-blur-sm group" onClick={(e) => { e.preventDefault(); navigator.clipboard.writeText(window.location.href); alert('Link copied to clipboard!'); }}>
                                    <svg className="w-4 h-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

          </article>

          {/* Minimalist Sidebar */}
          <aside className="lg:col-span-4 flex flex-col gap-16">
            
            {/* Newsletter - Minimalist version */}
            <div className="bg-[#0c1622] rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl"></div>
                <h3 className="text-2xl font-bold mb-4 relative z-10 font-malayalam">Keep in touch</h3>
                <p className="text-white/50 text-sm mb-10 relative z-10 font-malayalam leading-relaxed">
                    പുതിയ പഠനവിദ്യകളും അപ്‌ഡേറ്റുകളും നിങ്ങളുടെ ഇൻബോക്സിൽ നേരിട്ട് ലഭിക്കാൻ സബ്സ്ക്രൈബ് ചെയ്യൂ.
                </p>
                <div className="space-y-4 relative z-10">
                    <input type="email" placeholder="നിങ്ങളുടെ ഇമെയിൽ" className="w-full bg-white/5 border border-white/10 rounded-full px-8 py-4 text-white outline-none focus:border-emerald-500/50 transition-all font-malayalam text-sm" />
                    <button className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-bold hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 font-malayalam">Join Journal</button>
                </div>
            </div>

            {/* Related Journal Entries */}
            <div className="flex flex-col gap-10">
                <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                    <h3 className="text-xl font-bold text-[#0c1622] font-malayalam">കൂടുതൽ വായിക്കാം</h3>
                    <Link href="/blogs" className="text-xs font-bold text-gray-400 hover:text-[#0c1622] transition-colors uppercase tracking-widest">View All</Link>
                </div>
                <div className="flex flex-col gap-6">
                    {allBlogs.slice(0, 3).map((related: any) => (
                        <Link key={related.id} href={`/blogs/${related.slug}`} className="group flex flex-col gap-4 bg-white/40 backdrop-blur-xl border border-white/60 p-4 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-sm">
                                <Image src={related.image} alt={related.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                            </div>
                            <div className="px-2 pb-2">
                                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2 font-malayalam">{related.date}</p>
                                <h4 className="text-[15px] font-bold text-[#0c1622] group-hover:text-[#395c80] transition-colors line-clamp-2 font-malayalam leading-snug">
                                    {related.title}
                                </h4>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

          </aside>

        </div>
      </div>

      <Footer />
    </main>
  );
}
