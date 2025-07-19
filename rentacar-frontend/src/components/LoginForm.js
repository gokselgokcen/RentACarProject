import React, { useState } from "react";
import axios from "axios";

const LoginForm = ({ onLoginSuccess, switchToRegister }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    
    try {
      const response = await axios.post(
        "http://localhost:5087/api/auth/login",
        { username, password }
      );
      const token = response.data.token;
      localStorage.setItem("token", token);

      setIsError(false);
      setMessage("🎉 Giriş başarılı! Yönlendiriliyorsunuz...");
      setTimeout(() => {
        onLoginSuccess();
        setUsername("");
        setPassword("");
      }, 1500);
    } catch (err) {
      setIsError(true);
      setMessage("❌ Giriş başarısız: " + (err.response?.data || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="form-modern scale-in" style={{ minWidth: "380px", maxWidth: "450px" }}>
        <div className="text-center mb-4">
          <div className="mb-3">
            <div className="d-inline-block p-3 rounded-circle" style={{ 
              background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <i className="fas fa-car text-white" style={{ fontSize: '2rem' }}>🚗</i>
            </div>
          </div>
          <h2 className="text-gradient fw-bold mb-2">Hoş Geldiniz</h2>
          <p className="text-muted mb-0">Hesabınıza giriş yapın</p>
        </div>

        <form onSubmit={handleSubmit} className="fade-in">
          <div className="mb-4">
            <label className="form-label-modern d-block">
              <i className="fas fa-user me-2">👤</i>
              Kullanıcı Adı
            </label>
            <input
              type="text"
              className="form-control-modern w-100"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Kullanıcı adınızı girin"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="mb-4">
            <label className="form-label-modern d-block">
              <i className="fas fa-lock me-2">🔒</i>
              Şifre
            </label>
            <input
              type="password"
              className="form-control-modern w-100"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifrenizi girin"
              required
              disabled={isLoading}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn-modern w-100 mb-3"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="d-flex align-items-center justify-content-center">
                <div className="loading-spinner me-2"></div>
                Giriş Yapılıyor...
              </div>
            ) : (
              <>
                <i className="fas fa-sign-in-alt me-2">🚀</i>
                Giriş Yap
              </>
            )}
          </button>
        </form>

        {message && (
          <div className={`alert-modern ${isError ? 'alert-danger' : 'alert-success'} slide-in`}>
            <div className="d-flex align-items-center">
              <i className={`fas ${isError ? 'fa-exclamation-triangle' : 'fa-check-circle'} me-2`}>
                {isError ? '⚠️' : '✅'}
              </i>
              {message}
            </div>
          </div>
        )}

        <div className="text-center mt-4 pt-3 border-top">
          <p className="text-muted mb-0">
            Hesabınız yok mu?{" "}
            <button
              type="button"
              className="btn btn-link p-0 text-decoration-none fw-bold"
              style={{ color: 'var(--primary-color)' }}
              onClick={switchToRegister}
              disabled={isLoading}
            >
              Kayıt Ol
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
