import { useEffect, useState, useCallback } from "react";
import api from "./api.js";
import NoteCard from "./components/NoteCard";
import NoteForm from "./components/NoteForm";
import SearchBar from "./components/SearchBar";
import DarkModeToggle from "./components/DarkModeToggle";
import ViewModal from "./components/ViewModal";
import Login from "./components/Login";
import Register from "./components/Register";
import { io as socketIOClient } from "socket.io-client";
import "./index.css";

export default function App() {
  const [notes, setNotes] = useState([]);
  const [user, setUser] = useState(null);
  const [authView, setAuthView] = useState("login");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [search, setSearch] = useState("");
  const [viewingNote, setViewingNote] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchNotes = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      console.log("🔄 Fetching notes for user:", user.id);
      const res = await api.get("/notes");
      console.log("✅ Notes loaded:", res.data.length);
      setNotes(res.data);
    } catch (err) {
      console.error("❌ Error:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (token && savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchNotes();
      
      const socket = socketIOClient(import.meta.env.VITE_API_URL);
      socket.on("refreshNotes", fetchNotes);
      socket.on("reminderDue", (note) => {
        alert(`Reminder: ${note.title}`);
      });
      return () => socket.disconnect();
    }
  }, [user, fetchNotes]);

  const handleLogin = (userData) => {
    console.log("👤 Logged in:", userData);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setNotes([]);
  };

  const handleCreate = async (note) => {
    try {
      await api.post("/notes", note);
      fetchNotes();
      setIsFormOpen(false);
    } catch (err) {
      console.error("Create error:", err);
    }
  };

  const handleUpdate = async (id, note) => {
    try {
      await api.put(`/notes/${id}`, note);
      fetchNotes();
      setEditingNote(null);
      setIsFormOpen(false);
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this note?")) return;
    try {
      await api.delete(`/notes/${id}`);
      fetchNotes();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handlePin = async (id) => {
    try {
      await api.put(`/notes/${id}/toggle-pin`);
      fetchNotes();
    } catch (err) {
      console.error("Pin error:", err);
    }
  };

  const openViewModal = (note) => {
    setViewingNote(note);
    if (window.innerWidth < 768) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const closeViewModal = () => setViewingNote(null);

  const filteredNotes = notes.filter(
    (note) =>
      note.title?.toLowerCase().includes(search.toLowerCase()) ||
      note.content?.toLowerCase().includes(search.toLowerCase())
  );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="w-full max-w-md">
          {authView === "login" ? (
            <Login onLogin={handleLogin} setAuthView={setAuthView} />
          ) : (
            <Register onLogin={handleLogin} setAuthView={setAuthView} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-[var(--bg-color)] text-[var(--text-color)]">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 justify-between w-full md:w-auto">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl text-teal-500 font-bold font-mono">
              📝 {user.email}'s Notes ({notes.length})
            </h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm font-medium"
            >
              Logout
            </button>
          </div>
          <div className="md:hidden">
            <DarkModeToggle />
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="hidden md:block">
            <DarkModeToggle />
          </div>
          <button
            onClick={() => {
              setEditingNote(null);
              setIsFormOpen(true);
              if (window.innerWidth < 768)
                window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="px-4 py-2 bg-teal-500 text-white rounded-md w-full md:w-auto hover:bg-teal-600 font-medium"
          >
            + Add Note
          </button>
        </div>
      </div>

      <div className="flex justify-center mb-6 px-2">
        <div className="w-full max-w-xl">
          <SearchBar setSearch={setSearch} />
        </div>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400">Loading your notes...</p>
        </div>
      )}

      {isFormOpen && (
        <NoteForm
          onSave={(note) =>
            editingNote ? handleUpdate(editingNote._id, note) : handleCreate(note)
          }
          onCancel={() => {
            setIsFormOpen(false);
            setEditingNote(null);
          }}
          initialData={editingNote}
        />
      )}

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 justify-items-center">
        {filteredNotes.length === 0 && !loading ? (
          <div className="col-span-full text-center py-20">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-2">
              No notes yet
            </h2>
            <p className="text-gray-500 dark:text-gray-500 mb-6">
              Your notes will appear here
            </p>
            <button
              onClick={() => {
                setEditingNote(null);
                setIsFormOpen(true);
              }}
              className="px-6 py-3 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600"
            >
              Create First Note
            </button>
          </div>
        ) : (
          filteredNotes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onEdit={() => {
                setEditingNote(note);
                setIsFormOpen(true);
                if (window.innerWidth < 768)
                  window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onDelete={() => handleDelete(note._id)}
              onPin={() => handlePin(note._id)}
              onView={() => openViewModal(note)}
            />
          ))
        )}
      </section>

      {viewingNote && <ViewModal note={viewingNote} onClose={closeViewModal} />}
    </div>
  );
}
