"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/store";
import { useTheme } from "@/providers/ThemeProvider";
import Image from "next/image";

export function Navbar() {
  const { user, hydrated } = useAppSelector((s) => s.auth);
  const { isDark, toggle } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const onScroll = () => setIsScrolled(window.scrollY > 8);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }
  }, []);

  if (!hydrated) return null;
  return (
    <header className="fixed top-0 inset-x-0 z-50 pointer-events-none py-2 sm:py-3">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className={`pointer-events-auto rounded-3xl px-4 py-3 backdrop-blur-md border flex items-center justify-between transition-all duration-300 ${isScrolled ? "h-12 sm:h-14 bg-white/90 dark:bg-slate-900/90 border-slate-200/50 dark:border-slate-700/50 shadow-lg" : "h-14 sm:h-16 bg-white/80 dark:bg-slate-900/80 border-slate-200/30 dark:border-slate-700/30 shadow-md"}`}>
          <Link href="/" className="group">
            <Image
              src={isDark ?  "/AppImage/logo_light.jpeg" : "/AppImage/logo_dark.jpeg"}
              alt="tr.link logo"
              width={140}
              height={50}
              className="h-10 sm:h-12 w-auto group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200">
              Ana Sayfa
            </Link>
            <Link href="/about" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200">
              Hakkımızda
            </Link>
            <Link href="/blog" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200">
              Blog
            </Link>
            <Link href="/statistics" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200">
              Kazanç Oranları
            </Link>
            <Link href="/advertise" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200">
              Reklam Ver
            </Link>
            <Link href="/contact" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200">
              İletişim
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden pointer-events-auto inline-flex items-center justify-center h-8 w-8 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200" 
            title="Menü"
            aria-label="Mobil menüyü aç/kapat"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            )}
          </button>
          
          <div className="hidden md:flex items-center gap-2">
            {/* Theme toggle */}
            <button onClick={toggle} className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200" title="Tema değiştir">
              {isDark ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="1.6"/></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" stroke="currentColor" strokeWidth="1.6"/></svg>
              )}
            </button>
            {user ? (
              <Link
                href="/panel"
                className="px-3 py-2 h-8 inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 text-sm font-medium transition-all duration-200"
                title="Kullanıcı Paneli"
              >
                <span className="hidden sm:inline">{user.name || user.email}</span>
                <span className="sm:hidden">Panel</span>
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3 py-2 h-8 inline-flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium transition-all duration-200"
                >
                  <span className="hidden sm:inline">Giriş Yap</span>
                  <span className="sm:hidden">Giriş</span>
                </Link>
                <Link
                  href="/register"
                  className="px-3 py-2 h-8 inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 text-sm font-medium transition-all duration-200"
                >
                  <span className="hidden sm:inline">Kayıt Ol</span>
                  <span className="sm:hidden">Kayıt</span>
                </Link>
              </>
            )}
          </div>

        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden pointer-events-auto">
            <div className="px-4 py-3 space-y-1">
              {/* Navigation Links */}
              <Link 
                href="/" 
                className="block text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Ana Sayfa
              </Link>
              <Link 
                href="/about" 
                className="block text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Hakkımızda
              </Link>
              <Link 
                href="/blog" 
                className="block text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <Link 
                href="/statistics" 
                className="block text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Kazanç Oranları
              </Link>
              <Link 
                href="/advertise" 
                className="block text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Reklam Ver
              </Link>
              <Link 
                href="/contact" 
                className="block text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                İletişim
              </Link>
              
              {/* Divider */}
              <div className="border-t border-slate-200 dark:border-slate-700 my-2"></div>
              
              {/* Theme Toggle */}
              <button 
                onClick={() => {
                  toggle();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-2 rounded-lg transition-all duration-200"
              >
                <div className="w-6 h-6 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                  {isDark ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="1.6"/>
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6"/>
                      <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" stroke="currentColor" strokeWidth="1.6"/>
                    </svg>
                  )}
                </div>
                <div className="text-sm font-medium">{isDark ? 'Karanlık Tema' : 'Aydınlık Tema'}</div>
              </button>
              
              {/* User Actions */}
              {user ? (
                <Link
                  href="/panel"
                  className="block text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-2 rounded-lg transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.6"/>
                        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.6"/>
                      </svg>
                    </div>
                    <div className="text-sm font-medium">{user.name || user.email}</div>
                  </div>
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-2 rounded-lg transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" stroke="currentColor" strokeWidth="1.6"/>
                          <polyline points="10,17 15,12 10,7" stroke="currentColor" strokeWidth="1.6"/>
                          <line x1="15" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="1.6"/>
                        </svg>
                      </div>
                      <div className="text-sm font-medium">Giriş Yap</div>
                    </div>
                  </Link>
                  <Link
                    href="/register"
                    className="block text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-2 rounded-lg transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.6"/>
                          <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.6"/>
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.6"/>
                        </svg>
                      </div>
                      <div className="text-sm font-medium">Kayıt Ol</div>
                    </div>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;



