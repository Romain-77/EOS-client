import React, { useState, useEffect } from "react";
import { getCategories } from "../../services/api";
import type { Category, Note } from "../../interfaces/types";
import api from "../../services/api";
import "./NoteForm.css";

interface NoteFormProps {
    onNoteAdded: () => void;
    editingNote: Note | null;
    onCancelEdit: () => void;
}

const NoteForm = ({ onNoteAdded, editingNote, onCancelEdit }: NoteFormProps) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [categoryId, setCategoryId] = useState("");


    useEffect(() => {
        getCategories()
        .then(setCategories).catch(console.error);
    }, []);

    useEffect(() => {
        if (editingNote) {
            setTitle(editingNote.title);
            setContent(editingNote.content);
            setCategoryId(editingNote.categoryId.toString());
        } else {
            setTitle("");
            setContent("");
            setCategoryId("");
        }
    }, [editingNote]);

const handleSubmit = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    try {
        const payload = { title, content, categoryId: Number(categoryId) };
        
        if (editingNote) {
            await api.put(`/notes/${editingNote.id}`, payload);
        } else {
            await api.post("/notes", payload);
        }

        setTitle("");
        setContent("");
        setCategoryId("");
        onNoteAdded();
        if (editingNote) onCancelEdit();
    } catch (err) {
        console.error("Erreur lors de l'envoi:", err);
    }
};

    return (
        <section className="note-form-container">
             <form onSubmit={handleSubmit} className="note-form">
                <div className="form-header">
                    <h2>{editingNote ? "Modifier la pensée" : "Nouvelle pensée"}</h2>
                    {editingNote && (
                        <button type="button" className="cancel-btn" onClick={onCancelEdit}>
                            Annuler
                        </button>
                    )}
                </div>    
                <div className="input-group">
                    <input 
                        type="text" 
                        placeholder="Titre de votre réflexion..." 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)}
                        required 
                        className="note-input-title"
                    />

                    <select
                        value={categoryId} 
                        onChange={(e) => setCategoryId(e.target.value)} 
                        required
                        className="note-select"
                    >
                        <option value="">Sélectionner un thème</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>    

                <textarea 
                    placeholder="Écrivez ce que vous avez sur le coeur..." 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)} 
                    required 
                    className="note-textarea"
                />
                <div className="note-form-btns">
                    <button type="submit" className="submit-note-btn">
                        {editingNote ? "Mettre à jour" : "Inscrire dans le journal"}
                    </button>
                </div>
            </form>
        </section>
    );
};

export default NoteForm;