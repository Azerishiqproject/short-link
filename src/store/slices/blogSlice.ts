import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

const API_URL = process.env.API_URL ;

// Types
export interface BlogPost {
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

export interface BlogCategory {
  _id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
}

export interface BlogPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface BlogState {
  posts: BlogPost[];
  categories: BlogCategory[];
  currentPost: BlogPost | null;
  relatedPosts: BlogPost[];
  featuredPosts: BlogPost[];
  pagination: BlogPagination | null;
  loading: boolean;
  error: string | null;
  selectedCategory: string;
}

const initialState: BlogState = {
  posts: [],
  categories: [],
  currentPost: null,
  relatedPosts: [],
  featuredPosts: [],
  pagination: null,
  loading: false,
  error: null,
  selectedCategory: "Tümü",
};

// Async Thunks
export const fetchBlogPostsThunk = createAsyncThunk<
  { posts: BlogPost[]; pagination: BlogPagination },
  { page?: number; limit?: number; category?: string; retryCount?: number }
>(
  "blog/fetchPosts",
  async ({ page = 1, limit = 10, category = "", retryCount = 0 }, { rejectWithValue }) => {
    const maxRetries = 3;
    const retryDelay = 1000; // 1 second

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        
        if (category) params.append("category", category);

        const res = await fetch(`${API_URL}/api/blog/posts?${params}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // Add timeout
          signal: AbortSignal.timeout(15000), // 15 second timeout
        });
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP ${res.status}: Failed to fetch blog posts`);
        }
        
        const data = await res.json();
        
        // Validate response structure
        if (!data.posts || !Array.isArray(data.posts)) {
          throw new Error("Invalid response format from server");
        }
        
        return data;
      } catch (error) {
        console.error(`Blog posts fetch error (attempt ${attempt + 1}/${maxRetries + 1}):`, error);
        
        // If this is the last attempt, reject with error
        if (attempt === maxRetries) {
          if (error instanceof Error) {
            return rejectWithValue(error.message);
          }
          return rejectWithValue("An unexpected error occurred");
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
      }
    }
    
    return rejectWithValue("Max retries exceeded");
  }
);

export const fetchBlogPostThunk = createAsyncThunk<BlogPost, string>(
  "blog/fetchPost",
  async (slug) => {
    const res = await fetch(`${API_URL}/api/blog/posts/${slug}`);
    if (!res.ok) {
      if (res.status === 404) throw new Error("Post not found");
      throw new Error("Failed to fetch blog post");
    }
    return await res.json();
  }
);

export const fetchBlogCategoriesThunk = createAsyncThunk<BlogCategory[]>(
  "blog/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/api/blog/categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${res.status}: Failed to fetch categories`);
      }
      
      const data = await res.json();
      
      if (!Array.isArray(data)) {
        throw new Error("Invalid response format from server");
      }
      
      return data;
    } catch (error) {
      console.error("Blog categories fetch error:", error);
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

export const fetchRelatedPostsThunk = createAsyncThunk<BlogPost[], string>(
  "blog/fetchRelatedPosts",
  async (postId) => {
    const res = await fetch(`${API_URL}/api/blog/related/${postId}`);
    if (!res.ok) throw new Error("Failed to fetch related posts");
    return await res.json();
  }
);

export const fetchFeaturedPostsThunk = createAsyncThunk<BlogPost[], number>(
  "blog/fetchFeaturedPosts",
  async (limit = 3) => {
    const res = await fetch(`${API_URL}/api/blog/featured?limit=${limit}`);
    if (!res.ok) throw new Error("Failed to fetch featured posts");
    return await res.json();
  }
);

// Admin Thunks
export const fetchAdminBlogPostsThunk = createAsyncThunk<
  { posts: BlogPost[]; pagination: BlogPagination },
  { token: string; page?: number; limit?: number; status?: string; search?: string }
>(
  "blog/fetchAdminPosts",
  async ({ token, page = 1, limit = 20, status = "", search = "" }) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (status) params.append("status", status);
    if (search) params.append("search", search);

    const res = await fetch(`${API_URL}/api/admin/blog/posts?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch admin blog posts");
    return await res.json();
  }
);

export const createBlogPostThunk = createAsyncThunk<
  BlogPost,
  { token: string; postData: Partial<BlogPost> }
>(
  "blog/createPost",
  async ({ token, postData }) => {
    const res = await fetch(`${API_URL}/api/admin/blog/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(postData),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to create blog post");
    }
    return await res.json();
  }
);

export const updateBlogPostThunk = createAsyncThunk<
  BlogPost,
  { token: string; postId: string; postData: Partial<BlogPost> }
>(
  "blog/updatePost",
  async ({ token, postId, postData }) => {
    const res = await fetch(`${API_URL}/api/admin/blog/posts/${postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(postData),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to update blog post");
    }
    return await res.json();
  }
);

export const deleteBlogPostThunk = createAsyncThunk<string, { token: string; postId: string }>(
  "blog/deletePost",
  async ({ token, postId }) => {
    const res = await fetch(`${API_URL}/api/admin/blog/posts/${postId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to delete blog post");
    }
    return postId;
  }
);

export const fetchAdminCategoriesThunk = createAsyncThunk<BlogCategory[], string>(
  "blog/fetchAdminCategories",
  async (token) => {
    const res = await fetch(`${API_URL}/api/admin/blog/categories`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch admin categories");
    return await res.json();
  }
);

export const createBlogCategoryThunk = createAsyncThunk<
  BlogCategory,
  { token: string; categoryData: Partial<BlogCategory> }
>(
  "blog/createCategory",
  async ({ token, categoryData }) => {
    const res = await fetch(`${API_URL}/api/admin/blog/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(categoryData),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to create category");
    }
    return await res.json();
  }
);

export const updateBlogCategoryThunk = createAsyncThunk<
  BlogCategory,
  { token: string; categoryId: string; categoryData: Partial<BlogCategory> }
>(
  "blog/updateCategory",
  async ({ token, categoryId, categoryData }) => {
    const res = await fetch(`${API_URL}/api/admin/blog/categories/${categoryId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(categoryData),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to update category");
    }
    return await res.json();
  }
);

export const deleteBlogCategoryThunk = createAsyncThunk<string, { token: string; categoryId: string }>(
  "blog/deleteCategory",
  async ({ token, categoryId }) => {
    const res = await fetch(`${API_URL}/api/admin/blog/categories/${categoryId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to delete category");
    }
    return categoryId;
  }
);

// Slice
const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPost: (state) => {
      state.currentPost = null;
    },
    resetBlogState: (state) => {
      state.posts = [];
      state.categories = [];
      state.currentPost = null;
      state.relatedPosts = [];
      state.featuredPosts = [];
      state.pagination = null;
      state.loading = false;
      state.error = null;
      state.selectedCategory = "Tümü";
    },
    forceRefresh: (state) => {
      state.loading = true;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch blog posts
    builder
      .addCase(fetchBlogPostsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogPostsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.posts;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchBlogPostsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch blog posts";
      });

    // Fetch single blog post
    builder
      .addCase(fetchBlogPostThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogPostThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPost = action.payload;
      })
      .addCase(fetchBlogPostThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch blog post";
      });

    // Fetch categories
    builder
      .addCase(fetchBlogCategoriesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogCategoriesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchBlogCategoriesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch categories";
      });

    // Fetch related posts
    builder
      .addCase(fetchRelatedPostsThunk.fulfilled, (state, action) => {
        state.relatedPosts = action.payload;
      });

    // Fetch featured posts
    builder
      .addCase(fetchFeaturedPostsThunk.fulfilled, (state, action) => {
        state.featuredPosts = action.payload;
      });

    // Admin operations
    builder
      .addCase(fetchAdminBlogPostsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminBlogPostsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.posts;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAdminBlogPostsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch admin blog posts";
      });

    // Create blog post
    builder
      .addCase(createBlogPostThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBlogPostThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload);
      })
      .addCase(createBlogPostThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create blog post";
      });

    // Update blog post
    builder
      .addCase(updateBlogPostThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBlogPostThunk.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.posts.findIndex(post => post._id === action.payload._id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
        if (state.currentPost?._id === action.payload._id) {
          state.currentPost = action.payload;
        }
      })
      .addCase(updateBlogPostThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update blog post";
      });

    // Delete blog post
    builder
      .addCase(deleteBlogPostThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBlogPostThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = state.posts.filter(post => post._id !== action.payload);
      })
      .addCase(deleteBlogPostThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete blog post";
      });

    // Admin categories
    builder
      .addCase(fetchAdminCategoriesThunk.fulfilled, (state, action) => {
        state.categories = action.payload;
      });

    // Create category
    builder
      .addCase(createBlogCategoryThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBlogCategoryThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload);
      })
      .addCase(createBlogCategoryThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create category";
      });

    // Update category
    builder
      .addCase(updateBlogCategoryThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBlogCategoryThunk.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.categories.findIndex(cat => cat._id === action.payload._id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(updateBlogCategoryThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update category";
      });

    // Delete category
    builder
      .addCase(deleteBlogCategoryThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBlogCategoryThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter(cat => cat._id !== action.payload);
      })
      .addCase(deleteBlogCategoryThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete category";
      });
  },
});

export const { setSelectedCategory, clearError, clearCurrentPost, resetBlogState, forceRefresh } = blogSlice.actions;
export default blogSlice.reducer;

