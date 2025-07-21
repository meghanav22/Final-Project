"use client";

import React, { useState } from "react";
import { FaStickyNote } from "react-icons/fa";

const initialNotes = [
  { label: "Class #1", note: "" },
  { label: "Class #2", note: "" },
  { label: "Class #3", note: "" },
  { label: "General", note: "" },
];

export default function NotesPage() {
  const [notes, setNotes] = useState(initialNotes);
  const [search, setSearch] = useState("");

  const handleNoteChange = (idx: number, value: string) => {
    setNotes(notes =>
      notes.map((n, i) => (i === idx ? { ...n, note: value } : n))
    );
  };

  // Filter notes by search (optional, simple contains)
  const filteredNotes = notes.filter(n =>
    n.label.toLowerCase().includes(search.toLowerCase()) ||
    n.note.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans p-6 relative">
      {/* Header */}
      <header className="flex flex-col items-center mb-6">
        <div className="w-full h-20 bg-white/40 rounded-xl mb-2 flex items-center justify-between px-4 shadow">
          <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
            <FaStickyNote className="text-[#a97c50] text-2xl" />
          </div>
          <h1 className="text-3xl font-bold tracking-wide">Notes</h1>
          <div className="w-10 h-10" /> {/* Spacer */}
        </div>
        <div className="w-full h-6 bg-white/60 rounded mb-2" /> {/* Search bar placeholder */}
      </header>

      {/* Search Bar */}
      <div className="w-full max-w-2xl mx-auto mb-8">
        <input
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full border rounded-xl px-4 py-2 shadow"
        />
      </div>

      {/* Notes List */}
      <div className="flex flex-col gap-8 max-w-3xl mx-auto">
        {filteredNotes.map((item, idx) => (
          <div key={idx} className="flex gap-4 items-start bg-white/80 rounded-xl shadow p-4">
            <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-3xl shrink-0">
              📝
            </div>
            <div className="flex-1">
              <div className="font-bold mb-2">{item.label}</div>
              <textarea
                className="w-full border rounded-xl p-3 shadow min-h-[60px]"
                placeholder={`Write notes for ${item.label.toLowerCase()}...`}
                value={item.note}
                onChange={e => handleNoteChange(idx, e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}