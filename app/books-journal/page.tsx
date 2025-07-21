"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FaBook } from "react-icons/fa";

const initialBooks = [
  { title: "Book #1", finished: false, rating: 0 },
  { title: "Book #2", finished: false, rating: 0 },
  { title: "Book #3", finished: false, rating: 0 },
  { title: "Book #4", finished: false, rating: 0 },
];

export default function BooksJournal() {
  const [books, setBooks] = useState(initialBooks);
  const [journal, setJournal] = useState("");

  const handleFinishedChange = (idx: number) => {
    setBooks(books =>
      books.map((b, i) =>
        i === idx ? { ...b, finished: !b.finished } : b
      )
    );
  };

  const handleRatingChange = (idx: number, value: number) => {
    setBooks(books =>
      books.map((b, i) =>
        i === idx ? { ...b, rating: value } : b
      )
    );
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
              className="bg-white/80 rounded-xl shadow p-4 flex flex-col items-center"
            >
              <div className="w-24 h-32 bg-gray-200 rounded mb-3 flex items-center justify-center text-gray-400 text-2xl">
                {/* Book cover placeholder */}
                📚
              </div>
              <div className="font-bold mb-2">{book.title}</div>
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
                  onChange={e => handleRatingChange(idx, Number(e.target.value))}
                  className="border rounded px-1 py-0.5 text-sm"
                >
                  <option value={0}>/5</option>
                  {[1, 2, 3, 4, 5].map(n => (
                    <option key={n} value={n}>{n}/5</option>
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