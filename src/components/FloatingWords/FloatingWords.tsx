import { useEffect, useState } from "react";
import "./FloatingWords.css";

const words = [
    "Sérénité",
    "Gratitude",
    "Douceur",
    "Paix",
    "Clarté",
    "Énergie",
    "Harmonie",
    "Confiance",
    "Sagesse",
    "Calme",
    "Joie",
    "Force",
    "Liberté",
    "Courage",
    "Unité",
];

const FloatingWords = () => {
    const [elements, setElements] = useState<{id: number, text: string, top: string, left: string, delay: string}[]>([]);

    useEffect(() => {
        const rows = 5; // Nombre de lignes 5
        const cols = 5; // Nombre de colonnes 5
        const newElements: any[] = [];
        
        // On mélange les mots pour ne pas avoir toujours les mêmes au même endroit
        const shuffledWords = [...words].sort(() => Math.random() - 0.5);

        let wordIndex = 0;
        // double boucle pour parcourir les cellules de la grille (5x5 donc 25 cellules)
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (wordIndex < shuffledWords.length) {
                    // On calcule une position de base par zone
                    const baseTop = (r * 100) / rows;
                    const baseLeft = (c * 100) / cols;
                    // Et on ajoute une variation le jitter
                    const jitterTop = Math.random() * 10; 
                    const jitterLeft = Math.random() * 10;

                    // Ajout  d'un nouvel élément au tableau avec sa position calculée 
                    // (position de base + variation + 5% de marge) 
                    // et un délai d'animation aléatoire entre 0 et 10 secondes.
                    newElements.push({
                        id: wordIndex,
                        text: shuffledWords[wordIndex],
                        top: `${baseTop + jitterTop + 5}%`,
                        left: `${baseLeft + jitterLeft + 5}%`,
                        delay: `${Math.random() * 10}s`
                    });
                    wordIndex++;
                }
            }
        }
        setElements(newElements);
    }, []);

    return (
        <div className="floating-words-container">
            {elements.map(el => (
                <span   
                    key={el.id}
                    className="floating-word"
                    style={{
                        top: el.top,
                        left: el.left,
                        animationDelay: el.delay
                    }}
                    >
                        {el.text}
                    </span>
            ))}
        </div>
    );
};

export default FloatingWords;