import { useEffect, useState } from "react";
import { deleteNote, getDailyStats, getNotes, getStatsHistory } from "../../services/api";
import type { CategoryWithStats, Note } from "../../interfaces/types";
import NoteForm from "../../components/NoteForm/NoteForm";
import WellnessTracker from "../../components/WellnessTracker/WellnessTracker";
import WellnessChart from "../../components/WellnessChart/WellnessChart";
import { useAuth } from "../../contexts/AuthContext";
import PatternPopper from "../../components/PatternPopper/PatternPopper";
import "./Home.css";

const Home = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [stats, setStats] = useState<CategoryWithStats[]>([]);
    const [history, setHistory] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [editingNote, setEditingNote] = useState<Note | null>(null);
    const { user, logout, loading } = useAuth();

    const loadAllData = async () => {
      try {
        const [fetchedNotes, fetchedStats, fetchedHistory] = await Promise.all([
          getNotes(),
          getDailyStats(),
          getStatsHistory(7)
        ]);
        setNotes(fetchedNotes);
        setStats(fetchedStats);
        setHistory(fetchedHistory);
      } catch (err) {
        console.error("Erreur de chargement:", err);
      }
    }
  
    useEffect(() => {
      console.log("Etat de l'auth pour chargement:", {loading, user});
      if(!loading && user) {
        console.log("User présent, chargement des données");
      loadAllData();
      }
    }, [user, loading]);

    if (loading) {
      return <div className="loading-screen">Un instant pour soi...</div>;
    }

    if (!user) {
      return null;
    }
    const filteredNotes = notes.filter(note => {
    if (selectedCategory === "all") 
    return true;
    return note.categoryId?.toString() === selectedCategory?.toString();
});


    const handleEdit = (note : Note) => {
      setEditingNote(note);
      window.scrollTo(0, 0);
    }

    const handleDelete = async (id: number) => {
      if (confirm("Supprimer cette note ?")) {
        try {
          await deleteNote(id);
          setNotes(prev => prev.filter(n => n.id !== id));
        } catch (err) {
          console.error("Erreur lors de la suppression", err);
        }
      }
    };


    return (
      <div className="home-page">
        <header className="home-header">
          <div className="header-content">
              <h1 className="logo-small">E O S</h1>
              <p className="welcome-text">Bienvenue, {user?.username}</p>
              <button className="logout-btn" onClick={logout}>Déconnexion</button>
            </div>
          </header>

          <main className="home-container">
            <section className="dashboard-top">
              <div className="tracker-card">
                  <WellnessTracker stats={stats} onStatsChange={loadAllData} />
              </div>
                <div className="mini-games">
                  <PatternPopper />
                </div>
            </section>

            {history.length > 0 && (
              <section className="chart-section-wrapper">
                <WellnessChart rawData={history} />
              </section> 
            )}

            <section className="notes-section">
              <div className="notes-header">
                <h2>Journal de bord</h2>
                  <div className="filter-bar">
                    <select
                      id="category-filter"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="all">Toutes les pensées</option>
                      {stats.map((cat, index) => (
                          <option key={`filter-cat-${cat.id}-${index}`} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div> 

                <NoteForm 
                onNoteAdded={loadAllData} 
                editingNote={editingNote} 
                onCancelEdit={() => setEditingNote(null)}
                />
                
                <div className="notes-grid">
                  {filteredNotes.length === 0 ? (
                    <p className="no-notes">Aucune note dans cette catégorie.</p>
                  ) : (
                    filteredNotes.map((note) => (
                      <article key={`note-card-${note.id}`} className="note-card">
                        <div className="note-header">
                            <span className="category-badge">{note.categoryName}</span>
                            <span className="note-date">
                                {new Date(note.createdAt).toLocaleDateString("fr-FR", {day: "numeric", month: "short"})}
                            </span>
                        </div>    
                        <h3>{note.title}</h3>
                        <p>{note.content}</p>
                        <div className="actions-btns">
                          <button className="edit-btn" onClick={() => handleEdit(note)}>Modifier</button>
                          <button className="delete-btn" onClick={() => handleDelete(note.id)}>Supprimer</button>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </section>
            </main>
          </div>
        );
};

export default Home;