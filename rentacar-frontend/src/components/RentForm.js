import React, { useEffect, useState } from "react";
import axios from "axios";

const RentForm = ({ refreshSignal, onSuccess }) => {
  const [carId, setCarId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCars, setIsLoadingCars] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    setIsLoadingCars(true);
    axios
      .get("http://localhost:5087/api/Car")
      .then((res) => setCars(res.data))
      .catch((err) => console.error("Araçlar alınamadı:", err))
      .finally(() => setIsLoadingCars(false));
  }, [refreshSignal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    if (!token) {
      setMessage("❌ Giriş yapmanız gerekiyor.");
      setIsLoading(false);
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
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        `🎉 Araç başarıyla kiralandı! Toplam tutar: ₺${response.data.totalPrice}`
      );

      if (onSuccess) onSuccess();

      setCarId("");
      setStartDate("");
      setEndDate("");
    } catch (error) {
      setMessage("❌ Kiralama başarısız: " + (error.response?.data || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const availableCars = cars.filter((car) => car.isAvailable);

  return (
    <div className="fade-in">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="form-label-modern d-block">
            <i className="fas fa-car me-2">🚗</i>
            Araç Seçin
          </label>
          {isLoadingCars ? (
            <div className="form-control-modern w-100 d-flex align-items-center justify-content-center py-3">
              <div className="loading-spinner me-2"></div>
              <span className="text-muted">Araçlar yükleniyor...</span>
            </div>
          ) : (
            <select
              className="form-control-modern w-100"
              value={carId}
              onChange={(e) => setCarId(e.target.value)}
              required
              disabled={isLoading}
            >
              <option value="">-- Lütfen araç seçin --</option>
              {availableCars.map((car) => (
                <option key={car.id} value={car.id}>
                  {car.brand} {car.model} - ₺{car.pricePerDay}/gün
                </option>
              ))}
            </select>
          )}
          {!isLoadingCars && availableCars.length === 0 && (
            <small className="text-muted">
              <i className="fas fa-info-circle me-1">ℹ️</i>
              Şu anda kiralanabilir araç bulunmuyor
            </small>
          )}
        </div>

        <div className="mb-4">
          <label className="form-label-modern d-block">
            <i className="fas fa-calendar-plus me-2">📅</i>
            Başlangıç Tarihi
          </label>
          <input
            type="date"
            className="form-control-modern w-100"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            disabled={isLoading}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="mb-4">
          <label className="form-label-modern d-block">
            <i className="fas fa-calendar-minus me-2">📅</i>
            Bitiş Tarihi
          </label>
          <input
            type="date"
            className="form-control-modern w-100"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            disabled={isLoading}
            min={startDate || new Date().toISOString().split('T')[0]}
          />
        </div>

        <button 
          type="submit" 
          className="btn-modern w-100 mb-3"
          disabled={isLoading || availableCars.length === 0}
        >
          {isLoading ? (
            <div className="d-flex align-items-center justify-content-center">
              <div className="loading-spinner me-2"></div>
              Kiralanıyor...
            </div>
          ) : (
            <>
              <i className="fas fa-key me-2">🔑</i>
              Araç Kirala
            </>
          )}
        </button>
      </form>

      {message && (
        <div className={`alert-modern ${message.startsWith("🎉") ? 'alert-success' : 'alert-danger'} slide-in`}>
          <div className="d-flex align-items-center">
            <i className={`fas ${message.startsWith("🎉") ? 'fa-check-circle' : 'fa-exclamation-triangle'} me-2`}>
              {message.startsWith("🎉") ? '✅' : '⚠️'}
            </i>
            {message}
          </div>
        </div>
      )}

      {availableCars.length > 0 && (
        <div className="glass-card p-3 mt-3">
          <div className="d-flex align-items-center">
            <i className="fas fa-info-circle me-2" style={{ color: 'var(--primary-color)' }}>ℹ️</i>
            <div>
              <small className="fw-semibold d-block">Kiralama Bilgileri</small>
              <small className="text-muted">
                {availableCars.length} araç kiralanabilir durumda
              </small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RentForm;
