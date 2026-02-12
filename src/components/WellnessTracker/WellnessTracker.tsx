import React, { useEffect, useState } from "react";
import { CategoryWithStats } from "../../interfaces/types";
import { updateDailyScore, updateCategoryTarget} from "../../services/api";
import "./WellnessTracker.css";

interface WellnessTrackerProps {
    stats: CategoryWithStats[];
    onStatsChange: () => void;
}

const WellnessTracker = ({ stats, onStatsChange }: WellnessTrackerProps) => {
    const [localScores, setLocalScores] = useState<Record<number, number>>({});

    useEffect(() => {
        const initialScores: Record<number, number> = {};
        stats.forEach(cat => {
            initialScores[cat.id] = cat.currentScore ?? 0;
        });
        setLocalScores(initialScores);
    }, [stats]);

    const handleSliderChange = async (categoryId: number, score: number) => {
       
        setLocalScores(prev => ({ ...prev, [categoryId]: score }));

        try {
            await updateDailyScore(categoryId, score);
        } catch (err) {
            console.error("Erreur d'actualisation du score", err);
        }
    };

    const handleTargetClick = async (categoryId: number, currentTarget: number, categoryName: string) => {
        const targetValue = currentTarget !== undefined ? currentTarget : 8;
        
        const userInput = window.prompt(
            `Modifier l'objectif pour "${categoryName}"(actuellement ${currentTarget}/10) :`, currentTarget.toString()
        );

        if (userInput !== null) {
            const newTarget = parseInt(userInput, 10);

            if(!isNaN(newTarget) && newTarget >= 0 && newTarget <= 10) {
                try {
                    await updateCategoryTarget(categoryId, newTarget);
                    onStatsChange();
                } catch (err) {
                    alert("Erreur lors de la modification de l'obejectif");
                }
            } else {
                alert("Veuillez entrer un nombre entre 0 et 10.");
            }
        }
    };

    return (
        <section className="wellness-tracker">
            <h2 className="tracker-title">État d'esprit du jour</h2>
            <div className="tracker-grid">
                {stats.map((cat) => {
                    const current = localScores[cat.id] ?? cat.currentScore ?? 0;
                    const target = cat.target_score; 
                    const progressPercent = (current / 10) * 100;

                    return (
                        <div key={`tracker-${cat.id}`} className="tracker-item">
                            <div className="tracker-info">
                                <label className="cat-name">{cat.name}</label>
                                <span className="current-score"> {current} / 10</span>
                            </div>

                            <div className="slider-container">
                                <input
                                    type="range"
                                    min="0"
                                    max="10"
                                    value={current}
                                    onChange={(e) => handleSliderChange(cat.id, parseInt(e.target.value))} 
                                    className="slider"
                                />
                            </div>

                            <div className="progress-bar-container">
                                <div 
                                    className={`progress-bar-fill ${current >= target ? 'achieved' : ''}`}
                                    style={{ width: `${progressPercent}%` }}
                                ></div>
                            </div>

                            <div className="target footer" onClick={() => handleTargetClick(cat.id, target, cat.name)}>
                                <span className="target-text">Objectif: {target}/10</span>
                                <span className="edit-target">Ajuster</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default WellnessTracker;