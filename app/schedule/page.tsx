"use client";

import React, { useState, useEffect } from "react";
import { FaRegClock } from "react-icons/fa";
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

export default function Schedule() {
  const days = ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"];
  const [dayTasks, setDayTasks] = useState<string[][]>(
    Array.from({ length: 7 }, () => [])
  );
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [newDayTask, setNewDayTask] = useState("");
  const [reminders, setReminders] = useState<string[]>(
    ["Reminder 1", "Reminder 2", "Reminder 3"]
  );
  const [newReminder, setNewReminder] = useState("");
  const [events, setEvents] = useState<string[]>(
    ["Event 1", "Event 2", "Event 3"]
  );
  const [newEvent, setNewEvent] = useState("");

  // Load initial data from storage
  useEffect(() => {
    setReminders(
      loadFromStorage<string[]>("scheduleReminders", [
        "Reminder 1",
        "Reminder 2",
        "Reminder 3",
      ])
    );
    setEvents(
      loadFromStorage<string[]>("scheduleEvents", [
        "Event 1",
        "Event 2",
        "Event 3",
      ])
    );
    setDayTasks(
      loadFromStorage<string[][]>("scheduleDayTasks", Array.from({ length: 7 }, () => []))
    );
  }, []);

  // Save reminders to storage
  useEffect(() => {
    saveToStorage("scheduleReminders", reminders);
  }, [reminders]);

  // Save events to storage
  useEffect(() => {
    saveToStorage("scheduleEvents", events);
  }, [events]);

  // Save day tasks to storage
  useEffect(() => {
    saveToStorage("scheduleDayTasks", dayTasks);
  }, [dayTasks]);

  // Add new reminder
  const handleAddReminder = () => {
    if (newReminder.trim()) {
      setReminders([...reminders, newReminder.trim()]);
      setNewReminder("");
    }
  };

  // Add new event
  const handleAddEvent = () => {
    if (newEvent.trim()) {
      setEvents([...events, newEvent.trim()]);
      setNewEvent("");
    }
  };

  // Add new task to a day
  const handleAddDayTask = (dayIdx: number) => {
    if (newDayTask.trim()) {
      const updated = [...dayTasks];
      updated[dayIdx] = [...updated[dayIdx], newDayTask.trim()];
      setDayTasks(updated);
      setNewDayTask("");
      setEditingDay(null);
    }
  };

  // Remove a task from a day
  const handleRemoveDayTask = (dayIdx: number, taskIdx: number) => {
    const updated = [...dayTasks];
    updated[dayIdx] = updated[dayIdx].filter((_, i) => i !== taskIdx);
    setDayTasks(updated);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans p-6">
      {/* Header */}
      <header className="flex flex-col items-center mb-6">
        <div className="w-full h-20 bg-white/40 rounded-xl mb-2 flex items-center justify-between px-4 shadow">
          <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
            <FaRegClock className="text-[#a97c50] text-2xl" />
          </div>
          <h1 className="text-3xl font-bold tracking-wide">Schedule</h1>
          <div className="w-10 h-10" /> {/* Spacer */}
        </div>
        <div className="w-full h-6 bg-white/60 rounded mb-2" /> {/* Search bar placeholder */}
      </header>

      {/* Weekly Calendar */}
      <section className="mb-8">
        <div className="flex gap-2 justify-center">
          {days.map((day, idx) => (
            <div
              key={day}
              className="bg-white/80 rounded-xl w-32 h-32 flex flex-col items-center justify-start shadow text-lg font-medium relative p-2"
            >
              <span className="font-bold mb-1">{day}</span>
              <ul className="text-sm text-gray-700 mb-2 w-full">
                {dayTasks[idx].map((task, tIdx) => (
                  <li key={tIdx} className="flex justify-between items-center">
                    <span>{task}</span>
                    <button
                      className="ml-2 text-xs text-red-400 hover:text-red-600"
                      onClick={() => handleRemoveDayTask(idx, tIdx)}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
              {editingDay === idx ? (
                <div className="w-full flex flex-col items-center">
                  <input
                    type="text"
                    className="border rounded px-2 py-1 mb-1 w-full"
                    value={newDayTask}
                    onChange={(e) => setNewDayTask(e.target.value)}
                    placeholder="New task"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      className="bg-[#a97c50] text-white px-2 py-1 rounded text-xs"
                      onClick={() => handleAddDayTask(idx)}
                    >
                      Add
                    </button>
                    <button
                      className="bg-gray-200 px-2 py-1 rounded text-xs"
                      onClick={() => {
                        setEditingDay(null);
                        setNewDayTask("");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className="mt-auto text-xs text-[#a97c50] underline"
                  onClick={() => setEditingDay(idx)}
                >
                  + Add Task
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-2 gap-8">
        {/* Reminders */}
        <section>
          <h2 className="font-semibold text-xl mb-2">Reminders (Weekly)</h2>
          <ul className="space-y-3 mb-3">
            {reminders.map((reminder, idx) => (
              <li key={idx} className="flex items-center gap-2 text-lg">
                <input type="checkbox" className="w-5 h-5 accent-[#a97c50]" />
                <span>{reminder}</span>
              </li>
            ))}
          </ul>
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              className="border rounded px-2 py-1 flex-1"
              value={newReminder}
              onChange={(e) => setNewReminder(e.target.value)}
              placeholder="Add reminder"
            />
            <button
              className="bg-[#a97c50] text-white px-3 py-1 rounded"
              onClick={handleAddReminder}
            >
              Add
            </button>
          </div>
          <div className="bg-white/80 rounded-xl h-32 shadow" /> {/* Placeholder box */}
        </section>
        {/* Weekly Events */}
        <section>
          <h2 className="font-semibold text-xl mb-2">Weekly Events</h2>
          <ul className="space-y-3 mb-3">
            {events.map((event, idx) => (
              <li key={idx} className="flex items-center gap-2 text-lg">
                <input type="checkbox" className="w-5 h-5 accent-[#a97c50]" />
                <span>{event}</span>
              </li>
            ))}
          </ul>
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              className="border rounded px-2 py-1 flex-1"
              value={newEvent}
              onChange={(e) => setNewEvent(e.target.value)}
              placeholder="Add event"
            />
            <button
              className="bg-[#a97c50] text-white px-3 py-1 rounded"
              onClick={handleAddEvent}
            >
              Add
            </button>
          </div>
          <div className="bg-white/80 rounded-xl h-32 shadow" /> {/* Placeholder box */}
        </section>
      </div>

      {/* Coffee Image Section */}
      <section className="bg-gray-200 rounded-xl p-4 shadow flex flex-col items-center mb-6">
        <Image
          src="/coffee.jpg"
          alt="Coffee cup"
          width={120}
          height={120}
          className="rounded-lg object-cover mb-2"
          style={{ maxHeight: 120, width: "auto", height: "auto" }}
          priority
        />
        {/* ...rest of your content for this section... */}
      </section>
    </div>
  );
}