import React from 'react';
import Link from 'next/link';
import { getDefaultProduct } from '@/lib/products';
import { getPrimaryImage } from '@/lib/media';
import { sectionHeadingOnDarkClass } from './sectionStyles';

export default async function ProductSection() {
  const product = await getDefaultProduct();
  const price = product?.price ?? 499;
  const mrp = product?.mrp ?? 999;
  const image = getPrimaryImage(product?.images);
  const title = 'ഷാ ഡേവിഡിന്റെ ഇംഗ്ലീഷ് കമ്പാനിയൻ';

  return (
    <section className="relative w-full bg-white pt-12 sm:pt-16 md:pt-[100px] xl:pt-[120px] laptop:pt-[140px] 2xl:pt-[150px] laptop-wide:pt-[160px] pb-12 sm:pb-16 md:pb-[80px] xl:pb-[100px] px-5 md:px-8 xl:px-10 laptop:px-12 2xl:px-14 laptop-wide:px-16 max-w-[1920px] mx-auto overflow-hidden">

      <div className="relative w-full rounded-[28px] sm:rounded-[36px] 2xl:rounded-[44px] laptop-wide:rounded-[50px] bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] p-7 sm:p-10 lg:p-12 xl:p-12 laptop:p-14 2xl:p-16 laptop-wide:p-24 overflow-hidden flex flex-col lg:flex-row items-stretch gap-10 lg:gap-12 xl:gap-14 laptop:gap-16 2xl:gap-16 laptop-wide:gap-20 shadow-2xl">

        <div className="w-full lg:w-[38%] xl:w-[40%] relative flex flex-col justify-center items-center z-10 shrink-0">
          <div className="relative w-full max-w-[320px] sm:max-w-[380px] lg:max-w-none transform hover:scale-105 transition-transform duration-500 m-auto overflow-hidden rounded-[24px] xl:rounded-[28px] 2xl:rounded-[30px] shadow-2xl">
            <div className="absolute inset-0 bg-white/20 blur-[50px] rounded-full"></div>
            <img
              loading="lazy"
              src={image}
              alt={product?.titleEn || "Shaa David's English Companion"}
              className="relative z-10 w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="w-full lg:w-[62%] xl:w-[60%] flex flex-col justify-center items-start z-10 min-w-0 pt-2 lg:pt-0">
          <span className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-[10px] md:text-xs font-black text-[#29425e] bg-white mb-4 md:mb-6 shadow-xl cursor-default font-malayalam uppercase tracking-[0.2em]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#29425e] animate-pulse" />
            ഔദ്യോഗിക പുസ്തകം
          </span>

          <h2 className={`${sectionHeadingOnDarkClass} mb-5 sm:mb-6 text-balance`}>
            {title}
          </h2>

          <p className="text-white/90 text-base sm:text-lg md:text-xl xl:text-lg laptop:text-xl 2xl:text-xl laptop-wide:text-2xl font-malayalam leading-[1.75] sm:leading-[1.8] laptop-wide:leading-[2] w-full max-w-2xl laptop-wide:max-w-3xl font-medium mb-7 sm:mb-8">
            മലയാളത്തിലൂടെ വളരെ എളുപ്പത്തിൽ ഇംഗ്ലീഷ് പഠിക്കാൻ സഹായിക്കുന്ന സമ്പൂർണ്ണ ഗൈഡ്. വ്യാകരണ നിയമങ്ങളുടെ ഭയമില്ലാതെ ആത്മവിശ്വാസത്തോടെ സംസാരിക്കാൻ ഇന്ന് തന്നെ സ്വന്തമാക്കൂ.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 mb-8 sm:mb-10 w-full">
            <div className="flex flex-col w-full sm:w-auto bg-black/20 px-5 py-3 sm:px-6 rounded-2xl backdrop-blur-sm border border-white/10">
              <span className="text-white/60 line-through text-sm md:text-base font-bold">₹{mrp.toLocaleString('en-IN')}</span>
              <span className="text-3xl md:text-4xl 2xl:text-[2.75rem] laptop-wide:text-5xl font-extrabold text-white">₹{price.toLocaleString('en-IN')}</span>
            </div>

            <Link href="/product" className="w-full sm:w-auto flex items-center justify-center gap-3 px-7 sm:px-8 2xl:px-10 laptop-wide:px-12 py-3.5 sm:py-4 2xl:py-5 laptop-wide:py-5 bg-white text-[#29425e] hover:bg-gray-50 transition-all transform hover:scale-105 shadow-xl rounded-full group">
              <span className="font-malayalam font-bold text-base 2xl:text-lg laptop-wide:text-xl tracking-wide">ഇപ്പോൾ വാങ്ങുക</span>
              <svg className="w-5 h-5 laptop-wide:w-6 laptop-wide:h-6 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
            {(product?.features?.slice(0, 2) || [
              '100+ പ്രായോഗിക പാഠങ്ങൾ',
              'യഥാർത്ഥ ജീവിത സംഭാഷണങ്ങൾ',
            ]).map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-black/10 px-4 py-3 rounded-xl border border-white/5 backdrop-blur-sm">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="font-semibold text-white/90 text-sm md:text-base 2xl:text-base laptop-wide:text-lg">{feature}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
