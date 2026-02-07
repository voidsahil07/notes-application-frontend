import { useState, useEffect } from "react";
import { FaSave, FaTimes } from "react-icons/fa";

export default function NoteForm({ onSave, onCancel, initialData }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState("normal");
  const [reminderAt, setReminderAt] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setContent(initialData.content || "");
      setPriority(initialData.priority || "normal");
      setReminderAt(
        initialData.reminderAt
          ? new Date(initialData.reminderAt).toISOString().slice(0, 16)
          : ""
      );
    } else {
      setTitle("");
      setContent("");
      setPriority("normal");
      setReminderAt("");
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onSave({
      title,
      content,
      priority,
      reminderAt: reminderAt || null
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md mb-6 w-full max-w-xl mx-auto border border-gray-200 dark:border-gray-700"
    >
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-teal-500 dark:text-teal-300 text-center">
        {initialData ? "✏️ Edit Note" : "📝 New Note"}
      </h2>

      <input
        type="text"
        placeholder="Enter title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 p-3 mb-3 rounded-lg"
      />

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 p-3 mb-3 rounded-lg"
      >
        <option value="low">🟢 Low</option>
        <option value="normal">⚪ Normal</option>
        <option value="high">🟡 High</option>
        <option value="urgent">🔴 Urgent</option>
      </select>

      <input
        type="datetime-local"
        value={reminderAt}
        onChange={(e) => setReminderAt(e.target.value)}
        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 p-3 mb-3 rounded-lg"
      />

      <textarea
        placeholder="Write note content..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 p-3 mb-3 rounded-lg h-36 resize-vertical"
      />

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700">
          <FaSave /> {initialData ? "Update" : "Save"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-400 dark:bg-gray-600 text-white"
        >
          <FaTimes /> Cancel
        </button>
      </div>
    </form>
  );
}
