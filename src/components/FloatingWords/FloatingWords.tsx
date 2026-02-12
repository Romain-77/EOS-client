import { useEffect, useState } from "react";
import "./FloatingWords.css";

const words = ["Sérénité", "Gratitude", "Équilibre", "Douceur", "Paix", "Clarté", "Énergie", "Harmonie"];

const FloatingWords = () => {
    const [elements, setElements] = useState<{id: number, text: string, top: string, left: string, delay: string}[]>([]);

    useEffect(() => {
        const generate = words.map((word, i) => ({
            id: i,
            text: word,
            top: `${Math.random() * 85 + 5}%`,
            left: `${Math.random() * 85 + 5}%`,
            delay: `${Math.random() * 10}s`
        }));
        setElements(generate);
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