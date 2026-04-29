import React from 'react';
import { FaLink, FaShieldAlt, FaEnvelope, FaChevronRight, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { FaFacebookF, FaInstagram, FaXTwitter, FaYoutube } from 'react-icons/fa6';

export default function Footer() {
  return (
    <footer className="w-full bg-[#353941] rounded-t-[40px] xl:rounded-t-[60px] pt-12 xl:pt-16 pb-8 overflow-hidden relative">
      <div className="max-w-[1920px] mx-auto px-5 sm:px-8 xl:px-12 2xl:px-16 flex flex-col">

        {/* Top Section - Links */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-12 xl:mb-16">

          {/* Logo & Description (Span 4) */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center p-1.5">
                <img src="/icon.png" alt="Shaa David Icon" className="w-full h-full object-contain" />
              </div>
              <span className="text-white text-xl xl:text-2xl font-bold tracking-tight">SHAA DAVID</span>
            </div>
            <p className="text-gray-400 text-sm xl:text-sm leading-relaxed mb-8 font-malayalam pr-4 lg:pr-12">
              മലയാളത്തിലൂടെ വളരെ എളുപ്പത്തിൽ ഇംഗ്ലീഷ് പഠിക്കാൻ സഹായിക്കുന്ന സമ്പൂർണ്ണ ഗൈഡ്. വ്യാകരണ ഭയമില്ലാതെ ആത്മവിശ്വാസത്തോടെ സംസാരിക്കാം.
            </p>
            <div className="flex items-center gap-3">
              {/* Social Icons */}
              {[
                <FaFacebookF key="1" className="w-4 h-4" />,
                <FaInstagram key="2" className="w-4 h-4" />,
                <FaXTwitter key="3" className="w-4 h-4" />,
                <FaYoutube key="4" className="w-4 h-4" />
              ].map((icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns (Span 8) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8 xl:gap-12 pl-0 lg:pl-12">

            {/* Col 1 */}
            <div className="flex flex-col">
              <h4 className="text-white font-extrabold mb-6 text-base xl:text-lg tracking-wide flex items-center gap-2">
                <FaLink className="w-4 h-4 text-white" />
                Quick Links
              </h4>
              <ul className="flex flex-col gap-4">
                {[
                  { name: 'Home', href: '/' },
                  { name: 'About Us', href: '/about' },
                  { name: 'Services', href: '/service' },
                  { name: 'Products', href: '/product' },
                  { name: 'Blog', href: '/blogs' },
                  { name: 'Contact', href: '/contact' }
                ].map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-gray-400 hover:text-white text-sm xl:text-[15px] transition-colors flex items-center gap-2 group">
                      <FaChevronRight className="w-2.5 h-2.5 text-white group-hover:translate-x-1 transition-transform" />
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 2 */}
            <div className="flex flex-col">
              <h4 className="text-white font-extrabold mb-6 text-base xl:text-lg tracking-wide flex items-center gap-2">
                <FaShieldAlt className="w-4 h-4 text-white" />
                Legals
              </h4>
              <ul className="flex flex-col gap-4">
                {['Privacy Policy', 'Terms & Conditions', 'Refund Policy', 'Cookie Policy'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-white text-sm xl:text-[15px] transition-colors flex items-center gap-2 group">
                      <FaChevronRight className="w-2.5 h-2.5 text-white group-hover:translate-x-1 transition-transform" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3 */}
            <div className="flex flex-col">
              <h4 className="text-white font-extrabold mb-6 text-base xl:text-lg tracking-wide flex items-center gap-2">
                <FaEnvelope className="w-4 h-4 text-white" />
                Contact
              </h4>
              <ul className="flex flex-col gap-4">
                <li>
                  <a href="mailto:info@shaadavid.com" className="text-gray-400 hover:text-white text-sm xl:text-[15px] transition-colors flex items-center gap-2">
                    <FaEnvelope className="w-3.5 h-3.5 text-white" /> info@shaadavid.com
                  </a>
                </li>
                <li>
                  <a href="tel:+917907075923" className="text-gray-400 hover:text-white text-sm xl:text-[15px] transition-colors flex items-center gap-2">
                    <FaPhoneAlt className="w-3.5 h-3.5 text-white" /> +91 790 7075 923
                  </a>
                </li>
                <li>
                  <div className="text-gray-400 text-sm xl:text-[15px] flex items-center gap-2 mt-2">
                    <FaMapMarkerAlt className="w-3.5 h-3.5 text-white" /> Kerala, India
                  </div>
                </li>
              </ul>
            </div>

          </div>
        </div>


        {/* Bottom Section - Copyright */}
        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t-4 border-double border-white/20">
          <p className="text-white text-[16px] xl:text-[16px] z-10">
            © {new Date().getFullYear()} Shaa David.
          </p>

          {/* Centered Faded Text */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pt-6 text-white/5 text-[50px] md:text-[80px] lg:text-[120px] font-black tracking-[0.2em] uppercase pointer-events-none z-0 whitespace-nowrap hidden sm:block">
            SHAA DAVID
          </div>

          <div className="flex items-center gap-3 text-white text-[16px] xl:text-[16px] z-10">
            <a href="#" className="hover:text-gray-300 transition-colors">Powered By <span className="font-bold">Crafteluxe</span></a>
          </div>
        </div>

      </div>
    </footer>
  );
}
