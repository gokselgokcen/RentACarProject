import React, { useState, useEffect } from "react";
import axios from "axios";

const ReturnForm = ({ refreshSignal, onSuccess }) => {
  const [rentalId, setRentalId] = useState("");
  const [rentals, setRentals] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRentals, setIsLoadingRentals] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoadingRentals(true);

    axios
      .get("http://localhost:5087/api/rental/active", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setRentals(res.data))
      .catch((err) =>
        console.error("Kiralama verileri alınırken hata:", err)
      )
      .finally(() => setIsLoadingRentals(false));
  }, [refreshSignal]);

  const handleReturn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    const token = localStorage.getItem("token");

    try {
      const response = await axios.put(
        `http://localhost:5087/api/rental/return/${rentalId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      if (data.totalPrice !== undefined && data.newEndDate !== undefined) {
        setMessage(
          `🎉 İade başarılı! Yeni Teslim Tarihi: ${new Date(
            data.newEndDate
          ).toLocaleDateString('tr-TR')} - Toplam Tutar: ₺${data.totalPrice}`
        );
      } else {
        setMessage("🎉 İade başarılı!");
      }

      if (onSuccess) onSuccess();
      setRentalId("");
    } catch (error) {
      setMessage(
        `❌ Hata: ${error.response?.data || error.message}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <form onSubmit={handleReturn}>
        <div className="mb-4">
          <label className="form-label-modern d-block">
            <i className="fas fa-undo me-2">🔄</i>
            İade Edilecek Araç
          </label>
          {isLoadingRentals ? (
            <div className="form-control-modern w-100 d-flex align-items-center justify-content-center py-3">
              <div className="loading-spinner me-2"></div>
              <span className="text-muted">Kiralama verileri yükleniyor...</span>
            </div>
          ) : (
            <select
              className="form-control-modern w-100"
              value={rentalId}
              onChange={(e) => setRentalId(e.target.value)}
              required
              disabled={isLoading}
            >
              <option value="">-- Lütfen kiralanmış aracı seçin --</option>
              {rentals.map((rental) => (
                <option key={rental.id} value={rental.id}>
                  {rental.car.brand} {rental.car.model} (Kiralama ID: {rental.id})
                </option>
              ))}
            </select>
          )}
          {!isLoadingRentals && rentals.length === 0 && (
            <small className="text-muted">
              <i className="fas fa-info-circle me-1">ℹ️</i>
              Aktif kiralama bulunmuyor
            </small>
          )}
        </div>

        <button 
          type="submit" 
          className="btn-modern btn-success w-100 mb-3"
          disabled={isLoading || rentals.length === 0}
        >
          {isLoading ? (
            <div className="d-flex align-items-center justify-content-center">
              <div className="loading-spinner me-2"></div>
              İade Ediliyor...
            </div>
          ) : (
            <>
              <i className="fas fa-undo me-2">🔄</i>
              Araç İade Et
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

      {rentals.length > 0 && (
        <div className="glass-card p-3 mt-3">
          <div className="d-flex align-items-center">
            <i className="fas fa-info-circle me-2" style={{ color: 'var(--accent-color)' }}>ℹ️</i>
            <div>
              <small className="fw-semibold d-block">İade Bilgileri</small>
              <small className="text-muted">
                {rentals.length} aktif kiralama bulunuyor
              </small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReturnForm;
