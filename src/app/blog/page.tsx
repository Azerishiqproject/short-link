"use client";

import React, { useEffect } from "react";
import DOMPurify from "dompurify";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { BlurSpot } from "@/components/ui/BlurSpot";
import { motion, MotionConfig } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaCalendarAlt, FaUser, FaArrowRight, FaTag } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/store";
import { 
  fetchBlogPostsThunk, 
  fetchBlogCategoriesThunk, 
  setSearchTerm, 
  setSelectedCategory 
} from "@/store/slices/blogSlice";
import Pagination from "@/components/common/Pagination";

// Motion variants
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const slideUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6 } }
};

export default function BlogPage() {
  const dispatch = useAppDispatch();
  const { posts, categories, loading, error, searchTerm, selectedCategory, pagination } = useAppSelector((s) => s.blog);

  // Güvenli HTML renderer
  const sanitizeHTML = (html: string) => {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'br', 'strong', 'em', 'u', 's', 'mark',
        'ul', 'ol', 'li',
        'blockquote', 'pre', 'code',
        'a', 'img',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'div', 'span', 'section', 'article',
        'hr'
      ],
      ALLOWED_ATTR: [
        'href', 'target', 'rel', 'src', 'alt', 'title',
        'class', 'id', 'style', 'width', 'height'
      ],
      ALLOW_DATA_ATTR: false
    });
  };

  // Her component mount'ta verileri çek
  useEffect(() => {
    dispatch(fetchBlogPostsThunk({ page: 1, limit: 9 }));
    dispatch(fetchBlogCategoriesThunk());
  }, [dispatch]);

  // Not: Veriler boşsa tekrar tekrar çekmeyelim; boş durumda boş-state gösteriyoruz

  // Sayfa focus olduğunda verileri yenile
  useEffect(() => {
    const handleFocus = () => {
      if (posts.length === 0) {
        dispatch(fetchBlogPostsThunk({ page: 1, limit: 9 }));
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('focus', handleFocus);
      return () => window.removeEventListener('focus', handleFocus);
    }
  }, [posts.length, dispatch]);

  const handleCategoryChange = (category: string) => {
    dispatch(setSelectedCategory(category));
    dispatch(fetchBlogPostsThunk({ 
      page: 1, 
      limit: 9, 
      category: category === "Tümü" ? "" : category 
    }));
  };

  const handleSearchChange = (term: string) => {
    dispatch(setSearchTerm(term));
    dispatch(fetchBlogPostsThunk({ 
      page: 1, 
      limit: 9, 
      search: term,
      category: selectedCategory === "Tümü" ? "" : selectedCategory
    }));
  };

  const handlePageChange = (page: number) => {
    dispatch(fetchBlogPostsThunk({ 
      page, 
      limit: 9, 
      category: selectedCategory === "Tümü" ? "" : selectedCategory,
      search: searchTerm
    }));
  };

  const allCategories = ["Tümü", ...categories.map(cat => cat.name)];

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className="relative overflow-x-hidden will-change-transform"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Background */}
        <div className="absolute inset-0 -z-20 bg-gradient-to-b from-[#F8FBFF] via-white to-[#F5F7FB] dark:from-slate-900 dark:via-slate-950 dark:to-slate-900" />
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-20" style={{backgroundImage:"radial-gradient(#e5e7eb 1px, transparent 1px)", backgroundSize:"24px 24px"}} />
        <div className="pointer-events-none absolute inset-0 -z-10 hidden dark:block opacity-12" style={{backgroundImage:"radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize:"24px 24px"}} />

        {/* Hero Section */}
        <Section className="pt-24 sm:pt-28 pb-14 sm:pb-20">
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <BlurSpot className="absolute left-4 sm:left-8 top-8 hidden sm:block" color="#60a5fa" size={160} opacity={0.18} />
              <BlurSpot className="absolute right-6 top-[240px] hidden md:block" color="#a78bfa" size={200} opacity={0.16} />
            </div>
            
            <motion.div
              variants={slideUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="text-center space-y-6"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-200/70 dark:border-blue-500/30 text-xs sm:text-sm">
                <FaTag className="w-3 h-3" />
                Blog
              </span>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                Link Kısaltma ve Dijital Pazarlama Rehberi
              </h1>
              <p className="mx-auto max-w-2xl text-slate-600 dark:text-slate-300 text-base sm:text-lg">
                Link yönetimi, analitik ve dijital pazarlama konularında uzman görüşleri ve pratik ipuçları.
              </p>
            </motion.div>
          </div>
        </Section>

        {/* Search and Filter Section */}
        <Section className="py-8">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* Search Bar */}
             

              {/* Category Filter */}
              <motion.div variants={slideUp} className="flex flex-wrap justify-center gap-2">
                {allCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedCategory === category
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </Section>

        {/* Blog Posts Grid */}
        <Section className="py-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            {loading && posts.length === 0 ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-slate-600 dark:text-slate-400">Yükleniyor...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                <Button onClick={() => dispatch(fetchBlogPostsThunk({ page: 1, limit: 9 }))}>
                  Tekrar Dene
                </Button>
              </div>
            ) : (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {posts.map((post, index) => (
                  <motion.article
                    key={post._id}
                    variants={slideUp}
                    whileHover={{ y: -4, scale: 1.01 }}
                    className={`group relative overflow-hidden transition-all duration-300 ${
                      index % 3 === 0 
                        ? "md:col-span-2 lg:col-span-1" 
                        : index % 3 === 1 
                        ? "md:col-span-1 lg:col-span-1"
                        : "md:col-span-1 lg:col-span-1"
                    }`}
                  >
                  {/* Card Container */}
                  <div className="relative h-full bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5 dark:opacity-10">
                      <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 20% 80%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 80% 20%, #8b5cf6 0%, transparent 50%)`
                      }} />
                    </div>
                    
                    {/* Image Section */}
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1.5 rounded-full bg-white/95 dark:bg-slate-800/95 backdrop-blur text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-lg">
                          {post.category.name}
                        </span>
                      </div>
                      
                      {/* Read Time Badge */}
                      <div className="absolute top-4 right-4">
                        <span className="px-2.5 py-1 rounded-full bg-black/20 backdrop-blur text-xs font-medium text-white">
                          {post.readTime} dk
                        </span>
                      </div>
                    </div>
                    
                    {/* Content Section */}
                    <div className="relative p-6 space-y-4">
                      {/* Meta Info */}
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <FaCalendarAlt className="w-3 h-3" />
                            <span>{new Date(post.publishedAt).toLocaleDateString('tr-TR')}</span>
                          </div>
                          <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                          <div className="flex items-center gap-1">
                            <span>{post.views} görüntülenme</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Title */}
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 line-clamp-2">
                        {post.title}
                      </h2>
                      
                      {/* Excerpt */}
                      <div 
                        className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed line-clamp-3 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: sanitizeHTML(post.excerpt) }}
                      />
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-900/30 text-xs font-medium text-blue-700 dark:text-blue-300"
                          >
                            #{tag}
                          </span>
                        ))}
                        {post.tags.length > 2 && (
                          <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-xs text-slate-500 dark:text-slate-400">
                            +{post.tags.length - 2}
                          </span>
                        )}
                      </div>
                      
                      {/* Read More Button */}
                      <div className="pt-2">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm hover:gap-3 transition-all duration-300 group/link"
                    >
                      <span>Devamını Oku</span>
                      <FaArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform duration-300" />
                    </Link>
                      </div>
                    </div>
                    
                    {/* Hover Effect Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  </div>
                </motion.article>
                ))}

                {posts.length === 0 && (
                  <motion.div
                    variants={fadeIn}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="text-center py-12"
                  >
                    <div className="text-slate-500 dark:text-slate-400">
                      <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.636M15 6.5a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0z" />
                      </svg>
                      <p className="text-lg font-medium mb-2">Daha haber yok</p>
                      <p className="text-sm">Yeni içerikler eklendiğinde burada göreceksiniz</p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>
        </Section>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <Section className="py-8">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <motion.div
                variants={slideUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="flex justify-center"
              >
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </motion.div>
            </div>
          </Section>
        )}
      </motion.div>
    </MotionConfig>
  );
}
