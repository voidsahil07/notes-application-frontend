export default function SearchBar({ setSearch }) {
  return (
    <input
      type="text"
      placeholder="Search notes by title or content..."
      className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}
