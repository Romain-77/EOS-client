import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./BreathingModal.css";

interface BreathingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type BreathingPhase = "Inspirer" | "Expirer" | "Prêt?";

const BreathingModal = ({ isOpen, onClose }: BreathingModalProps) => {
    const [isActive, setIsActive] = useState(false);
    const [phase, setPhase] = useState<BreathingPhase>("Prêt?");
    const [timeLeft, setTimeLeft] = useState(120); // 2 minutes (120 secondes)

    useEffect(() => {
        let timer: any;

        if (isActive) {
            setPhase("Inspirer"); // On commence directement par inspirer
            
            timer = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime <= 1) {
                        // Fin de la session
                        clearInterval(timer);
                        setIsActive(false);
                        setPhase("Prêt?");
                        return 120; // Réinitialise pour la prochaine fois
                    }
                    
                    const newTime = prevTime - 1;
                    const elapsed = 120 - newTime;
                    
                    // Gestion du cycle de 10 secondes (5s inspiration / 5s expiration)
                    const cycleSecond = elapsed % 10;
                    if (cycleSecond < 5) {
                        setPhase("Inspirer");
                    } else {
                        setPhase("Expirer");
                    }
                    
                    return newTime;
                });
            }, 1000);
        }

        // Nettoyage à la mise en pause ou fermeture
        return () => clearInterval(timer);
    }, [isActive]); 

    const handleStart = () => {
        setTimeLeft(120);
        setIsActive(true);
    };

    const handleStop = () => {
        setIsActive(false);
        setPhase("Prêt?");
        setTimeLeft(120); // Remet à 2 min pour que le bouton affiche à nouveau "Commencer"
    };

    const handleClose = () => {
        handleStop(); // Reset la logique si on ferme la modal
        onClose();
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    if (!isOpen) return null;

    return (
        <div className="breathing-overlay">
            <div className="breathing-card">
                <button className="close-button" onClick={handleClose}>✕</button>
                
                <h2>Cohérence Cardiaque</h2>
                <p className="timer-display">{formatTime(timeLeft)}</p>
                
                <div className="breathing-circle-container">
                    <motion.div
                        className={`breathing-circle ${phase === "Inspirer" && isActive ? "inhale" : ""}`}
                        animate={{
                            scale: isActive ? (phase === "Inspirer" ? 1.5 : 0.8) : 1,
                            backgroundColor: isActive 
                            ? (phase === "Inspirer" ? "rgba(175, 88, 98, 0.4)" : "rgba(254, 183, 128, 0.3)")
                            : "rgba(255, 255, 255, 0.1)"
                        }}
                        transition={{ duration: 5, ease: "easeInOut" }} 
                    />
                    <div className="phase-text">{phase}</div>
                </div>
                
                <div className="breathing-controls">
                    {!isActive ? (
                        <button className="start-breath-btn" onClick={handleStart}>
                            Commencer (2 min) 
                        </button>
                    ) : (
                        <button className="stop-breath-btn" onClick={handleStop}>
                            Arrêter
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BreathingModal;