import React from 'react';

const TEXT_ITEMS = [
  "Grammar ഭയങ്ങളില്ലാതെ പഠനം",
  "ദൈനംദിന വാക്കുകൾ അടിസ്ഥാനമാക്കി",
  "സ്വന്തമായി വാക്യങ്ങൾ ഉണ്ടാക്കാനുള്ള പരിശീലനം",
  "Beginners-നുള്ള Easy-to-Follow Format",
  "മലയാളത്തിലൂടെ ഇംഗ്ലീഷ് പഠിക്കാം",
  "തെറ്റുമെന്ന ഭയം ഇല്ലാതെ സംസാരിക്കാം",
];

export default function TextSlider() {
  return (
    <div className="relative w-full bg-white overflow-hidden py-5 xl:py-6 z-40 border-t border-[#29425e]/10">
      {/* Top Double Gradient Border */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto]" />
      <div className="absolute top-[5px] left-0 w-full h-[1px] bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] opacity-60" />

      {/* Bottom Double Gradient Border */}
      <div className="absolute bottom-[5px] left-0 w-full h-[1px] bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] opacity-60" />
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto]" />

      {/* Slider Content */}
      <div className="flex w-max animate-marquee will-change-transform items-center min-h-[2.75rem] xl:min-h-[3.25rem]">
        {[...TEXT_ITEMS, ...TEXT_ITEMS, ...TEXT_ITEMS, ...TEXT_ITEMS].map((text, index) => (
          <div key={index} className="flex items-center">
            {/* Solid color avoids bg-clip glyph cropping in the marquee */}
            <span className="text-[#29425e] font-malayalam text-base md:text-lg lg:text-xl 2xl:text-2xl font-extrabold tracking-wide px-6 md:px-10 2xl:px-12 whitespace-nowrap leading-[1.8] antialiased">
              {text}
            </span>
            <div className="flex-shrink-0 flex items-center justify-center grayscale">
              <svg
                className="w-5 h-5 md:w-6 md:h-6 2xl:w-8 2xl:h-8 text-[#111]"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
