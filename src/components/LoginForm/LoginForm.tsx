import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import "./LoginForm.css";

interface LoginFormProps {
    onSwitch: () => void;
    onForgot?: () => void;
}

const LoginForm = ({ onSwitch, onForgot }: LoginFormProps) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();

    const handleSubmit = async (e: React.BaseSyntheticEvent) => {
        e.preventDefault();

        try {
            await login({ email, password });
        } catch (err) {
            alert ("Idenditifiants incorrects ou problème serveur");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="auth-form">
            <h3>Maîtrisez votre quotidien et votre bien-être</h3>
            <h2>Connexion</h2>
            <p className="input-title">E-mail</p>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <p className="input-title">Mot de passe</p>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}required />
            <button type="submit">Se connecter</button>
            <p>Pas encore inscrit ? <span className="switch-link" onClick={onSwitch}>S'insrire</span></p>
            <p onClick={onForgot} className="forgot-link">
                    Mot de passe oublié ?
                </p>
        </form>
    );
};

export default LoginForm;