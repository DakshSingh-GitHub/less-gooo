"use client";

import { useState } from "react";
import { Post, DEFAULT_POST_TAGS, DEFAULT_POST_CATEGORIES, createPostInDb, UserProfile } from "@/lib/appwrite";

interface CreatePostModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (post: Post) => void;
}

export default function CreatePostModal({
  user,
  isOpen,
  onClose,
  onPostCreated,
}: CreatePostModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<string>("Experiences");
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState("");
  
  // Selected tags (default to 1-2 or empty)
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTagInput, setCustomTagInput] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAddCustomTag = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = customTagInput.trim();
    if (!trimmed) return;
    const formatted = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
    if (!selectedTags.includes(formatted)) {
      setSelectedTags([...selectedTags, formatted]);
    }
    setCustomTagInput("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Please provide both a title and post content.");
      return;
    }

    const finalCategory = isCustomCategory ? customCategoryInput.trim() || "General" : category;

    setIsSubmitting(true);
    setError(null);

    try {
      const newPost = await createPostInDb({
        userId: user.userId,
        authorName: user.fullName || "Traveller",
        authorUsername: user.username || "explorer",
        title: title.trim(),
        content: content.trim(),
        category: finalCategory,
        tags: selectedTags,
        likesCount: 0,
        likedBy: [],
        createdAt: new Date().toISOString(),
      });

      if (newPost) {
        onPostCreated(newPost);
        // Reset form
        setTitle("");
        setContent("");
        setSelectedTags([]);
        setIsCustomCategory(false);
        setCustomCategoryInput("");
        onClose();
      } else {
        setError("Could not publish post. Please verify your connection.");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to publish post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-2xl bg-white dark:bg-[#1A1B20] border border-[#E7E3DC] dark:border-[#26272D] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E7E3DC] dark:border-[#26272D] flex items-center justify-between bg-[#FAF8F5]/50 dark:bg-[#121316]/50">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C84B26] block">
              Traveller Community Dispatch
            </span>
            <h2 className="font-serif text-xl sm:text-2xl text-[#18181B] dark:text-[#F4F1EA]">
              Create a Post
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#71717A] hover:text-[#18181B] dark:hover:text-[#F4F1EA] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-mono">
              {error}
            </div>
          )}

          {/* Author Badge Preview */}
          <div className="flex items-center gap-2.5 text-xs font-mono text-[#71717A] dark:text-[#A1A1AA]">
            <div className="w-6 h-6 rounded-full bg-[#18181B] dark:bg-[#F4F1EA] text-white dark:text-[#121316] flex items-center justify-center text-[10px] font-bold">
              {user.fullName ? user.fullName[0].toUpperCase() : "T"}
            </div>
            <span>
              Posting as <strong className="text-[#18181B] dark:text-[#F4F1EA]">@{user.username}</strong> ({user.fullName})
            </span>
          </div>

          {/* Post Title */}
          <div>
            <label className="block text-xs font-mono uppercase text-[#71717A] dark:text-[#A1A1AA] tracking-wider mb-1.5">
              Post Headline / Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Hidden rooftop chai spot near Kedar Ghat"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] bg-[#FAF8F5] dark:bg-[#121316] text-[#18181B] dark:text-[#F4F1EA] text-sm focus:outline-none focus:border-[#C84B26]"
            />
          </div>

          {/* Category Selector (Standard or Custom) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase text-[#71717A] dark:text-[#A1A1AA] tracking-wider">
                Category
              </label>
              <button
                type="button"
                onClick={() => {
                  setIsCustomCategory(!isCustomCategory);
                  if (isCustomCategory) setCustomCategoryInput("");
                }}
                className="text-[11px] font-mono text-[#C84B26] dark:text-[#E05A32] hover:underline cursor-pointer"
              >
                {isCustomCategory ? "← Choose from standard categories" : "+ Add custom category"}
              </button>
            </div>

            {isCustomCategory ? (
              <input
                type="text"
                placeholder="e.g. Ghat Photography, Local Legends, Scam Warning..."
                value={customCategoryInput}
                onChange={(e) => setCustomCategoryInput(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-[#C84B26] bg-[#FAF8F5] dark:bg-[#121316] text-[#18181B] dark:text-[#F4F1EA] text-sm focus:outline-none"
              />
            ) : (
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-11 px-3.5 pr-9 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] bg-[#FAF8F5] dark:bg-[#121316] text-[#18181B] dark:text-[#F4F1EA] text-sm focus:outline-none focus:border-[#C84B26] appearance-none cursor-pointer"
                >
                  {DEFAULT_POST_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#71717A] dark:text-[#A1A1AA]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* Post Content */}
          <div>
            <label className="block text-xs font-mono uppercase text-[#71717A] dark:text-[#A1A1AA] tracking-wider mb-1.5">
              Content / Story / Travel Tip *
            </label>
            <textarea
              required
              rows={5}
              placeholder="Share your discovery, real-time ground experience, question, route advice, or food recommendations with the LessGooo community..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] bg-[#FAF8F5] dark:bg-[#121316] text-[#18181B] dark:text-[#F4F1EA] text-sm focus:outline-none focus:border-[#C84B26] resize-none leading-relaxed"
            />
          </div>

          {/* Active Tags Preview */}
          {selectedTags.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-[#71717A] dark:text-[#A1A1AA] tracking-wider">
                Selected Tags ({selectedTags.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-[#C84B26]/10 text-[#C84B26] dark:text-[#E05A32] border border-[#C84B26]/30"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleToggleTag(tag)}
                      className="hover:text-red-500 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Custom Tag Input */}
          <div>
            <label className="block text-xs font-mono uppercase text-[#71717A] dark:text-[#A1A1AA] tracking-wider mb-1.5">
              Add Custom #Tag
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. #AssiGhatChai or BlueLassi"
                value={customTagInput}
                onChange={(e) => setCustomTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCustomTag();
                  }
                }}
                className="flex-1 h-11 px-3.5 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] bg-[#FAF8F5] dark:bg-[#121316] text-[#18181B] dark:text-[#F4F1EA] text-sm focus:outline-none focus:border-[#C84B26]"
              />
              <button
                type="button"
                onClick={handleAddCustomTag}
                className="px-4 h-11 rounded-xl bg-white dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D] text-xs font-mono uppercase text-[#18181B] dark:text-[#F4F1EA] hover:border-[#C84B26] transition-colors cursor-pointer"
              >
                + Add
              </button>
            </div>
          </div>

          {/* 30 Default Suggested #Tags */}
          <div className="space-y-2 pt-2 border-t border-[#E7E3DC] dark:border-[#26272D]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase text-[#71717A] dark:text-[#A1A1AA] tracking-wider">
                Popular Curated #Tags (Click to Toggle)
              </label>
              <span className="text-[10px] font-mono text-[#71717A]">30 Presets Available</span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1">
              {DEFAULT_POST_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleToggleTag(tag)}
                    className={`px-2.5 py-1 rounded-full text-xs font-mono transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#C84B26] text-white shadow-xs"
                        : "bg-white dark:bg-[#121316] border border-[#E7E3DC] dark:border-[#26272D] text-[#71717A] dark:text-[#A1A1AA] hover:border-[#C84B26] hover:text-[#18181B] dark:hover:text-white"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-4 border-t border-[#E7E3DC] dark:border-[#26272D] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl border border-[#E7E3DC] dark:border-[#26272D] text-xs font-mono uppercase text-[#71717A] hover:text-[#18181B] dark:hover:text-[#F4F1EA] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#C84B26] hover:bg-[#B33F1D] text-white font-medium text-xs font-mono uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-sm flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <span>Publish Dispatch</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
