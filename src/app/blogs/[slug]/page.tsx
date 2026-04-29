"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const BLOG_POSTS = [
  {
    id: 1,
    title: "ഇംഗ്ലീഷ് സംസാരിക്കാൻ പഠിക്കുമ്പോൾ ശ്രദ്ധിക്കേണ്ട 5 കാര്യങ്ങൾ",
    content: `
      ഇംഗ്ലീഷ് ഒരു വിദേശ ഭാഷ എന്ന നിലയിൽ പഠിക്കുമ്പോൾ പലർക്കും ഉണ്ടാകുന്ന വലിയൊരു പ്രശ്നം ആത്മവിശ്വാസക്കുറവാണ്. തെറ്റുകൾ വരുമോ എന്ന പേടി കാരണം പലരും സംസാരിക്കാൻ മടിക്കുന്നു. എന്നാൽ ഇംഗ്ലീഷ് ഒഴുക്കോടെ സംസാരിക്കാൻ നിങ്ങളെ സഹായിക്കുന്ന ചില ടിപ്‌സുകൾ താഴെ നൽകുന്നു.

      ### 1. തെറ്റുകളെ പേടിക്കരുത്
      ഭാഷ പഠിക്കുമ്പോൾ തെറ്റുകൾ സ്വാഭാവികമാണ്. തെറ്റുകൾ വരുത്തുമ്പോഴാണ് നമ്മൾ പുതിയ കാര്യങ്ങൾ പഠിക്കുന്നത്. അതുകൊണ്ട് സംസാരിക്കാൻ കിട്ടുന്ന ഒരു അവസരവും കളയരുത്.

      ### 2. ദിവസവും സംസാരിക്കുക
      നിങ്ങൾ പഠിക്കുന്ന വാക്കുകൾ അന്ന് തന്നെ ആരോടെങ്കിലും സംസാരിക്കാൻ ഉപയോഗിക്കുക. കൂട്ടുകാരോടോ വീട്ടുകാരോടോ സംസാരിക്കാം. ആരുമില്ലെങ്കിൽ കണ്ണാടിക്ക് മുന്നിൽ നിന്ന് സ്വയം സംസാരിക്കുന്നത് വളരെ ഫലപ്രദമാണ്.

      ### 3. ഇംഗ്ലീഷ് സിനിമകളും പാട്ടുകളും
      ഇംഗ്ലീഷ് സിനിമകൾ സബ്‌ടൈറ്റിലോട് കൂടി കാണുന്നത് ഉച്ചാരണം മെച്ചപ്പെടുത്താൻ സഹായിക്കും. പാട്ടുകൾ കേൾക്കുന്നത് പുതിയ വാക്കുകൾ പഠിക്കാനും അവയുടെ താളം മനസ്സിലാക്കാനും സഹായിക്കും.

      ### 4. ലളിതമായ വാക്കുകൾ ഉപയോഗിക്കുക
      ആദ്യമേ തന്നെ കടുപ്പമേറിയ വാക്കുകൾ ഉപയോഗിക്കണം എന്ന് നിർബന്ധമില്ല. ലളിതമായ വാക്കുകൾ ഉപയോഗിച്ച് ആശയവിനിമയം നടത്താൻ ശ്രമിക്കുക.

      ### 5. സ്ഥിരത (Consistency)
      ഒരു ദിവസം കൊണ്ട് ഇംഗ്ലീഷ് പഠിക്കാൻ കഴിയില്ല. ദിവസവും ചുരുങ്ങിയത് 15-30 മിനിറ്റ് എങ്കിലും ഇംഗ്ലീഷ് പഠനത്തിനായി മാറ്റിവെക്കുക.
    `,
    date: "28 April 2026",
    category: "പഠന വിദ്യകൾ",
    image: "/about.jpg",
    slug: "tips-to-speak-english-fluently",
    author: "Shaa David",
    authorRole: "Senior English Coach"
  },
  {
    id: 2,
    title: "ദിവസവും 15 മിനിറ്റ് ഇംഗ്ലീഷ് പഠനം: എങ്ങനെ ഫലപ്രദമാക്കാം?",
    content: `
      നമ്മുടെ തിരക്കേറിയ ജീവിതത്തിനിടയിൽ മണിക്കൂറുകൾ മാറ്റിവെച്ച് ഭാഷ പഠിക്കുക എന്നത് പ്രായോഗികമല്ല. എന്നാൽ ദിവസവും വെറും 15 മിനിറ്റ് ശ്രദ്ധയോടെ പഠിച്ചാൽ വലിയ മാറ്റങ്ങൾ ഉണ്ടാക്കാൻ സാധിക്കും.

      ### 1. പ്ലാനിംഗ് ആണ് പ്രധാനം
      ഈ 15 മിനിറ്റിൽ നിങ്ങൾ എന്താണ് പഠിക്കാൻ പോകുന്നത് എന്ന് നേരത്തെ തീരുമാനിക്കുക. 5 മിനിറ്റ് വായന, 5 മിനിറ്റ് കേൾക്കൽ, 5 മിനിറ്റ് സംസാരിക്കൽ എന്നിങ്ങനെ വിഭജിക്കാം.

      ### 2. പുതിയ വാക്കുകൾ
      ദിവസവും രണ്ട് പുതിയ വാക്കുകൾ വീതം പഠിക്കുക. അവയുടെ അർത്ഥം മനസ്സിലാക്കുകയും സ്വന്തമായി വാചകങ്ങൾ നിർമ്മിക്കുകയും ചെയ്യുക.

      ### 3. മൊബൈൽ ആപ്പുകൾ
      യാത്രയ്ക്കിടയിലോ ഒഴിവ് സമയത്തോ ഇംഗ്ലീഷ് പഠന ആപ്പുകൾ ഉപയോഗിക്കുന്നത് നല്ലതാണ്. ഇത് നിങ്ങളുടെ സമയം ലാഭിക്കാൻ സഹായിക്കും.

      ### 4. ചിന്തകൾ ഇംഗ്ലീഷിലാക്കുക
      നിങ്ങൾ ചെയ്യുന്ന കാര്യങ്ങൾ മനസ്സിൽ ഇംഗ്ലീഷിൽ പറയാൻ ശ്രമിക്കുക. ഉദാഹരണത്തിന് 'I am going to office' എന്ന് മനസ്സിൽ പറയുക.
    `,
    date: "25 April 2026",
    category: "ഭാഷാ നൈപുണ്യം",
    image: "/about.jpg",
    slug: "daily-learning-routine",
    author: "Shaa David",
    authorRole: "Senior English Coach"
  },
  {
    id: 3,
    title: "ഇന്റർവ്യൂകളിൽ ഇംഗ്ലീഷ് ആത്മവിശ്വാസത്തോടെ സംസാരിക്കാം",
    content: `
      ജോലി ഇന്റർവ്യൂകളിൽ പലർക്കും വെല്ലുവിളിയാകുന്നത് ഇംഗ്ലീഷ് സംസാരിക്കാനുള്ള പേടിയാണ്. എന്നാൽ ചില തയ്യാറെടുപ്പുകൾ നടത്തിയാൽ നിങ്ങൾക്ക് മികച്ച രീതിയിൽ ഇന്റർവ്യൂ നേരിടാം.

      ### 1. സ്വയം പരിചയപ്പെടുത്തൽ
      നിങ്ങളെക്കുറിച്ച് ലളിതമായും വ്യക്തമായും സംസാരിക്കാൻ പഠിക്കുക (Self-introduction). ഇത് ആത്മവിശ്വാസം നൽകും.

      ### 2. ചോദ്യങ്ങൾ മുൻകൂട്ടി കാണുക
      ഇന്റർവ്യൂകളിൽ സാധാരണയായി ചോദിക്കുന്ന ചോദ്യങ്ങൾ കണ്ടെത്തുകയും അവയ്ക്കുള്ള മറുപടികൾ തയ്യാറാക്കുകയും ചെയ്യുക.

      ### 3. ബോഡി ലാംഗ്വേജ്
      സംസാരിക്കുമ്പോൾ പുഞ്ചിരിക്കാനും ഐ-കോൺടാക്ട് നിലനിർത്താനും ശ്രമിക്കുക. ഇത് നിങ്ങൾ കോൺഫിഡന്റ് ആണെന്ന് തോന്നിപ്പിക്കും.

      ### 4. ലളിതമായ ഉത്തരം
      ചോദിക്കുന്ന ചോദ്യത്തിന് നേരിട്ട് ഉത്തരം നൽകുക. കടുപ്പമേറിയ വാക്കുകൾ ഉപയോഗിച്ച് തെറ്റുകൾ വരുത്തുന്നതിനേക്കാൾ നല്ലത് ലളിതമായ ഇംഗ്ലീഷ് ആണ്.
    `,
    date: "15 April 2026",
    category: "കരിയർ",
    image: "/about.jpg",
    slug: "english-for-interviews",
    author: "Shaa David",
    authorRole: "Senior English Coach"
  }
];

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug;
  const post = BLOG_POSTS.find(p => p.slug === slug) || BLOG_POSTS[0];

  return (
    <main className="relative min-h-screen w-full flex flex-col font-sans bg-[#F8FAFC]">
      <div className="relative z-50 w-full max-w-[1920px] mx-auto bg-white/80 backdrop-blur-md sticky top-0 border-b border-gray-100">
        <Header />
      </div>

      {/* Elegant Hero Section */}
      <div className="w-full h-[70vh] lg:h-[85vh] relative overflow-hidden flex items-center justify-center">
        <Image 
          src={post.image} 
          alt={post.title} 
          fill 
          className="object-cover scale-105 opacity-60"
          priority
        />
        {/* Layered Overlays for Elegance */}
        <div className="absolute inset-0 bg-[#0c1622]/60 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] via-transparent to-[#0c1622]/30"></div>
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10 z-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#395c80] rounded-full mix-blend-screen filter blur-[120px] opacity-40 animate-pulse z-0"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-emerald-500 rounded-full mix-blend-screen filter blur-[150px] opacity-10 z-0"></div>
        
        <div className="relative z-10 w-full px-5 md:px-12 xl:px-20 2xl:px-32 text-center flex flex-col items-center">
            <Link href="/blogs" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-all mb-12 group font-malayalam text-sm tracking-widest uppercase">
                <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Back to Journal
            </Link>
            
            <div className="flex items-center gap-3 text-emerald-400 text-xs font-bold uppercase tracking-[0.2em] mb-8 font-malayalam bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                <span>{post.category}</span>
                <span className="text-white/30">•</span>
                <span className="text-white/70">{post.date}</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#0c1622] mb-10 leading-[1.1] font-malayalam tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-1000">
                {post.title}
            </h1>
            
            <div className="flex items-center gap-4 bg-white/50 backdrop-blur-xl p-2 pr-6 rounded-full border border-white/50 shadow-xl">
                <div className="w-12 h-12 rounded-full bg-[#0c1622] flex items-center justify-center text-white font-bold text-lg shadow-inner">
                    S
                </div>
                <div className="text-left">
                    <p className="text-[#0c1622] font-bold text-sm font-malayalam leading-none mb-1">{post.author}</p>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider font-malayalam">{post.authorRole}</p>
                </div>
            </div>
        </div>
      </div>

      {/* Refined Content Area */}
      <div className="w-full mx-auto px-5 md:px-12 xl:px-20 2xl:px-32 py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          
          {/* Main Article Body */}
          <article className="lg:col-span-8 lg:col-start-1">
            {/* Immersive Glassy Article Header */}
            <div className="bg-white/40 backdrop-blur-xl border border-white/60 p-6 md:p-8 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] mb-16">
                {/* Featured Image in 4:3 Ratio */}
                <div className="relative w-full aspect-[4/3] rounded-[32px] overflow-hidden mb-8 shadow-xl">
                    <Image src={post.image} alt={post.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>

                {/* Post Metadata Row inside glassy box */}
                <div className="flex flex-wrap items-center gap-6 text-[#395c80] font-bold text-xs uppercase tracking-widest font-malayalam px-2">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#0c1622] flex items-center justify-center text-white text-[10px] shadow-lg">SD</div>
                        <span>{post.author}</span>
                    </div>
                    <div className="w-1.5 h-1.5 bg-gray-300/60 rounded-full"></div>
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <span className="text-gray-500">{post.date}</span>
                    </div>
                    <div className="w-1.5 h-1.5 bg-gray-300/60 rounded-full"></div>
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                        <span className="text-emerald-600">{post.category}</span>
                    </div>
                </div>
            </div>

            {/* Drop cap first letter effect or introductory text */}
            <div className="prose prose-xl prose-slate max-w-none prose-headings:text-[#0c1622] prose-headings:font-bold prose-p:text-gray-600 prose-p:leading-[1.8] prose-p:text-lg prose-li:text-gray-600 font-malayalam selection:bg-[#395c80]/10">
              {post.content.split('\n').map((line, i) => {
                if (line.trim().startsWith('###')) {
                  return <h3 key={i} className="text-3xl font-bold mt-16 mb-8 text-[#0c1622] relative inline-block">
                    {line.replace('###', '').trim()}
                    <span className="absolute -bottom-2 left-0 w-12 h-1 bg-emerald-500 rounded-full"></span>
                  </h3>;
                }
                if (line.trim() === '') return <div key={i} className="h-4" />;
                return <p key={i} className="mb-8">{line.trim()}</p>;
              })}
            </div>

            {/* Elegant Post Footer */}
            <div className="mt-20 pt-12 border-t border-gray-100">
                <div className="flex flex-wrap items-center justify-between gap-8">
                    <div className="flex flex-wrap gap-2">
                        {['English Mastery', 'Language Coach', 'Fluent Speaking'].map(tag => (
                            <span key={tag} className="px-5 py-2 bg-gray-50 text-gray-400 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#0c1622] hover:text-white transition-all cursor-pointer border border-gray-100">
                                {tag}
                            </span>
                        ))}
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest font-malayalam">ഷെയർ ചെയ്യൂ:</span>
                        <div className="flex gap-2">
                            {['whatsapp', 'facebook', 'linkedin'].map(social => (
                                <button key={social} className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:border-[#395c80] hover:text-[#395c80] transition-all shadow-sm">
                                    <span className="sr-only">{social}</span>
                                    <div className="capitalize font-bold text-[10px]">{social[0]}</div>
                                </button>
                            ))}
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
                    {BLOG_POSTS.slice(0, 3).map(related => (
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
