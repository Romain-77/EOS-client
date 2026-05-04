import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import authService from "../../services/auth.service";
import FloatingWords from "../../components/FloatingWords/FloatingWords";
import "./ResetPasswordPage.css"; // Optionnel : pour des ajustements spécifiques

const ResetPasswordPage = () => {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [status, setStatus] = useState<{ type: 'error' | 'success', msg: string } | null>(null);

const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

        if (password !== confirmPassword) {
            setStatus({ type: 'error', msg: "Les mots de passe ne correspondent pas." });
            return;
        }

        try {
            if (!token) throw new Error("Token manquant");
            
            await authService.resetPassword(token, password);
            
            setStatus({ type: 'success', msg: "Mot de passe modifié avec succès ! Redirection..." });
            
            // On redirige vers le login après 3 secondes
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } catch (err) {
            setStatus({ type: 'error', msg: "Le lien est invalide ou a expiré." });
        }
    };

    return (
        <div className="landing-page">
            <FloatingWords />
            <div className="landing-container">
                <header className="landing-info">
                    <h1 className="logo-title">E O S</h1>
                </header>

                <main className="auth-box">
                    <form onSubmit={handleSubmit} className="form-content">
                        <h2>Nouveau mot de passe</h2>
                        
                        <input
                            type="password"
                            placeholder="Nouveau mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                        
                        <input
                            type="password"
                            placeholder="Confirmer le mot de passe"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />

                        <button type="submit" className="submit-btn">
                            Mettre à jour
                        </button>

                        {status && (
                            <p className={`status-message ${status.type}`}>
                                {status.msg}
                            </p>
                        )}
                    </form>
                </main>
            </div>
        </div>
    );
};

export default ResetPasswordPage;