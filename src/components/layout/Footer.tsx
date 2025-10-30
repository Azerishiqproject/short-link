import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/providers/ThemeProvider";

export function Footer() {
  const { isDark } = useTheme();
  
  return (
    <footer className="mt-0">
      <div className="w-full px-0">
        <div className="rounded-none border-t border-black/10 bg-gradient-to-br from-white/90 via-white/80 to-white/90 dark:from-slate-900/80 dark:via-slate-900/70 dark:to-slate-900/80 backdrop-blur-xl py-16 shadow-2xl">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-10">
              <div className="sm:col-span-1">
                <div className="group">
                  <Image
                    src={isDark ?  "/AppImage/logo_light.jpeg" : "/AppImage/logo_dark.jpeg"}
                    alt="short.link logo"
                    width={160}
                    height={60}
                    className="h-12 sm:h-14 w-auto group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="mt-4 text-foreground/70 text-base leading-relaxed max-w-sm">Kısa link, akıllı reklam ve gelişmiş analitik. Linklerinizi gelire dönüştürün ve dijital varlığınızı güçlendirin.</p>
                <div className="mt-6 flex items-center gap-4">
                  <a href="#" aria-label="Twitter" className="group size-10 rounded-2xl bg-gradient-to-br from-white to-white/90 dark:from-white/10 dark:to-white/5 border border-black/10 dark:border-white/20 flex items-center justify-center hover:from-blue-500 hover:to-blue-600 hover:border-blue-500/50 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="group-hover:scale-110 transition-transform duration-300"><path d="M22 5.8c-.7.3-1.4.5-2.2.6.8-.5 1.3-1.1 1.6-2-.8.5-1.6.8-2.5 1A3.8 3.8 0 0 0 12 7.9c0 .3 0 .6.1.9-3.2-.2-6-1.7-7.9-4-.4.7-.6 1.4-.6 2.2 0 1.5.8 2.8 2 3.5-.6 0-1.2-.2-1.7-.5v.1c0 2.2 1.6 4 3.7 4.4-.4.1-.8.2-1.2.2-.3 0-.6 0-.9-.1.6 1.8 2.3 3.1 4.3 3.1A7.7 7.7 0 0 1 2 19.5c1.9 1.2 4.1 1.9 6.4 1.9 7.7 0 12-6.4 12-12v-.5c.8-.5 1.4-1.1 1.9-1.8Z" fill="currentColor"/></svg>
                  </a>
                  <a href="#" aria-label="GitHub" className="group size-10 rounded-2xl bg-gradient-to-br from-white to-white/90 dark:from-white/10 dark:to-white/5 border border-black/10 dark:border-white/20 flex items-center justify-center hover:from-gray-800 hover:to-gray-900 hover:border-gray-800/50 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="group-hover:scale-110 transition-transform duration-300"><path d="M12 2C6.5 2 2 6.6 2 12.1c0 4.5 2.9 8.3 6.9 9.6.5.1.7-.2.7-.5v-2c-2.8.6-3.4-1.2-3.4-1.2-.5-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.6 1.1 1.6 1.1.9 1.6 2.5 1.1 3.1.8.1-.7.3-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5.1 0-1.1.4-2 1.1-2.8-.1-.3-.5-1.3.1-2.6 0 0 .9-.3 2.9 1.1.8-.2 1.6-.3 2.4-.3s1.6.1 2.4.3c2-1.4 2.9-1.1 2.9-1.1.6 1.3.2 2.3.1 2.6.7.8 1.1 1.7 1.1 2.8 0 4-2.4 4.8-4.6 5.1.3.3.6.8.6 1.7v2.5c0 .3.2.6.7.5 4-1.3 6.9-5.1 6.9-9.6C22 6.6 17.5 2 12 2Z" fill="currentColor"/></svg>
                  </a>
                  <a href="#" aria-label="LinkedIn" className="group size-10 rounded-2xl bg-gradient-to-br from-white to-white/90 dark:from-white/10 dark:to-white/5 border border-black/10 dark:border-white/20 flex items-center justify-center hover:from-blue-600 hover:to-blue-700 hover:border-blue-600/50 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="group-hover:scale-110 transition-transform duration-300"><path d="M6.9 8.5H4V20h2.9V8.5ZM5.4 7.1A1.7 1.7 0 1 0 5.4 3a1.7 1.7 0 0 0 0 3.4ZM20 20h-2.9v-6.2c0-1.5-.5-2.5-1.9-2.5-1 0-1.5.7-1.7 1.4-.1.2-.1.6-.1.9V20H10V8.5h2.8v1.6c.4-.6 1.1-1.6 2.8-1.6 2.1 0 3.4 1.4 3.4 4.3V20Z" fill="currentColor"/></svg>
                  </a>
                </div>
              </div>
              <div className="text-base">
                <p className="font-bold text-lg mb-4 bg-gradient-to-r from-black to-black/80 dark:from-white dark:to-white/80 bg-clip-text text-transparent">Ürün</p>
                <ul className="space-y-3">
                  <li>
                    <Link href="/" className="group flex items-center text-foreground/70 hover:text-foreground transition-colors duration-300 hover:translate-x-1">
                      <span className="w-1 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>Ana Sayfa
                    </Link>
                  </li>
                  <li>
                    <Link href="/statistics" className="group flex items-center text-foreground/70 hover:text-foreground transition-colors duration-300 hover:translate-x-1">
                      <span className="w-1 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>Kazanç Oranları
                    </Link>
                  </li>
                  <li>
                    <Link href="/advertise" className="group flex items-center text-foreground/70 hover:text-foreground transition-colors duration-300 hover:translate-x-1">
                      <span className="w-1 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>Reklam Ver
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="text-base">
                <p className="font-bold text-lg mb-4 bg-gradient-to-r from-black to-black/80 dark:from-white dark:to-white/80 bg-clip-text text-transparent">Kaynaklar</p>
                <ul className="space-y-3">
                  <li>
                    <Link href="/about" className="group flex items-center text-foreground/70 hover:text-foreground transition-colors duration-300 hover:translate-x-1">
                      <span className="w-1 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>Hakkımızda
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="group flex items-center text-foreground/70 hover:text-foreground transition-colors duration-300 hover:translate-x-1">
                      <span className="w-1 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>İletişim
                    </Link>
                  </li>
                  <li>
                    <Link href="/sss" className="group flex items-center text-foreground/70 hover:text-foreground transition-colors duration-300 hover:translate-x-1">
                      <span className="w-1 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>SSS
                    </Link>
                  </li>
                  <li>
                    <Link href="/policies" className="group flex items-center text-foreground/70 hover:text-foreground transition-colors duration-300 hover:translate-x-1">
                      <span className="w-1 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>Politikalar
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="text-base">
                <p className="font-bold text-lg mb-4 bg-gradient-to-r from-black to-black/80 dark:from-white dark:to-white/80 bg-clip-text text-transparent">Şirket</p>
                <ul className="space-y-3">
                  <li>
                    <Link href="/panel" className="group flex items-center text-foreground/70 hover:text-foreground transition-colors duration-300 hover:translate-x-1">
                      <span className="w-1 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>Panel
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-gradient-to-r from-transparent via-black/20 to-transparent dark:via-white/20">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-foreground/60 text-sm flex items-center gap-2">
                  <span>© {new Date().getFullYear()}</span>
                  <span className="w-1 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
                  <span className="font-semibold bg-gradient-to-r from-black to-black/80 dark:from-white dark:to-white/80 bg-clip-text text-transparent">short.link</span>
                  <span>• Tüm hakları saklıdır.</span>
                </p>
                <nav className="flex items-center gap-6">
                 
                  <Link href="/policies" className="group text-foreground/60 hover:text-foreground text-sm font-medium transition-all duration-300 hover:translate-y-[-1px] relative">
                    <span className="relative z-10">Koşullar</span>
                    <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-500 to-blue-500 group-hover:w-full transition-all duration-300"></div>
                  </Link>
                 
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;


