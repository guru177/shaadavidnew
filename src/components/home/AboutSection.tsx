"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { sectionEyebrowClass, sectionEyebrowDotClass, sectionHeadingGradientClass } from './sectionStyles';

function AnimatedCounter({ end, duration = 2500 }: { end: number, duration?: number }) {
  const [count, setCount] = useState(0);
  const nodeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    let hasRun = false;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasRun) {
          hasRun = true;
          let startTime: number | null = null;

          const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            // easeOutExpo for a very smooth slow-down at the end
            const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

            setCount(Math.floor(easeOut * end));

            if (progress < 1) {
              window.requestAnimationFrame(step);
            }
          };

          window.requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={nodeRef} className="tabular-nums">{count}%</span>;
}

function AnimatedFadeInUp({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={nodeRef}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
    >
      {children}
    </div>
  );
}

function AnimatedSlideInRight({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={nodeRef}
      className={`transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
        } ${className}`}
    >
      {children}
    </div>
  );
}

export default function AboutSection() {
  return (
    <section className="relative w-full bg-white z-30 py-[80px] px-5 md:px-8 xl:px-10 laptop:px-12 2xl:px-14 laptop-wide:px-16 max-w-[1920px] mx-auto overflow-x-clip">

      {/* Top Row */}
      <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-8 lg:gap-6 xl:gap-8 laptop:gap-10 2xl:gap-12 laptop-wide:gap-14 mb-8 xl:mb-10 shrink-0">

        {/* Left Content */}
        <div className="w-full lg:w-[55%] flex flex-col items-start z-10 min-w-0">
          <span className={sectionEyebrowClass}>
            <span className={sectionEyebrowDotClass} />
            About Shaa David
          </span>
          <h2 className={`${sectionHeadingGradientClass} mb-4 md:mb-5 w-full text-balance`}>
            ആത്മവിശ്വാസത്തോടെ ഇംഗ്ലീഷ് സംസാരിക്കുക!
          </h2>
          <p className="text-gray-500 text-base sm:text-lg xl:text-lg laptop:text-xl 2xl:text-xl laptop-wide:text-2xl font-malayalam leading-[1.7] sm:leading-[1.8] laptop-wide:leading-[2] w-full max-w-[42rem] laptop:max-w-none font-medium">
            ഇംഗ്ലീഷ് കേട്ടാൽ മനസിലാകും, എന്നാൽ തിരിച്ചു പറയാൻ ശ്രമിക്കുമ്പോൾ തെറ്റിപ്പോകുമോ എന്ന ഭയം മിക്കവർക്കുമുണ്ട്. വ്യാകരണത്തിലെ ശരിതെറ്റുകളെ മാത്രം ആശ്രയിച്ചുള്ള പഴയ പഠനരീതിയാണ് ഇതിന് കാരണം. എന്നാൽ മനസ്സിൽ വരുന്ന ആശയങ്ങൾ ഭയമില്ലാതെ പ്രകടിപ്പിക്കാൻ സഹായിക്കുന്ന ശാസ്ത്രീയവും പ്രായോഗികവുമായ ഒരു പഠനരീതിയാണ് നമുക്കാവശ്യം. ഇംഗ്ലീഷ് അനായാസം സംസാരിക്കാൻ നിങ്ങളെ പ്രാപ്തരാക്കുന്ന ഒരു പാഠ്യപദ്ധതി ഇപ്പോൾ പുസ്തക രൂപത്തിൽ ലഭ്യമാണ്. ഷാ ഡേവിഡ്സ് ഇംഗ്ലീഷ് കംപാനിയനിലൂടെ, ഇനി മലയാളത്തിലൂടെ തന്നെ വളരെ എളുപ്പത്തിൽ ഇംഗ്ലീഷ് പഠിക്കാം.
          </p>
        </div>

        {/* Right Image */}
        <div className="w-full sm:w-[80%] lg:w-[42%] xl:w-[40%] relative mt-8 lg:mt-10 xl:mt-12 laptop:mt-14 2xl:mt-16 laptop-wide:mt-[90px] shrink-0">
          {/* Decorative Rotating Icon (Top Right) */}
          <img
            loading="lazy"
            src="/icon.webp"
            alt="Decorative rotating icon"
            className="absolute -top-10 -right-3 xl:-top-12 xl:-right-4 laptop:-right-6 2xl:-right-10 laptop-wide:-right-16 w-12 h-12 xl:w-14 xl:h-14 laptop:w-16 laptop:h-16 2xl:w-[4.5rem] 2xl:h-[4.5rem] laptop-wide:w-20 laptop-wide:h-20 hidden md:block animate-[spin_60s_linear_infinite] object-contain z-20"
          />

          {/* Decorative Arrow (Bottom Left) */}
          <svg className="absolute -bottom-8 -left-8 xl:-bottom-10 xl:-left-10 laptop:-left-12 2xl:-left-16 laptop-wide:-left-24 w-14 h-14 xl:w-16 xl:h-16 laptop:w-[4.5rem] laptop:h-[4.5rem] 2xl:w-20 2xl:h-20 laptop-wide:w-28 laptop-wide:h-28 text-[#111] hidden md:block transform -rotate-12" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 80 Q 40 40, 80 20" />
            <path d="M60 20 L80 20 L80 40" />
          </svg>

          <div className="relative w-full aspect-[4/3] rounded-[24px] xl:rounded-[28px] 2xl:rounded-[32px] laptop-wide:rounded-[40px] overflow-hidden transition-all duration-700 shadow-2xl">
            <img
              loading="lazy"
              src="/about.webp"
              alt="Team"
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>
      </div>

      {/* Bottom Row (Dark Container with gradient) */}
      <div className="relative w-full rounded-[28px] sm:rounded-[30px] 2xl:rounded-[36px] laptop-wide:rounded-[40px] bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer p-7 sm:p-10 xl:p-9 laptop:p-10 2xl:p-12 laptop-wide:p-14 overflow-visible flex flex-col md:flex-row items-start flex-1 min-h-[350px] lg:min-h-[400px] xl:min-h-[420px] laptop:min-h-[440px] 2xl:min-h-[500px] laptop-wide:min-h-[550px]">

        {/* Abstract Wavy lines background inside the container */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'repeating-radial-gradient(circle at 100% 50%, transparent 0, transparent 40px, rgba(255,255,255,0.1) 41px, rgba(255,255,255,0.1) 42px)' }}></div>
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'repeating-radial-gradient(circle at 0% 100%, transparent 0, transparent 30px, rgba(255,255,255,0.2) 31px, rgba(255,255,255,0.2) 32px)' }}></div>

        {/* Left Content inside Dark Box */}
        <div className="w-full lg:w-[50%] flex flex-col relative z-10 h-full justify-center gap-5 md:gap-6 laptop:gap-7 2xl:gap-8 laptop-wide:gap-10 py-4 pr-0 lg:pr-4">
          <div>
            <h3 className="text-4xl xs:text-5xl md:text-6xl xl:text-6xl laptop:text-7xl 2xl:text-7xl laptop-wide:text-8xl font-bold text-white mb-1 md:mb-2 tracking-tight drop-shadow-lg"><AnimatedCounter end={99} /></h3>
            <p className="text-white/90 text-base sm:text-lg xl:text-lg laptop:text-xl 2xl:text-xl laptop-wide:text-2xl font-malayalam font-medium tracking-wide max-w-md">
              സംസാരിക്കാനുള്ള ആത്മവിശ്വാസം വർദ്ധിക്കുന്നു
            </p>
          </div>

          {/* Tags Cluster */}
          <div className="flex flex-wrap items-center gap-2 md:gap-2.5 laptop:gap-3 2xl:gap-3.5 laptop-wide:gap-4 pb-4 overflow-visible">
            <AnimatedFadeInUp delay={0}>
              <span className="inline-block bg-white text-[#111] px-4 py-2.5 xl:px-5 xl:py-3 2xl:px-6 laptop-wide:px-8 2xl:py-3.5 laptop-wide:py-4 rounded-full font-malayalam font-bold text-sm md:text-base laptop-wide:text-xl leading-[1.5] transform -rotate-2 hover:rotate-0 hover:scale-110 transition-all cursor-default">സംസാരിക്കൽ</span>
            </AnimatedFadeInUp>
            <AnimatedFadeInUp delay={100}>
              <span className="inline-block bg-white text-[#111] px-4 py-2.5 xl:px-5 xl:py-3 2xl:px-6 laptop-wide:px-8 2xl:py-3.5 laptop-wide:py-4 rounded-full font-malayalam font-bold text-sm md:text-base laptop-wide:text-xl leading-[1.5] transform rotate-3 hover:rotate-0 hover:scale-110 transition-all cursor-default">വ്യാകരണം</span>
            </AnimatedFadeInUp>
            <AnimatedFadeInUp delay={200}>
              <span className="inline-block bg-white text-[#111] px-4 py-2.5 xl:px-5 xl:py-3 2xl:px-6 laptop-wide:px-8 2xl:py-3.5 laptop-wide:py-4 rounded-full font-malayalam font-bold text-sm md:text-base laptop-wide:text-xl leading-[1.5] transform -rotate-1 hover:rotate-0 hover:scale-110 transition-all cursor-default">പദസമ്പത്ത്</span>
            </AnimatedFadeInUp>
            <AnimatedFadeInUp delay={300}>
              <span className="inline-block bg-white text-[#111] px-4 py-2.5 xl:px-5 xl:py-3 2xl:px-6 laptop-wide:px-8 2xl:py-3.5 laptop-wide:py-4 rounded-full font-malayalam font-bold text-sm md:text-base laptop-wide:text-xl leading-[1.5] transform rotate-2 hover:rotate-0 hover:scale-110 transition-all cursor-default">ഉച്ചാരണം</span>
            </AnimatedFadeInUp>
            <AnimatedFadeInUp delay={400}>
              <span className="inline-block bg-white text-[#111] px-4 py-2.5 xl:px-5 xl:py-3 2xl:px-6 laptop-wide:px-8 2xl:py-3.5 laptop-wide:py-4 rounded-full font-malayalam font-bold text-sm md:text-base laptop-wide:text-xl leading-[1.5] transform -rotate-3 hover:rotate-0 hover:scale-110 transition-all cursor-default">ആത്മവിശ്വാസം</span>
            </AnimatedFadeInUp>

            <AnimatedFadeInUp delay={500}>
              <Link href="/about" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 xl:px-6 xl:py-3 2xl:px-7 laptop-wide:px-8 2xl:py-3.5 laptop-wide:py-4 bg-transparent border-2 border-white/80 text-white rounded-full font-bold text-sm md:text-base laptop-wide:text-xl hover:bg-white hover:text-[#29425e] transition-all duration-300 transform hover:scale-105 group w-fit">
                View More
                <svg className="w-5 h-5 laptop-wide:w-6 laptop-wide:h-6 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </AnimatedFadeInUp>
          </div>
        </div>

        {/* Right "Cutout" Image Area - Desktop */}
        <AnimatedSlideInRight className="absolute bottom-0 right-0 w-[42%] xl:w-[44%] laptop:w-[45%] h-[72%] xl:h-[74%] 2xl:h-[76%] laptop-wide:h-[80%] bg-white rounded-tl-[24px] xl:rounded-tl-[28px] 2xl:rounded-tl-[36px] laptop-wide:rounded-tl-[50px] p-2.5 sm:p-3 xl:p-3.5 2xl:p-5 laptop-wide:p-6 z-10 hidden lg:block">
          <div className="relative w-full h-full rounded-[16px] xl:rounded-[20px] 2xl:rounded-[24px] laptop-wide:rounded-[30px] overflow-hidden transition-all duration-700">
            <img
              loading="lazy"
              src="/about2.webp"
              alt="Team collaborating"
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
            />
          </div>
        </AnimatedSlideInRight>

        {/* Mobile/Tablet only right image */}
        <AnimatedSlideInRight className="w-full mt-12 lg:hidden relative z-10">
          <div className="relative w-full aspect-video rounded-[20px] overflow-hidden transition-all duration-700 border-4 border-white shadow-xl">
            <img
              loading="lazy"
              src="/about2.webp"
              alt="Team collaborating"
              className="w-full h-full object-cover"
            />
          </div>
        </AnimatedSlideInRight>

      </div>
    </section>
  );
}
