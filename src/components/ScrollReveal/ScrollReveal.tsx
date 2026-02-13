import { motion } from "framer-motion";
import { ReactNode } from "react";


interface Props {
    children: ReactNode;
    delay?: number;
}

const ScrollReveal = ({ children, delay = 0 }: Props) => {
    return (
        <motion.div
        initial={{ opacity: 0, y: 30 }} // Départ
        whileInView={{ opacity: 1, y: 0 }} // Arrivée
        viewport={{ once: false, amount: 0.3 }} // Activation visible a 30% du contenu
        transition={{ duration: 0.8, ease: "easeOut", delay: delay }} // Durée de l'animation et effet
        >
            {children}
        </motion.div>
    );
};

export default ScrollReveal;