import React, { useState } from "react";
import axios from "axios";

const LoginForm = ({ onLoginSuccess, switchToRegister }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5087/api/auth/login",
        { username, password }
      );
      const token = response.data.token;
      localStorage.setItem("token", token);

      setIsError(false);
      setMessage("✅ Giriş başarılı, panel yükleniyor...");
      onLoginSuccess();
      setUsername("");
      setPassword("");
    } catch (err) {
      setIsError(true);
      setMessage("❌ Giriş başarısız: " + (err.response?.data || err.message));
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-sm p-4" style={{ minWidth: "320px" }}>
        <h2 className="text-center text-primary mb-4">Giriş Yap</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Kullanıcı Adı</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Kullanıcı adınızı girin"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Şifre</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifrenizi girin"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Giriş Yap
          </button>
        </form>

        {message && (
          <div
            className={`alert mt-3 ${
              isError ? "alert-danger" : "alert-success"
            }`}
          >
            {message}
          </div>
        )}

        <p className="text-center mt-3">
          Hesabın yok mu?{" "}
          <button
            type="button"
            className="btn btn-link p-0"
            onClick={switchToRegister}
          >
            Kayıt Ol
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
