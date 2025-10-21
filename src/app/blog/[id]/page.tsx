"use client";

import React, { useState, useEffect, use } from "react";
import DOMPurify from "dompurify";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { BlurSpot } from "@/components/ui/BlurSpot";
import { motion, MotionConfig } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaCalendarAlt, FaUser, FaArrowLeft, FaTag, FaClock, FaShareAlt } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/store";
import { 
  fetchBlogPostThunk, 
  fetchRelatedPostsThunk, 
  clearCurrentPost 
} from "@/store/slices/blogSlice";


// Motion variants
const slideUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6 } }
};

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: { _id: string; name: string };
  tags: string[];
  status: string;
  publishedAt: string;
  readTime: number;
  views: number;
  likes: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export default function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const dispatch = useAppDispatch();
  const { currentPost, relatedPosts, loading, error } = useAppSelector((s) => s.blog);
  
  // Unwrap params Promise
  const resolvedParams = use(params);

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

  useEffect(() => {
    // resolvedParams.id aslında slug olarak kullanılıyor
    dispatch(fetchBlogPostThunk(resolvedParams.id));
    
    return () => {
      dispatch(clearCurrentPost());
    };
  }, [dispatch, resolvedParams.id]);

  useEffect(() => {
    if (currentPost) {
      dispatch(fetchRelatedPostsThunk(currentPost._id));
    }
  }, [dispatch, currentPost]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !currentPost) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            {error || "Yazı Bulunamadı"}
          </h1>
          <Link href="/blog" className="text-blue-600 dark:text-blue-400 hover:underline">
            Blog sayfasına dön
          </Link>
        </div>
      </div>
    );
  }

  const post = currentPost;

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

        {/* Back Button */}
        <Section className="pt-24 pb-4">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={slideUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <FaArrowLeft className="w-4 h-4" />
                Blog'a Dön
              </Link>
            </motion.div>
          </div>
        </Section>

        {/* Article Header */}
        <Section className="py-8">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={slideUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <span className="px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 text-blue-700 dark:text-blue-300 border border-blue-200/70 dark:border-blue-500/30 text-sm font-semibold">
                  {post.category.name}
                </span>
                <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">{post.readTime} dk</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-100 dark:to-slate-200 bg-clip-text text-transparent leading-tight">
                {post.title}
              </h1>
              
              <div 
                className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl mx-auto text-left prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: sanitizeHTML(post.excerpt) }}
              />
              
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm mt-8">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <FaCalendarAlt className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">{new Date(post.publishedAt).toLocaleDateString('tr-TR')}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <FaClock className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">{post.views} görüntülenme</span>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                  <FaShareAlt className="w-4 h-4" />
                  <span className="font-medium">Paylaş</span>
                </button>
              </div>
            </motion.div>
          </div>
        </Section>

        {/* Featured Image */}
        <Section className="py-6">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={slideUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-3xl shadow-2xl"
            >
              <div className="aspect-[16/9] relative">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover"
              />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </div>
            </motion.div>
          </div>
        </Section>

        {/* Article Content */}
        <Section className="py-8">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={slideUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="bg-white/90 dark:bg-slate-900/90 backdrop-blur rounded-3xl p-10 sm:p-12 shadow-xl border border-slate-200/60 dark:border-slate-700/60"
            >
              <div 
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: sanitizeHTML(post.content) }}
              />
            </motion.div>
            
            {/* Tags */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="mt-6 pt-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Etiketler:</span>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </Section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <Section className="py-12">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <motion.div
                variants={slideUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="text-center mb-8"
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
                  İlgili Yazılar
                </h2>
                <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
                  Aynı kategorideki diğer yazılarımızı keşfedin
                </p>
              </motion.div>
              
              <motion.div
                variants={slideUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost._id}
                    href={`/blog/${relatedPost.slug}`}
                    className="group relative overflow-hidden rounded-2xl border border-slate-200/50 dark:border-slate-700/50 bg-white/90 dark:bg-slate-900/90 backdrop-blur shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <Image
                        src={relatedPost.featuredImage}
                        alt={relatedPost.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 rounded-full bg-white/90 dark:bg-slate-800/90 text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {relatedPost.category.name}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-3">
                        <FaClock className="w-3 h-3" />
                        <span>{relatedPost.readTime} dk</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed line-clamp-3">
                        {relatedPost.excerpt}
                      </p>
                    </div>
                  </Link>
                ))}
              </motion.div>
            </div>
          </Section>
        )}

      
      </motion.div>
    </MotionConfig>
  );
}
