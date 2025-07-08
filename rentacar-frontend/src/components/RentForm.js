import React, { useEffect, useState } from "react";
import axios from "axios";

const RentForm = ({ refreshSignal, onSuccess }) => {
  const [carId, setCarId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");
  const [cars, setCars] = useState([]);

  const token = localStorage.getItem("token"); // ✅ Token'ı al

  useEffect(() => {
    axios
      .get("http://localhost:5087/api/Car")
      .then((res) => setCars(res.data))
      .catch((err) => console.error("Araçlar alınamadı:", err));
  }, [refreshSignal]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setMessage("❌ Giriş yapmanız gerekiyor.");
      return;
    }

    const rentalData = {
      carId: parseInt(carId),
      startDate,
      endDate,
    };

    try {
      const response = await axios.post(
        "http://localhost:5087/api/rental",
        rentalData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Token'ı header'a ekle
          },
        }
      );

      setMessage(
        `✅ Araç başarıyla kiralandı. Toplam tutar: ${response.data.totalPrice}₺`
      );

      if (onSuccess) onSuccess();

      setCarId("");
      setStartDate("");
      setEndDate("");
    } catch (error) {
      setMessage("❌ Kiralama başarısız: " + (error.response?.data || error.message));
    }
  };

  return (
    <div className="card shadow-sm p-4">
      <h2 className="text-primary mb-4 text-center">Araç Kirala</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Araç Seç:</label>
          <select
            className="form-select"
            value={carId}
            onChange={(e) => setCarId(e.target.value)}
            required
          >
            <option value="">-- Lütfen araç seçin --</option>
            {cars
              .filter((car) => car.isAvailable)
              .map((car) => (
                <option key={car.id} value={car.id}>
                  {car.brand} {car.model} - {car.pricePerDay}₺/gün
                </option>
              ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Başlangıç Tarihi:</label>
          <input
            type="date"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Bitiş Tarihi:</label>
          <input
            type="date"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">Kirala</button>
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

export default RentForm;
