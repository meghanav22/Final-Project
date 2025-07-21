"use client";

import React, { useState } from "react";
import { FaListUl, FaStickyNote, FaCalendarAlt, FaBook, FaRegClock, FaHome } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image"; // <-- Add this import

function getTimeParts() {
  const now = new Date();
  let hours = now.getHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const day = now.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
  return { hours: hours.toString().padStart(2, "0"), minutes, ampm, day };
}

export default function Home() {
  // Get time parts for display
  const { hours, minutes, ampm, day } = getTimeParts();

  // Quick tasks state
  const [tasks, setTasks] = useState([
    "Finalise assignment",
    "Practice speech",
    "Print papers",
    "Catch up",
  ]);
  const [newTask, setNewTask] = useState("");
  const [showInput, setShowInput] = useState(false);

  // Class details popup state
  const [showClassDetails, setShowClassDetails] = useState(false);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [classDetails, setClassDetails] = useState([
    { notes: "" },
    { notes: "" },
    { notes: "" },
    { notes: "" },
  ]);

  const [classNames, setClassNames] = useState([
    "Class 1",
    "Class 2",
    "Class 3",
    "Class 4",
  ]);
  const [editingClassIdx, setEditingClassIdx] = useState<number | null>(null);
  const [newClassName, setNewClassName] = useState("");

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

  // Handler to update notes for selected class
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (selectedClass !== null) {
      const updated = [...classDetails];
      updated[selectedClass - 1].notes = e.target.value;
      setClassDetails(updated);
    }
  };

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

      <div className="grid grid-cols-4 gap-6">
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
        </div>

        {/* Center Column - Classes */}
        <div className="col-span-2 flex flex-col gap-6">
          <span className="font-semibold text-xl mb-2">Classes</span>
          {classNames.map((name, idx) => (
            <div
              key={idx}
              className="bg-white/80 rounded-xl h-24 flex flex-col justify-between shadow text-lg font-medium px-6 relative"
            >
              <div className="absolute top-3 left-4">
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
                      className="border rounded px-2 py-1 text-sm"
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
                    className="text-base font-semibold cursor-pointer"
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
                className="absolute left-6 bottom-4 px-2 py-1 rounded border border-[#a97c50] text-[#a97c50] bg-transparent text-sm font-semibold hover:bg-[#f5efec] transition"
                onClick={() => handleViewDetails(idx + 1)}
              >
                Details
              </button>
            </div>
          ))}
        </div>

        {/* Right Column - Navigation Bar */}
        <div className="col-span-1 flex flex-col gap-6">
          <section className="bg-white/80 rounded-xl p-4 shadow">
            <span className="font-semibold text-xl mb-4 block">Navigation</span>
            <ul className="space-y-4">
              <li>
                <Link href="/notes">
                  <button className="w-full text-left px-4 py-2 rounded bg-[#f5efec] text-[#a97c50] font-semibold hover:bg-[#f7e8d7] transition flex items-center gap-2">
                    <FaStickyNote className="text-xl" />
                    Notes
                  </button>
                </Link>
              </li>
              <li>
                <Link href="/calendar">
                  <button className="w-full text-left px-4 py-2 rounded bg-[#f5efec] text-[#a97c50] font-semibold hover:bg-[#f7e8d7] transition flex items-center gap-2">
                    <FaCalendarAlt className="text-xl" />
                    Calendar
                  </button>
                </Link>
              </li>
              <li>
                <Link href="/books-journal">
                  <button className="w-full text-left px-4 py-2 rounded bg-[#f5efec] text-[#a97c50] font-semibold hover:bg-[#f7e8d7] transition flex items-center gap-2">
                    <FaBook className="text-xl" />
                    Books/Journal
                  </button>
                </Link>
              </li>
              <li>
                <Link href="/schedule">
                  <button className="w-full text-left px-4 py-2 rounded bg-[#f5efec] text-[#a97c50] font-semibold hover:bg-[#f7e8d7] transition flex items-center gap-2">
                    <FaRegClock className="text-xl" />
                    Schedule
                  </button>
                </Link>
              </li>
            </ul>
          </section>
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