"use client";

import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { Button } from "@/components/ui/Button";
import CKEditorComponent from "@/components/ui/CKEditor";
import { FiPlus, FiEdit, FiTrash2, FiEye, FiSave, FiX } from "react-icons/fi";
import {
  fetchAdminBlogPostsThunk,
  fetchAdminCategoriesThunk,
  createBlogPostThunk,
  updateBlogPostThunk,
  deleteBlogPostThunk,
  createBlogCategoryThunk,
  updateBlogCategoryThunk,
  deleteBlogCategoryThunk,
  clearError
} from "@/store/slices/blogSlice";

import { BlogPost, BlogCategory } from "@/store/slices/blogSlice";

interface BlogManagerProps {}

export default function BlogManager({}: BlogManagerProps) {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((s) => s.auth);
  const { posts, categories, loading, error } = useAppSelector((s) => s.blog);
  
  const [activeTab, setActiveTab] = useState<"posts" | "categories">("posts");
  
  // Post form states
  const [showPostForm, setShowPostForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [postForm, setPostForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    featuredImage: "",
    category: "",
    tags: [] as string[],
    status: "draft" as "draft" | "published" | "archived",
    seoTitle: "",
    seoDescription: "",
  });
  
  // Category form states
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    isActive: true,
  });
  
  const [tagInput, setTagInput] = useState("");

  // Fetch data
  useEffect(() => {
    if (token) {
      dispatch(fetchAdminBlogPostsThunk({ token }));
      dispatch(fetchAdminCategoriesThunk(token));
    }
  }, [dispatch, token]);

  // Post handlers
  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    
    try {
      if (editingPost) {
        await dispatch(updateBlogPostThunk({ 
          token, 
          postId: editingPost._id, 
          postData: {
            ...postForm,
            category: postForm.category as any
          }
        })).unwrap();
      } else {
        await dispatch(createBlogPostThunk({ 
          token, 
          postData: {
            ...postForm,
            category: postForm.category as any
          }
        })).unwrap();
      }
      
      resetPostForm();
    } catch (err) {
      // Error is handled by Redux
    }
  };

  const handlePostDelete = async (postId: string) => {
    if (!token || (typeof window !== 'undefined' && !confirm("Bu yazıyı silmek istediğinizden emin misiniz?"))) return;
    
    try {
      await dispatch(deleteBlogPostThunk({ token, postId })).unwrap();
    } catch (err) {
      // Error is handled by Redux
    }
  };

  const resetPostForm = () => {
    setPostForm({
      title: "",
      excerpt: "",
      content: "",
      featuredImage: "",
      category: "",
      tags: [],
      status: "draft",
      seoTitle: "",
      seoDescription: "",
    });
    setTagInput("");
    setEditingPost(null);
    setShowPostForm(false);
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setPostForm({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      featuredImage: post.featuredImage,
      category: post.category._id,
      tags: post.tags,
      status: post.status as "draft" | "published" | "archived",
      seoTitle: post.seoTitle || "",
      seoDescription: post.seoDescription || "",
    });
    setShowPostForm(true);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !postForm.tags.includes(tagInput.trim())) {
      setPostForm(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setPostForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Category handlers
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    
    try {
      if (editingCategory) {
        await dispatch(updateBlogCategoryThunk({ 
          token, 
          categoryId: editingCategory._id, 
          categoryData: categoryForm 
        })).unwrap();
      } else {
        await dispatch(createBlogCategoryThunk({ 
          token, 
          categoryData: categoryForm 
        })).unwrap();
      }
      
      resetCategoryForm();
    } catch (err) {
      // Error is handled by Redux
    }
  };

  const handleCategoryDelete = async (categoryId: string) => {
    if (!token || (typeof window !== 'undefined' && !confirm("Bu kategoriyi silmek istediğinizden emin misiniz?"))) return;
    
    try {
      await dispatch(deleteBlogCategoryThunk({ token, categoryId })).unwrap();
    } catch (err) {
      // Error is handled by Redux
    }
  };

  const resetCategoryForm = () => {
    setCategoryForm({ name: "", isActive: true });
    setEditingCategory(null);
    setShowCategoryForm(false);
  };

  const handleEditCategory = (category: BlogCategory) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      isActive: category.isActive,
    });
    setShowCategoryForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Blog Yönetimi</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => setActiveTab("posts")}
            variant={activeTab === "posts" ? "primary" : "secondary"}
            size="sm"
          >
            Yazılar
          </Button>
          <Button
            onClick={() => setActiveTab("categories")}
            variant={activeTab === "categories" ? "primary" : "secondary"}
            size="sm"
          >
            Kategoriler
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-red-700 dark:text-red-300">{error}</p>
            <button
              onClick={() => dispatch(clearError())}
              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Posts Tab */}
      {activeTab === "posts" && (
        <div className="space-y-4">
          {/* Add Post Button */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Blog Yazıları</h3>
            <Button
              onClick={() => setShowPostForm(true)}
              className="flex items-center gap-2"
            >
              <FiPlus className="w-4 h-4" />
              Yeni Yazı
            </Button>
          </div>

          {/* Posts List */}
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                Yükleniyor...
              </div>
            ) : posts.length === 0 ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                Henüz blog yazısı yok
              </div>
            ) : (
              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {posts.map((post) => (
                  <div key={post._id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                          {post.title}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded">
                            {post.category.name}
                          </span>
                          <span className={`px-2 py-1 rounded ${
                            post.status === "published" 
                              ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                              : post.status === "draft"
                              ? "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300"
                              : "bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300"
                          }`}>
                            {post.status === "published" ? "Yayında" : 
                             post.status === "draft" ? "Taslak" : "Arşiv"}
                          </span>
                          <span>{post.views} görüntülenme</span>
                          <span>{new Date(post.createdAt).toLocaleDateString('tr-TR')}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => handleEditPost(post)}
                          size="sm"
                          variant="secondary"
                        >
                          <FiEdit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handlePostDelete(post._id)}
                          size="sm"
                          variant="secondary"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === "categories" && (
        <div className="space-y-4">
          {/* Add Category Button */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Kategoriler</h3>
            <Button
              onClick={() => setShowCategoryForm(true)}
              className="flex items-center gap-2"
            >
              <FiPlus className="w-4 h-4" />
              Yeni Kategori
            </Button>
          </div>

          {/* Categories List */}
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            {categories.length === 0 ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                Henüz kategori yok
              </div>
            ) : (
              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {categories.map((category) => (
                  <div key={category._id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold text-slate-900 dark:text-white">
                          {category.name}
                        </h4>
                        <span className={`px-2 py-1 text-xs rounded ${
                          category.isActive 
                            ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                            : "bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300"
                        }`}>
                          {category.isActive ? "Aktif" : "Pasif"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => handleEditCategory(category)}
                          size="sm"
                          variant="secondary"
                        >
                          <FiEdit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleCategoryDelete(category._id)}
                          size="sm"
                          variant="secondary"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Post Form Modal */}
      {showPostForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {editingPost ? "Yazıyı Düzenle" : "Yeni Yazı"}
                </h3>
                <Button
                  onClick={resetPostForm}
                  size="sm"
                  variant="secondary"
                >
                  <FiX className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <form onSubmit={handlePostSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Başlık *
                  </label>
                  <input
                    type="text"
                    value={postForm.title}
                    onChange={(e) => setPostForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Kategori *
                  </label>
                  <select
                    value={postForm.category}
                    onChange={(e) => setPostForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    required
                  >
                    <option value="">Kategori seçin</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Özet *
                </label>
                <textarea
                  value={postForm.excerpt}
                  onChange={(e) => setPostForm(prev => ({ ...prev, excerpt: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  İçerik *
                </label>
                <CKEditorComponent
                  value={postForm.content}
                  onChange={(content) => setPostForm(prev => ({ ...prev, content }))}
                  placeholder="Blog yazısının içeriğini yazın..."
                  height="400px"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Öne Çıkan Resim URL *
                </label>
                <input
                  type="url"
                  value={postForm.featuredImage}
                  onChange={(e) => setPostForm(prev => ({ ...prev, featuredImage: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Etiketler
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                    placeholder="Etiket ekle ve Enter'a bas"
                    className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <Button type="button" onClick={handleAddTag} size="sm">
                    Ekle
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {postForm.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded text-sm flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Durum
                  </label>
                  <select
                    value={postForm.status}
                    onChange={(e) => setPostForm(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="draft">Taslak</option>
                    <option value="published">Yayında</option>
                    <option value="archived">Arşiv</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    SEO Başlık
                  </label>
                  <input
                    type="text"
                    value={postForm.seoTitle}
                    onChange={(e) => setPostForm(prev => ({ ...prev, seoTitle: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    SEO Açıklama
                  </label>
                  <input
                    type="text"
                    value={postForm.seoDescription}
                    onChange={(e) => setPostForm(prev => ({ ...prev, seoDescription: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <Button
                  type="button"
                  onClick={resetPostForm}
                  variant="secondary"
                >
                  İptal
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  <FiSave className="w-4 h-4" />
                  {editingPost ? "Güncelle" : "Kaydet"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Form Modal */}
      {showCategoryForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {editingCategory ? "Kategoriyi Düzenle" : "Yeni Kategori"}
                </h3>
                <Button
                  onClick={resetCategoryForm}
                  size="sm"
                  variant="secondary"
                >
                  <FiX className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <form onSubmit={handleCategorySubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Kategori Adı *
                </label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={categoryForm.isActive}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 text-sm"
                />
                <label htmlFor="isActive" className="ml-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  Aktif
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <Button
                  type="button"
                  onClick={resetCategoryForm}
                  variant="secondary"
                >
                  İptal
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  <FiSave className="w-4 h-4" />
                  {editingCategory ? "Güncelle" : "Kaydet"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
