import { useEffect, useState } from "react";
import { deleteNote, getDailyStats, getNotes, getStatsHistory } from "../../services/api";
import type { CategoryWithStats, Note } from "../../interfaces/types";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import logoEOS from "../../assets/logo/logo-EOS.png";
import NoteForm from "../../components/NoteForm/NoteForm";
import PatternPopper from "../../components/PatternPopper/PatternPopper";
import ScrollReveal from "../../components/ScrollReveal/ScrollReveal";
import WellnessTracker from "../../components/WellnessTracker/WellnessTracker";
import WellnessChart from "../../components/WellnessChart/WellnessChart";
import "./Home.css";
import BreathingModal from "../../components/BreathingModal/BreathingModal";

const Home = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [stats, setStats] = useState<CategoryWithStats[]>([]);
    const [history, setHistory] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [editingNote, setEditingNote] = useState<Note | null>(null);
    const { user, logout, loading } = useAuth();
    const [showScrollIndicator, setShowScrollIndicator] = useState(true);
    const [isBreathingModalOpen, setIsBreathingModalOpen] = useState(false);
    
    useEffect(() => {
      const handleScroll = () => {
        if (window.scrollY > 50) {
          setShowScrollIndicator(false);
          window.removeEventListener("scroll", handleScroll);
        } else {
          setShowScrollIndicator(true);
        }
      };
   
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);

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
 const filteredNotes = notes
    .filter(note => {
        if (selectedCategory === "all") return true;
        return note.categoryId?.toString() === selectedCategory?.toString();
    })
    .sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
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
            <div className="logo-container">
              <img src={logoEOS} alt="EOS logo" className="logo-img" />
            </div>
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
              <button className="breathing-modal-btn" onClick={() => setIsBreathingModalOpen(true)}>
                🧘 Prendre une pause respiration
              </button>
            </div>
            <motion.div 
              className="scroll-indicator"
              initial={{ opacity: 1 }}
              animate={{ opacity: showScrollIndicator ? 1 : 0, y: showScrollIndicator ? 0 : 20 }}
              transition={{ duration: 0.4 }}
              style={{ pointerEvents: showScrollIndicator ? 'auto' : 'none' }}
            >
              <div className="mouse">
                <div className="wheel"></div>
              </div>
            </motion.div>
          </section>

          {history.length > 0 && (
            <ScrollReveal>
              <section className="chart-section-wrapper">
                <WellnessChart rawData={history} />
              </section> 
            </ScrollReveal>
          )}

          <section className="notes-section">
            <ScrollReveal>
              <NoteForm 
                onNoteAdded={loadAllData} 
                editingNote={editingNote} 
                onCancelEdit={() => setEditingNote(null)}
              />
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
            </ScrollReveal>

            <div className="notes-grid">
              {filteredNotes.length === 0 ? (
                <p className="no-notes">Aucune note dans cette catégorie.</p>
              ) : (
                filteredNotes.map((note, index) => (
                  <motion.article 
                    key={`note-card-${note.id}`} 
                    className="note-card"
                    initial={{opacity: 0, y: 30}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{once: false, amount: 0.1}}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.1,
                      ease: "easeOut"
                    }}
                  >
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
                  </motion.article>
                ))
              )}
            </div>
          </section>
        </main>
        <BreathingModal isOpen={isBreathingModalOpen} onClose={() => setIsBreathingModalOpen(false)} />
      </div>
    );
};

export default Home;