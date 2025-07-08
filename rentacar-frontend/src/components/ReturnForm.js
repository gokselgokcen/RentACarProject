import React, { useState, useEffect } from "react";
import axios from "axios";

const ReturnForm = ({ refreshSignal, onSuccess }) => {
  const [rentalId, setRentalId] = useState("");
  const [rentals, setRentals] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:5087/api/rental/active", {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Token'ı header'a ekledik
        },
      })
      .then((res) => setRentals(res.data))
      .catch((err) =>
        console.error("Kiralama verileri alınırken hata:", err)
      );
  }, [refreshSignal]);

  const handleReturn = async (e) => {
    e.preventDefault();
    setMessage("");

    const token = localStorage.getItem("token");

    try {
      const response = await axios.put(
        `http://localhost:5087/api/rental/return/${rentalId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ PUT isteği için de token gerekli
          },
        }
      );

      const data = response.data;

      if (data.totalPrice !== undefined && data.newEndDate !== undefined) {
        setMessage(
          `✅ İade başarılı! Yeni Teslim Tarihi: ${new Date(
            data.newEndDate
          ).toLocaleDateString()} - Toplam Tutar: ${data.totalPrice}₺`
        );
      } else {
        setMessage("✅ İade başarılı.");
      }

      if (onSuccess) onSuccess();
    } catch (error) {
      setMessage(
        `❌ Hata: ${error.response?.data || error.message}`
      );
    }
  };

  return (
    <div className="card shadow-sm p-4">
      <h2 className="text-success mb-4 text-center">Araç İade Et</h2>
      <form onSubmit={handleReturn}>
        <div className="mb-3">
          <label className="form-label">Kiralama Seç:</label>
          <select
            className="form-select"
            value={rentalId}
            onChange={(e) => setRentalId(e.target.value)}
            required
          >
            <option value="">-- Lütfen kiralanmış aracı seçin --</option>
            {rentals.map((rental) => (
              <option key={rental.id} value={rental.id}>
                {rental.car.brand} {rental.car.model} (ID: {rental.id})
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-success w-100">
          İade Et
        </button>
      </form>

      {message && (
        <div
          className={`alert mt-3 ${
            message.startsWith("✅") ? "alert-success" : "alert-danger"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default ReturnForm;
