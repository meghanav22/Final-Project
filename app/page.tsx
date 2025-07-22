"use client";

import React, { useState, useEffect } from "react";
import { FaListUl, FaHome } from "react-icons/fa";
import Image from "next/image";

function getTimeParts() {
  const now = new Date();
  let hours = now.getHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const day = now.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
  return { hours: hours.toString().padStart(2, "0"), minutes, ampm, day };
}

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

export default function Home() {
  const [timeParts, setTimeParts] = useState(getTimeParts());
  const [tasks, setTasks] = useState(() =>
    loadFromStorage<string[]>("tasks", [
      "Finalise assignment",
      "Practice speech",
      "Print papers",
      "Catch up",
    ])
  );
  const [newTask, setNewTask] = useState("");
  const [showInput, setShowInput] = useState(false);

  const [showClassDetails, setShowClassDetails] = useState(false);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [classDetails, setClassDetails] = useState(() =>
    loadFromStorage<{ notes: string }[]>("classDetails", [
      { notes: "" },
      { notes: "" },
      { notes: "" },
      { notes: "" },
    ])
  );
  const [classNames, setClassNames] = useState(() => {
    const loaded = loadFromStorage<string[]>("classNames", [
      "Class 1",
      "Class 2",
      "Class 3",
      "Class 4",
    ]);
    // If loaded is empty, use fallback
    return Array.isArray(loaded) && loaded.length === 0
      ? ["Class 1", "Class 2", "Class 3", "Class 4"]
      : loaded;
  });
  const [editingClassIdx, setEditingClassIdx] = useState<number | null>(null);
  const [newClassName, setNewClassName] = useState("");

  useEffect(() => {
    const interval = setInterval(() => setTimeParts(getTimeParts()), 1000 * 60);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    saveToStorage("tasks", tasks);
  }, [tasks]);

  useEffect(() => {
    saveToStorage("classNames", classNames);
  }, [classNames]);

  useEffect(() => {
    saveToStorage("classDetails", classDetails);
  }, [classDetails]);

  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, newTask.trim()]);
      setNewTask("");
      setShowInput(false);
    }
  };

  const handleViewDetails = (num: number) => {
    setSelectedClass(num);
    setShowClassDetails(true);
  };

  const handleCloseDetails = () => {
    setShowClassDetails(false);
    setSelectedClass(null);
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (selectedClass !== null) {
      const updated = [...classDetails];
      updated[selectedClass - 1].notes = e.target.value;
      setClassDetails(updated);
    }
  };

  const { hours, minutes, ampm, day } = timeParts;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans p-6 relative">
      {/* Header */}
      <header className="flex flex-col items-center mb-6">
        <div className="w-full h-20 bg-white/40 rounded-xl mb-2 flex items-center justify-between px-4 shadow">
          <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
            <FaHome className="text-[#a97c50] text-2xl" />
          </div>
          <h1 className="text-3xl font-bold tracking-wide">Home Page</h1>
          <div className="w-10 h-10" /> {/* Spacer */}
        </div>
        <div className="w-full h-6 bg-white/60 rounded mb-2" /> {/* Search bar placeholder */}
      </header>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="col-span-1 flex flex-col gap-6">
          {/* Time + Date */}
          <section className="flex gap-2 items-end">
            <div className="bg-[#bfa76f] rounded-t-xl rounded-b-xl w-20 h-28 flex flex-col justify-between items-center shadow relative">
              <span className="text-white text-5xl font-bold mt-4">{hours}</span>
              <span className="text-white text-xs mb-2">{ampm}</span>
            </div>
            <div className="bg-[#bfa76f] rounded-t-xl rounded-b-xl w-20 h-28 flex flex-col justify-between items-center shadow relative">
              <span className="text-white text-5xl font-bold mt-4">{minutes}</span>
              <span className="text-white text-xs mb-2">{day}</span>
            </div>
          </section>
          {/* Quick Tasks & Notes */}
          <section className="bg-[#f5efec] rounded-xl p-4 shadow">
            <div className="flex items-center gap-2 mb-3">
              <FaListUl className="text-[#a97c50] text-2xl" />
              <span className="text-[#a97c50] font-bold text-xl">Quick tasks</span>
            </div>
            <button
              className="bg-white border border-[#a97c50] text-[#a97c50] rounded px-3 py-1 mb-3 font-medium hover:bg-[#f7e8d7] transition"
              onClick={() => setShowInput(true)}
            >
              New task
            </button>
            {showInput && (
              <div className="mb-3 flex gap-2">
                <input
                  type="text"
                  className="border rounded px-2 py-1 flex-1"
                  value={newTask}
                  onChange={e => setNewTask(e.target.value)}
                  placeholder="Enter task"
                  autoFocus
                />
                <button
                  className="bg-[#a97c50] text-white px-3 py-1 rounded"
                  onClick={handleAddTask}
                >
                  Add
                </button>
              </div>
            )}
            <ul className="space-y-3">
              {tasks.map((task, idx) => (
                <li key={idx} className="flex items-center gap-2 text-lg">
                  <input type="checkbox" className="w-5 h-5 accent-[#a97c50]" />
                  <span>{task}</span>
                  <button
                    className="ml-2 text-red-500 hover:text-red-700 font-bold text-xl"
                    title="Delete task"
                    onClick={() => {
                      setTasks(tasks.filter((_, i) => i !== idx));
                    }}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </section>
          {/* Barnes image below Quick Tasks */}
          <div className="flex justify-center mt-6">
            <Image
              src="/barnes.jpg"
              alt="Barnes"
              width={400}
              height={220}
              className="rounded-xl shadow object-cover"
              priority={false}
            />
          </div>
        </div>

        {/* Center Column - Classes */}
        <div className="col-span-1 flex flex-col items-center gap-6">
          <span className="font-semibold text-3xl mb-2">Classes</span>
          {classNames.map((name, idx) => (
            <div
              key={idx}
              className="w-[340px] bg-white/80 rounded-xl h-32 flex flex-col justify-between shadow text-xl font-medium px-8 py-6 relative mb-2"
            >
              <div className="mb-2">
                {editingClassIdx === idx ? (
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      if (newClassName.trim()) {
                        const updated = [...classNames];
                        updated[idx] = newClassName.trim();
                        setClassNames(updated);
                      }
                      setEditingClassIdx(null);
                      setNewClassName("");
                    }}
                  >
                    <input
                      type="text"
                      className="border rounded px-2 py-1 text-lg w-full"
                      value={newClassName}
                      onChange={e => setNewClassName(e.target.value)}
                      autoFocus
                      onBlur={() => {
                        setEditingClassIdx(null);
                        setNewClassName("");
                      }}
                    />
                  </form>
                ) : (
                  <span
                    className="font-semibold cursor-pointer"
                    onClick={() => {
                      setEditingClassIdx(idx);
                      setNewClassName(classNames[idx]);
                    }}
                    title="Click to edit"
                  >
                    {name}
                  </span>
                )}
              </div>
              <button
                className="self-start px-3 py-1 rounded border border-[#a97c50] text-[#a97c50] bg-transparent text-base font-semibold hover:bg-[#f5efec] transition"
                onClick={() => handleViewDetails(idx + 1)}
              >
                Details
              </button>
            </div>
          ))}
        </div>

        {/* Right Column - Image */}
        <div className="col-span-1 flex flex-col gap-6 justify-start items-center mt-[52px]">
          <Image
            src="/study-desk.jpg"
            alt="Study desk with notes, calculator, and laptop"
            width={250}
            height={80}
            className="rounded-lg shadow"
            priority
          />
        </div>
      </div>

      {/* Class Details Popup */}
      {showClassDetails && selectedClass !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 shadow-lg min-w-[300px] max-w-[90vw]">
            <h2 className="text-2xl font-bold mb-4 text-[#a97c50]">Class {selectedClass} Details</h2>
            <label className="block mb-2 font-semibold text-[#a97c50]">Notes:</label>
            <textarea
              className="w-full border rounded p-2 mb-6"
              rows={4}
              value={classDetails[selectedClass - 1].notes}
              onChange={handleNotesChange}
              placeholder="Add notes for this class..."
            />
            <button
              className="px-4 py-2 rounded bg-[#a97c50] text-white font-semibold hover:bg-[#8c653a] transition"
              onClick={handleCloseDetails}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}