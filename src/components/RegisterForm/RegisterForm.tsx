import React, { useState } from "react";
import authService from "../../services/auth.service";

const RegisterForm = ({ onSwitch}: {onSwitch: () => void}) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.BaseSyntheticEvent) => {
        e.preventDefault();
        try {
            await authService.register({ username, email, password });
            alert("Compte créé ! Vous pouvez maintenant vous connecter");
            onSwitch();
        } catch (err) {
            alert ("Erreur lors de l'inscription");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="auth-form">
            <h2>Créer un compte</h2>
            <input type="text" placeholder="Pseudo" value={username} onChange={e => setUsername(e.target.value)} required />
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="submit">S'inscire</button>
            <p onClick={onSwitch} className="switch-link">Déjà inscrit? Se connecter</p>
        </form>
    );
};

export default RegisterForm;