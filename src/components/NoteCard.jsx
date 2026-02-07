import { FaEdit, FaTrash, FaThumbtack } from "react-icons/fa";
import { MdOutlinePreview } from "react-icons/md";

export default function NoteCard({ note, onEdit, onDelete, onPin, onView }) {
  const priorityColors = {
    low: "bg-green-200 dark:bg-green-600 text-green-800 dark:text-white",
    normal: "bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white",
    high: "bg-yellow-200 dark:bg-yellow-500 text-yellow-800 dark:text-white",
    urgent: "bg-red-200 dark:bg-red-600 text-red-800 dark:text-white",
  };

  return (
    <article
      className="note-card dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700
                 p-4 rounded-xl shadow-sm bg-white w-full max-w-xs break-words"
      role="article"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg sm:text-xl font-bold font-mono leading-tight break-words">
          {note.title}
        </h3>
        <button
          onClick={onPin}
          aria-label={note.pinned ? "Unpin note" : "Pin note"}
          className="text-yellow-600 dark:text-yellow-300 hover:opacity-90 ml-2"
        >
          <FaThumbtack
            className={`text-base transform transition-transform ${
              note.pinned ? "rotate-0" : "-rotate-45"
            }`}
          />
        </button>
      </div>

      <div className="mt-2 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span
            className={`inline-block px-2 py-0.5 rounded text-xs ${priorityColors[note.priority]}`}
          >
            {note.priority?.toUpperCase() || "NORMAL"}
          </span>
          <time className="text-xs text-gray-500 dark:text-gray-300">
            {new Date(note.createdAt).toLocaleString()}
          </time>
        </div>

        {note.reminderAt && !note.reminderSent && (
          <div className="text-xs text-blue-500 dark:text-blue-300">
            Reminder at: {new Date(note.reminderAt).toLocaleString()}
          </div>
        )}
      </div>

      <div className="mt-3 max-h-32 overflow-y-auto pr-1 text-sm text-gray-700 dark:text-gray-200 
                      whitespace-pre-wrap break-words">
        {note.content}
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={onEdit}
          className="flex-1 px-3 py-1 text-sm rounded-md bg-teal-100 dark:bg-teal-700 text-teal-700 dark:text-white hover:opacity-95"
        >
          <FaEdit className="inline mr-2" /> Edit
        </button>
        <button
          onClick={onDelete}
          className="flex-1 px-3 py-1 text-sm rounded-md bg-red-100 dark:bg-red-700 text-red-700 dark:text-white hover:opacity-95"
        >
          <FaTrash className="inline mr-2" /> Delete
        </button>
        <button
          onClick={onView}
          className="flex-1 px-3 py-1 text-sm rounded-md bg-rose-100 dark:bg-rose-700 text-rose-700 dark:text-white hover:opacity-95"
        >
          <MdOutlinePreview className="inline mr-2" /> View
        </button>
      </div>
    </article>
  );
}
