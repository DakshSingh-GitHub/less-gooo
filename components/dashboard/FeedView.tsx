"use client";

import { useState, useMemo } from "react";
import { Post, UserProfile, toggleLikePostInDb } from "@/lib/appwrite";
import CreatePostModal from "./CreatePostModal";

export type FeedSubFilter = "latest" | "hot" | "growing" | "mine";

interface FeedViewProps {
  user: UserProfile;
  posts: Post[];
  isLoading?: boolean;
  onPostCreated: (post: Post) => void;
  onPostUpdated: (updatedPost: Post) => void;
}

export default function FeedView({
  user,
  posts,
  isLoading = false,
  onPostCreated,
  onPostUpdated,
}: FeedViewProps) {
  const [subFilter, setSubFilter] = useState<FeedSubFilter>("latest");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastText, setToastText] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastText(msg);
    setTimeout(() => setToastText(null), 3000);
  };

  // Extract all unique categories present in posts + default suggestions
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [posts]);

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    // 1. Sub-filter: Mine
    if (subFilter === "mine") {
      result = result.filter((p) => p.userId === user.userId);
    }

    // 2. Category Filter
    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // 3. Tag Filter
    if (selectedTag) {
      result = result.filter((p) =>
        p.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase())
      );
    }

    // 4. Search Query (title, content, author, tags, category)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q) ||
          p.authorName.toLowerCase().includes(q) ||
          p.authorUsername.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // 5. Sorting
    if (subFilter === "latest" || subFilter === "mine") {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (subFilter === "hot") {
      // Hot: most likes first
      result.sort((a, b) => b.likesCount - a.likesCount);
    } else if (subFilter === "growing") {
      // Fast growing: high likes weighted with recency
      result.sort((a, b) => {
        const ageHoursA = Math.max(1, (Date.now() - new Date(a.createdAt).getTime()) / (1000 * 60 * 60));
        const ageHoursB = Math.max(1, (Date.now() - new Date(b.createdAt).getTime()) / (1000 * 60 * 60));
        const scoreA = (a.likesCount + 1) / Math.pow(ageHoursA, 1.2);
        const scoreB = (b.likesCount + 1) / Math.pow(ageHoursB, 1.2);
        return scoreB - scoreA;
      });
    }

    return result;
  }, [posts, subFilter, selectedCategory, selectedTag, searchQuery, user.userId]);

  const handleLike = async (post: Post) => {
    const res = await toggleLikePostInDb(post.$id || post.id || "", user.userId, post);
    const updated: Post = {
      ...post,
      likesCount: res.likesCount,
      likedBy: res.likedBy,
    };
    onPostUpdated(updated);
  };

  const handleCopyLink = (post: Post) => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/dashboard#post-${post.$id || post.id}`;
      navigator.clipboard.writeText(url).then(() => {
        showNotification("Post reference link copied to clipboard!");
      });
    }
  };

  const formatRelativeTime = (isoString: string) => {
    try {
      const diff = Date.now() - new Date(isoString).getTime();
      const mins = Math.floor(diff / (1000 * 60));
      if (mins < 1) return "just now";
      if (mins < 60) return `${mins}m ago`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    } catch {
      return "recently";
    }
  };

  return (
    <div className="space-y-6 relative pb-20">
      {/* Toast Notification */}
      {toastText && (
        <div className="fixed top-20 right-8 z-50 p-3.5 px-5 rounded-2xl bg-[#18181B] text-white dark:bg-[#F4F1EA] dark:text-[#121316] text-xs font-mono shadow-xl animate-fadeIn border border-[#C84B26]/30">
          {toastText}
        </div>
      )}

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-[#E7E3DC] dark:border-[#26272D]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C84B26]">
              Traveller Dispatch Network
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#C84B26]/10 text-[#C84B26]">
              Live
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#18181B] dark:text-[#F4F1EA]">
            Community Feed
          </h1>
          <p className="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] mt-1 max-w-xl">
            Real-time on-ground field logs, street recommendations, scam alerts, and travel questions shared directly by explorers.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="hidden sm:inline-flex items-center gap-2 py-2.5 px-5 rounded-xl bg-[#C84B26] hover:bg-[#B33F1D] text-white text-xs font-mono uppercase tracking-wider font-semibold shadow-sm transition-all cursor-pointer"
        >
          <span className="text-base font-bold leading-none">+</span>
          <span>Create Post</span>
        </button>
      </div>

      {/* Sub-Filters & Search Bar (Same Horizontal Level) */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white dark:bg-[#1A1B20] p-3 rounded-2xl border border-[#E7E3DC] dark:border-[#26272D] shadow-xs">
        {/* Left: Sub-Filters (Latest, Hot, Fast growing, My posts) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSubFilter("latest")}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              subFilter === "latest"
                ? "bg-[#18181B] text-white dark:bg-[#F4F1EA] dark:text-[#121316] font-semibold shadow-xs"
                : "text-[#71717A] dark:text-[#A1A1AA] hover:text-[#18181B] dark:hover:text-[#F4F1EA] hover:bg-black/[0.03] dark:hover:bg-white/[0.03]"
            }`}
          >
            Latest
          </button>

          <button
            onClick={() => setSubFilter("hot")}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              subFilter === "hot"
                ? "bg-[#18181B] text-white dark:bg-[#F4F1EA] dark:text-[#121316] font-semibold shadow-xs"
                : "text-[#71717A] dark:text-[#A1A1AA] hover:text-[#18181B] dark:hover:text-[#F4F1EA] hover:bg-black/[0.03] dark:hover:bg-white/[0.03]"
            }`}
          >
            Hot
          </button>

          <button
            onClick={() => setSubFilter("growing")}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              subFilter === "growing"
                ? "bg-[#18181B] text-white dark:bg-[#F4F1EA] dark:text-[#121316] font-semibold shadow-xs"
                : "text-[#71717A] dark:text-[#A1A1AA] hover:text-[#18181B] dark:hover:text-[#F4F1EA] hover:bg-black/[0.03] dark:hover:bg-white/[0.03]"
            }`}
          >
            Fast Growing
          </button>

          <button
            onClick={() => setSubFilter("mine")}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              subFilter === "mine"
                ? "bg-[#18181B] text-white dark:bg-[#F4F1EA] dark:text-[#121316] font-semibold shadow-xs"
                : "text-[#71717A] dark:text-[#A1A1AA] hover:text-[#18181B] dark:hover:text-[#F4F1EA] hover:bg-black/[0.03] dark:hover:bg-white/[0.03]"
            }`}
          >
            My Posts
          </button>
        </div>

        {/* Right: Search Bar */}
        <div className="relative flex-1 lg:max-w-xs">
          <div className="pointer-events-none absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#71717A]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search posts, #tags, authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-3.5 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] bg-[#FAF8F5] dark:bg-[#121316] text-[#18181B] dark:text-[#F4F1EA] text-xs focus:outline-none focus:border-[#C84B26]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#71717A] hover:text-[#18181B] dark:hover:text-white text-xs cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Category Pills & Active Tag Notice */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717A] dark:text-[#A1A1AA] mr-1">
          Categories:
        </span>
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
            selectedCategory === "all"
              ? "bg-[#C84B26] text-white"
              : "bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] text-[#71717A] hover:text-[#18181B] dark:hover:text-white"
          }`}
        >
          All
        </button>

        {availableCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
              selectedCategory.toLowerCase() === cat.toLowerCase()
                ? "bg-[#C84B26] text-white"
                : "bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] text-[#71717A] hover:text-[#18181B] dark:hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}

        {/* Selected Tag Active Pill */}
        {selectedTag && (
          <div className="ml-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#C84B26]/10 border border-[#C84B26]/30 text-[#C84B26] text-xs font-mono">
            <span>Tag: {selectedTag}</span>
            <button
              onClick={() => setSelectedTag(null)}
              className="font-bold hover:text-red-500 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Main Stream Workspace (Strict Zero Mock Data Guardrail) */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] space-y-3 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-black/10 dark:bg-white/10" />
                <div className="space-y-1">
                  <div className="w-24 h-3 bg-black/10 dark:bg-white/10 rounded-sm" />
                  <div className="w-16 h-2 bg-black/10 dark:bg-white/10 rounded-sm" />
                </div>
              </div>
              <div className="w-3/4 h-5 bg-black/10 dark:bg-white/10 rounded-sm" />
              <div className="w-full h-12 bg-black/10 dark:bg-white/10 rounded-sm" />
            </div>
          ))}
        </div>
      ) : filteredPosts.length === 0 ? (
        /* Explicit, Clean Zero-Mock Empty State */
        <div className="p-12 sm:p-16 text-center rounded-3xl bg-white dark:bg-[#1A1B20] border border-dashed border-[#E7E3DC] dark:border-[#26272D] space-y-4 shadow-xs">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FAF8F5] dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D] flex items-center justify-center text-[#C84B26]">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="font-serif text-xl sm:text-2xl text-[#18181B] dark:text-[#F4F1EA]">
              No community posts found
            </h3>
            <p className="text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
              {searchQuery || selectedCategory !== "all" || selectedTag || subFilter === "mine"
                ? "No dispatches match your current search criteria or filters. Try clearing your filters or search terms."
                : "No travellers have shared dispatches in the database yet. Under our platform principles, zero fake or placeholder data is displayed. Be the first explorer to contribute!"}
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="py-3 px-6 rounded-xl bg-[#C84B26] hover:bg-[#B33F1D] text-white text-xs font-mono uppercase tracking-wider font-semibold shadow-sm transition-all cursor-pointer"
            >
              + Create First Post
            </button>
          </div>
        </div>
      ) : (
        /* Real Posts Feed Listing */
        <div className="space-y-4">
          {filteredPosts.map((post) => {
            const hasLiked = post.likedBy?.includes(user.userId);
            const isAuthor = post.userId === user.userId;

            return (
              <article
                key={post.$id || post.id}
                id={`post-${post.$id || post.id}`}
                className="p-6 rounded-2xl bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] shadow-sm hover:border-[#C84B26]/40 transition-all space-y-4"
              >
                {/* Post Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#18181B] dark:bg-[#F4F1EA] text-white dark:text-[#121316] flex items-center justify-center text-xs font-bold font-mono">
                      {post.authorName ? post.authorName[0].toUpperCase() : "T"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-sm font-semibold text-[#18181B] dark:text-[#F4F1EA]">
                          {post.authorName}
                        </span>
                        <span className="text-xs font-mono text-[#71717A] dark:text-[#A1A1AA]">
                          @{post.authorUsername}
                        </span>
                        {isAuthor && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm bg-[#C84B26]/10 text-[#C84B26]">
                            Author
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-mono text-[#71717A] dark:text-[#A1A1AA] mt-0.5">
                        <span className="text-[#C84B26] font-medium uppercase tracking-wider">
                          [{post.category}]
                        </span>
                        <span>•</span>
                        <span>{formatRelativeTime(post.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopyLink(post)}
                    title="Copy reference link"
                    className="p-1.5 rounded-lg text-[#71717A] hover:text-[#18181B] dark:hover:text-[#F4F1EA] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>
                </div>

                {/* Post Body */}
                <div className="space-y-2">
                  <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#18181B] dark:text-[#F4F1EA] leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#3F3F46] dark:text-[#D4D4D8] leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>
                </div>

                {/* Post Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {post.tags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                        className={`text-xs font-mono px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                          selectedTag === tag
                            ? "bg-[#C84B26] text-white"
                            : "bg-[#FAF8F5] dark:bg-[#121316] text-[#71717A] dark:text-[#A1A1AA] hover:text-[#C84B26] border border-[#E7E3DC] dark:border-[#26272D]"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                )}

                {/* Post Action Footer */}
                <div className="pt-3 border-t border-[#E7E3DC]/60 dark:border-[#26272D] flex items-center justify-between text-xs font-mono">
                  {/* Interactive Like Button */}
                  <button
                    onClick={() => handleLike(post)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                      hasLiked
                        ? "border-[#C84B26] text-[#C84B26] bg-[#C84B26]/10 font-semibold"
                        : "border-[#E7E3DC] dark:border-[#26272D] text-[#71717A] dark:text-[#A1A1AA] hover:border-[#C84B26] hover:text-[#C84B26]"
                    }`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill={hasLiked ? "currentColor" : "none"}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span>{post.likesCount}</span>
                    <span className="hidden sm:inline lowercase text-[11px]">
                      {post.likesCount === 1 ? "like" : "likes"}
                    </span>
                  </button>

                  <div className="flex items-center gap-3 text-[#71717A] dark:text-[#A1A1AA] text-[11px]">
                    <span>Appwrite Verified</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Floating Action Button (+ CTA Button at Bottom-Right Corner) */}
      <button
        onClick={() => setIsModalOpen(true)}
        aria-label="Create a Post"
        className="fixed bottom-8 right-8 z-40 flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-[#C84B26] hover:bg-[#B33F1D] text-white font-mono text-xs uppercase tracking-wider font-semibold shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/20"
      >
        <span className="text-xl leading-none font-bold">+</span>
        <span className="hidden sm:inline">Create Post</span>
      </button>

      {/* Create Post Modal */}
      <CreatePostModal
        user={user}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPostCreated={(newPost) => {
          onPostCreated(newPost);
          showNotification("Your dispatch has been published to the community feed!");
        }}
      />
    </div>
  );
}
