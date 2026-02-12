import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import "./LoginForm.css";

interface LoginFormProps {
    onSwitch: () => void;
}

const LoginForm = ({ onSwitch }: LoginFormProps) => {
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
            <h2>Connexion</h2>
            <input type="email" placeholder="Email..." value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Mot de passe..." value={password} onChange={(e) => setPassword(e.target.value)}required />
            <button type="submit">Se connecter</button>
            <p>Pas encore inscrit ? <span className="switch-link" onClick={onSwitch}>S'insrire</span></p>
        </form>
    );
};

export default LoginForm;