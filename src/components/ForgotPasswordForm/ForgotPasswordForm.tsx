import { useState } from "react";
import authService from "../../services/auth.service";
import "./ForgotPasswordForm.css";
import { useAuth } from "../../contexts/AuthContext";

const ForgotPasswordForm = ({ onSwitch }: { onSwitch: () => void }) => {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await authService.forgotPassword(email);
            setSent(true);
        } catch (err) {
            alert ("Erreur lors de l'envoi du lien de réinitialisation");   
        }
        };
        if (sent) {
            return (
                <div className="form-content">
                    <p> Si cet e-mail existe, un lien a été encoyé.</p>
                    <button onClick={onSwitch}>Retour à la connexion</button>
                </div>
            );
        }

    return (
        <form onSubmit={handleSubmit} className="form-content">
            <h2>Mot de passe oublié ?</h2>
            <input 
            type="e-mail"
            placeholder="Votre e-mail"
            value= {email}
            onChange={(e) => setEmail(e.target.value)}
            required
            />
            <button type="submit" className="submit-btn">Envoyer le lien de réinitialisation</button>
            <p onClick={onSwitch} className="switch-link">Retour à la connexion</p>
        </form>
    );
};

export default ForgotPasswordForm;