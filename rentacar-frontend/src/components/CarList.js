// src/components/CarList.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const CarList = ({ refreshSignal }) => {
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get("http://localhost:5087/api/car");
        setCars(res.data);
      } catch (err) {
        console.error("Araçlar alınamadı:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCars();
  }, [refreshSignal]);

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="loading-spinner mx-auto mb-3"></div>
        <p className="text-muted">Araçlar yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="table-responsive">
        <table className="table table-modern">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>#</th>
              <th>
                <i className="fas fa-car me-2">🚗</i>
                Marka
              </th>
              <th>
                <i className="fas fa-tag me-2">🏷️</i>
                Model
              </th>
              <th>
                <i className="fas fa-money-bill-wave me-2">💰</i>
                Günlük Fiyat
              </th>
              <th>
                <i className="fas fa-info-circle me-2">ℹ️</i>
                Durum
              </th>
            </tr>
          </thead>
          <tbody>
            {cars.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-5">
                  <div className="text-muted">
                    <i className="fas fa-car" style={{ fontSize: '3rem', opacity: 0.3 }}>🚗</i>
                    <p className="mt-3 mb-0">Henüz araç bulunmuyor</p>
                  </div>
                </td>
              </tr>
            ) : (
              cars.map((car, idx) => (
                <tr key={car.id} className="hover-lift">
                  <td className="fw-bold text-muted">{idx + 1}</td>
                  <td>
                    <div className="fw-semibold">{car.brand}</div>
                  </td>
                  <td>
                    <div className="text-muted">{car.model}</div>
                  </td>
                  <td>
                    <div className="fw-bold text-success">
                      ₺{car.pricePerDay.toFixed(2)}
                    </div>
                  </td>
                  <td>
                    <span className={`badge-modern ${car.isAvailable ? 'badge-success' : 'badge-danger'}`}>
                      <i className={`fas ${car.isAvailable ? 'fa-check-circle' : 'fa-times-circle'} me-1`}>
                        {car.isAvailable ? '✅' : '❌'}
                      </i>
                      {car.isAvailable ? "Uygun" : "Kirada"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {cars.length > 0 && (
        <div className="text-center mt-3">
          <div className="glass-card d-inline-block px-3 py-2">
            <small className="text-muted">
              <i className="fas fa-info-circle me-1">ℹ️</i>
              Toplam {cars.length} araç listeleniyor
            </small>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarList;
