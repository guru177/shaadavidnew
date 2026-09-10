'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { toWhatsAppHref } from '@/lib/contactFormat';
import ClientOnly from '@/components/ClientOnly';
import { showsMobileBuyCta } from '@/lib/mobileChrome';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function ChatBotInner() {
  const pathname = usePathname();
  const { settings } = useSiteSettings();
  const whatsappHref = toWhatsAppHref(settings.contact.whatsapp || settings.contact.phone);
  const clearOfBuyBar = showsMobileBuyCta(pathname);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSpeak = (text: string) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const cleanText = text.replace(/^- /, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    let voices = window.speechSynthesis.getVoices();

    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        voices = window.speechSynthesis.getVoices();
      };
    }

    const isFemale = (v: SpeechSynthesisVoice) => {
      const name = v.name.toLowerCase();
      return (name.includes('female') || name.includes('samantha') || name.includes('zira') ||
              name.includes('heera') || name.includes('neerja') || name.includes('google us english') ||
              name.includes('victoria') || name.includes('katherine')) &&
             !name.includes('male') && !name.includes('guy');
    };

    const femaleIndianVoice = voices.find(v => v.lang.includes('en-IN') && isFemale(v));
    const anyIndianVoice = voices.find(v => v.lang.includes('en-IN') && !v.name.toLowerCase().includes('male'));
    const femaleEnglishVoice = voices.find(v => isFemale(v));

    const selectedVoice = femaleIndianVoice || anyIndianVoice || femaleEnglishVoice || voices[0];

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.pitch = 1.1;
    utterance.rate = 0.9;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    // Lock page scroll on small screens while chat is open
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 639px)').matches) {
      document.body.style.overflow = 'hidden';
    }
    const t = window.setTimeout(() => inputRef.current?.focus(), 250);
    return () => {
      document.body.style.overflow = prev;
      window.clearTimeout(t);
    };
  }, [isOpen]);

  // Keep admin surfaces clean — floating CTAs belong on the public site only
  if (pathname?.startsWith('/admin')) return null;

  // Stack above the mobile Buy bar when it is visible:
  // AI (lower) → WhatsApp (higher), with ~12px gap between 48–56px buttons.
  const aiBottom = clearOfBuyBar
    ? "bottom-[4.5rem] max-[1020px]:bottom-[4.75rem] lg:bottom-10"
    : "bottom-5 lg:bottom-10";
  const waBottom = clearOfBuyBar
    ? "bottom-[9rem] max-[1020px]:bottom-[9.25rem] lg:bottom-32"
    : "bottom-[5.5rem] lg:bottom-32";

  // Sit just under the fixed site header; stretch down to FAB clearance on mobile
  const panelPosition = clearOfBuyBar
    ? "top-[calc(5.5rem+env(safe-area-inset-top))] md:top-[calc(6.25rem+env(safe-area-inset-top))] bottom-[calc(4.75rem+env(safe-area-inset-bottom))] max-[1020px]:bottom-[calc(5rem+env(safe-area-inset-bottom))] sm:bottom-auto"
    : "top-[calc(5.5rem+env(safe-area-inset-top))] md:top-[calc(6.25rem+env(safe-area-inset-top))] bottom-[calc(4.5rem+env(safe-area-inset-bottom))] sm:bottom-auto";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      const data = await response.json();
      if (data.content) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.content }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              'English:\n- Sorry, I could not reply right now.\n\nMalayalam:\n- ക്ഷമിക്കണം, ഇപ്പോൾ മറുപടി നൽകാൻ കഴിഞ്ഞില്ല.\n\nTip:\n- ദയവായി പിന്നീട് വീണ്ടും ശ്രമിക്കുക.',
          },
        ]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'English:\n- Network error. Please try again.\n\nMalayalam:\n- നെറ്റ്‌വർക്ക് പിശക്. ദയവായി വീണ്ടും ശ്രമിക്കുക.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* WhatsApp Floating Button */}
      {!isOpen && (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className={`fixed ${waBottom} right-4 sm:right-6 z-[100] w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-emerald-500/80 backdrop-blur-md border border-white/40 ring-4 ring-emerald-500/10 flex items-center justify-center text-white shadow-[0_10px_40px_rgba(16,185,129,0.2)] hover:scale-110 active:scale-95 transition-all duration-500 group overflow-hidden`}
          title="Chat on WhatsApp"
        >
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[length:250%_250%] animate-shimmer pointer-events-none" />
          <svg className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 relative z-10 drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.067 2.877 1.215 3.076.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.393 0 12.026c0 2.12.554 4.189 1.602 6.006L0 24l6.135-1.61a11.803 11.803 0 005.911 1.586h.005c6.634 0 12.032-5.396 12.034-12.028a11.794 11.794 0 00-3.417-8.467z" />
          </svg>
        </a>
      )}

      {/* Floating Button Label (Desktop Only) */}
      {!isOpen && (
        <div className="fixed bottom-24 lg:bottom-10 right-24 hidden lg:flex items-center px-4 py-2 bg-[#29425e] text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-xl">
          Learn English with AI
          <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-[#29425e]"></div>
        </div>
      )}

      {/* Floating Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close AI tutor' : 'Open AI tutor'}
        className={`fixed z-[100] transition-all duration-500 hover:scale-110 active:scale-95 shadow-2xl flex items-center justify-center
          ${aiBottom} right-4 sm:right-6
          w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-white border-2 border-[#29425e]/30 ring-2 ring-[#29425e] ring-offset-2 ring-offset-[#29425e]/10 text-[#0c1622]`}
      >
        {isOpen ? (
          <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="relative">
            <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <div className="absolute -top-3 -right-3 px-1.5 py-0.5 bg-[#0c1622] text-white text-[8px] font-black rounded-md shadow-lg border border-[#29425e]/50 animate-pulse">AI</div>
          </div>
        )}
      </button>

      {/* Chat Window — anchored under site header, full usable height */}
      <div
        className={`fixed inset-x-3 ${panelPosition} sm:inset-x-auto sm:right-6 z-[490] w-auto sm:w-[400px] sm:h-[min(70dvh,560px)] bg-white/95 backdrop-blur-2xl border border-[#29425e]/20 rounded-[24px] sm:rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.85,0,0.15,1)] origin-top-right
          ${isOpen ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="shrink-0 px-4 py-3.5 sm:p-5 border-b border-gray-100/50 flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer flex items-center justify-center text-white shrink-0">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-[#0c1622] text-sm sm:text-base truncate">AI English Tutor</h3>
            <p className="text-[9px] sm:text-[10px] text-emerald-600 font-black uppercase tracking-widest">
              {isSpeaking ? 'Speaking…' : 'Powered by Advanced AI'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="sm:hidden shrink-0 w-9 h-9 rounded-full bg-gray-100 text-[#0c1622] flex items-center justify-center"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages — min-h-0 so flex can shrink and input stays visible */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 py-4 sm:p-5 space-y-4 sm:space-y-6 [scrollbar-width:thin]">
          {messages.length === 0 && (
            <div className="text-center py-6 sm:py-10">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h4 className="font-bold text-[#0c1622] mb-2 font-malayalam text-sm sm:text-base">നമസ്കാരം! ഞാൻ നിങ്ങളുടെ AI ട്യൂട്ടർ.</h4>
              <p className="text-gray-500 text-xs sm:text-sm font-malayalam px-2 sm:px-4 leading-relaxed">
                ഇംഗ്ലീഷ് പഠിക്കാൻ എന്നോട് സംസാരിക്കാം. മലയാളത്തിലോ ഇംഗ്ലീഷിലോ എന്തെങ്കിലും ചോദിക്കൂ, ഞാൻ തിരുത്തി പറഞ്ഞു തരാം.
              </p>
              <div className="mt-5 sm:mt-8 flex flex-wrap justify-center gap-2 px-2 sm:px-4">
                {['എനിക്ക് വിശക്കുന്നു', 'I am happy', 'How are you?'].map((ex) => (
                  <button
                    key={ex}
                    type="button"
                    onClick={() => {
                      setInput(ex);
                      inputRef.current?.focus();
                    }}
                    className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-bold text-[#395c80] hover:bg-white hover:shadow-sm transition-all italic"
                  >
                    &quot;{ex}&quot;
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div
                className={`max-w-[90%] sm:max-w-[85%] p-3 sm:p-4 rounded-2xl text-sm leading-relaxed
                  ${msg.role === 'user'
                    ? 'bg-[#29425e] text-white rounded-br-none shadow-lg'
                    : 'bg-white border border-gray-100 text-[#0c1622] rounded-bl-none shadow-sm'
                  }`}
              >
                {msg.role === 'assistant' ? (
                  <div className="whitespace-pre-wrap font-medium relative pr-8 sm:pr-10 text-[14px] sm:text-[15px] leading-relaxed">
                    {msg.content.split('\n').map((line, j) => {
                      const lowerLine = line.toLowerCase();
                      const isHeader = lowerLine.startsWith('english:') ||
                                       lowerLine.startsWith('malayalam:') ||
                                       lowerLine.startsWith('better:') ||
                                       lowerLine.startsWith('better pronunciation:') ||
                                       lowerLine.startsWith('reply:') ||
                                       lowerLine.startsWith('reply malayalam:') ||
                                       lowerLine.startsWith('reply pronunciation:') ||
                                       lowerLine.startsWith('tip:') ||
                                       lowerLine.startsWith('pronunciation:');

                      const isEnglishLine = lowerLine.startsWith('english:') ||
                                           lowerLine.startsWith('better:') ||
                                           lowerLine.startsWith('reply:');

                      return (
                        <div key={j} className="relative group/line">
                          <div className={isHeader ? 'font-black text-[#29425e] mt-3 first:mt-0 uppercase text-[10px] sm:text-[11px] tracking-widest' : 'pl-1 sm:pl-2 text-gray-700 break-words'}>
                            {line}
                          </div>
                          {isEnglishLine && line.trim() && (
                            <button
                              type="button"
                              onClick={() => {
                                const textToSpeak = line.includes(':') ? line.split(':').slice(1).join(':').trim() : line;
                                handleSpeak(textToSpeak);
                              }}
                              className="absolute right-[-28px] sm:right-[-36px] top-1/2 -translate-y-1/2 p-1.5 text-emerald-600 hover:scale-110 active:scale-95 transition-all rounded-full bg-emerald-50 border border-emerald-100 shadow-sm flex items-center justify-center"
                              title="Listen to pronunciation"
                            >
                              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                              </svg>
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-bl-none shadow-sm flex gap-1">
                <span className="w-1.5 h-1.5 bg-[#29425e] rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-[#29425e] rounded-full animate-bounce delay-150"></span>
                <span className="w-1.5 h-1.5 bg-[#29425e] rounded-full animate-bounce delay-300"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input — always pinned at bottom of panel */}
        <form onSubmit={handleSubmit} className="shrink-0 p-3 sm:p-4 border-t border-gray-100/50 bg-white/80 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:pb-4">
          <div className="relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type message..."
              enterKeyHint="send"
              autoComplete="off"
              className="w-full pl-4 sm:pl-6 pr-12 sm:pr-14 py-3 sm:py-4 rounded-2xl bg-white border-2 border-gray-100 outline-none focus:border-[#395c80] focus:ring-4 focus:ring-[#395c80]/5 transition-all text-sm font-medium"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-1.5 sm:right-2 w-9 h-9 sm:w-10 sm:h-10 bg-[#29425e] text-white rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-30 disabled:scale-100 transition-all shadow-lg shadow-blue-900/20"
              aria-label="Send"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default function ChatBot() {
  return (
    <ClientOnly>
      <ChatBotInner />
    </ClientOnly>
  );
}
