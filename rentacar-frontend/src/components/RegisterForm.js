import React, { useState } from "react";
import axios from "axios";

const RegisterForm = ({ onRegisterSuccess, switchToLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // ➊
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ➋ Şifre eşleşme kontrolü
    if (password !== confirmPassword) {
      setIsError(true);
      setMessage("❌ Şifreler eşleşmiyor!");
      return;
    }

    try {
      await axios.post("http://localhost:5087/api/auth/register", {
        username,
        password,
      });
      setIsError(false);
      setMessage("✅ Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...");
      setTimeout(() => {
        setUsername("");
        setPassword("");
        setConfirmPassword(""); // ➌ temizle
        onRegisterSuccess();
      }, 1500);
    } catch (err) {
      setIsError(true);
      setMessage("❌ Kayıt hatası: " + (err.response?.data || err.message));
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-sm p-4" style={{ minWidth: "320px" }}>
        <h2 className="text-center text-success mb-4">Kayıt Ol</h2>
        <form onSubmit={handleSubmit}>
          {/* Kullanıcı Adı */}
          <div className="mb-3">
            <label className="form-label">Kullanıcı Adı</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Kullanıcı adı"
              required
            />
          </div>

          {/* Şifre */}
          <div className="mb-3">
            <label className="form-label">Şifre</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifre"
              required
            />
          </div>

          {/* Şifre (Tekrar) */}
          <div className="mb-3">
            <label className="form-label">Şifrenizi Tekrar Giriniz</label>
            <input
              type="password"
              className="form-control"
              value={confirmPassword}                // ➍
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Şifre tekrar"
              required
            />
          </div>

          <button type="submit" className="btn btn-success w-100">
            Kayıt Ol
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
          Hesabın var mı?{" "}
          <button
            type="button"
            className="btn btn-link p-0"
            onClick={switchToLogin}
          >
            Giriş Yap
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
