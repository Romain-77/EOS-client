import { useState } from "react";
import LoginForm from "../../components/LoginForm/LoginForm";
import RegisterForm from "../../components/RegisterForm/RegisterForm";
import "./LandingPage.css";

const LandingPage = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="landing-page">
            <div className="landing-container">
                <header className="landing-info"></header>
                    <h1 className="logo-title">E O S</h1>
                    <h3 className="sub-title">Maîtrisez votre quotidien et votre bien-être</h3>
            
           
                <main className="auth-box">
                    {isLogin ? (
                         <LoginForm onSwitch={() => setIsLogin(false)}/>
                    ) : (
                        <RegisterForm onSwitch={() => setIsLogin(true)}/>
                    )}
                </main>
            </div>
        </div>
    );
};

export default LandingPage;