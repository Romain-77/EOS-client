import React, { useEffect, useState } from "react";
import { CategoryWithStats } from "../../interfaces/types";
import { updateDailyScore, updateCategoryTarget} from "../../services/api";
import "./WellnessTracker.css";

interface WellnessTrackerProps {
    stats: CategoryWithStats[];
    onStatsChange: () => void;
}

const MOOD_OPTIONS = [
    { value: 2, emoji: "🌧️", label: "Nuageux" },
    { value: 5, emoji: "⚡", label: "Stressé" },
    { value: 8, emoji: "☁️", label: "Paisible" },
    { value: 10, emoji: "☀️", label: "Radieux" }
];

const ENERGY_OPTIONS = [
    { value: 2, emoji: "🪫", label: "Épuisé" },
    { value: 5, emoji: "📉", label: "Ralenti" },
    { value: 8, emoji: "🔋", label: "En forme" },
    { value: 10, emoji: "⚡", label: "Productif" }
];

const ACTIVITY_OPTIONS = [
    { value: 2, emoji: "💼", label: "Travail" },
    { value: 5, emoji: "🚶", label: "Balade" },
    { value: 8, emoji: "📖", label: "Lecture" },
    { value: 10, emoji: "🧘", label: "Méditation" }
];

const WellnessTracker = ({ stats, onStatsChange }: WellnessTrackerProps) => {
    const [localScores, setLocalScores] = useState<Record<number, number>>({});

    useEffect(() => {
        const initialScores: Record<number, number> = {};
        stats.forEach(cat => {
            initialScores[cat.id] = cat.currentScore ?? 0;
        });
        setLocalScores(initialScores);
    }, [stats]);

  const handleIconSelect = async (categoryId: number, score: number) => {
        setLocalScores(prev => ({ ...prev, [categoryId]: score }));
        try {
            await updateDailyScore(categoryId, score);
            onStatsChange();
        } catch (err) {
            console.error("Erreur d'actualisation du score", err);
        }
    };

    const getOptionsForCategory = (name: string) => {
        if (name.toLowerCase().includes("humeur du jour")) return MOOD_OPTIONS;
        if(name.toLowerCase().includes("énergie") || name.toLowerCase().includes("énergie")) return ENERGY_OPTIONS;
        return ACTIVITY_OPTIONS;
    };

return (
        <section className="wellness-tracker">
            <h2 className="tracker-title">État d'esprit du jour</h2>
            <div className="tracker-grid">
                {stats.map((cat) => {
                    const currentScore = localScores[cat.id] ?? cat.currentScore ?? 0;
                    const options = getOptionsForCategory(cat.name);

                    return (
                        <div key={`tracker-${cat.id}`} className="tracker-item-modern">
                            <label className="cat-name-modern">{cat.name}</label>
                            
                            <div className="icons-selection-container">
                                {options.map((opt) => {
                                    const isSelected = currentScore === opt.value;
                                    return (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            className={`icon-capsule ${isSelected ? "active" : ""}`}
                                            onClick={() => handleIconSelect(cat.id, opt.value)}
                                        >
                                            <span className="icon-emoji">{opt.emoji}</span>
                                            <span className="icon-label">{opt.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};
export default WellnessTracker;