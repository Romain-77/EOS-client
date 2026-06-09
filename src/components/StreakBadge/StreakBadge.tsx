import { useEffect, useState } from "react";
import { getStreak } from "../../services/api";
import type { StreakResponse } from "../../interfaces/types";
import "./StreakBadge.css";

const StreakBadge =() => {
    const [streak, setStreak] = useState<StreakResponse>({currentStreak: 0, activeToday: false});


useEffect(() => {
    getStreak()
    .then(data => {
        console.log("Données de série reçues du server:", data);
        setStreak(data);
    })
    .catch(err => console.error("Erreur de récupération de la série", err));
    }, []);

    console.log("Streak actuel:", streak);


  return (
        <div 
            className={`streak-badge ${streak.activeToday ? "lit" : "dimmed"}`} 
            title={streak.activeToday ? "Série active aujourd'hui !" : "Validez vos activités ou écrivez une pensée pour garder votre série !"}
        >
            <span className="streak-emoji">🔥</span>
            <span className="streak-count">{streak.currentStreak}</span>
        </div>
    );
};

export default StreakBadge;