"use client";

import React, { useState, useEffect } from "react";
import { FaStickyNote } from "react-icons/fa";
import Image from "next/image";

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
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNoteLabel, setNewNoteLabel] = useState("");

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

  const handleAddNoteSection = () => {
    if (newNoteLabel.trim()) {
      setNotes([...notes, { label: newNoteLabel.trim(), note: "" }]);
      setNewNoteLabel("");
      setShowAddNote(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans p-6 flex flex-col items-center justify-center">
      {/* Header - full width */}
      <header className="mb-8 w-full flex flex-col items-center">
        <div className="w-full h-20 bg-white/40 rounded-xl mb-2 flex items-center px-6 shadow">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-6">
            <FaStickyNote className="text-[#a97c50] text-3xl" />
          </div>
          <h1 className="text-5xl font-bold script text-center flex-1">
            Notes
          </h1>
        </div>
        <div className="w-full h-6 bg-white/60 rounded mb-2" />
      </header>

      {/* Main content container */}
      <div className="w-full max-w-3xl flex flex-col items-center">
        {/* Images under the header */}
        <div className="flex justify-center gap-8 mb-8">
          <Image
            src="/Final-Project/bookstore.jpg"
            alt="Bookstore"
            width={160}
            height={160}
            className="rounded-xl object-cover shadow"
            priority
          />
          <Image
            src="/Final-Project/gg.jpg"
            alt="GG"
            width={160}
            height={160}
            className="rounded-xl object-cover shadow"
            priority
          />
          <Image
            src="/Final-Project/rory.jpg"
            alt="Rory"
            width={160}
            height={160}
            className="rounded-xl object-cover shadow"
            priority
          />
        </div>

        {/* Add Note Section Button */}
        <div className="mb-6 flex justify-center w-full">
          <button
            className="px-4 py-2 bg-[#a97c50] text-white rounded font-semibold hover:bg-[#8c653a] transition"
            onClick={() => setShowAddNote(true)}
          >
            + Add New Notes Section
          </button>
        </div>

        {/* Add Note Modal */}
        {showAddNote && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 shadow-lg min-w-[320px] max-w-[90vw]">
              <h2 className="text-xl font-bold mb-4 text-[#a97c50]">Add a New Notes Section</h2>
              <input
                type="text"
                className="border rounded px-3 py-2 w-full mb-4"
                placeholder="Section label..."
                value={newNoteLabel}
                onChange={e => setNewNoteLabel(e.target.value)}
                autoFocus
              />
              <button
                className="bg-[#a97c50] text-white px-4 py-2 rounded font-semibold hover:bg-[#8c653a] transition mb-4"
                onClick={handleAddNoteSection}
                disabled={!newNoteLabel.trim()}
              >
                Add Section
              </button>
              <button
                className="mt-2 px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
                onClick={() => setShowAddNote(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

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
        <div className="flex flex-col gap-8 w-full items-center">
          {filteredNotes.map((note, idx) => (
            <div key={idx} className="mb-6 w-full">
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
    </div>
  );
}