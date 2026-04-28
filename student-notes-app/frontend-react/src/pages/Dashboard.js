import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  deleteNote,
  dislikeNote,
  getMyUploads,
  getNotes,
  likeNote,
  uploadNote
} from "../services/api";
import { clearAuth, getStoredUser } from "../utils/auth";
import "./dashboard.css";

function ThumbUpIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14 9V5.5c0-1.4-.8-2.7-2-3.3L8.6 9H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h9.2a3 3 0 0 0 2.9-2.2l1.4-5.2a3 3 0 0 0-2.9-3.8H14Z" />
      <path d="M8 9v12" />
    </svg>
  );
}

function ThumbDownIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10 15v3.5c0 1.4.8 2.7 2 3.3l3.4-6.8H19a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H9.8a3 3 0 0 0-2.9 2.2L5.5 10.4A3 3 0 0 0 8.4 14H10Z" />
      <path d="M16 15V3" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2.5M12 19.5V22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M2 12h2.5M19.5 12H22M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 15.3A8.5 8.5 0 0 1 8.7 4a9 9 0 1 0 11.3 11.3Z" />
    </svg>
  );
}

function OverviewIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 13.5 12 5l8 8.5" />
      <path d="M6.5 11.5V20h11v-8.5" />
      <path d="M10 20v-5h4v5" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 16V4" />
      <path d="m7.5 8.5 4.5-4.5 4.5 4.5" />
      <path d="M5 18.5V20h14v-1.5" />
    </svg>
  );
}

function CollectionIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <path d="M8 9h8M8 13h8M8 17h5" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16" />
      <path d="M9 3h6l1 2H8l1-2Z" />
      <path d="M7 7l1 13h8l1-13" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

function Counter({ value }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let frame;
    let start;
    const duration = 700;

    const animate = (timestamp) => {
      if (!start) {
        start = timestamp;
      }

      const progress = Math.min((timestamp - start) / duration, 1);
      setDisplayValue(Math.round(progress * value));

      if (progress < 1) {
        frame = window.requestAnimationFrame(animate);
      }
    };

    frame = window.requestAnimationFrame(animate);

    return () => window.cancelAnimationFrame(frame);
  }, [value]);

  return <>{displayValue}</>;
}

function LoadingBlock({ message }) {
  return (
    <div className="loading-block">
      <div className="loader-ring"></div>
      <p>{message}</p>
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const user = getStoredUser();

  const [notes, setNotes] = useState([]);
  const [myUploads, setMyUploads] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedNote, setSelectedNote] = useState(null);
  const [toast, setToast] = useState(null);
  const [noteToDelete, setNoteToDelete] = useState(null);

  const showToast = (message, type = "info") => {
    setToast({ id: Date.now(), message, type });
  };

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setToast(null);
    }, 2600);

    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleAuthFailure = () => {
    clearAuth();
    navigate("/");
  };

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [allNotesRes, myUploadsRes] = await Promise.all([
        getNotes(),
        getMyUploads()
      ]);

      setNotes(allNotesRes.data);
      setMyUploads(myUploadsRes.data);
    } catch (error) {
      if (error.response?.status === 401) {
        handleAuthFailure();
        return;
      }

      showToast(error.response?.data?.message || "Failed to load notes", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    setSelectedSubject("All");
  }, [activeTab]);

  const upload = async () => {
    if (!file) {
      showToast("Select file first", "error");
      return;
    }

    const fd = new FormData();
    fd.append("file", file);
    fd.append("title", title);
    fd.append("subject", subject);
    fd.append("topic", topic);

    try {
      await uploadNote(fd);
      await loadDashboardData();
      setFile(null);
      setTitle("");
      setSubject("");
      setTopic("");
      setActiveTab("myUploads");
      showToast("Note uploaded successfully", "success");
    } catch (error) {
      showToast(error.response?.data?.message || "Upload failed", "error");
    }
  };

  const totalLikes = notes.reduce((sum, note) => sum + (note.likes || 0), 0);
  const subjects = notes.map((note) => note.subject).filter(Boolean);
  const mostUsedSubject =
    subjects.length > 0
      ? subjects
          .sort(
            (a, b) =>
              subjects.filter((value) => value === a).length -
              subjects.filter((value) => value === b).length
          )
          .pop()
      : "None";
  const latestNote = notes.length > 0 ? notes[0].title : "None";

  const currentItems = activeTab === "myUploads" ? myUploads : notes;
  const availableSubjects = [
    "All",
    ...new Set(currentItems.map((note) => note.subject).filter(Boolean))
  ];

  const sortNotes = (items) => {
    const sorted = [...items];

    if (sortBy === "newest") {
      return sorted.sort(
        (a, b) => new Date(b.uploadedAt || 0) - new Date(a.uploadedAt || 0)
      );
    }

    if (sortBy === "oldest") {
      return sorted.sort(
        (a, b) => new Date(a.uploadedAt || 0) - new Date(b.uploadedAt || 0)
      );
    }

    if (sortBy === "mostLiked") {
      return sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    }

    if (sortBy === "titleAsc") {
      return sorted.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    }

    return sorted;
  };

  const prepareNotes = (items) =>
    sortNotes(
      items.filter((note) => {
        const matchesSearch =
          note.title?.toLowerCase().includes(search.toLowerCase()) ||
          note.subject?.toLowerCase().includes(search.toLowerCase()) ||
          note.topic?.toLowerCase().includes(search.toLowerCase());
        const matchesSubject =
          selectedSubject === "All" || note.subject === selectedSubject;

        return matchesSearch && matchesSubject;
      })
    );

  const filteredNotes = prepareNotes(notes);
  const filteredMyUploads = prepareNotes(myUploads);

  const getSubjectBadgeClass = (subjectValue) => {
    const normalized = (subjectValue || "").trim().toLowerCase();
    const subjectMap = {
      dbms: "badge-dbms",
      database: "badge-dbms",
      java: "badge-java",
      python: "badge-python",
      os: "badge-os",
      operating: "badge-os",
      cn: "badge-cn",
      networks: "badge-cn",
      ai: "badge-ai",
      ml: "badge-ai",
      maths: "badge-maths",
      math: "badge-maths"
    };

    const match = Object.keys(subjectMap).find((key) =>
      normalized.includes(key)
    );

    return match ? subjectMap[match] : "badge-default";
  };

  const logout = () => {
    clearAuth();
    navigate("/");
  };

  const handleLike = async (id) => {
    try {
      await likeNote(id);
      await loadDashboardData();
      showToast("Reaction updated", "success");
    } catch (error) {
      showToast(error.response?.data?.message || "Like failed", "error");
    }
  };

  const handleDislike = async (id) => {
    try {
      await dislikeNote(id);
      await loadDashboardData();
      showToast("Reaction updated", "success");
    } catch (error) {
      showToast(error.response?.data?.message || "Dislike failed", "error");
    }
  };

  const requestDelete = (note) => {
    setNoteToDelete(note);
  };

  const confirmDelete = async () => {
    if (!noteToDelete) {
      return;
    }

    try {
      await deleteNote(noteToDelete._id);
      await loadDashboardData();

      if (selectedNote?._id === noteToDelete._id) {
        setSelectedNote(null);
      }

      setNoteToDelete(null);
      showToast("Note deleted", "success");
    } catch (error) {
      showToast(error.response?.data?.message || "Delete failed", "error");
    }
  };

  const renderNotes = (items, emptyText) => {
    if (items.length === 0) {
      return (
        <div className="empty-state">
          <h3>Nothing to show yet</h3>
          <p>{emptyText}</p>
        </div>
      );
    }

    return (
      <div className="notes-grid">
        {items.map((note) => {
          const likedBy = note.likedBy || [];
          const dislikedBy = note.dislikedBy || [];
          const isLiked = likedBy.includes(user?.userId);
          const isDisliked = dislikedBy.includes(user?.userId);
          const isOwner = note.userId === user?.userId;

          return (
            <article className="note-card card-animated" key={note._id}>
              <div className="note-card-head">
                <span className={`note-badge ${getSubjectBadgeClass(note.subject)}`}>
                  {note.subject}
                </span>
                <div className="note-reaction-summary">
                  <span className="note-likes">{note.likes || 0} likes</span>
                  <span className="note-dislikes">{note.dislikes || 0} dislikes</span>
                </div>
              </div>

              <h4>{note.title}</h4>
              <p className="note-topic">{note.topic}</p>

              <div className="actions">
                <button
                  className={isLiked ? "reaction-btn active-like" : "reaction-btn"}
                  onClick={() => handleLike(note._id)}
                  title="Like"
                >
                  <ThumbUpIcon />
                  <span>Like</span>
                </button>

                <button
                  className={isDisliked ? "reaction-btn active-dislike" : "reaction-btn"}
                  onClick={() => handleDislike(note._id)}
                  title="Dislike"
                >
                  <ThumbDownIcon />
                  <span>Dislike</span>
                </button>

                <button className="secondary-btn" onClick={() => setSelectedNote(note)}>
                  Details
                </button>

                <a
                  href={`http://127.0.0.1:3001/${note.filepath}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open File
                </a>

                <button
                  className={isOwner ? "danger-btn delete-btn" : "disabled-btn delete-btn"}
                  onClick={() => isOwner && requestDelete(note)}
                  disabled={!isOwner}
                  title={isOwner ? "Delete this note" : "Only the uploader can delete this note"}
                >
                  <TrashIcon />
                  <span>Delete</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <div className="dashboard-shell">
        <aside className="sidebar">
          <div className="sidebar-top">
            <div>
              <span className="sidebar-kicker">Workspace</span>
              <h2 className="logo">NoteMate</h2>
            </div>

            <div className="profile-card">
              <span className="profile-avatar">
                {(user?.name || user?.email || "U").charAt(0).toUpperCase()}
              </span>
              <div>
                <strong>{user?.name || "Student User"}</strong>
                <p>{user?.email || "Signed in"}</p>
              </div>
            </div>
          </div>

          <nav className="sidebar-nav">
            <button
              className={activeTab === "dashboard" ? "nav-item active" : "nav-item"}
              onClick={() => setActiveTab("dashboard")}
            >
              <OverviewIcon />
              <span>Overview</span>
            </button>
            <button
              className={activeTab === "upload" ? "nav-item active" : "nav-item"}
              onClick={() => setActiveTab("upload")}
            >
              <UploadIcon />
              <span>Upload Notes</span>
            </button>
            <button
              className={activeTab === "myUploads" ? "nav-item active" : "nav-item"}
              onClick={() => setActiveTab("myUploads")}
            >
              <CollectionIcon />
              <span>My Uploads</span>
            </button>
          </nav>

          <div className="sidebar-actions">
            <button
              className="theme-toggle"
              onClick={() => setTheme((current) => (current === "light" ? "dark" : "light"))}
            >
              {theme === "light" ? <MoonIcon /> : <SunIcon />}
              <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
            </button>

            <button className="logout-btn" onClick={logout}>
              <LogoutIcon />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        <main className="main">
          <section className="hero-panel card-animated">
            <div>
              <span className="hero-kicker">Academic control center</span>
              <h1>
                {activeTab === "dashboard" && "A clearer way to manage all notes"}
                {activeTab === "upload" && "Upload new study material"}
                {activeTab === "myUploads" && "Review your personal uploads"}
              </h1>
              <p>
                Keep files organized by subject and topic, then jump into what you
                need without digging through folders.
              </p>
            </div>

            <div className="hero-tools">
              <div className="hero-search">
                <input
                  type="text"
                  placeholder={
                    activeTab === "myUploads"
                      ? "Search your uploads..."
                      : "Search notes..."
                  }
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {activeTab !== "upload" && (
                <div className="toolbar-row">
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="mostLiked">Most liked</option>
                    <option value="titleAsc">Title A-Z</option>
                  </select>
                </div>
              )}
            </div>
          </section>

          {activeTab !== "upload" && (
            <section className="subject-filter-bar">
              {availableSubjects.map((subjectOption) => (
                <button
                  key={subjectOption}
                  className={
                    selectedSubject === subjectOption
                      ? "subject-chip active"
                      : "subject-chip"
                  }
                  onClick={() => setSelectedSubject(subjectOption)}
                >
                  {subjectOption}
                </button>
              ))}
            </section>
          )}

          {activeTab === "dashboard" && (
            <>
              <section className="metrics">
                <div className="card metric-card card-animated">
                  <span className="metric-label">Total notes</span>
                  <h3><Counter value={notes.length} /></h3>
                  <p>Files available across the workspace.</p>
                </div>
                <div className="card metric-card card-animated">
                  <span className="metric-label">Total likes</span>
                  <h3><Counter value={totalLikes} /></h3>
                  <p>Engagement across all shared materials.</p>
                </div>
                <div className="card metric-card card-animated">
                  <span className="metric-label">Top subject</span>
                  <h3>{mostUsedSubject}</h3>
                  <p>Most frequent subject in the note library.</p>
                </div>
                <div className="card metric-card card-animated">
                  <span className="metric-label">Latest upload</span>
                  <h3>{latestNote}</h3>
                  <p>Most recently added note in the system.</p>
                </div>
              </section>

              <section className="section-block card-animated">
                <div className="section-heading">
                  <div>
                    <span className="section-kicker">Library</span>
                    <h2>All Notes</h2>
                  </div>
                  <span className="section-meta">
                    {filteredNotes.length} result{filteredNotes.length === 1 ? "" : "s"}
                  </span>
                </div>
                {isLoading ? (
                  <LoadingBlock message="Please wait while notes are loading." />
                ) : (
                  renderNotes(filteredNotes, "No notes matched your current search.")
                )}
              </section>
            </>
          )}

          {activeTab === "upload" && (
            <section className="upload-layout">
              <div className="upload-card card-animated">
                <div className="section-heading">
                  <div>
                    <span className="section-kicker">Uploader</span>
                    <h2>Add New Note</h2>
                  </div>
                </div>

                <div className="inputs">
                  <label className="input-card">
                    <span>Title</span>
                    <input
                      placeholder="Database Systems Unit 3"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </label>

                  <label className="input-card">
                    <span>Subject</span>
                    <input
                      placeholder="Database Systems"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </label>

                  <label className="input-card">
                    <span>Topic</span>
                    <input
                      placeholder="Normalization"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                    />
                  </label>

                  <label className="input-card file-card">
                    <span>Choose file</span>
                    <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                  </label>
                </div>

                <button className="upload-btn" onClick={upload}>
                  Upload Note
                </button>
              </div>

              <div className="upload-side-panel">
                <div className="tip-card card-animated">
                  <span className="section-kicker">Best practice</span>
                  <h3>Name files clearly</h3>
                  <p>
                    Use meaningful titles and subject names so search works better for
                    you and your classmates.
                  </p>
                </div>

                <div className="tip-card card-animated">
                  <span className="section-kicker">Current selection</span>
                  <h3>{file?.name || "No file selected"}</h3>
                  <p>
                    Add a file, then upload it to move it directly into your personal
                    note collection.
                  </p>
                </div>
              </div>
            </section>
          )}

          {activeTab === "myUploads" && (
            <>
              <section className="metrics compact-metrics">
                <div className="card metric-card card-animated">
                  <span className="metric-label">My uploads</span>
                  <h3><Counter value={myUploads.length} /></h3>
                  <p>Total notes uploaded from your account.</p>
                </div>
              </section>

              <section className="section-block card-animated">
                <div className="section-heading">
                  <div>
                    <span className="section-kicker">Personal library</span>
                    <h2>My Uploads</h2>
                  </div>
                  <span className="section-meta">
                    {filteredMyUploads.length} result{filteredMyUploads.length === 1 ? "" : "s"}
                  </span>
                </div>
                {isLoading ? (
                  <LoadingBlock message="Please wait while your uploads are loading." />
                ) : (
                  renderNotes(
                    filteredMyUploads,
                    "You have not uploaded any notes yet."
                  )
                )}
              </section>
            </>
          )}
        </main>
      </div>

      {selectedNote && (
        <div className="modal-backdrop" onClick={() => setSelectedNote(null)}>
          <div className="note-modal card-animated" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top">
              <div>
                <span className="section-kicker">Note details</span>
                <h2>{selectedNote.title}</h2>
              </div>
              <button className="modal-close" onClick={() => setSelectedNote(null)}>
                Close
              </button>
            </div>

            <div className="modal-grid">
              <div className="modal-detail">
                <span>Subject</span>
                <strong>{selectedNote.subject || "General"}</strong>
              </div>
              <div className="modal-detail">
                <span>Topic</span>
                <strong>{selectedNote.topic || "General"}</strong>
              </div>
              <div className="modal-detail">
                <span>Likes</span>
                <strong>{selectedNote.likes || 0}</strong>
              </div>
              <div className="modal-detail">
                <span>Dislikes</span>
                <strong>{selectedNote.dislikes || 0}</strong>
              </div>
            </div>

            <div className="modal-actions">
              <a
                href={`http://127.0.0.1:3001/${selectedNote.filepath}`}
                target="_blank"
                rel="noreferrer"
              >
                Open File
              </a>
            </div>
          </div>
        </div>
      )}

      {noteToDelete && (
        <div className="modal-backdrop" onClick={() => setNoteToDelete(null)}>
          <div className="confirm-modal card-animated" onClick={(e) => e.stopPropagation()}>
            <span className="section-kicker">Confirm delete</span>
            <h2>Delete this note?</h2>
            <p>
              You are about to remove <strong>{noteToDelete.title}</strong>. This action
              cannot be undone.
            </p>
            <div className="confirm-actions">
              <button className="modal-close" onClick={() => setNoteToDelete(null)}>
                Cancel
              </button>
              <button className="danger-btn delete-btn" onClick={confirmDelete}>
                <TrashIcon />
                <span>Delete Note</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <strong>
            {toast.type === "success" ? "Success" : toast.type === "error" ? "Error" : "Info"}
          </strong>
          <span>{toast.message}</span>
        </div>
      )}
    </>
  );
}

export default Dashboard;
