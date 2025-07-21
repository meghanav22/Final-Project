"use client";

import React, { useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";

export default function Calendar() {
  const daysOfWeek = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
  const daysInMonth = 31;
  const firstDayIdx = 2; // July 1, 2025 is a Tuesday

  // Calendar grid setup
  const calendarCells = [];
  for (let i = 0; i < firstDayIdx; i++) calendarCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d);
  while (calendarCells.length % 7 !== 0) calendarCells.push(null);

  // State for tasks per day
  const [dayTasks, setDayTasks] = useState<{ [key: number]: { text: string; done: boolean }[] }>(
    {}
  );
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [newDayTask, setNewDayTask] = useState("");

  // State for upcoming/important events
  const [events, setEvents] = useState<{ text: string; done: boolean }[]>([
    { text: "Event 1", done: false },
    { text: "Event 2", done: false },
    { text: "Event 3", done: false },
    { text: "Event 4", done: false },
  ]);
  const [newEvent, setNewEvent] = useState("");

  // Add new task to a day
  const handleAddDayTask = (day: number) => {
    if (newDayTask.trim()) {
      setDayTasks(prev => ({
        ...prev,
        [day]: [...(prev[day] || []), { text: newDayTask.trim(), done: false }],
      }));
      setNewDayTask("");
      setEditingDay(null);
    }
  };

  // Toggle completion for a day task
  const handleToggleDayTask = (day: number, idx: number) => {
    setDayTasks(prev => ({
      ...prev,
      [day]: prev[day].map((task, i) =>
        i === idx ? { ...task, done: !task.done } : task
      ),
    }));
  };

  // Remove a day task
  const handleRemoveDayTask = (day: number, idx: number) => {
    setDayTasks(prev => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== idx),
    }));
  };

  // Add new event
  const handleAddEvent = () => {
    if (newEvent.trim()) {
      setEvents([...events, { text: newEvent.trim(), done: false }]);
      setNewEvent("");
    }
  };

  // Toggle completion for event
  const handleToggleEvent = (idx: number) => {
    setEvents(events.map((event, i) =>
      i === idx ? { ...event, done: !event.done } : event
    ));
  };

  // Remove event
  const handleRemoveEvent = (idx: number) => {
    setEvents(events.filter((_, i) => i !== idx));
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans p-6 relative">
      {/* Header */}
      <header className="flex flex-col items-center mb-6">
        <div className="w-full h-20 bg-white/40 rounded-xl mb-2 flex items-center justify-between px-4 shadow">
          <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
            <FaCalendarAlt className="text-[#a97c50] text-2xl" />
          </div>
          <h1 className="text-3xl font-bold tracking-wide">Calendar</h1>
          <div className="w-10 h-10" /> {/* Spacer */}
        </div>
        <div className="w-full h-6 bg-white/60 rounded mb-2" /> {/* Search bar placeholder */}
      </header>

      {/* Calendar Grid */}
      <section className="mb-8">
        <div className="font-bold text-xl mb-2">July 2025</div>
        <div className="grid grid-cols-7 gap-2 mb-2">
          {daysOfWeek.map(day => (
            <div key={day} className="text-center font-semibold">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {calendarCells.map((cell, idx) => (
            <div
              key={idx}
              className={`h-32 bg-white/80 rounded-xl flex flex-col items-start justify-start p-2 shadow text-lg font-medium relative ${cell ? "" : "opacity-0"}`}
            >
              {cell && (
                <>
                  <span className="font-bold mb-1">{cell}</span>
                  <ul className="text-sm text-gray-700 mb-2 w-full">
                    {(dayTasks[cell] || []).map((task, tIdx) => (
                      <li key={tIdx} className="flex justify-between items-center">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={task.done}
                            onChange={() => handleToggleDayTask(cell, tIdx)}
                            className="w-4 h-4 accent-[#a97c50]"
                          />
                          <span className={task.done ? "line-through" : ""}>{task.text}</span>
                        </label>
                        <button
                          className="ml-2 text-xs text-red-400 hover:text-red-600"
                          onClick={() => handleRemoveDayTask(cell, tIdx)}
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                  {editingDay === cell ? (
                    <div className="w-full flex flex-col items-center">
                      <input
                        type="text"
                        className="border rounded px-2 py-1 mb-1 w-full"
                        value={newDayTask}
                        onChange={e => setNewDayTask(e.target.value)}
                        placeholder="New task"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          className="bg-[#a97c50] text-white px-2 py-1 rounded text-xs"
                          onClick={() => handleAddDayTask(cell)}
                        >
                          Add
                        </button>
                        <button
                          className="bg-gray-200 px-2 py-1 rounded text-xs"
                          onClick={() => { setEditingDay(null); setNewDayTask(""); }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      className="mt-auto text-xs text-[#a97c50] underline"
                      onClick={() => setEditingDay(cell)}
                    >
                      + Add Task
                    </button>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming / Important Events */}
      <section className="mt-8">
        <h2 className="font-semibold text-xl mb-2">Upcoming / Important Events</h2>
        <ul className="space-y-3 mb-3">
          {events.map((event, idx) => (
            <li key={idx} className="flex items-center gap-2 text-lg">
              <input
                type="checkbox"
                className="w-5 h-5 accent-[#a97c50]"
                checked={event.done}
                onChange={() => handleToggleEvent(idx)}
              />
              <span className={event.done ? "line-through" : ""}>{event.text}</span>
              <button
                className="ml-2 text-xs text-red-400 hover:text-red-600"
                onClick={() => handleRemoveEvent(idx)}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            className="border rounded px-2 py-1 flex-1"
            value={newEvent}
            onChange={e => setNewEvent(e.target.value)}
            placeholder="Add event"
          />
          <button
            className="bg-[#a97c50] text-white px-3 py-1 rounded"
            onClick={handleAddEvent}
          >
            Add
          </button>
        </div>
      </section>
    </div>
  );
}