import { useState } from "react";
import LoginForm from "../../components/LoginForm/LoginForm";
import FloatingWords from "../../components/FloatingWords/FloatingWords";
import ForgotPasswordForm from "../../components/ForgotPasswordForm/ForgotPasswordForm";
import RegisterForm from "../../components/RegisterForm/RegisterForm";
import "./LandingPage.css";

const LandingPage = () => {
    const [view, setView] = useState<"login" | "register" | "forgot">("login");

    return (
        <div className="landing-page">
            <FloatingWords /> 
            <div className="landing-container">
                <header className="landing-info">
                    <h1 className="logo-title">E O S</h1>
                </header>
            
                <main className="auth-box">
                    {view === "login" && (
                         <LoginForm 
                         onSwitch={() => setView("register")}
                         onForgot={() => setView("forgot")}
                            />
                    )}
                    {view === "register" && (
                        <RegisterForm onSwitch={() => setView("login")} />
                    )}
                    {view === "forgot" && (
                        <ForgotPasswordForm onSwitch={() => setView("login")} />
                    )}
                </main>
            </div>
        </div>
    );
};

export default LandingPage;