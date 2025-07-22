"use client";

import React, { useState, useEffect } from "react";
import { FaStickyNote } from "react-icons/fa";

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T) {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

export default function NotesPage() {
  const [notes, setNotes] = useState(() =>
    loadFromStorage<{ label: string; note: string }[]>("notes", [
      { label: "Class #1", note: "" },
      { label: "Class #2", note: "" },
      { label: "Class #3", note: "" },
      { label: "General", note: "" },
    ])
  );
  const [search, setSearch] = useState("");
  const [editingLabelIdx, setEditingLabelIdx] = useState<number | null>(null);
  const [newLabel, setNewLabel] = useState("");

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

  useEffect(() => {
    saveToStorage("notes", notes);
  }, [notes]);

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
        {filteredNotes.map((note, idx) => (
          <div key={idx} className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              {editingLabelIdx === idx ? (
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    if (newLabel.trim()) {
                      const updated = [...notes];
                      updated[idx].label = newLabel.trim();
                      setNotes(updated);
                    }
                    setEditingLabelIdx(null);
                    setNewLabel("");
                  }}
                >
                  <input
                    type="text"
                    className="border rounded px-2 py-1 text-sm"
                    value={newLabel}
                    onChange={e => setNewLabel(e.target.value)}
                    autoFocus
                    onBlur={() => {
                      setEditingLabelIdx(null);
                      setNewLabel("");
                    }}
                  />
                </form>
              ) : (
                <span
                  className="font-bold text-lg cursor-pointer"
                  onClick={() => {
                    setEditingLabelIdx(idx);
                    setNewLabel(note.label);
                  }}
                  title="Click to edit label"
                >
                  {note.label}
                </span>
              )}
            </div>
            <textarea
              className="w-full border rounded p-2"
              rows={3}
              value={note.note}
              onChange={e => handleNoteChange(idx, e.target.value)}
              placeholder="Type your note here..."
            />
          </div>
        ))}
      </div>
    </div>
  );
}