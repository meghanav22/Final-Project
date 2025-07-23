"use client";

import React, { useState, useEffect, useRef } from "react";
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
  const [notification, setNotification] = useState<string | null>(null);
  const notificationTimeout = useRef<NodeJS.Timeout | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    if (notificationTimeout.current) clearTimeout(notificationTimeout.current);
    notificationTimeout.current = setTimeout(() => setNotification(null), 1800);
  };

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
      showNotification("Reminder added!");
    }
  };

  // Add new event
  const handleAddEvent = () => {
    if (newEvent.trim()) {
      setEvents([...events, newEvent.trim()]);
      setNewEvent("");
      showNotification("Event added!");
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
      showNotification("Task added!");
    }
  };

  // Remove a task from a day
  const handleRemoveDayTask = (dayIdx: number, taskIdx: number) => {
    const updated = [...dayTasks];
    updated[dayIdx] = updated[dayIdx].filter((_, i) => i !== taskIdx);
    setDayTasks(updated);
    showNotification("Task deleted!");
  };

  const handleDeleteReminder = (idx: number) => {
    setReminders(reminders.filter((_, i) => i !== idx));
    showNotification("Reminder deleted!");
  };

  const handleDeleteEvent = (idx: number) => {
    setEvents(events.filter((_, i) => i !== idx));
    showNotification("Event deleted!");
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
                <button
                  className="ml-2 text-red-500 hover:text-red-700 font-bold text-xl"
                  title="Delete reminder"
                  onClick={() => handleDeleteReminder(idx)}
                >
                  ×
                </button>
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
          <div className="bg-gray-200 rounded-xl h-56 shadow flex items-center justify-center relative overflow-hidden">
            <Image
              src="/Final-Project/coffee.jpg"
              alt="Coffee cup"
              fill
              className="object-cover rounded-xl"
              priority
            />
          </div>
        </section>
        {/* Weekly Events */}
        <section>
          <h2 className="font-semibold text-xl mb-2">Weekly Events</h2>
          <ul className="space-y-3 mb-3">
            {events.map((event, idx) => (
              <li key={idx} className="flex items-center gap-2 text-lg">
                <input type="checkbox" className="w-5 h-5 accent-[#a97c50]" />
                <span>{event}</span>
                <button
                  className="ml-2 text-red-500 hover:text-red-700 font-bold text-xl"
                  title="Delete event"
                  onClick={() => handleDeleteEvent(idx)}
                >
                  ×
                </button>
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
          <div className="bg-gray-200 rounded-xl h-56 shadow flex items-center justify-center relative overflow-hidden">
            <Image
              src="/Final-Project/library.jpg"
              alt="Library"
              fill
              className="object-cover rounded-xl"
              priority
            />
          </div>
        </section>
      </div>

      {/* Notification Popup */}
      {notification && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#a97c50] text-white px-4 py-2 rounded shadow-lg z-[9999] transition-all animate-fadeIn">
          {notification}
          <style jsx global>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(20px);}
              to { opacity: 1; transform: translateY(0);}
            }
            .animate-fadeIn {
              animation: fadeIn 0.4s;
            }
          `}</style>
        </div>
      )}
    </div>
  );
}