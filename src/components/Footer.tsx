'use client';

import React from 'react';
import { FaLink, FaShieldAlt, FaEnvelope, FaChevronRight, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { FaFacebookF, FaInstagram, FaXTwitter, FaYoutube } from 'react-icons/fa6';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { formatPhoneDisplay, toTelHref } from '@/lib/contactFormat';
import { LEGAL_NAV } from '@/types/legal';

export default function Footer() {
  const pathname = usePathname();
  const hasMobileCTA = pathname !== '/product';
  const { settings } = useSiteSettings();

  const socialItems = [
    { icon: <FaFacebookF className="w-4 h-4" />, href: settings.social.facebook },
    { icon: <FaInstagram className="w-4 h-4" />, href: settings.social.instagram },
    { icon: <FaXTwitter className="w-4 h-4" />, href: settings.social.twitter },
    { icon: <FaYoutube className="w-4 h-4" />, href: settings.social.youtube },
  ].filter((s) => s.href);

  const locationLabel = [settings.contact.state, settings.contact.country].filter(Boolean).join(', ') || 'Kerala, India';
  const phoneHref = toTelHref(settings.contact.phone);
  const phoneLabel = formatPhoneDisplay(settings.contact.phone);
  const brandName = (settings.siteName || 'Shaa David').replace(/'s Academy$/i, '').trim() || 'Shaa David';

  return (
    <footer
      className={`w-full bg-[linear-gradient(180deg,#29425e_0%,#0c1622_100%)] rounded-t-[40px] xl:rounded-t-[60px] pt-12 xl:pt-16 overflow-hidden relative ${
        hasMobileCTA ? 'pb-[88px] min-[1021px]:pb-8' : 'pb-4 sm:pb-8'
      }`}
    >
      <div className="max-w-[1920px] mx-auto px-5 sm:px-8 xl:px-12 2xl:px-16 flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-12 xl:mb-16">
          {/* Brand */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-white rounded-full overflow-hidden flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 relative shrink-0">
                <img src="/logo.png" alt={settings.siteName} className="h-full w-full object-cover" />
              </div>
              <span className="text-white font-extrabold text-lg sm:text-xl tracking-[0.08em] uppercase">
                {brandName}
              </span>
            </div>

            <p className="text-white/80 text-sm xl:text-[15px] leading-[1.8] mb-8 font-malayalam pr-4 lg:pr-10 max-w-md">
              മലയാളത്തിലൂടെ വളരെ എളുപ്പത്തിൽ ഇംഗ്ലീഷ് പഠിക്കാൻ സഹായിക്കുന്ന സമ്പൂർണ്ണ ഗൈഡ്. വ്യാകരണ ഭയമില്ലാതെ ആത്മവിശ്വാസത്തോടെ സംസാരിക്കാം.
            </p>

            {socialItems.length > 0 && (
              <div className="flex items-center gap-3">
                {socialItems.map((item, i) => (
                  <a
                    key={i}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-all"
                    aria-label="Social link"
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-10 xl:gap-12 pl-0 lg:pl-8 xl:pl-12">
            {/* Quick Links */}
            <div className="flex flex-col">
              <h4 className="text-white font-extrabold mb-6 text-base xl:text-lg tracking-wide flex items-center gap-2.5">
                <FaLink className="w-4 h-4 text-white" />
                Quick Links
              </h4>
              <ul className="flex flex-col gap-3.5">
                {[
                  { name: 'Home', href: '/' },
                  { name: 'About Us', href: '/about' },
                  { name: 'Services', href: '/services' },
                  { name: 'Products', href: '/product' },
                  { name: 'Blog', href: '/blogs' },
                  { name: 'Contact', href: '/contact' },
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-white/85 hover:text-white text-sm xl:text-[15px] transition-colors flex items-center gap-2 group"
                    >
                      <FaChevronRight className="w-2.5 h-2.5 text-white/70 group-hover:translate-x-1 transition-transform" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legals */}
            <div className="flex flex-col">
              <h4 className="text-white font-extrabold mb-6 text-base xl:text-lg tracking-wide flex items-center gap-2.5">
                <FaShieldAlt className="w-4 h-4 text-white" />
                Legals
              </h4>
              <ul className="flex flex-col gap-3.5">
                {LEGAL_NAV.map((link) => (
                  <li key={link.slug}>
                    <Link
                      href={link.href}
                      className="text-white/85 hover:text-white text-sm xl:text-[15px] transition-colors flex items-center gap-2 group"
                    >
                      <FaChevronRight className="w-2.5 h-2.5 text-white/70 group-hover:translate-x-1 transition-transform" />
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="flex flex-col">
              <h4 className="text-white font-extrabold mb-6 text-base xl:text-lg tracking-wide flex items-center gap-2.5">
                <FaEnvelope className="w-4 h-4 text-white" />
                Contact
              </h4>
              <ul className="flex flex-col gap-4">
                {settings.contact.email && (
                  <li>
                    <a
                      href={`mailto:${settings.contact.email}`}
                      className="text-white/85 hover:text-white text-sm xl:text-[15px] transition-colors flex items-center gap-2.5"
                    >
                      <FaEnvelope className="w-3.5 h-3.5 text-white shrink-0" />
                      {settings.contact.email}
                    </a>
                  </li>
                )}
                {settings.contact.phone && (
                  <li>
                    <a
                      href={phoneHref}
                      className="text-white/85 hover:text-white text-sm xl:text-[15px] transition-colors flex items-center gap-2.5"
                    >
                      <FaPhoneAlt className="w-3.5 h-3.5 text-white shrink-0" />
                      {phoneLabel}
                    </a>
                  </li>
                )}
                <li>
                  <div className="text-white/85 text-sm xl:text-[15px] flex items-center gap-2.5">
                    <FaMapMarkerAlt className="w-3.5 h-3.5 text-white shrink-0" />
                    <span>{locationLabel}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 mt-2 pt-6 pb-2">
          <p className="text-white text-sm sm:text-[16px] z-10">
            © {new Date().getFullYear()} {brandName}.
          </p>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 hidden sm:block select-none">
            <span className="font-malayalam-display text-white/5 text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-[0.12em] uppercase whitespace-nowrap">
              {brandName}
            </span>
          </div>

          <p className="text-white text-sm sm:text-[16px] z-10">
            Powered By <span className="font-bold">Craftelux.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
