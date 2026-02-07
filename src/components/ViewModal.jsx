import React from "react";

export default function ViewModal({ note, onClose }) {
  if (!note) return null;

  const priorityColors = {
    low: "bg-green-200 dark:bg-green-600 text-green-800 dark:text-white",
    normal: "bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white",
    high: "bg-yellow-200 dark:bg-yellow-500 text-yellow-800 dark:text-white",
    urgent: "bg-red-200 dark:bg-red-600 text-red-800 dark:text-white",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
    >
  
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-gray-800 
        text-gray-900 dark:text-gray-100 rounded-xl shadow-lg p-6 z-10
        max-h-[90vh] flex flex-col"
      >
      
        <div className="flex items-start justify-between gap-4 flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold">{note.title}</h2>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {new Date(note.createdAt).toLocaleString()}
            </p>

            <span
              className={`inline-block mt-3 px-2 py-0.5 rounded text-xs ${priorityColors[note.priority]}`}
            >
              {note.priority?.toUpperCase() || "NORMAL"}
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 text-sm hover:opacity-90"
          >
            Close
          </button>
        </div>

        <hr className="my-4 border-gray-200 dark:border-gray-700 flex-shrink-0" />

       
        <div
          className="overflow-y-auto pr-2 text-gray-800 dark:text-gray-200 text-sm leading-relaxed"
          style={{ maxHeight: "65vh" }}
        >
          {note.content}
        </div>
      </div>
    </div>
  );
}
