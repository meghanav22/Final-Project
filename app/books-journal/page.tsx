"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaBook } from "react-icons/fa";

// LocalStorage helpers
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    if (typeof window !== "undefined") {
      const item = localStorage.getItem(key);
      if (!item) return fallback;
      const parsed = JSON.parse(item);
      if (Array.isArray(parsed) && parsed.length === 0) return fallback;
      return parsed;
    }
  } catch {}
  return fallback;
}
function saveToStorage<T>(key: string, value: T) {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

const initialBooks = [
  { title: "Book #1", finished: false, rating: 0, cover: "" },
  { title: "Book #2", finished: false, rating: 0, cover: "" },
  { title: "Book #3", finished: false, rating: 0, cover: "" },
  { title: "Book #4", finished: false, rating: 0, cover: "" },
];

export default function BooksJournal() {
  const [books, setBooks] = useState(() =>
    loadFromStorage("books", initialBooks)
  );
  const [journal, setJournal] = useState("");
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Save books to localStorage whenever they change
  useEffect(() => {
    saveToStorage("books", books);
  }, [books]);

  const handleFinishedChange = (idx: number) => {
    setBooks((books) =>
      books.map((b, i) => (i === idx ? { ...b, finished: !b.finished } : b))
    );
  };

  const handleRatingChange = (idx: number, value: number) => {
    setBooks((books) =>
      books.map((b, i) => (i === idx ? { ...b, rating: value } : b))
    );
  };

  const handleDeleteBook = (idx: number) => {
    setBooks((books) => books.filter((_, i) => i !== idx));
  };

  const handleEditBook = (idx: number) => {
    setEditingIdx(idx);
    setEditTitle(books[idx].title);
  };

  const handleEditBookSubmit = (idx: number) => {
    if (editTitle.trim()) {
      setBooks((books) =>
        books.map((b, i) => (i === idx ? { ...b, title: editTitle.trim() } : b))
      );
      setEditingIdx(null);
      setEditTitle("");
    }
  };

  // Handle book cover upload
  const handleBookIconClick = (idx: number) => {
    if (fileInputRefs.current[idx]) {
      fileInputRefs.current[idx]!.click();
    }
  };

  const handleCoverChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setBooks((books) =>
        books.map((b, i) =>
          i === idx ? { ...b, cover: ev.target?.result as string } : b
        )
      );
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans p-6 relative">
      {/* Header */}
      <header className="flex flex-col items-center mb-6">
        <div className="w-full h-20 bg-white/40 rounded-xl mb-2 flex items-center justify-between px-4 shadow">
          <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
            <FaBook className="text-[#a97c50] text-2xl" />
          </div>
          <h1 className="text-3xl font-bold tracking-wide">Books/Journal</h1>
          <div className="w-10 h-10" /> {/* Spacer */}
        </div>
        <div className="w-full h-6 bg-white/60 rounded mb-2" /> {/* Search bar placeholder */}
      </header>

      {/* Search Bar */}
      <div className="w-full max-w-2xl mx-auto mb-8">
        <input
          type="text"
          placeholder="Search books or journal..."
          className="w-full border rounded-xl px-4 py-2 shadow"
        />
      </div>

      {/* Reading List */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Reading List</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {books.map((book, idx) => (
            <div
              key={idx}
              className="bg-white/80 rounded-xl shadow p-4 flex flex-col items-center relative"
            >
              <div
                className="w-24 h-32 bg-gray-200 rounded mb-3 flex items-center justify-center text-gray-400 text-2xl cursor-pointer overflow-hidden group"
                title="Click to upload book cover"
                onClick={() => handleBookIconClick(idx)}
                style={{ position: "relative" }}
              >
                {book.cover ? (
                  <img
                    src={book.cover}
                    alt="Book cover"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaBook className="text-4xl text-[#a97c50] group-hover:opacity-60 transition" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  ref={el => (fileInputRefs.current[idx] = el)}
                  onChange={e => handleCoverChange(idx, e)}
                />
                {!book.cover && (
                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-[#a97c50] opacity-80 group-hover:underline">
                    Upload
                  </span>
                )}
              </div>
              <div className="font-bold mb-2 w-full flex items-center justify-center">
                {editingIdx === idx ? (
                  <form
                    className="flex w-full gap-2"
                    onSubmit={e => {
                      e.preventDefault();
                      handleEditBookSubmit(idx);
                    }}
                  >
                    <input
                      type="text"
                      className="border rounded px-2 py-1 text-base flex-1"
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      autoFocus
                      onBlur={() => setEditingIdx(null)}
                    />
                    <button
                      type="submit"
                      className="px-2 py-1 bg-[#a97c50] text-white rounded hover:bg-[#8c653a] transition"
                    >
                      Save
                    </button>
                  </form>
                ) : (
                  <>
                    <span>{book.title}</span>
                    <button
                      className="ml-2 text-[#a97c50] hover:text-[#8c653a] text-base"
                      title="Edit book title"
                      onClick={() => handleEditBook(idx)}
                    >
                      ✏️
                    </button>
                    <button
                      className="ml-2 text-red-500 hover:text-red-700 text-base"
                      title="Delete book"
                      onClick={() => handleDeleteBook(idx)}
                    >
                      ×
                    </button>
                  </>
                )}
              </div>
              <label className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={book.finished}
                  onChange={() => handleFinishedChange(idx)}
                  className="accent-[#a97c50] w-5 h-5"
                />
                <span className="text-sm">Finished!</span>
              </label>
              <div className="flex items-center gap-1">
                <span className="text-sm">Rating:</span>
                <select
                  value={book.rating}
                  onChange={e =>
                    handleRatingChange(idx, Number(e.target.value))
                  }
                  className="border rounded px-1 py-0.5 text-sm"
                >
                  <option value={0}>/5</option>
                  {[1, 2, 3, 4, 5].map(n => (
                    <option key={n} value={n}>
                      {n}/5
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Journal */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Journal</h2>
        <textarea
          className="w-full max-w-3xl border rounded-xl p-4 shadow min-h-[120px]"
          placeholder="Write your journal entry here..."
          value={journal}
          onChange={e => setJournal(e.target.value)}
        />
      </section>
    </div>
  );
}